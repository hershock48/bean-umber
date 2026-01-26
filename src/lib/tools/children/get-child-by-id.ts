/**
 * Tool: getChildByChildId
 *
 * Validates that a Child ID exists and returns the child record.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 */

import { logger } from '../../logger';
import { findAllActiveSponsorships } from '../../database';
import type { ToolResult, ChildSummary, ChildStatus } from '../../types/child-update';
import { CHILD_STATUS } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface GetChildByIdInput {
  childId: string;
}

export interface GetChildByIdOutput {
  childRecordId: string;
  childId: string;
  firstName: string;
  status: ChildStatus;
  schoolLocation?: string;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Get a child by their Child ID
 *
 * Validates the Child ID exists and returns basic child info.
 *
 * @param input - Contains childId to lookup
 * @returns Child record if found
 */
export async function getChildByChildIdTool(
  input: GetChildByIdInput
): Promise<ToolResult<GetChildByIdOutput>> {
  const { childId } = input;

  logger.info('getChildByChildId: Starting', { childId });

  // Validate input
  if (!childId || typeof childId !== 'string') {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'childId is required and must be a string',
      },
    };
  }

  // Validate Child ID format (BAN-XXXX)
  const childIdPattern = /^BAN-\d{4,}$/;
  if (!childIdPattern.test(childId)) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'childId must be in format BAN-XXXX (e.g., BAN-0001)',
      },
    };
  }

  try {
    // For now, we look up children via sponsorships
    // In full implementation, this would query a Children table
    const sponsorships = await findAllActiveSponsorships();

    const sponsorship = sponsorships.find(s => s.fields.ChildID === childId);

    if (!sponsorship) {
      logger.warn('getChildByChildId: Child not found', { childId });

      return {
        success: false,
        error: {
          code: 'not_found',
          message: `Child with ID ${childId} not found`,
        },
      };
    }

    const result: GetChildByIdOutput = {
      childRecordId: sponsorship.id,
      childId: sponsorship.fields.ChildID,
      firstName: sponsorship.fields.ChildDisplayName?.split(' ')[0] || 'Unknown',
      status: CHILD_STATUS.ACTIVE as ChildStatus,
      schoolLocation: sponsorship.fields.ChildLocation,
    };

    logger.info('getChildByChildId: Found', {
      childId,
      childRecordId: result.childRecordId,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('getChildByChildId: Failed', error, { childId });

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to fetch child',
      },
    };
  }
}
