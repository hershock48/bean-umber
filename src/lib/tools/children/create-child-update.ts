/**
 * Tool: createChildUpdateRecord
 *
 * Creates a new Child Update record with Pending Review status.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 * - Input validation
 */

import { logger } from '../../logger';
import { submitUpdate } from '../../database';
import { ROLE_EMAILS, SOURCE_TYPE, CHILD_UPDATE_STATUS, UPDATE_TYPES } from '../../constants';
import type {
  ToolResult,
  CreateChildUpdateInput,
  ChildUpdateStatus,
  SourceType,
  RoleActorEmail,
} from '../../types/child-update';

// ============================================================================
// TYPES
// ============================================================================

export interface CreateChildUpdateOutput {
  updateRecordId: string;
  updateId: string;
  status: ChildUpdateStatus;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate that the submitter email is a valid role email
 */
function isValidRoleEmail(email: string): email is RoleActorEmail {
  return Object.values(ROLE_EMAILS).includes(email as RoleActorEmail);
}

/**
 * Generate the computed Update ID
 */
function generateUpdateId(
  childId: string,
  periodOrTerm: string,
  sourceType: SourceType
): string {
  return `${childId} | ${periodOrTerm} | ${sourceType}`;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Create a new Child Update record
 *
 * @param input - Contains all update data
 * @returns The created record ID and computed update ID
 */
export async function createChildUpdateRecordTool(
  input: CreateChildUpdateInput
): Promise<ToolResult<CreateChildUpdateOutput>> {
  logger.info('createChildUpdateRecord: Starting', {
    childId: input.childId,
    sourceType: input.sourceType,
    period: input.period,
    academicTerm: input.academicTerm,
    submittedBy: input.submittedBy,
  });

  // =========================================================================
  // VALIDATION
  // =========================================================================

  // Validate required fields
  if (!input.childId) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'childId is required',
      },
    };
  }

  if (!input.sourceType || !Object.values(SOURCE_TYPE).includes(input.sourceType)) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'sourceType must be "field" or "academic"',
      },
    };
  }

  if (!input.submittedBy) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'submittedBy is required',
      },
    };
  }

  // Validate role-based submitter
  if (!isValidRoleEmail(input.submittedBy)) {
    logger.warn('createChildUpdateRecord: Invalid submitter email', {
      submittedBy: input.submittedBy,
      validEmails: Object.values(ROLE_EMAILS),
    });

    return {
      success: false,
      error: {
        code: 'forbidden_actor',
        message: `Submitter email must be a valid role email: ${Object.values(ROLE_EMAILS).join(', ')}`,
      },
    };
  }

  // Validate source-specific requirements
  if (input.sourceType === SOURCE_TYPE.FIELD && !input.period) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'period is required for field updates',
      },
    };
  }

  if (input.sourceType === SOURCE_TYPE.ACADEMIC && !input.academicTerm) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'academicTerm is required for academic updates',
      },
    };
  }

  // Validate submitter matches source type
  if (input.sourceType === SOURCE_TYPE.FIELD && input.submittedBy !== ROLE_EMAILS.FIELD_UPDATES) {
    return {
      success: false,
      error: {
        code: 'forbidden_actor',
        message: `Field updates must be submitted by ${ROLE_EMAILS.FIELD_UPDATES}`,
      },
    };
  }

  if (input.sourceType === SOURCE_TYPE.ACADEMIC && input.submittedBy !== ROLE_EMAILS.ACADEMICS) {
    return {
      success: false,
      error: {
        code: 'forbidden_actor',
        message: `Academic updates must be submitted by ${ROLE_EMAILS.ACADEMICS}`,
      },
    };
  }

  // =========================================================================
  // CREATE RECORD
  // =========================================================================

  try {
    const periodOrTerm = input.period || input.academicTerm || '';
    const updateId = generateUpdateId(input.childId, periodOrTerm, input.sourceType);

    // Map to existing Updates table structure (temporary)
    // In full implementation, this would create a record in Child Updates table
    const updateType =
      input.sourceType === SOURCE_TYPE.ACADEMIC
        ? UPDATE_TYPES.PROGRESS_REPORT
        : UPDATE_TYPES.PHOTO_UPDATE;

    // Build content from fields
    let content = '';
    if (input.fields.sponsorNarrative) {
      content = input.fields.sponsorNarrative;
    } else if (input.fields.attendancePercent !== undefined) {
      content = `Academic Update - Attendance: ${input.fields.attendancePercent}%`;
    } else {
      content = 'Update submitted';
    }

    // Create the record using existing function
    const record = await submitUpdate({
      childId: input.childId,
      updateType,
      title: `${input.sourceType === SOURCE_TYPE.FIELD ? 'Field' : 'Academic'} Update - ${periodOrTerm}`,
      content,
      submittedBy: input.submittedBy,
    });

    logger.info('createChildUpdateRecord: Created', {
      updateRecordId: record.id,
      updateId,
      childId: input.childId,
      sourceType: input.sourceType,
    });

    return {
      success: true,
      data: {
        updateRecordId: record.id,
        updateId,
        status: CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('createChildUpdateRecord: Failed', error, {
      childId: input.childId,
      sourceType: input.sourceType,
    });

    // Check for duplicate
    if (err.message?.includes('duplicate')) {
      return {
        success: false,
        error: {
          code: 'duplicate_update',
          message: 'An update already exists for this child, period, and source type',
        },
      };
    }

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to create child update record',
      },
    };
  }
}
