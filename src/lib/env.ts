/**
 * Environment variable validation and access
 * Ensures all required environment variables are present at startup
 */

interface EnvironmentVariables {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;

  // Stripe (optional until configured)
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;

  // Email Service (SendGrid or Gmail)
  SENDGRID_API_KEY?: string;
  GMAIL_CLIENT_ID?: string;
  GMAIL_CLIENT_SECRET?: string;
  GMAIL_REFRESH_TOKEN?: string;
  GMAIL_USER_EMAIL?: string;
  GMAIL_FROM_EMAIL?: string;

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
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
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
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
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
 * Get Supabase configuration
 */
export function getSupabaseConfig() {
  const envVars = getEnv();
  return {
    url: envVars.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: envVars.SUPABASE_SERVICE_ROLE_KEY,
  };
}

/**
 * @deprecated Use getSupabaseConfig() instead
 * Kept for backward compatibility during migration
 */
export function getAirtableConfig() {
  console.warn('getAirtableConfig() is deprecated. Use getSupabaseConfig() instead.');
  return {
    apiKey: 'deprecated',
    baseId: 'deprecated',
    tables: {
      sponsorships: 'sponsorships',
      updates: 'updates',
      children: 'children',
      childUpdates: 'child_updates',
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
 * Supports both SendGrid and Gmail
 */
export function getEmailConfig() {
  const envVars = getEnv();
  const useGmail = !!(envVars.GMAIL_CLIENT_ID && envVars.GMAIL_CLIENT_SECRET && envVars.GMAIL_REFRESH_TOKEN);
  const useSendGrid = !!envVars.SENDGRID_API_KEY;

  return {
    enabled: useGmail || useSendGrid,
    provider: useGmail ? 'gmail' : 'sendgrid',
    // SendGrid config
    sendgridApiKey: envVars.SENDGRID_API_KEY || '',
    // Gmail config
    gmailClientId: envVars.GMAIL_CLIENT_ID,
    gmailClientSecret: envVars.GMAIL_CLIENT_SECRET,
    gmailRefreshToken: envVars.GMAIL_REFRESH_TOKEN,
    gmailUserEmail: envVars.GMAIL_USER_EMAIL || envVars.GMAIL_FROM_EMAIL,
    // Common config
    fromEmail: process.env.GMAIL_FROM_EMAIL || process.env.SENDGRID_FROM_EMAIL || 'info@beanumber.org',
    fromName: process.env.GMAIL_FROM_NAME || process.env.SENDGRID_FROM_NAME || 'Be A Number, International',
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
 * Check if Gmail is configured
 */
export function isGmailConfigured(): boolean {
  const envVars = getEnv();
  return !!(
    envVars.GMAIL_CLIENT_ID &&
    envVars.GMAIL_CLIENT_SECRET &&
    envVars.GMAIL_REFRESH_TOKEN
  );
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
