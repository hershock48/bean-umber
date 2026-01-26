/**
 * List Available Children Tool
 *
 * WAT-compliant tool for fetching children awaiting sponsors.
 * Returns list of available children with their profiles.
 */

import { logger } from '../../logger';
import { ValidationResult, success, failure } from '../../validation';
import { findAvailableChildren, sponsorshipToChildProfile } from '../../database';
import type { ChildProfile } from '../../types/airtable';

// ============================================================================
// INPUT/OUTPUT INTERFACES
// ============================================================================

/**
 * Input schema - no required parameters for listing
 */
export interface ListAvailableChildrenInput {
  /** Maximum number of children to return */
  limit?: number;
}

/**
 * Output schema
 */
export interface ListAvailableChildrenOutput {
  success: boolean;
  data?: {
    children: AvailableChild[];
    total: number;
  };
  error?: string;
}

/**
 * Available child data for catalog display
 */
export interface AvailableChild extends ChildProfile {
  recordId: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate tool input
 */
function validateInput(input: unknown): ValidationResult<ListAvailableChildrenInput> {
  // Input is optional for this tool
  if (input === undefined || input === null) {
    return success({});
  }

  if (typeof input !== 'object') {
    return failure('Invalid input: expected an object');
  }

  const obj = input as Record<string, unknown>;

  // Validate optional limit
  if (obj.limit !== undefined) {
    if (typeof obj.limit !== 'number' || obj.limit < 1) {
      return failure('Invalid input: limit must be a positive number');
    }
  }

  return success({
    limit: obj.limit as number | undefined,
  });
}

// ============================================================================
// MAIN TOOL FUNCTION
// ============================================================================

/**
 * List all children available for sponsorship
 *
 * @param input - Optional filter parameters
 * @returns List of available children with profiles
 *
 * @example
 * const result = await listAvailableChildrenTool({});
 * if (result.success) {
 *   result.data.children.forEach(child => console.log(child.displayName));
 * }
 */
export async function listAvailableChildrenTool(
  input?: unknown
): Promise<ListAvailableChildrenOutput> {
  // 1. Validate input
  const validated = validateInput(input);
  if (!validated.success) {
    logger.warn('list-available-children validation failed', { error: validated.error });
    return {
      success: false,
      error: validated.error,
    };
  }

  const { limit } = validated.data!;

  // 2. Execute action
  try {
    logger.debug('Fetching available children', { limit });

    // Query Airtable for available children
    const records = await findAvailableChildren();

    // Transform records to child profiles
    let children: AvailableChild[] = records.map(record => ({
      ...sponsorshipToChildProfile(record),
      recordId: record.id,
    }));

    // Apply limit if specified
    if (limit && limit < children.length) {
      children = children.slice(0, limit);
    }

    // 3. Log success
    logger.info('Listed available children', {
      total: records.length,
      returned: children.length,
    });

    // 4. Return structured output
    return {
      success: true,
      data: {
        children,
        total: records.length,
      },
    };
  } catch (error) {
    // 5. Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('list-available-children failed', error);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
