/**
 * Tool: listPendingUpdates
 *
 * Returns all pending (unverified) child updates for admin review.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 */

import { logger } from '../../logger';
import { findPendingUpdates } from '../../database';
import { SOURCE_TYPE, CHILD_UPDATE_STATUS, UPDATE_TYPES } from '../../constants';
import type {
  ToolResult,
  ChildUpdateSummary,
  SourceType,
  ChildUpdateStatus,
} from '../../types/child-update';

// ============================================================================
// TYPES
// ============================================================================

export interface ListPendingUpdatesOutput {
  updates: ChildUpdateSummary[];
  count: number;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * List all pending child updates for admin review
 *
 * Returns updates with status = Pending Review or Needs Correction.
 *
 * @returns List of pending updates
 */
export async function listPendingUpdatesTool(): Promise<
  ToolResult<ListPendingUpdatesOutput>
> {
  logger.info('listPendingUpdates: Starting', {});

  try {
    const records = await findPendingUpdates();

    // Map to ChildUpdateSummary format
    const updates: ChildUpdateSummary[] = records.map(record => {
      // Infer source type from update type (temporary heuristic)
      const sourceType: SourceType =
        record.fields.UpdateType === UPDATE_TYPES.PROGRESS_REPORT
          ? SOURCE_TYPE.ACADEMIC
          : SOURCE_TYPE.FIELD;

      // Generate update ID
      const periodOrTerm =
        record.fields.SubmittedAt?.substring(0, 7) || 'unknown';
      const updateId = `${record.fields.ChildID} | ${periodOrTerm} | ${sourceType}`;

      return {
        recordId: record.id,
        updateId,
        childId: record.fields.ChildID,
        sourceType,
        periodOrTerm,
        submittedAt: record.fields.SubmittedAt || record.createdTime,
        submittedBy: record.fields.SubmittedBy || 'unknown',
        status: CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus,
      };
    });

    logger.info('listPendingUpdates: Completed', {
      count: updates.length,
    });

    return {
      success: true,
      data: {
        updates,
        count: updates.length,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('listPendingUpdates: Failed', error, {});

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to list pending updates',
      },
    };
  }
}
