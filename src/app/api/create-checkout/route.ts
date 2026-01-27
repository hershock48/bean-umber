import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { checkCheckoutRateLimit } from '@/lib/rate-limit';
import { validateDonationAmount, validateEmail, sanitizeString } from '@/lib/validation';
import { ERROR_MESSAGES } from '@/lib/constants';

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
    .filter(([, value]) => !value)
    .map(([key]) => key);
  
  if (missing.length > 0) {
    console.error('[Create Checkout] Missing required environment variables:', missing);
    throw new Error('Payment system configuration error. Please contact support.');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitError = checkCheckoutRateLimit(request);
    if (rateLimitError) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.TOO_MANY_REQUESTS },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitError.retryAfter?.toString() || '60',
          },
        }
      );
    }

    // Validate environment variables
    validateEnvVars();
    
    const stripe = await getStripe();
    const body = await request.json();

    // Validate amount - the validation function returns cents
    const amountValidation = validateDonationAmount(body.amount);
    if (!amountValidation.success) {
      return NextResponse.json(
        { error: amountValidation.error },
        { status: 400 }
      );
    }
    const amountInCents = amountValidation.data!;
    const amountInDollars = amountInCents / 100;

    // Validate optional email
    let email: string | undefined;
    if (body.email) {
      const emailValidation = validateEmail(body.email);
      if (!emailValidation.success) {
        return NextResponse.json(
          { error: emailValidation.error },
          { status: 400 }
        );
      }
      email = emailValidation.data;
    }

    // Sanitize optional name
    const name = sanitizeString(body.name).slice(0, 200) || 'Anonymous';

    // Validate isMonthly is boolean
    const isMonthly = body.isMonthly === true;

    // Get origin from request header (as per Stripe docs)
    const origin = request.headers.get('origin') || 'https://www.beanumber.org';

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
                ? `Thank you for changing lives. Your monthly gift of $${amountInDollars} supports sustainable community systems in Northern Uganda — healthcare, education, workforce development, and economic empowerment that transform communities.`
                : `Thank you for changing lives. Your contribution of $${amountInDollars} supports sustainable community systems in Northern Uganda — healthcare, education, workforce development, and economic empowerment that transform communities.`,
            },
            unit_amount: amountInCents,
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
        donor_name: name,
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
          amount: amountInDollars.toString(),
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    console.error('Stripe checkout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
