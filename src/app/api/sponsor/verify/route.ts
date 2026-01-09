import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

  // Search for sponsor by email and sponsor code with all checks in formula
  // Airtable checkbox = 1 for true, 0 for false
  const formula = `AND({SponsorEmail}="${email}",{SponsorCode}="${sponsorCode}",{AuthStatus}="Active",{VisibleToSponsor}=1)`;
  
  console.log('[Verify] Airtable query:', formula);
  
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
    const { email, sponsorCode } = await request.json();

    if (!email || !sponsorCode) {
      return NextResponse.json(
        { error: 'Email and sponsor code are required' },
        { status: 400 }
      );
    }

    // Verify sponsor
    const sponsor = await verifySponsor(email, sponsorCode);

    if (!sponsor) {
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
  } catch (error: any) {
    console.error('[Sponsor Verify] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify sponsor' },
      { status: 500 }
    );
  }
}
