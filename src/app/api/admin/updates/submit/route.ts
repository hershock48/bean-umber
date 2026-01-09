import { NextRequest, NextResponse } from 'next/server';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_SPONSORSHIPS_TABLE = process.env.AIRTABLE_SPONSORSHIPS_TABLE || 'Sponsorships';
const AIRTABLE_UPDATES_TABLE = process.env.AIRTABLE_UPDATES_TABLE || 'Updates';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const sponsorCode = formData.get('sponsorCode') as string;
    const updateType = formData.get('updateType') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const submittedBy = formData.get('submittedBy') as string;
    const photos = formData.getAll('photos') as File[];

    if (!sponsorCode || !title || !content || !submittedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials not configured');
    }

    // Upload photos to Airtable (convert to base64 or use Airtable's attachment API)
    const photoAttachments: any[] = [];
    
    // Note: Airtable attachments need to be uploaded separately or converted to URLs
    // For now, we'll store photo metadata and you can upload manually or use a file storage service
    // In production, you'd want to upload to S3/Cloudinary/etc. and store URLs

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
        { error: 'Child ID not found for this sponsor code' },
        { status: 404 }
      );
    }

    // Create update record in Airtable
    const now = new Date().toISOString();
    const fields: any = {
      'ChildID': childID,
      'SponsorCode': sponsorCode,
      'UpdateType': updateType,
      'Title': title,
      'Content': content,
      'Status': 'Pending Review',
      'VisibleToSponsor': false,
      'RequestedBySponsor': false,
      'RequestedAt': now,
      'SubmittedBy': submittedBy,
    };

    // If you have photo URLs, add them here
    // For now, photos will need to be added manually in Airtable or via a file upload service

    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_UPDATES_TABLE}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Airtable API error: ${error}`);
    }

    const data = await response.json();

    // TODO: Upload photos to file storage and update record with photo URLs
    // For now, field team can add photos manually in Airtable after submission

    return NextResponse.json({
      success: true,
      updateId: data.id,
      message: 'Update submitted successfully. Photos can be added in Airtable.',
    });
  } catch (error: any) {
    console.error('[Submit Update] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit update' },
      { status: 500 }
    );
  }
}
