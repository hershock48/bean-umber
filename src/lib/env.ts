/**
 * Environment variable validation and access
 * Ensures all required environment variables are present at startup
 */

interface EnvironmentVariables {
  // Airtable
  AIRTABLE_API_KEY: string;
  AIRTABLE_BASE_ID: string;
  AIRTABLE_SPONSORSHIPS_TABLE: string;
  AIRTABLE_UPDATES_TABLE: string;

  // Stripe (optional until configured)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;

  // SendGrid
  SENDGRID_API_KEY?: string;

  // Admin
  ADMIN_API_TOKEN?: string;

  // Optional - Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;
}

class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Validates that all required environment variables are present
 * @throws {EnvironmentError} if any required variables are missing
 */
function validateEnvironment(): EnvironmentVariables {
  const requiredVars = [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_SPONSORSHIPS_TABLE',
    'AIRTABLE_UPDATES_TABLE',
  ] as const;

  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new EnvironmentError(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file or Vercel environment settings.'
    );
  }

  // Warn about optional but recommended variables
  const recommendedVars = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'SENDGRID_API_KEY', 'ADMIN_API_TOKEN'];
  const missingRecommended: string[] = [];

  for (const varName of recommendedVars) {
    if (!process.env[varName]) {
      missingRecommended.push(varName);
    }
  }

  if (missingRecommended.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️  Missing recommended environment variables: ${missingRecommended.join(', ')}`
    );
  }

  return {
    AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY!,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID!,
    AIRTABLE_SPONSORSHIPS_TABLE: process.env.AIRTABLE_SPONSORSHIPS_TABLE!,
    AIRTABLE_UPDATES_TABLE: process.env.AIRTABLE_UPDATES_TABLE!,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    ADMIN_API_TOKEN: process.env.ADMIN_API_TOKEN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  };
}

// Validate environment on module load (only on server-side)
let env: EnvironmentVariables;

if (typeof window === 'undefined') {
  try {
    env = validateEnvironment();

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Environment variables validated successfully');
    }
  } catch (error) {
    if (error instanceof EnvironmentError) {
      console.error('❌ Environment validation failed:');
      console.error(error.message);

      // In development, throw error to stop the server
      // In production, let it fail at runtime with better error messages
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    }
    throw error;
  }
}

/**
 * Get validated environment variables
 * Safe to use throughout the application
 */
export function getEnv(): EnvironmentVariables {
  if (!env) {
    // Lazy initialization for edge cases
    env = validateEnvironment();
  }
  return env;
}

/**
 * Check if a specific optional environment variable is configured
 */
export function hasEnv(key: keyof EnvironmentVariables): boolean {
  const envVars = getEnv();
  return !!envVars[key];
}

/**
 * Get Airtable configuration
 */
export function getAirtableConfig() {
  const envVars = getEnv();
  return {
    apiKey: envVars.AIRTABLE_API_KEY,
    baseId: envVars.AIRTABLE_BASE_ID,
    tables: {
      sponsorships: envVars.AIRTABLE_SPONSORSHIPS_TABLE,
      updates: envVars.AIRTABLE_UPDATES_TABLE,
    },
  };
}

/**
 * Get Stripe configuration
 * @throws {Error} if Stripe is not configured
 */
export function getStripeConfig() {
  const envVars = getEnv();

  if (!envVars.STRIPE_SECRET_KEY || !envVars.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET environment variables.');
  }

  return {
    secretKey: envVars.STRIPE_SECRET_KEY,
    webhookSecret: envVars.STRIPE_WEBHOOK_SECRET,
    publishableKey: envVars.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  };
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  const envVars = getEnv();
  return !!(envVars.STRIPE_SECRET_KEY && envVars.STRIPE_WEBHOOK_SECRET);
}

/**
 * Get SendGrid configuration
 */
export function getSendGridConfig() {
  const envVars = getEnv();

  if (!envVars.SENDGRID_API_KEY) {
    throw new Error('SendGrid is not configured. Set SENDGRID_API_KEY environment variable.');
  }

  return {
    apiKey: envVars.SENDGRID_API_KEY,
  };
}

/**
 * Get email service configuration
 */
export function getEmailConfig() {
  const envVars = getEnv();

  return {
    enabled: !!envVars.SENDGRID_API_KEY,
    apiKey: envVars.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'info@beanumber.org',
    fromName: process.env.SENDGRID_FROM_NAME || 'Be A Number, International',
  };
}

/**
 * Get admin authentication token
 */
export function getAdminToken(): string {
  const envVars = getEnv();

  if (!envVars.ADMIN_API_TOKEN) {
    throw new Error('Admin authentication is not configured. Set ADMIN_API_TOKEN environment variable.');
  }

  return envVars.ADMIN_API_TOKEN;
}

/**
 * Check if SendGrid is configured
 */
export function isSendGridConfigured(): boolean {
  return hasEnv('SENDGRID_API_KEY');
}

/**
 * Check if admin authentication is configured
 */
export function isAdminAuthConfigured(): boolean {
  return hasEnv('ADMIN_API_TOKEN');
}

/**
 * Check if analytics is configured
 */
export function isAnalyticsConfigured(): boolean {
  return hasEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID');
}
