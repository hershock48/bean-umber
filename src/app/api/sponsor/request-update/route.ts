import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_SPONSORSHIPS_TABLE = process.env.AIRTABLE_SPONSORSHIPS_TABLE || 'Sponsorships';
const AIRTABLE_UPDATES_TABLE = process.env.AIRTABLE_UPDATES_TABLE || 'Updates';

async function verifySession(sponsorCode: string): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('sponsor_session');

  if (!sessionCookie) return false;

  try {
    const session = JSON.parse(sessionCookie.value);
    if (new Date(session.expires) < new Date()) return false;
    return session.sponsorCode === sponsorCode;
  } catch {
    return false;
  }
}

async function checkLastRequest(sponsorCode: string): Promise<{ canRequest: boolean; daysUntil: number }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    return { canRequest: false, daysUntil: 0 };
  }

  const formula = `{SponsorCode} = "${sponsorCode}"`;
  
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SPONSORSHIPS_TABLE}?filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      if (data.records && data.records.length > 0) {
        const fields = data.records[0].fields;
        const nextRequestEligibleAt = fields['NextRequestEligibleAt'];
        
        if (nextRequestEligibleAt) {
          const eligibleDate = new Date(nextRequestEligibleAt);
          const now = new Date();
          const canRequest = now >= eligibleDate;
          const daysUntil = canRequest ? 0 : Math.ceil((eligibleDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          return { canRequest, daysUntil };
        }
      }
    }
  } catch (error) {
    console.error('Error checking last request:', error);
  }

  return { canRequest: true, daysUntil: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const { sponsorCode, email } = await request.json();

    if (!sponsorCode || !email) {
      return NextResponse.json(
        { error: 'Sponsor code and email are required' },
        { status: 400 }
      );
    }

    // Verify session
    if (!(await verifySession(sponsorCode))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if can request using NextRequestEligibleAt
    const { canRequest, daysUntil } = await checkLastRequest(sponsorCode);

    if (!canRequest) {
      return NextResponse.json(
        { error: `You can request your next update in ${daysUntil} days. Updates are limited to once per quarter.` },
        { status: 429 }
      );
    }

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials not configured');
    }

    // Get ChildID from Sponsorships table
    const sponsorshipFormula = `{SponsorCode} = "${sponsorCode}"`;
    const sponsorshipResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SPONSORSHIPS_TABLE}?filterByFormula=${encodeURIComponent(sponsorshipFormula)}&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let childID = null;
    if (sponsorshipResponse.ok) {
      const sponsorshipData = await sponsorshipResponse.json();
      if (sponsorshipData.records && sponsorshipData.records.length > 0) {
        childID = sponsorshipData.records[0].fields['ChildID'] || null;
      }
    }

    if (!childID) {
      return NextResponse.json(
        { error: 'Child ID not found for this sponsorship' },
        { status: 404 }
      );
    }

    // Create update request record
    const now = new Date().toISOString();
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_UPDATES_TABLE}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'ChildID': childID,
            'SponsorCode': sponsorCode,
            'UpdateType': 'Requested Update',
            'Title': `Update Request from ${email}`,
            'Content': `Sponsor ${email} has requested an update about their sponsored child.`,
            'Status': 'Pending Review',
            'VisibleToSponsor': false,
            'RequestedBySponsor': true,
            'RequestedAt': now,
          },
        }),
      }
    );

    // Update Sponsorships table with LastRequestAt and NextRequestEligibleAt
    if (response.ok) {
      const sponsorshipData = await sponsorshipResponse.json();
      if (sponsorshipData.records && sponsorshipData.records.length > 0) {
        const sponsorshipId = sponsorshipData.records[0].id;
        const nextEligible = new Date();
        nextEligible.setDate(nextEligible.getDate() + 90); // 90 days from now

        await fetch(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SPONSORSHIPS_TABLE}/${sponsorshipId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${AIRTABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fields: {
                'LastRequestAt': now,
                'NextRequestEligibleAt': nextEligible.toISOString(),
              },
            }),
          }
        );
      }
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Airtable API error: ${error}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Update request submitted successfully',
    });
  } catch (error: any) {
    console.error('[Request Update] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit update request' },
      { status: 500 }
    );
  }
}
