import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Prevent MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Enable XSS filter (legacy browsers)
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    // Control referrer information
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Permissions policy (restrict browser features)
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    // Strict Transport Security (HTTPS only)
    // Only enable in production (beanumber.org uses HTTPS)
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    // Content Security Policy
    // Adjusted to allow Stripe, Airtable, and legitimate third-party resources
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self, Stripe, inline for Next.js hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com",
      // Styles: self, inline for CSS-in-JS
      "style-src 'self' 'unsafe-inline'",
      // Images: self, data URIs, Stripe, Airtable attachments
      "img-src 'self' data: blob: https: https://*.stripe.com https://dl.airtable.com https://v5.airtableusercontent.com",
      // Fonts: self and common font CDNs
      "font-src 'self' data:",
      // Connect: self, Stripe, Airtable API
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://api.airtable.com",
      // Frames: Stripe checkout
      "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://hooks.stripe.com",
      // Form actions
      "form-action 'self'",
      // Base URI
      "base-uri 'self'",
      // Object sources
      "object-src 'none'",
      // Upgrade insecure requests in production
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  /* config options here */
  
  // Add security headers to all routes
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  
  // Recommended: Disable x-powered-by header
  poweredByHeader: false,
};

export default nextConfig;
