/**
 * Tool: detectMissingUpdates
 *
 * Compares expected updates against existing submissions to identify
 * children who are missing updates for a given period/term.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 * - Read-only (no data modification)
 */

import { logger } from '../../logger';
import { getActiveChildrenTool } from '../children';
import { findUpdatesForChild, findPendingUpdates } from '../../database';
import { SOURCE_TYPE, UPDATE_STATUS } from '../../constants';
import type {
  ToolResult,
  SourceType,
  MissingUpdate,
} from '../../types/child-update';

// ============================================================================
// TYPES
// ============================================================================

export interface DetectMissingUpdatesInput {
  periodOrTerm: string;
  sourceType: SourceType;
}

export interface DetectMissingUpdatesOutput {
  missingChildIds: string[];
  presentChildIds: string[];
  missingUpdates: MissingUpdate[];
  counts: {
    expected: number;
    present: number;
    missing: number;
  };
  complianceRate: number;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Detect which children are missing updates for a given period
 *
 * Compares the list of active children against submitted updates
 * to identify who needs to submit.
 *
 * "Present" means status is one of:
 * - Pending Review
 * - Needs Correction
 * - Published
 *
 * @param input - Contains periodOrTerm and sourceType
 * @returns Lists of missing and present children with counts
 */
export async function detectMissingUpdatesTool(
  input: DetectMissingUpdatesInput
): Promise<ToolResult<DetectMissingUpdatesOutput>> {
  const { periodOrTerm, sourceType } = input;

  logger.info('detectMissingUpdates: Starting', {
    periodOrTerm,
    sourceType,
  });

  // =========================================================================
  // VALIDATION
  // =========================================================================

  if (!periodOrTerm || typeof periodOrTerm !== 'string') {
    return {
      success: false,
      error: {
        code: 'invalid_args',
        message: 'periodOrTerm is required',
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

  // =========================================================================
  // FETCH DATA
  // =========================================================================

  try {
    // Get all active children
    const childrenResult = await getActiveChildrenTool();

    if (!childrenResult.success) {
      return {
        success: false,
        error: childrenResult.error,
      };
    }

    const activeChildren = childrenResult.data.children;
    const activeChildIds = new Set(activeChildren.map(c => c.childId));

    // Get all pending updates
    const pendingUpdates = await findPendingUpdates();

    // Build a set of children who have submitted updates for this period
    // In the current implementation, we use a heuristic based on SubmittedAt date
    // matching the period. In full implementation, this would use the Period field.
    const presentChildIds = new Set<string>();

    // Check pending updates
    for (const update of pendingUpdates) {
      const childId = update.fields.ChildID;
      const submittedAt = update.fields.SubmittedAt || update.createdTime;

      // Extract period from submitted date (YYYY-MM format)
      const submittedPeriod = submittedAt?.substring(0, 7);

      // Simple period matching (for MVP)
      // In full implementation, would match exact Period/AcademicTerm field
      if (submittedPeriod === periodOrTerm || periodOrTerm.includes(submittedPeriod?.substring(0, 4) || '')) {
        presentChildIds.add(childId);
      }
    }

    // Also check for published updates
    for (const child of activeChildren) {
      const updates = await findUpdatesForChild(child.childId);

      for (const update of updates) {
        const publishedAt = update.fields.PublishedAt;
        const publishedPeriod = publishedAt?.substring(0, 7);

        if (publishedPeriod === periodOrTerm || periodOrTerm.includes(publishedPeriod?.substring(0, 4) || '')) {
          presentChildIds.add(child.childId);
          break;
        }
      }
    }

    // Identify missing children
    const missingChildIds: string[] = [];
    const missingUpdates: MissingUpdate[] = [];

    for (const child of activeChildren) {
      if (!presentChildIds.has(child.childId)) {
        missingChildIds.push(child.childId);
        missingUpdates.push({
          childId: child.childId,
          childFirstName: child.firstName,
          periodOrTerm,
          sourceType,
        });
      }
    }

    const expected = activeChildren.length;
    const present = presentChildIds.size;
    const missing = missingChildIds.length;
    const complianceRate = expected > 0 ? Math.round((present / expected) * 100) : 100;

    logger.info('detectMissingUpdates: Completed', {
      periodOrTerm,
      sourceType,
      expected,
      present,
      missing,
      complianceRate,
    });

    return {
      success: true,
      data: {
        missingChildIds,
        presentChildIds: Array.from(presentChildIds),
        missingUpdates,
        counts: {
          expected,
          present,
          missing,
        },
        complianceRate,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('detectMissingUpdates: Failed', error, {
      periodOrTerm,
      sourceType,
    });

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to detect missing updates',
      },
    };
  }
}
