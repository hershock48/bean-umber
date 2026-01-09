import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

// Initialize Stripe lazily using dynamic import to avoid issues during build
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

export async function POST(request: NextRequest) {
  try {
    const stripe = await getStripe();
    const { amount, email, name, isMonthly } = await request.json();

    // Get origin from request header (as per Stripe docs)
    const origin = request.headers.get('origin') || 'https://www.beanumber.org';

    // Validate amount
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
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
      cancel_url: `${origin}/donate?canceled=1`,
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
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
