import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { verifyAdminToken } from '@/lib/auth';
import { checkUpdateSubmissionRateLimit } from '@/lib/rate-limit';
import { 
  validateSponsorCode, 
  validateUpdateTitle, 
  validateUpdateContent,
  validateRequiredString,
  sanitizeString,
  escapeForAirtable 
} from '@/lib/validation';
import { ERROR_MESSAGES } from '@/lib/constants';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_SPONSORSHIPS_TABLE = process.env.AIRTABLE_SPONSORSHIPS_TABLE || 'Sponsorships';
const AIRTABLE_UPDATES_TABLE = process.env.AIRTABLE_UPDATES_TABLE || 'Updates';

/**
 * Verify form-submitted token using timing-safe comparison
 */
function verifyFormToken(token: string | null): boolean {
  if (!token) return false;
  
  const expectedToken = process.env.ADMIN_API_TOKEN;
  if (!expectedToken) return false;
  
  try {
    const tokenBuffer = Buffer.from(token, 'utf8');
    const expectedBuffer = Buffer.from(expectedToken, 'utf8');
    
    if (tokenBuffer.length !== expectedBuffer.length) {
      // Do a comparison anyway to maintain constant time
      timingSafeEqual(tokenBuffer, tokenBuffer);
      return false;
    }
    
    return timingSafeEqual(tokenBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit first
    const rateLimitError = checkUpdateSubmissionRateLimit(request);
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

    const formData = await request.formData();
    
    // Authentication check using timing-safe comparison
    const adminPassword = formData.get('adminPassword') as string;
    
    // Verify token - try both header and form-based auth
    if (!verifyAdminToken(request) && !verifyFormToken(adminPassword)) {
      console.warn('[Admin Submit] Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin password' },
        { status: 401 }
      );
    }
    
    // Extract and validate form fields
    const sponsorCodeRaw = formData.get('sponsorCode') as string;
    const updateType = sanitizeString(formData.get('updateType')).slice(0, 100);
    const titleRaw = formData.get('title') as string;
    const contentRaw = formData.get('content') as string;
    const submittedByRaw = formData.get('submittedBy') as string;

    // Validate sponsor code
    const codeValidation = validateSponsorCode(sponsorCodeRaw);
    if (!codeValidation.success) {
      return NextResponse.json(
        { error: codeValidation.error },
        { status: 400 }
      );
    }
    const sponsorCode = codeValidation.data!;

    // Validate title
    const titleValidation = validateUpdateTitle(titleRaw);
    if (!titleValidation.success) {
      return NextResponse.json(
        { error: titleValidation.error },
        { status: 400 }
      );
    }
    const title = titleValidation.data!;

    // Validate content
    const contentValidation = validateUpdateContent(contentRaw);
    if (!contentValidation.success) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      );
    }
    const content = contentValidation.data!;

    // Validate submittedBy
    const submittedByValidation = validateRequiredString(submittedByRaw, 'Submitted by', 1, 200);
    if (!submittedByValidation.success) {
      return NextResponse.json(
        { error: submittedByValidation.error },
        { status: 400 }
      );
    }
    const submittedBy = submittedByValidation.data!;

    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable credentials not configured');
    }

    // Get ChildID from Sponsorships table with escaped input
    const escapedCode = escapeForAirtable(sponsorCode);
    const sponsorshipFormula = `{SponsorCode} = "${escapedCode}"`;
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
    const fields: Record<string, unknown> = {
      'ChildID': childID,
      'SponsorCode': sponsorCode,
      'UpdateType': updateType || 'Progress Report',
      'Title': title,
      'Content': content,
      'Status': 'Pending Review',
      'VisibleToSponsor': false,
      'RequestedBySponsor': false,
      'RequestedAt': now,
      'SubmittedBy': submittedBy,
    };

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

    return NextResponse.json({
      success: true,
      updateId: data.id,
      message: 'Update submitted successfully. Photos can be added in Airtable.',
    });
  } catch (error: unknown) {
    console.error('[Submit Update] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit update';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
