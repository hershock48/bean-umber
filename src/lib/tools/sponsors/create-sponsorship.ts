/**
 * Create Sponsorship Tool
 *
 * WAT-compliant tool for creating new sponsorships.
 * Assigns a sponsor to an available child.
 */

import { logger } from '../../logger';
import { ValidationResult, success, failure } from '../../validation';
import { assignSponsorToChild, getSponsorshipById } from '../../database';
import { VALIDATION, SPONSOR_CODE_PATTERN, SPONSORSHIP_STATUS } from '../../constants';

// ============================================================================
// INPUT/OUTPUT INTERFACES
// ============================================================================

/**
 * Input schema for creating a sponsorship
 */
export interface CreateSponsorshipInput {
  /** Airtable record ID of the child's placeholder sponsorship */
  recordId: string;
  /** Sponsor's email address */
  sponsorEmail: string;
  /** Sponsor's full name */
  sponsorName?: string;
}

/**
 * Output schema
 */
export interface CreateSponsorshipOutput {
  success: boolean;
  data?: {
    sponsorCode: string;
    sponsorEmail: string;
    sponsorName?: string;
    childId: string;
    childName: string;
    sponsorshipStartDate: string;
  };
  error?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate tool input
 */
function validateInput(input: unknown): ValidationResult<CreateSponsorshipInput> {
  if (!input || typeof input !== 'object') {
    return failure('Invalid input: expected an object');
  }

  const obj = input as Record<string, unknown>;

  // Validate required recordId
  if (typeof obj.recordId !== 'string' || !obj.recordId.trim()) {
    return failure('Invalid input: recordId is required');
  }

  // Validate required sponsorEmail
  if (typeof obj.sponsorEmail !== 'string' || !obj.sponsorEmail.trim()) {
    return failure('Invalid input: sponsorEmail is required');
  }

  // Validate email format
  if (!VALIDATION.EMAIL_REGEX.test(obj.sponsorEmail.trim())) {
    return failure('Invalid input: sponsorEmail must be a valid email address');
  }

  // Validate optional sponsorName
  if (obj.sponsorName !== undefined && typeof obj.sponsorName !== 'string') {
    return failure('Invalid input: sponsorName must be a string');
  }

  return success({
    recordId: obj.recordId.trim(),
    sponsorEmail: obj.sponsorEmail.trim().toLowerCase(),
    sponsorName: obj.sponsorName ? (obj.sponsorName as string).trim() : undefined,
  });
}

/**
 * Generate a unique sponsor code
 */
function generateSponsorCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
  return `BAN-${year}-${randomNum}`;
}

// ============================================================================
// MAIN TOOL FUNCTION
// ============================================================================

/**
 * Create a sponsorship by assigning a sponsor to an available child
 *
 * @param input - Sponsorship details
 * @returns Created sponsorship information including sponsor code
 *
 * @example
 * const result = await createSponsorshipTool({
 *   recordId: 'recXXXXXX',
 *   sponsorEmail: 'sponsor@example.com',
 *   sponsorName: 'John Doe'
 * });
 */
export async function createSponsorshipTool(
  input: unknown
): Promise<CreateSponsorshipOutput> {
  // 1. Validate input
  const validated = validateInput(input);
  if (!validated.success) {
    logger.warn('create-sponsorship validation failed', { error: validated.error });
    return {
      success: false,
      error: validated.error,
    };
  }

  const { recordId, sponsorEmail, sponsorName } = validated.data!;

  // 2. Execute action
  try {
    logger.debug('Creating sponsorship', {
      recordId,
      email: logger.maskEmail(sponsorEmail),
    });

    // First, verify the record exists and is available
    const existingRecord = await getSponsorshipById(recordId);

    if (!existingRecord) {
      return {
        success: false,
        error: 'Child record not found',
      };
    }

    // Check if already sponsored
    if (existingRecord.fields.Status !== SPONSORSHIP_STATUS.AWAITING_SPONSOR) {
      return {
        success: false,
        error: 'This child is no longer available for sponsorship',
      };
    }

    // Generate unique sponsor code
    const sponsorCode = generateSponsorCode();

    // Assign sponsor to child
    const updatedRecord = await assignSponsorToChild(recordId, {
      sponsorEmail,
      sponsorName,
      sponsorCode,
    });

    // 3. Log success
    logger.info('Sponsorship created', {
      sponsorCode: logger.maskSponsorCode(sponsorCode),
      childId: updatedRecord.fields.ChildID,
      childName: updatedRecord.fields.ChildDisplayName,
    });

    // 4. Return structured output
    return {
      success: true,
      data: {
        sponsorCode,
        sponsorEmail,
        sponsorName,
        childId: updatedRecord.fields.ChildID,
        childName: updatedRecord.fields.ChildDisplayName,
        sponsorshipStartDate: updatedRecord.fields.SponsorshipStartDate || new Date().toISOString().split('T')[0],
      },
    };
  } catch (error) {
    // 5. Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('create-sponsorship failed', error, {
      recordId,
      email: logger.maskEmail(sponsorEmail),
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}
