/**
 * Admin Send Update Notification API
 * Sends notification email to sponsor about a published update (REQUIRES ADMIN AUTH)
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  createSuccessResponse,
  withErrorHandling,
  ValidationError,
} from '@/lib/errors';
import { requireAdminAuth } from '@/lib/auth';
import { parseRequestBody } from '@/lib/validation';
import { sendUpdateNotificationTool } from '@/lib/tools';
import { getUpdateById, findSponsorshipBySponsorCode } from '@/lib/database';

async function handler(request: NextRequest): Promise<NextResponse> {
  const method = 'POST';
  const path = '/api/admin/updates/notify';

  logger.apiRequest(method, path);

  // CRITICAL: Require admin authentication
  requireAdminAuth(request);

  // Parse request body
  const bodyResult = await parseRequestBody(request);
  if (!bodyResult.success) {
    throw new ValidationError(bodyResult.error!);
  }

  const { updateId } = bodyResult.data as { updateId: string };

  if (!updateId) {
    throw new ValidationError('updateId is required');
  }

  // Get the update
  const update = await getUpdateById(updateId);
  if (!update) {
    throw new ValidationError(`Update not found: ${updateId}`);
  }

  // Verify it's published
  if (update.fields.Status !== 'Published') {
    throw new ValidationError(`Update is not published (status: ${update.fields.Status})`);
  }

  // Get sponsor info
  if (!update.fields.SponsorCode) {
    throw new ValidationError('Update has no sponsor code - cannot send notification');
  }

  const sponsorship = await findSponsorshipBySponsorCode(update.fields.SponsorCode);
  if (!sponsorship) {
    throw new ValidationError(`Sponsorship not found for code: ${update.fields.SponsorCode}`);
  }

  if (!sponsorship.fields.SponsorEmail) {
    throw new ValidationError('Sponsor has no email address');
  }

  // Send notification
  const result = await sendUpdateNotificationTool({
    sponsorEmail: sponsorship.fields.SponsorEmail,
    sponsorName: sponsorship.fields.SponsorName || 'Valued Sponsor',
    childName: sponsorship.fields.ChildDisplayName,
    updateTitle: update.fields.Title,
    updatePreview: update.fields.Content,
  });

  if (!result.success) {
    throw new ValidationError(result.error!);
  }

  logger.info('Sponsor notification sent by admin', {
    updateId,
    sponsorEmail: logger.maskEmail(sponsorship.fields.SponsorEmail),
    childName: sponsorship.fields.ChildDisplayName,
    provider: result.data?.provider,
  });

  logger.apiResponse(method, path, 200);

  return createSuccessResponse({
    updateId,
    notificationSent: true,
    provider: result.data?.provider,
    recipientEmail: result.data?.recipientEmail,
  }, 'Notification sent successfully');
}

export const POST = withErrorHandling(handler, 'POST', '/api/admin/updates/notify');
