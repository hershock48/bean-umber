import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkLoginRateLimit } from '@/lib/rate-limit';
import { 
  validateEmail, 
  validateSponsorCode, 
  escapeForAirtable 
} from '@/lib/validation';
import { ERROR_MESSAGES } from '@/lib/constants';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_SPONSORSHIPS_TABLE = process.env.AIRTABLE_SPONSORSHIPS_TABLE || 'Sponsorships';

interface SponsorData {
  sponsorCode: string;
  email: string;
  name: string;
  childID: string;
  childName: string;
  childPhoto?: string;
  sponsorshipStartDate: string;
}

async function verifySponsor(email: string, sponsorCode: string): Promise<SponsorData | null> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    throw new Error('Airtable credentials not configured');
  }

  // Escape inputs for safe use in Airtable formula
  const escapedEmail = escapeForAirtable(email);
  const escapedCode = escapeForAirtable(sponsorCode);

  // Search for sponsor by email and sponsor code with all checks in formula
  // Airtable checkbox = 1 for true, 0 for false
  const formula = `AND({SponsorEmail}="${escapedEmail}",{SponsorCode}="${escapedCode}",{AuthStatus}="Active",{VisibleToSponsor}=1)`;
  
  console.log('[Verify] Airtable query with sanitized inputs');
  
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SPONSORSHIPS_TABLE}?filterByFormula=${encodeURIComponent(formula)}`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error('[Verify] Airtable API error:', error);
    throw new Error(`Airtable API error: ${error}`);
  }

  const data = await response.json();
  console.log('[Verify] Airtable response:', { recordCount: data.records?.length || 0 });

  if (data.records && data.records.length > 0) {
    const record = data.records[0];
    const fields = record.fields;

    // Double-check fields (formula should handle this, but verify)
    const authStatus = fields['AuthStatus'];
    const visibleToSponsor = fields['VisibleToSponsor'];

    if (authStatus !== 'Active') {
      console.log('[Verify] AuthStatus not Active:', authStatus);
      return null;
    }

    if (visibleToSponsor !== true && visibleToSponsor !== 1) {
      console.log('[Verify] VisibleToSponsor not true:', visibleToSponsor);
      return null;
    }

    return {
      sponsorCode: fields['SponsorCode'] || sponsorCode,
      email: fields['SponsorEmail'] || email,
      name: fields['SponsorName'] || '',
      childID: fields['ChildID'] || '',
      childName: fields['ChildDisplayName'] || '',
      childPhoto: fields['ChildPhoto']?.[0]?.url || undefined,
      sponsorshipStartDate: fields['SponsorshipStartDate'] || '',
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitError = checkLoginRateLimit(request);
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

    const body = await request.json();
    
    // Validate and sanitize inputs using the existing validation module
    const emailValidation = validateEmail(body.email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    const codeValidation = validateSponsorCode(body.sponsorCode);
    if (!codeValidation.success) {
      return NextResponse.json(
        { error: codeValidation.error },
        { status: 400 }
      );
    }

    const email = emailValidation.data!;
    const sponsorCode = codeValidation.data!;

    // Verify sponsor with sanitized inputs
    const sponsor = await verifySponsor(email, sponsorCode);

    if (!sponsor) {
      // Use generic error message to prevent enumeration attacks
      return NextResponse.json(
        { error: 'Invalid email or sponsor code, or sponsorship is not active' },
        { status: 401 }
      );
    }

    // Create session cookie (30 days)
    const cookieStore = await cookies();
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);

    const cookieValue = JSON.stringify({
      email: sponsor.email,
      sponsorCode: sponsor.sponsorCode,
      expires: expires.toISOString(),
    });

    // Cookie settings that work reliably
    cookieStore.set('sponsor_session', cookieValue, {
      httpOnly: true,
      secure: true, // Always true for HTTPS (beanumber.org)
      sameSite: 'lax',
      expires,
      path: '/',
      // Do NOT set domain - let it default to current domain
    });

    console.log('[Verify] Session cookie set:', {
      email: sponsor.email,
      sponsorCode: sponsor.sponsorCode,
      expires: expires.toISOString(),
    });

    return NextResponse.json({
      success: true,
      sponsorCode: sponsor.sponsorCode,
      name: sponsor.name,
    });
  } catch (error: unknown) {
    console.error('[Sponsor Verify] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify sponsor';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
