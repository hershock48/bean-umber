/**
 * List Overdue Updates Tool
 *
 * WAT-compliant tool for identifying children who haven't received updates recently.
 * Helps admin track which sponsorships need attention.
 *
 * Usage in workflows:
 * - Agent calls this tool to get list of overdue children
 * - Tool queries all active sponsorships and their update history
 * - Returns list of children needing updates (default: > 90 days since last update)
 */

import { logger } from '../../logger';
import { ValidationResult, success, failure } from '../../validation';
import { findAllActiveSponsorships, findAllPublishedUpdates } from '../../database';
import type { AirtableSponsorshipRecord, AirtableUpdateRecord } from '../../types/airtable';

// ============================================================================
// INPUT/OUTPUT INTERFACES
// ============================================================================

/**
 * Input schema for list-overdue tool
 */
export interface ListOverdueInput {
  /** Threshold in days (default: 90) */
  thresholdDays?: number;
}

/**
 * Child with overdue update
 */
export interface OverdueChild {
  /** Sponsor code (BAN-YYYY-XXX) */
  sponsorCode: string;
  /** Child's display name */
  childName: string;
  /** Child ID */
  childId: string;
  /** Sponsor's email address */
  sponsorEmail: string;
  /** Sponsor's name */
  sponsorName?: string;
  /** Date of last published update (null if never) */
  lastUpdateDate: string | null;
  /** Days since last update (Infinity if never) */
  daysSinceUpdate: number;
  /** Title of last update (if any) */
  lastUpdateTitle?: string;
}

/**
 * Output schema for list-overdue tool
 */
export interface ListOverdueOutput {
  success: boolean;
  data?: {
    overdueChildren: OverdueChild[];
    totalActive: number;
    overdueCount: number;
    thresholdDays: number;
    generatedAt: string;
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
function validateInput(input: unknown): ValidationResult<ListOverdueInput> {
  if (input === undefined || input === null) {
    return success({ thresholdDays: 90 });
  }

  if (typeof input !== 'object') {
    return failure('Invalid input: expected an object or undefined');
  }

  const obj = input as Record<string, unknown>;

  let thresholdDays = 90;
  if (obj.thresholdDays !== undefined) {
    if (typeof obj.thresholdDays !== 'number' || obj.thresholdDays < 1) {
      return failure('Invalid thresholdDays: must be a positive number');
    }
    thresholdDays = obj.thresholdDays;
  }

  return success({ thresholdDays });
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// MAIN TOOL FUNCTION
// ============================================================================

/**
 * List children with overdue updates
 *
 * This tool queries all active sponsorships, finds the most recent update
 * for each child, and returns those exceeding the threshold.
 *
 * @param input - Optional threshold configuration
 * @returns Structured result with overdue children list
 *
 * @example
 * const result = await listOverdueTool({ thresholdDays: 90 });
 * if (result.success) {
 *   console.log(`Found ${result.data?.overdueCount} overdue children`);
 *   result.data?.overdueChildren.forEach(child => {
 *     console.log(`${child.childName}: ${child.daysSinceUpdate} days`);
 *   });
 * }
 */
export async function listOverdueTool(input?: unknown): Promise<ListOverdueOutput> {
  // 1. Validate input
  const validated = validateInput(input);
  if (!validated.success) {
    logger.warn('list-overdue-tool validation failed', { error: validated.error });
    return {
      success: false,
      error: validated.error,
    };
  }

  const thresholdDays = validated.data!.thresholdDays ?? 90;

  // 2. Execute action
  try {
    logger.debug('list-overdue-tool executing', { thresholdDays });

    // Get all active sponsorships
    const sponsorships = await findAllActiveSponsorships();

    // Get all published updates
    const allUpdates = await findAllPublishedUpdates();

    // Build a map of childId -> most recent update
    const updatesByChild = new Map<string, AirtableUpdateRecord>();
    for (const update of allUpdates) {
      const childId = update.fields.ChildID;
      const existing = updatesByChild.get(childId);

      if (!existing) {
        updatesByChild.set(childId, update);
      } else {
        // Compare dates to keep most recent
        const existingDate = existing.fields.PublishedAt ? new Date(existing.fields.PublishedAt) : new Date(0);
        const updateDate = update.fields.PublishedAt ? new Date(update.fields.PublishedAt) : new Date(0);
        if (updateDate > existingDate) {
          updatesByChild.set(childId, update);
        }
      }
    }

    const now = new Date();
    const overdueChildren: OverdueChild[] = [];

    // Check each sponsorship
    for (const sponsorship of sponsorships) {
      const childId = sponsorship.fields.ChildID;
      const mostRecentUpdate = updatesByChild.get(childId);

      let lastUpdateDate: string | null = null;
      let daysSinceUpdate: number;
      let lastUpdateTitle: string | undefined;

      if (mostRecentUpdate && mostRecentUpdate.fields.PublishedAt) {
        lastUpdateDate = mostRecentUpdate.fields.PublishedAt;
        daysSinceUpdate = daysBetween(new Date(lastUpdateDate), now);
        lastUpdateTitle = mostRecentUpdate.fields.Title;
      } else {
        // Never had an update
        daysSinceUpdate = Infinity;
      }

      // Check if overdue
      if (daysSinceUpdate > thresholdDays) {
        overdueChildren.push({
          sponsorCode: sponsorship.fields.SponsorCode,
          childName: sponsorship.fields.ChildDisplayName,
          childId: childId,
          sponsorEmail: sponsorship.fields.SponsorEmail,
          sponsorName: sponsorship.fields.SponsorName,
          lastUpdateDate,
          daysSinceUpdate: daysSinceUpdate === Infinity ? -1 : daysSinceUpdate, // Use -1 for never
          lastUpdateTitle,
        });
      }
    }

    // Sort by days since update (most overdue first)
    overdueChildren.sort((a, b) => {
      // -1 (never) should be at the top
      if (a.daysSinceUpdate === -1) return -1;
      if (b.daysSinceUpdate === -1) return 1;
      return b.daysSinceUpdate - a.daysSinceUpdate;
    });

    // 3. Log success
    logger.info('list-overdue-tool completed successfully', {
      totalActive: sponsorships.length,
      overdueCount: overdueChildren.length,
      thresholdDays,
    });

    // 4. Return structured output
    return {
      success: true,
      data: {
        overdueChildren,
        totalActive: sponsorships.length,
        overdueCount: overdueChildren.length,
        thresholdDays,
        generatedAt: now.toISOString(),
      },
    };
  } catch (error) {
    // 5. Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('list-overdue-tool unexpected error', error, { thresholdDays });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Default export for convenience
export default listOverdueTool;
