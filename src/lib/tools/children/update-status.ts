/**
 * Tool: updateChildUpdateStatus
 *
 * Updates the status of a child update record.
 * Enforces governance rules:
 * - Published records are immutable
 * - Only admin can set Published/Rejected
 * - Only admin can set Needs Correction
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 */

import { logger } from '../../logger';
import { getUpdateById, publishUpdate, rejectUpdate } from '../../database';
import { airtableClient } from '../../database';
import { ROLE_EMAILS, CHILD_UPDATE_STATUS, AIRTABLE_FIELDS, UPDATE_STATUS } from '../../constants';
import type { ToolResult, ChildUpdateStatus, RoleActorEmail } from '../../types/child-update';
import { getAirtableConfig } from '../../env';

// ============================================================================
// TYPES
// ============================================================================

export interface UpdateStatusInput {
  updateRecordId: string;
  nextStatus: ChildUpdateStatus;
  actorEmail: string;
  notes?: string;
}

export interface UpdateStatusOutput {
  updateRecordId: string;
  status: ChildUpdateStatus;
  previousStatus: ChildUpdateStatus;
}

// ============================================================================
// STATUS TRANSITION RULES
// ============================================================================

/**
 * Valid status transitions
 * Key: current status, Value: array of allowed next statuses
 */
const VALID_TRANSITIONS: Record<ChildUpdateStatus, ChildUpdateStatus[]> = {
  'Draft': ['Pending Review', 'Rejected'],
  'Pending Review': ['Needs Correction', 'Published', 'Rejected'],
  'Needs Correction': ['Pending Review', 'Published', 'Rejected'],
  'Published': [], // Immutable
  'Rejected': [], // Terminal state
};

/**
 * Admin-only status changes
 */
const ADMIN_ONLY_STATUSES: ChildUpdateStatus[] = [
  CHILD_UPDATE_STATUS.PUBLISHED as ChildUpdateStatus,
  CHILD_UPDATE_STATUS.REJECTED as ChildUpdateStatus,
  CHILD_UPDATE_STATUS.NEEDS_CORRECTION as ChildUpdateStatus,
];

/**
 * Map child update status to legacy Updates table status
 */
function mapToLegacyStatus(status: ChildUpdateStatus): string {
  switch (status) {
    case CHILD_UPDATE_STATUS.DRAFT:
    case CHILD_UPDATE_STATUS.PENDING_REVIEW:
    case CHILD_UPDATE_STATUS.NEEDS_CORRECTION:
      return UPDATE_STATUS.PENDING_REVIEW;
    case CHILD_UPDATE_STATUS.PUBLISHED:
      return UPDATE_STATUS.PUBLISHED;
    case CHILD_UPDATE_STATUS.REJECTED:
      return UPDATE_STATUS.REJECTED;
    default:
      return UPDATE_STATUS.PENDING_REVIEW;
  }
}

/**
 * Map legacy status to new status system
 */
function mapFromLegacyStatus(status: string): ChildUpdateStatus {
  switch (status) {
    case UPDATE_STATUS.PENDING_REVIEW:
      return CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus;
    case UPDATE_STATUS.PUBLISHED:
      return CHILD_UPDATE_STATUS.PUBLISHED as ChildUpdateStatus;
    case UPDATE_STATUS.REJECTED:
      return CHILD_UPDATE_STATUS.REJECTED as ChildUpdateStatus;
    default:
      return CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus;
  }
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Update the status of a child update
 *
 * Enforces governance rules:
 * - Published records cannot be modified
 * - Only admin can publish, reject, or request correction
 *
 * @param input - Contains updateRecordId, nextStatus, actorEmail, and optional notes
 * @returns Updated record status
 */
export async function updateChildUpdateStatusTool(
  input: UpdateStatusInput
): Promise<ToolResult<UpdateStatusOutput>> {
  const { updateRecordId, nextStatus, actorEmail, notes } = input;

  logger.info('updateChildUpdateStatus: Starting', {
    updateRecordId,
    nextStatus,
    actorEmail,
  });

  // =========================================================================
  // VALIDATION
  // =========================================================================

  if (!updateRecordId) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'updateRecordId is required',
      },
    };
  }

  if (!nextStatus || !Object.values(CHILD_UPDATE_STATUS).includes(nextStatus)) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: `nextStatus must be one of: ${Object.values(CHILD_UPDATE_STATUS).join(', ')}`,
      },
    };
  }

  if (!actorEmail) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'actorEmail is required',
      },
    };
  }

  // Check if admin-only status change
  if (
    ADMIN_ONLY_STATUSES.includes(nextStatus) &&
    actorEmail !== ROLE_EMAILS.ADMIN
  ) {
    logger.warn('updateChildUpdateStatus: Non-admin attempted admin action', {
      updateRecordId,
      nextStatus,
      actorEmail,
    });

    return {
      success: false,
      error: {
        code: 'forbidden',
        message: `Only ${ROLE_EMAILS.ADMIN} can set status to ${nextStatus}`,
      },
    };
  }

  // =========================================================================
  // FETCH CURRENT RECORD
  // =========================================================================

  try {
    const record = await getUpdateById(updateRecordId);

    if (!record) {
      return {
        success: false,
        error: {
          code: 'not_found',
          message: `Update record ${updateRecordId} not found`,
        },
      };
    }

    const currentStatus = mapFromLegacyStatus(record.fields.Status);

    // =========================================================================
    // VALIDATE TRANSITION
    // =========================================================================

    // Check if record is published (immutable)
    if (currentStatus === CHILD_UPDATE_STATUS.PUBLISHED) {
      logger.warn('updateChildUpdateStatus: Attempted to modify published record', {
        updateRecordId,
        nextStatus,
      });

      return {
        success: false,
        error: {
          code: 'published_immutable',
          message: 'Published updates cannot be modified. Create a correction update instead.',
        },
      };
    }

    // Check if transition is valid
    const allowedTransitions = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedTransitions.includes(nextStatus)) {
      return {
        success: false,
        error: {
          code: 'invalid_transition',
          message: `Cannot transition from ${currentStatus} to ${nextStatus}. Allowed: ${allowedTransitions.join(', ')}`,
        },
      };
    }

    // =========================================================================
    // PERFORM UPDATE
    // =========================================================================

    // Use existing functions for publish/reject
    if (nextStatus === CHILD_UPDATE_STATUS.PUBLISHED) {
      await publishUpdate(updateRecordId);
    } else if (nextStatus === CHILD_UPDATE_STATUS.REJECTED) {
      await rejectUpdate(updateRecordId);
    } else {
      // For other status changes, update directly
      // This would need to be implemented for needs_correction
      const config = getAirtableConfig();
      await airtableClient.updateRecord(
        config.tables.updates,
        updateRecordId,
        {
          [AIRTABLE_FIELDS.UPDATES.STATUS]: mapToLegacyStatus(nextStatus),
        }
      );
    }

    logger.info('updateChildUpdateStatus: Completed', {
      updateRecordId,
      previousStatus: currentStatus,
      nextStatus,
      actorEmail,
    });

    return {
      success: true,
      data: {
        updateRecordId,
        status: nextStatus,
        previousStatus: currentStatus,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('updateChildUpdateStatus: Failed', error, {
      updateRecordId,
      nextStatus,
    });

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to update status',
      },
    };
  }
}
