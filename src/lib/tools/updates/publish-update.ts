/**
 * Publish Update Tool
 *
 * WAT-compliant tool for publishing an update from admin review.
 * Sets status to Published, makes visible to sponsor, and sets PublishedAt timestamp.
 *
 * Usage in workflows:
 * - Agent reads workflow instructions
 * - Agent calls this tool with update ID
 * - Tool executes deterministically and returns structured result
 * - Agent uses result to continue workflow (e.g., send notification)
 */

import { logger } from '../../logger';
import { ValidationResult, success, failure, validateRequiredString } from '../../validation';
import { publishUpdate, getUpdateById, findSponsorshipBySponsorCode } from '../../database';
import type { AirtableUpdateRecord, AirtableSponsorshipRecord } from '../../types/airtable';

// ============================================================================
// INPUT/OUTPUT INTERFACES
// ============================================================================

/**
 * Input schema for publish-update tool
 */
export interface PublishUpdateInput {
  /** The Airtable record ID of the update to publish */
  updateId: string;
}

/**
 * Output schema for publish-update tool
 */
export interface PublishUpdateOutput {
  success: boolean;
  data?: {
    updateId: string;
    childId: string;
    title: string;
    sponsorCode?: string;
    sponsorEmail?: string;
    sponsorName?: string;
    publishedAt: string;
  };
  error?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate tool input
 * @param input - Raw input to validate
 * @returns Validated input or error
 */
function validateInput(input: unknown): ValidationResult<PublishUpdateInput> {
  if (!input || typeof input !== 'object') {
    return failure('Invalid input: expected an object');
  }

  const obj = input as Record<string, unknown>;

  // Validate 'updateId' field
  const updateIdResult = validateRequiredString(obj.updateId, 'updateId', 1, 100);
  if (!updateIdResult.success) {
    return failure(updateIdResult.error!);
  }

  return success({
    updateId: updateIdResult.data!,
  });
}

// ============================================================================
// MAIN TOOL FUNCTION
// ============================================================================

/**
 * Publish an update
 *
 * This tool validates inputs, publishes the update in Airtable,
 * and returns sponsor info for notification purposes.
 *
 * @param input - The update ID to publish
 * @returns Structured result with success/failure and data/error
 *
 * @example
 * const result = await publishUpdateTool({ updateId: 'rec123abc' });
 * if (result.success) {
 *   console.log('Published:', result.data?.title);
 *   // Send notification to result.data?.sponsorEmail
 * } else {
 *   console.error('Failed:', result.error);
 * }
 */
export async function publishUpdateTool(input: unknown): Promise<PublishUpdateOutput> {
  // 1. Validate input
  const validated = validateInput(input);
  if (!validated.success) {
    logger.warn('publish-update-tool validation failed', { error: validated.error });
    return {
      success: false,
      error: validated.error,
    };
  }

  const { updateId } = validated.data!;

  // 2. Execute action
  try {
    logger.debug('publish-update-tool executing', { updateId });

    // First, get the current update to verify it exists and get sponsor code
    const existingUpdate = await getUpdateById(updateId);
    if (!existingUpdate) {
      return {
        success: false,
        error: `Update not found: ${updateId}`,
      };
    }

    // Verify it's pending review
    if (existingUpdate.fields.Status !== 'Pending Review') {
      return {
        success: false,
        error: `Update is not pending review (current status: ${existingUpdate.fields.Status})`,
      };
    }

    // Publish the update
    const publishedUpdate = await publishUpdate(updateId);

    // Get sponsor info if sponsor code exists
    let sponsorInfo: AirtableSponsorshipRecord | null = null;
    if (publishedUpdate.fields.SponsorCode) {
      sponsorInfo = await findSponsorshipBySponsorCode(publishedUpdate.fields.SponsorCode);
    }

    // 3. Log success
    logger.info('publish-update-tool completed successfully', {
      updateId,
      childId: publishedUpdate.fields.ChildID,
      title: publishedUpdate.fields.Title,
      sponsorCode: publishedUpdate.fields.SponsorCode,
    });

    // 4. Return structured output
    return {
      success: true,
      data: {
        updateId: publishedUpdate.id,
        childId: publishedUpdate.fields.ChildID,
        title: publishedUpdate.fields.Title,
        sponsorCode: publishedUpdate.fields.SponsorCode,
        sponsorEmail: sponsorInfo?.fields.SponsorEmail,
        sponsorName: sponsorInfo?.fields.SponsorName,
        publishedAt: publishedUpdate.fields.PublishedAt!,
      },
    };
  } catch (error) {
    // 5. Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('publish-update-tool unexpected error', error, { updateId });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Default export for convenience
export default publishUpdateTool;
