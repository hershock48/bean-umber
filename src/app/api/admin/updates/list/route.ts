/**
 * Admin Updates List API
 * Lists all pending updates for admin review (REQUIRES ADMIN AUTH)
 */

import { NextRequest, NextResponse } from 'next/server';
import { findPendingUpdates } from '@/lib/database';
import { logger } from '@/lib/logger';
import {
  createSuccessResponse,
  withErrorHandling,
} from '@/lib/errors';
import { requireAdminAuth } from '@/lib/auth';

async function handler(request: NextRequest): Promise<NextResponse> {
  const method = 'GET';
  const path = '/api/admin/updates/list';

  logger.apiRequest(method, path);

  // CRITICAL: Require admin authentication
  requireAdminAuth(request);

  // Get pending updates from Airtable
  const pendingUpdates = await findPendingUpdates();

  // Transform to API response format
  const updates = pendingUpdates.map((record) => ({
    id: record.id,
    childId: record.fields.ChildID,
    sponsorCode: record.fields.SponsorCode,
    updateType: record.fields.UpdateType,
    title: record.fields.Title,
    content: record.fields.Content,
    photos: record.fields.Photos?.map((photo) => ({
      url: photo.url,
      filename: photo.filename,
    })),
    status: record.fields.Status,
    requestedBySponsor: record.fields.RequestedBySponsor,
    requestedAt: record.fields.RequestedAt,
    submittedBy: record.fields.SubmittedBy,
    submittedAt: record.fields.SubmittedAt,
    createdTime: record.createdTime,
  }));

  logger.info('Listed pending updates for admin', {
    count: updates.length,
  });

  logger.apiResponse(method, path, 200);

  return createSuccessResponse({
    updates,
    count: updates.length,
  });
}

export const GET = withErrorHandling(handler, 'GET', '/api/admin/updates/list');
