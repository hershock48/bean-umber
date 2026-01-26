/**
 * Authentication utilities
 * Shared helpers for session management and authentication
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { findSponsorshipByCode } from './database';
import { logger } from './logger';
import { AuthenticationError } from './errors';
import { SESSION, ERROR_MESSAGES } from './constants';
import type { AirtableSponsorshipRecord } from './types/airtable';

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export interface SessionData {
  email: string;
  sponsorCode: string;
  expires: string;
}

/**
 * Get session data from cookie
 */
export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION.COOKIE_NAME);

    if (!sessionCookie) {
      return null;
    }

    const session: SessionData = JSON.parse(sessionCookie.value);

    // Check if expired
    if (new Date(session.expires) < new Date()) {
      logger.auth('session_expired', false);
      return null;
    }

    return session;
  } catch (error) {
    logger.error('Failed to parse session cookie', error);
    return null;
  }
}

/**
 * Verify session and return sponsorship record
 */
export async function verifySession(): Promise<AirtableSponsorshipRecord | null> {
  const session = await getSession();

  if (!session) {
    return null;
  }

  // Verify sponsorship still exists and is active
  const sponsorship = await findSponsorshipByCode(session.sponsorCode);

  if (!sponsorship) {
    logger.auth('session_invalid', false, {
      reason: 'sponsorship_not_found',
      code: logger.maskSponsorCode(session.sponsorCode),
    });
    return null;
  }

  return sponsorship;
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<AirtableSponsorshipRecord> {
  const sponsorship = await verifySession();

  if (!sponsorship) {
    throw new AuthenticationError(ERROR_MESSAGES.SESSION_EXPIRED);
  }

  return sponsorship;
}

/**
 * Verify session for specific sponsor code
 */
export async function verifySessionForCode(sponsorCode: string): Promise<boolean> {
  const session = await getSession();

  if (!session) {
    return false;
  }

  if (session.sponsorCode !== sponsorCode) {
    logger.auth('session_code_mismatch', false, {
      sessionCode: logger.maskSponsorCode(session.sponsorCode),
      requestCode: logger.maskSponsorCode(sponsorCode),
    });
    return false;
  }

  return true;
}

/**
 * Clear session cookie (logout)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION.COOKIE_NAME);
  logger.auth('logout', true);
}

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

/**
 * Verify admin authentication token
 */
export function verifyAdminToken(request: NextRequest): boolean {
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    logger.warn('Admin authentication not configured');
    return false;
  }

  const requestToken = request.headers.get('X-Admin-Token');

  if (!requestToken) {
    logger.auth('admin_auth_missing_token', false);
    return false;
  }

  const isValid = requestToken === adminToken;

  logger.auth('admin_auth_attempt', isValid);

  return isValid;
}

/**
 * Require admin authentication - throws error if not authenticated
 */
export function requireAdminAuth(request: NextRequest): void {
  if (!verifyAdminToken(request)) {
    throw new AuthenticationError('Admin authentication required');
  }
}
