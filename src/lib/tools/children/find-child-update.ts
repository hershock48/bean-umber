/**
 * Tool: findChildUpdate
 *
 * Checks if a child update already exists for a given child, period, and source type.
 * Used to enforce uniqueness constraint.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 */

import { logger } from '../../logger';
import { findUpdatesForChild, findPendingUpdates, findAllPublishedUpdates } from '../../database';
import type { ToolResult, SourceType, ChildUpdateStatus } from '../../types/child-update';
import { SOURCE_TYPE, CHILD_UPDATE_STATUS } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface FindChildUpdateInput {
  childId: string;
  sourceType: SourceType;
  period?: string;
  academicTerm?: string;
}

export interface FindChildUpdateOutput {
  exists: boolean;
  updateRecordId?: string;
  status?: ChildUpdateStatus;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Find if a child update already exists
 *
 * Enforces uniqueness: (child_id, period/term, source_type) must be unique.
 *
 * @param input - Contains childId, sourceType, and period/academicTerm
 * @returns Whether an update exists and its record ID if so
 */
export async function findChildUpdateTool(
  input: FindChildUpdateInput
): Promise<ToolResult<FindChildUpdateOutput>> {
  const { childId, sourceType, period, academicTerm } = input;

  logger.info('findChildUpdate: Starting', {
    childId,
    sourceType,
    period,
    academicTerm,
  });

  // Validate input
  if (!childId || typeof childId !== 'string') {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'childId is required',
      },
    };
  }

  if (!sourceType || !Object.values(SOURCE_TYPE).includes(sourceType)) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'sourceType must be "field" or "academic"',
      },
    };
  }

  if (sourceType === SOURCE_TYPE.FIELD && !period) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'period is required for field updates',
      },
    };
  }

  if (sourceType === SOURCE_TYPE.ACADEMIC && !academicTerm) {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'academicTerm is required for academic updates',
      },
    };
  }

  try {
    // Current implementation uses the Updates table which doesn't have
    // sourceType or period fields. In full implementation, this would
    // query the Child Updates table with proper filtering.
    //
    // For now, we check if any update exists for this child.
    // This is a temporary measure until the Child Updates table is created.

    const periodOrTerm = period || academicTerm || '';

    // Check all updates for this child
    const publishedUpdates = await findUpdatesForChild(childId);
    const pendingUpdates = await findPendingUpdates();

    // Filter pending updates for this child
    const childPendingUpdates = pendingUpdates.filter(
      u => u.fields.ChildID === childId
    );

    // In the full implementation, we would filter by sourceType and period/term
    // For now, we use a simple heuristic based on UpdateType
    const allUpdates = [...publishedUpdates, ...childPendingUpdates];

    // Check if any update matches our criteria
    // This is a simplified check - full implementation would use proper fields
    const existingUpdate = allUpdates.find(u => {
      // Map UpdateType to sourceType (heuristic)
      const updateSourceType =
        u.fields.UpdateType === 'Progress Report' ? SOURCE_TYPE.ACADEMIC : SOURCE_TYPE.FIELD;

      // Check if it matches
      // In full implementation, we'd check the actual Period/AcademicTerm fields
      return updateSourceType === sourceType;
    });

    if (existingUpdate) {
      // Map status to new system (cast to string to handle all possible values)
      let status: ChildUpdateStatus;
      const rawStatus = existingUpdate.fields.Status as string;
      switch (rawStatus) {
        case 'Pending Review':
          status = CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus;
          break;
        case 'Published':
          status = CHILD_UPDATE_STATUS.PUBLISHED as ChildUpdateStatus;
          break;
        case 'Rejected':
          status = CHILD_UPDATE_STATUS.REJECTED as ChildUpdateStatus;
          break;
        case 'Needs Correction':
          status = CHILD_UPDATE_STATUS.NEEDS_CORRECTION as ChildUpdateStatus;
          break;
        case 'Draft':
          status = CHILD_UPDATE_STATUS.DRAFT as ChildUpdateStatus;
          break;
        default:
          status = CHILD_UPDATE_STATUS.PENDING_REVIEW as ChildUpdateStatus;
      }

      logger.info('findChildUpdate: Found existing', {
        childId,
        sourceType,
        updateRecordId: existingUpdate.id,
        status,
      });

      return {
        success: true,
        data: {
          exists: true,
          updateRecordId: existingUpdate.id,
          status,
        },
      };
    }

    logger.info('findChildUpdate: No existing update', {
      childId,
      sourceType,
      periodOrTerm,
    });

    return {
      success: true,
      data: {
        exists: false,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('findChildUpdate: Failed', error, {
      childId,
      sourceType,
    });

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to find child update',
      },
    };
  }
}
