import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

// Initialize Stripe lazily
async function getStripe() {
  const StripeModule = (await import('stripe')).default;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new StripeModule(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

// Rate limiter for Airtable API (5 requests per second)
class RateLimiter {
  private queue: Array<() => void> = [];
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per second

  constructor(maxTokens: number, perSeconds: number = 1) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = maxTokens / perSeconds;
    this.startRefill();
  }

  private startRefill() {
    setInterval(() => {
      this.tokens = Math.min(this.maxTokens, this.tokens + this.refillRate / 10);
      this.processQueue();
    }, 100); // Check every 100ms
  }

  private processQueue() {
    while (this.queue.length > 0 && this.tokens >= 1) {
      this.tokens -= 1;
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }

  async removeTokens(count: number): Promise<void> {
    return new Promise((resolve) => {
      for (let i = 0; i < count; i++) {
        this.queue.push(resolve);
      }
      this.processQueue();
    });
  }
}

const airtableRateLimiter = new RateLimiter(5, 1);

// Airtable API helper with retry logic
async function airtableAPICall<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  await airtableRateLimiter.removeTokens(1);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`[Airtable] Retry attempt ${attempt} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// Airtable API configuration
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_DONORS_TABLE = process.env.AIRTABLE_DONORS_TABLE || 'Donors';
const AIRTABLE_DONATIONS_TABLE = process.env.AIRTABLE_DONATIONS_TABLE || 'Donations';
const AIRTABLE_COMMUNICATIONS_TABLE = process.env.AIRTABLE_COMMUNICATIONS_TABLE || 'Communications';

function getAirtableHeaders() {
  return {
    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// Find or create donor with deduplication
async function findOrCreateDonor(
  stripeCustomerId: string | null,
  email: string | null,
  donorData: {
    name: string;
    organization?: string;
    email: string;
    phone?: string;
    address?: string;
  }
): Promise<string> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  // Step 1: Search by Stripe Customer ID first
  if (stripeCustomerId) {
    const formula = `{Stripe Customer ID} = "${stripeCustomerId}"`;
    const response = await airtableAPICall(() =>
      fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONORS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`,
        {
          headers: getAirtableHeaders(),
        }
      )
    );

    if (response.ok) {
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        console.log('[Airtable] Found donor by Stripe Customer ID:', data.records[0].id);
        return data.records[0].id;
      }
    }
  }

  // Step 2: Search by email if no Stripe ID match
  if (email) {
    const formula = `{Email Address} = "${email}"`;
    const response = await airtableAPICall(() =>
      fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONORS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`,
        {
          headers: getAirtableHeaders(),
        }
      )
    );

    if (response.ok) {
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const donorId = data.records[0].id;
        console.log('[Airtable] Found donor by email:', donorId);
        
        // Update with Stripe Customer ID if we have it
        if (stripeCustomerId) {
          await airtableAPICall(() =>
            fetch(
              `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONORS_TABLE}/${donorId}`,
              {
                method: 'PATCH',
                headers: getAirtableHeaders(),
                body: JSON.stringify({
                  fields: {
                    'Stripe Customer ID': stripeCustomerId,
                  },
                }),
              }
            )
          );
        }
        
        return donorId;
      }
    }
  }

  // Step 3: Create new donor if no matches
  const newDonorFields: any = {
    'Donor Name': donorData.name,
    'Email Address': donorData.email,
  };

  if (donorData.organization) {
    newDonorFields['Organization Name'] = donorData.organization;
  }
  if (donorData.phone) {
    newDonorFields['Phone Number'] = donorData.phone;
  }
  if (donorData.address) {
    newDonorFields['Mailing Address'] = donorData.address;
  }
  if (stripeCustomerId) {
    newDonorFields['Stripe Customer ID'] = stripeCustomerId;
  }

  const response = await airtableAPICall(() =>
    fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONORS_TABLE}`,
      {
        method: 'POST',
        headers: getAirtableHeaders(),
        body: JSON.stringify({
          fields: newDonorFields,
        }),
      }
    )
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  const data = await response.json();
  console.log('[Airtable] Created new donor:', data.id);
  return data.id;
}

// Create or update donation record (idempotent)
async function upsertDonation(
  paymentIntentId: string,
  donationData: {
    sessionId: string;
    customerId: string | null;
    donorId: string;
    amount: number;
    currency: string;
    donationDate: string;
    isRecurring: boolean;
    subscriptionId: string | null;
    status: string;
    email: string;
    name: string;
    organization?: string;
    address?: any;
  }
): Promise<string> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  // Check if donation already exists (idempotency)
  const formula = `{Stripe Payment Intent ID} = "${paymentIntentId}"`;
  const searchResponse = await airtableAPICall(() =>
    fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONATIONS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`,
      {
        headers: getAirtableHeaders(),
      }
    )
  );

  if (searchResponse.ok) {
    const searchData = await searchResponse.json();
    if (searchData.records && searchData.records.length > 0) {
      console.log('[Airtable] Donation already exists:', searchData.records[0].id);
      return searchData.records[0].id;
    }
  }

  // Create new donation record
  const donationFields: any = {
    'Stripe Payment Intent ID': paymentIntentId,
    'Stripe Checkout Session ID': donationData.sessionId,
    'Stripe Customer ID': donationData.customerId || '',
    'Donation Amount': donationData.amount,
    'Currency': donationData.currency.toUpperCase(),
    'Donation Date': donationData.donationDate,
    'Payment Status': donationData.status,
    'Recurring Donation': donationData.isRecurring,
    'Donor': [donationData.donorId], // Link to donor record
    'Donor Email at Donation': donationData.email,
    'Donation Source': 'Website',
  };

  if (donationData.subscriptionId) {
    donationFields['Subscription ID'] = donationData.subscriptionId;
  }
  if (donationData.organization) {
    donationFields['Organization Name'] = donationData.organization;
  }
  if (donationData.address) {
    if (donationData.address.line1) {
      donationFields['Address Line 1'] = donationData.address.line1;
    }
    if (donationData.address.city) {
      donationFields['City'] = donationData.address.city;
    }
    if (donationData.address.state) {
      donationFields['State'] = donationData.address.state;
    }
    if (donationData.address.postal_code) {
      donationFields['Postal Code'] = donationData.address.postal_code;
    }
    if (donationData.address.country) {
      donationFields['Country'] = donationData.address.country;
    }
  }

  const response = await airtableAPICall(() =>
    fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_DONATIONS_TABLE}`,
      {
        method: 'POST',
        headers: getAirtableHeaders(),
        body: JSON.stringify({
          fields: donationFields,
        }),
      }
    )
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  const data = await response.json();
  console.log('[Airtable] Created donation record:', data.id);
  return data.id;
}

// Create communication record
async function createCommunicationRecord(
  donationId: string,
  donorId: string,
  emailData: {
    email: string;
    subject: string;
    body: string;
    status: string;
  }
): Promise<string> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  const communicationFields: any = {
    'Subject': emailData.subject,
    'Email Body': emailData.body,
    'Send Date': new Date().toISOString(),
    'Recipient Email': emailData.email,
    'Status': emailData.status,
    'Email Type': 'Thank You',
    'Related Donation': [donationId],
    'Related Donor': [donorId],
  };

  const response = await airtableAPICall(() =>
    fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_COMMUNICATIONS_TABLE}`,
      {
        method: 'POST',
        headers: getAirtableHeaders(),
        body: JSON.stringify({
          fields: communicationFields,
        }),
      }
    )
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Airtable API error: ${error}`);
  }

  const data = await response.json();
  console.log('[Airtable] Created communication record:', data.id);
  return data.id;
}

// Send thank-you email via SendGrid
async function sendThankYouEmail(donationData: {
  email: string;
  name: string;
  amount: number;
  currency: string;
  isRecurring: boolean;
  donationDate: string;
}): Promise<void> {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'Kevin@beanumber.org';

  if (!sendGridApiKey) {
    console.log('[Webhook] SendGrid API key not set, skipping email');
    return;
  }

  if (!donationData.email) {
    console.log('[Webhook] No customer email, skipping thank-you email');
    return;
  }

  const emailBody = {
    personalizations: [
      {
        to: [{ email: donationData.email, name: donationData.name }],
        subject: 'Thank You for Your Donation to Be A Number, International',
      },
    ],
    from: { email: fromEmail, name: 'Be A Number, International' },
    content: [
      {
        type: 'text/html',
        value: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1a1a1a; margin-bottom: 10px;">Thank You for Your Donation!</h1>
              </div>
              
              <p>Dear ${donationData.name},</p>
              
              <p>Thank you for your ${donationData.isRecurring ? 'monthly ' : ''}donation of $${donationData.amount.toFixed(2)} to Be A Number, International. Your contribution directly supports sustainable community systems in Northern Uganda.</p>
              
              <p><strong>Your donation details:</strong></p>
              <ul>
                <li>Amount: $${donationData.amount.toFixed(2)} ${donationData.currency}</li>
                <li>Type: ${donationData.isRecurring ? 'Monthly recurring' : 'One-time'}</li>
                <li>Date: ${new Date(donationData.donationDate).toLocaleDateString()}</li>
              </ul>
              
              <p>You will receive a tax-deductible receipt via email shortly. Be A Number, International is a registered 501(c)(3) organization (EIN: 93-1948872).</p>
              
              <p>Your support enables us to:</p>
              <ul>
                <li>Provide healthcare services to 700+ patients annually</li>
                <li>Train women and men in vocational skills</li>
                <li>Support education for children in Northern Uganda</li>
                <li>Build sustainable community infrastructure</li>
              </ul>
              
              <p>To learn more about our impact, visit <a href="https://www.beanumber.org/impact" style="color: #1a1a1a;">www.beanumber.org/impact</a></p>
              
              <p>With gratitude,<br>
              <strong>Kevin C. Hershock</strong><br>
              Founder & Executive Director<br>
              Be A Number, International</p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #666;">
                Be A Number, International | EIN: 93-1948872<br>
                <a href="https://www.beanumber.org" style="color: #666;">www.beanumber.org</a> | 
                <a href="mailto:Kevin@beanumber.org" style="color: #666;">Kevin@beanumber.org</a>
              </p>
            </body>
          </html>
        `,
      },
    ],
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  console.log('[Webhook] Thank-you email sent to:', donationData.email);
}

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('[Webhook] Processing checkout session:', session.id);

  try {
    // Get payment intent for full details
    const paymentIntentId = session.payment_intent as string;
    let paymentIntent: Stripe.PaymentIntent | null = null;
    let customer: Stripe.Customer | null = null;

    if (paymentIntentId) {
      const stripe = await getStripe();
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.customer) {
        customer = await stripe.customers.retrieve(paymentIntent.customer as string) as Stripe.Customer;
      }
    }

    // Extract donor information
    const email = session.customer_email || session.customer_details?.email || customer?.email || '';
    const name = session.customer_details?.name || session.metadata?.donor_name || customer?.name || 'Anonymous';
    const organization = session.custom_fields?.find(f => f.key === 'organization')?.text?.value || '';
    const phone = session.customer_details?.phone || customer?.phone || '';
    const address = session.customer_details?.address || customer?.address || null;
    
    // Format address as single string
    const addressString = address
      ? `${address.line1 || ''}${address.line2 ? ', ' + address.line2 : ''}, ${address.city || ''}, ${address.state || ''} ${address.postal_code || ''}, ${address.country || ''}`
      : undefined;

    const stripeCustomerId = session.customer as string || customer?.id || null;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || 'usd';
    const isRecurring = session.mode === 'subscription';
    const subscriptionId = session.subscription as string | null;
    const donationDate = new Date().toISOString();
    const status = paymentIntent?.status === 'succeeded' ? 'Succeeded' : 'Pending';

    // Step 1: Find or create donor
    const donorId = await findOrCreateDonor(stripeCustomerId, email, {
      name,
      organization: organization || undefined,
      email,
      phone: phone || undefined,
      address: addressString,
    });

    // Step 2: Create donation record (idempotent)
    const donationId = await upsertDonation(paymentIntentId || session.id, {
      sessionId: session.id,
      customerId: stripeCustomerId,
      donorId,
      amount,
      currency,
      donationDate,
      isRecurring,
      subscriptionId,
      status,
      email,
      name,
      organization: organization || undefined,
      address,
    });

    // Step 3: Send thank-you email
    let emailStatus = 'Sent';
    try {
      await sendThankYouEmail({
        email,
        name,
        amount,
        currency,
        isRecurring,
        donationDate,
      });
    } catch (error: any) {
      console.error('[Webhook] Failed to send email:', error);
      emailStatus = 'Failed';
    }

    // Step 4: Create communication record
    try {
      await createCommunicationRecord(donationId, donorId, {
        email,
        subject: 'Thank You for Your Donation to Be A Number, International',
        body: `Thank you for your ${isRecurring ? 'monthly ' : ''}donation of $${amount.toFixed(2)}.`,
        status: emailStatus,
      });
    } catch (error) {
      console.error('[Webhook] Failed to create communication record:', error);
      // Don't fail the whole process if communication record fails
    }

    console.log('[Webhook] Successfully processed donation:', {
      sessionId: session.id,
      donorId,
      donationId,
    });

    return { donorId, donationId };
  } catch (error: any) {
    console.error('[Webhook] Error processing checkout session:', error);
    throw error;
  }
}

// Verify webhook signature
async function verifyWebhookSignature(
  request: NextRequest,
  stripe: Stripe
): Promise<Stripe.Event | null> {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[Webhook] No signature found');
    return null;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set');
    return null;
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    return event;
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripe();
    const event = await verifyWebhookSignature(request, stripe);

    if (!event) {
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('[Webhook] Received event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[Webhook] Subscription event:', event.type, subscription.id);
        // You can add subscription-specific handling here if needed
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('[Webhook] Invoice payment succeeded:', invoice.id);
        // Handle recurring donation payments here if needed
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
