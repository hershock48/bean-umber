import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { checkCheckoutRateLimit } from '@/lib/rate-limit';
import { sanitizeString, sanitizeEmail, sanitizeNumber, safeErrorMessage } from '@/lib/sanitize';

// Initialize Stripe lazily using dynamic import to avoid issues during build
async function getStripe() {
  const StripeModule = (await import('stripe')).default;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error('[Create Checkout] STRIPE_SECRET_KEY is not set');
    throw new Error('Payment system configuration error. Please contact support.');
  }
  return new StripeModule(secretKey, {
    apiVersion: '2025-12-15.clover',
  });
}

// Validate required environment variables
function validateEnvVars() {
  const required = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };
  
  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.error('[Create Checkout] Missing required environment variables:', missing);
    throw new Error('Payment system configuration error. Please contact support.');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitError = checkCheckoutRateLimit(request);
    if (rateLimitError) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: rateLimitError.retryAfter 
            ? { 'Retry-After': rateLimitError.retryAfter.toString() }
            : undefined
        }
      );
    }
    
    // Validate environment variables
    validateEnvVars();
    
    const stripe = await getStripe();
    const body = await request.json();
    
    // Sanitize inputs
    const amount = sanitizeNumber(body.amount);
    const email = sanitizeEmail(body.email);
    const name = sanitizeString(body.name, 200);
    const isMonthly = Boolean(body.isMonthly);

    // Get origin from request header (as per Stripe docs)
    const origin = request.headers.get('origin') || 'https://www.beanumber.org';

    // Validate amount
    const MAX_DONATION_AMOUNT = 10000; // $10,000 maximum per transaction
    if (amount === null || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid donation amount. Minimum donation is $1.' },
        { status: 400 }
      );
    }
    if (amount > MAX_DONATION_AMOUNT) {
      return NextResponse.json(
        { error: `Donation amount exceeds maximum of $${MAX_DONATION_AMOUNT.toLocaleString()}. Please contact us for larger donations.` },
        { status: 400 }
      );
    }

    const mode = isMonthly ? 'subscription' : 'payment';
    const donationType = isMonthly ? 'monthly' : 'one-time';

    // Create Stripe Checkout Session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isMonthly 
                ? 'Monthly Donation to Be A Number, International'
                : 'Donation to Be A Number, International',
              description: isMonthly 
                ? `Thank you for changing lives. Your monthly gift of $${amount} supports sustainable community systems in Northern Uganda — healthcare, education, workforce development, and economic empowerment that transform communities.`
                : `Thank you for changing lives. Your contribution of $${amount} supports sustainable community systems in Northern Uganda — healthcare, education, workforce development, and economic empowerment that transform communities.`,
              // Add your logo image URL here (must be hosted publicly accessible)
              // images: [`${process.env.NEXT_PUBLIC_BASE_URL}/logo-be-a-number-primary-white.svg`],
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
            recurring: isMonthly ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: mode as 'payment' | 'subscription',
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#donate`,
      customer_email: email || undefined,
      metadata: {
        donor_name: name || 'Anonymous',
        donation_type: donationType,
      },
      // Branding customization
      allow_promotion_codes: false,
      billing_address_collection: 'required', // Require billing address for tax receipts
      // Add custom fields for tax receipt
      custom_fields: [
        {
          key: 'organization',
          label: {
            type: 'custom',
            custom: 'Organization Name (if applicable)',
          },
          type: 'text',
          optional: true,
        },
      ],
    };

    // For subscriptions, add subscription_data
    if (isMonthly) {
      sessionConfig.subscription_data = {
        metadata: {
          donation_type: 'monthly',
          amount: amount.toString(),
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: safeErrorMessage(error, 'Failed to create checkout session. Please try again.') },
      { status: 500 }
    );
  }
}
