/**
 * Input sanitization utilities for API routes
 * Prevents XSS, injection attacks, and data corruption
 */

/**
 * Sanitize a string by removing/escaping potentially dangerous characters
 * Keeps alphanumeric, spaces, and common punctuation
 */
export function sanitizeString(input: string | null | undefined, maxLength = 1000): string {
  if (!input) return '';
  
  return input
    // Convert to string in case of type coercion issues
    .toString()
    // Trim whitespace
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Escape HTML entities to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Limit length
    .slice(0, maxLength);
}

/**
 * Sanitize for plain text display (less strict, preserves more formatting)
 */
export function sanitizeText(input: string | null | undefined, maxLength = 5000): string {
  if (!input) return '';
  
  return input
    .toString()
    .trim()
    // Remove null bytes
    .replace(/\0/g, '')
    // Remove control characters except newlines, tabs, carriage returns
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Limit length
    .slice(0, maxLength);
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(input: string | null | undefined): string {
  if (!input) return '';
  
  const email = input.toString().trim().toLowerCase();
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return '';
  }
  
  // Max length for email (RFC 5321)
  return email.slice(0, 254);
}

/**
 * Sanitize a numeric string (for amounts, IDs, etc.)
 */
export function sanitizeNumber(input: string | number | null | undefined): number | null {
  if (input === null || input === undefined || input === '') return null;
  
  const num = typeof input === 'number' ? input : parseFloat(input.toString().replace(/[^0-9.-]/g, ''));
  
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  return num;
}

/**
 * Sanitize a sponsor code (alphanumeric + dashes)
 */
export function sanitizeSponsorCode(input: string | null | undefined): string {
  if (!input) return '';
  
  return input
    .toString()
    .trim()
    .toUpperCase()
    // Only allow alphanumeric and dashes
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 50);
}

/**
 * Create a safe error message for client responses
 * Hides internal details while remaining helpful
 */
export function safeErrorMessage(error: unknown, fallback = 'An unexpected error occurred'): string {
  // Known safe error messages to pass through
  const safeMessages = [
    'Invalid donation amount',
    'Missing required fields',
    'Unauthorized',
    'Invalid admin password',
    'Child ID not found',
    'Sponsor code not found',
    'Session expired',
    'Invalid email format',
  ];
  
  if (error instanceof Error) {
    // Check if it's a known safe message
    for (const safe of safeMessages) {
      if (error.message.toLowerCase().includes(safe.toLowerCase())) {
        return error.message;
      }
    }
  }
  
  // For unknown errors, return generic message
  return fallback;
}

/**
 * Validate and sanitize a URL
 */
export function sanitizeUrl(input: string | null | undefined, allowedHosts?: string[]): string | null {
  if (!input) return null;
  
  try {
    const url = new URL(input.toString().trim());
    
    // Only allow http/https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }
    
    // Check against allowed hosts if provided
    if (allowedHosts && !allowedHosts.includes(url.host)) {
      return null;
    }
    
    return url.toString();
  } catch {
    return null;
  }
}
