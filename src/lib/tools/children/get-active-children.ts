/**
 * Tool: getActiveChildren
 *
 * Returns the canonical list of active children for compliance and forms.
 *
 * WAT-compliant tool:
 * - Single responsibility
 * - Structured output { success, data?, error? }
 * - Logging via logger.ts
 */

import { logger } from '../../logger';
import { airtableClient, findAllActiveSponsorships } from '../../database';
import type { ToolResult, ChildSummary, ChildStatus } from '../../types/child-update';
import { CHILD_STATUS } from '../../constants';

// ============================================================================
// TYPES
// ============================================================================

export interface GetActiveChildrenOutput {
  children: ChildSummary[];
  count: number;
}

// ============================================================================
// TOOL IMPLEMENTATION
// ============================================================================

/**
 * Get all active children in the system
 *
 * This tool queries the Sponsorships table (current implementation)
 * to return a list of children who are actively sponsored.
 *
 * In the full system, this would query a dedicated Children table.
 *
 * @returns List of active children with basic info
 */
export async function getActiveChildrenTool(): Promise<ToolResult<GetActiveChildrenOutput>> {
  logger.info('getActiveChildren: Starting', {});

  try {
    // For now, we derive children from active sponsorships
    // In full implementation, this would query a Children table
    const sponsorships = await findAllActiveSponsorships();

    // Map sponsorships to child summaries (dedupe by ChildID)
    const childMap = new Map<string, ChildSummary>();

    for (const sponsorship of sponsorships) {
      const childId = sponsorship.fields.ChildID;

      // Skip if we've already processed this child
      if (childMap.has(childId)) {
        continue;
      }

      childMap.set(childId, {
        recordId: sponsorship.id,
        childId: childId,
        firstName: sponsorship.fields.ChildDisplayName?.split(' ')[0] || 'Unknown',
        status: CHILD_STATUS.ACTIVE as ChildStatus,
        schoolLocation: sponsorship.fields.ChildLocation,
      });
    }

    const children = Array.from(childMap.values());

    logger.info('getActiveChildren: Completed', {
      count: children.length,
    });

    return {
      success: true,
      data: {
        children,
        count: children.length,
      },
    };
  } catch (error: unknown) {
    const err = error as { message?: string };

    logger.error('getActiveChildren: Failed', error, {});

    return {
      success: false,
      error: {
        code: 'airtable_error',
        message: err.message || 'Failed to fetch active children',
      },
    };
  }
}
