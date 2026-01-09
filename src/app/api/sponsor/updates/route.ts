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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sponsorCode = searchParams.get('sponsorCode');

    if (!sponsorCode) {
      return NextResponse.json(
        { error: 'Sponsor code is required' },
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

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials not configured');
    }

    // Get child info from Sponsorships table
    const sponsorshipFormula = `{SponsorCode} = "${sponsorCode}"`;
    const sponsorshipResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_SPONSORSHIPS_TABLE}?filterByFormula=${encodeURIComponent(sponsorshipFormula)}`,
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let childInfo = null;
    let childID = null;
    if (sponsorshipResponse.ok) {
      const sponsorshipData = await sponsorshipResponse.json();
      if (sponsorshipData.records && sponsorshipData.records.length > 0) {
        const fields = sponsorshipData.records[0].fields;
        childID = fields['ChildID'] || null;
        childInfo = {
          name: fields['ChildDisplayName'] || '',
          photo: fields['ChildPhoto']?.[0]?.url || undefined,
          age: fields['ChildAge'] || undefined,
          location: fields['ChildLocation'] || undefined,
          sponsorshipStartDate: fields['SponsorshipStartDate'] || undefined,
        };
      }
    }

    // Get published updates - link by ChildID
    let updates = [];
    if (childID) {
      const updatesFormula = `AND({ChildID} = "${childID}", {VisibleToSponsor} = TRUE(), {Status} = "Published")`;
      const updatesResponse = await fetch(
        `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_UPDATES_TABLE}?filterByFormula=${encodeURIComponent(updatesFormula)}&sort[0][field]=PublishedAt&sort[0][direction]=desc`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (updatesResponse.ok) {
        const updatesData = await updatesResponse.json();
        updates = (updatesData.records || []).map((record: any) => {
          const fields = record.fields;
          return {
            id: record.id,
            date: fields['PublishedAt'] || fields['RequestedAt'] || '',
            type: fields['UpdateType'] || 'Progress Report',
            title: fields['Title'] || '',
            content: fields['Content'] || '',
            photos: (fields['Photos'] || []).map((photo: any) => photo.url),
          };
        });
      }
    }

    // Get last request date from Sponsorships table
    let lastRequestDate = null;
    let nextRequestEligibleAt = null;
    if (sponsorshipResponse.ok) {
      const sponsorshipData = await sponsorshipResponse.json();
      if (sponsorshipData.records && sponsorshipData.records.length > 0) {
        const fields = sponsorshipData.records[0].fields;
        lastRequestDate = fields['LastRequestAt'] || null;
        nextRequestEligibleAt = fields['NextRequestEligibleAt'] || null;
      }
    }

    return NextResponse.json({
      updates,
      childInfo,
      lastRequestDate,
      nextRequestEligibleAt,
    });
  } catch (error: any) {
    console.error('[Sponsor Updates] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load updates' },
      { status: 500 }
    );
  }
}
