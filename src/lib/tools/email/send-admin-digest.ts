/**
 * Send Admin Digest Tool
 *
 * WAT-compliant tool for sending daily admin digest email.
 * Summarizes pending updates, overdue children, and recent activity.
 *
 * Usage in workflows:
 * - Can be called manually or via scheduled cron job
 * - Gathers data from multiple sources
 * - Sends formatted HTML email to admin
 */

import { logger } from '../../logger';
import { ValidationResult, success, failure, validateEmail } from '../../validation';
import { sendEmail, EmailSendResult } from '../../email';
import { findPendingUpdates, findAllActiveSponsorships, findAllPublishedUpdates } from '../../database';
import { listOverdueTool } from '../updates/list-overdue';

// ============================================================================
// INPUT/OUTPUT INTERFACES
// ============================================================================

/**
 * Input schema for send-admin-digest tool
 */
export interface SendAdminDigestInput {
  /** Admin email address to send digest to */
  adminEmail: string;
  /** Include overdue children section (default: true) */
  includeOverdue?: boolean;
  /** Overdue threshold in days (default: 90) */
  overdueThresholdDays?: number;
}

/**
 * Output schema for send-admin-digest tool
 */
export interface SendAdminDigestOutput {
  success: boolean;
  data?: {
    messageId?: string;
    provider: 'gmail' | 'sendgrid' | 'disabled';
    summary: {
      pendingUpdates: number;
      overdueChildren: number;
      totalActiveSponsorships: number;
    };
    generatedAt: string;
  };
  error?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validate tool input
 */
function validateInput(input: unknown): ValidationResult<SendAdminDigestInput> {
  if (!input || typeof input !== 'object') {
    return failure('Invalid input: expected an object');
  }

  const obj = input as Record<string, unknown>;

  // Validate 'adminEmail' field
  const emailResult = validateEmail(obj.adminEmail);
  if (!emailResult.success) {
    return failure(`Invalid admin email: ${emailResult.error}`);
  }

  // Validate optional 'includeOverdue'
  let includeOverdue = true;
  if (obj.includeOverdue !== undefined) {
    if (typeof obj.includeOverdue !== 'boolean') {
      return failure('Invalid includeOverdue: must be a boolean');
    }
    includeOverdue = obj.includeOverdue;
  }

  // Validate optional 'overdueThresholdDays'
  let overdueThresholdDays = 90;
  if (obj.overdueThresholdDays !== undefined) {
    if (typeof obj.overdueThresholdDays !== 'number' || obj.overdueThresholdDays < 1) {
      return failure('Invalid overdueThresholdDays: must be a positive number');
    }
    overdueThresholdDays = obj.overdueThresholdDays;
  }

  return success({
    adminEmail: emailResult.data!,
    includeOverdue,
    overdueThresholdDays,
  });
}

/**
 * Format date for email
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate HTML email content
 */
function generateDigestHtml(data: {
  pendingUpdates: Array<{ title: string; sponsorCode?: string; submittedBy?: string; submittedAt?: string }>;
  overdueChildren: Array<{ childName: string; sponsorCode: string; daysSinceUpdate: number }>;
  totalActive: number;
  generatedAt: string;
}): string {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.beanumber.org'}/admin/dashboard`;

  const pendingSection = data.pendingUpdates.length > 0
    ? `
      <h3 style="color: #1a1a1a; margin-top: 20px;">Pending Updates (${data.pendingUpdates.length})</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Title</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Sponsor Code</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Submitted By</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Date</th>
          </tr>
        </thead>
        <tbody>
          ${data.pendingUpdates.map(u => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${u.title}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${u.sponsorCode || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${u.submittedBy || 'N/A'}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${formatDate(u.submittedAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    : '<p style="color: #059669;">No pending updates to review.</p>';

  const overdueSection = data.overdueChildren.length > 0
    ? `
      <h3 style="color: #1a1a1a; margin-top: 30px;">Overdue Children (${data.overdueChildren.length})</h3>
      <p style="color: #6b7280; font-size: 14px;">Children who haven't received an update in more than 90 days</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr style="background-color: #fef3c7;">
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Child</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Sponsor Code</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #e5e7eb;">Days Overdue</th>
          </tr>
        </thead>
        <tbody>
          ${data.overdueChildren.slice(0, 10).map(c => `
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${c.childName}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; font-family: monospace;">${c.sponsorCode}</td>
              <td style="padding: 8px; border: 1px solid #e5e7eb; ${c.daysSinceUpdate === -1 ? 'color: #dc2626; font-weight: bold;' : ''}">${c.daysSinceUpdate === -1 ? 'Never' : `${c.daysSinceUpdate} days`}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${data.overdueChildren.length > 10 ? `<p style="color: #6b7280; font-size: 14px;">...and ${data.overdueChildren.length - 10} more</p>` : ''}
    `
    : '<h3 style="color: #059669; margin-top: 30px;">All children have recent updates!</h3>';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background-color: #1a1a1a; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          .stat-box { display: inline-block; background: white; padding: 15px 25px; margin: 5px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
          .stat-number { font-size: 28px; font-weight: bold; color: #1a1a1a; }
          .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Admin Daily Digest</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">${formatDate(data.generatedAt)}</p>
          </div>
          <div class="content">
            <div style="text-align: center; margin-bottom: 20px;">
              <div class="stat-box">
                <div class="stat-number">${data.pendingUpdates.length}</div>
                <div class="stat-label">Pending Updates</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${data.overdueChildren.length}</div>
                <div class="stat-label">Overdue Children</div>
              </div>
              <div class="stat-box">
                <div class="stat-number">${data.totalActive}</div>
                <div class="stat-label">Active Sponsorships</div>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="button">Open Admin Dashboard</a>
            </div>

            ${pendingSection}
            ${overdueSection}
          </div>
          <div class="footer">
            <p>Be A Number, International | Admin Digest</p>
            <p>This is an automated email. Manage your notification settings in the admin dashboard.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// ============================================================================
// MAIN TOOL FUNCTION
// ============================================================================

/**
 * Send admin digest email
 *
 * Gathers data about pending updates and overdue children,
 * then sends a formatted summary email to the admin.
 *
 * @param input - The digest configuration
 * @returns Structured result with success/failure and summary
 *
 * @example
 * const result = await sendAdminDigestTool({
 *   adminEmail: 'kevin@beanumber.org'
 * });
 * if (result.success) {
 *   console.log('Digest sent:', result.data?.summary);
 * }
 */
export async function sendAdminDigestTool(input: unknown): Promise<SendAdminDigestOutput> {
  // 1. Validate input
  const validated = validateInput(input);
  if (!validated.success) {
    logger.warn('send-admin-digest-tool validation failed', { error: validated.error });
    return {
      success: false,
      error: validated.error,
    };
  }

  const { adminEmail, includeOverdue, overdueThresholdDays } = validated.data!;

  // 2. Execute action
  try {
    logger.debug('send-admin-digest-tool executing', {
      adminEmail: logger.maskEmail(adminEmail),
      includeOverdue,
      overdueThresholdDays,
    });

    const generatedAt = new Date().toISOString();

    // Get pending updates
    const pendingUpdates = await findPendingUpdates();
    const pendingData = pendingUpdates.map(u => ({
      title: u.fields.Title,
      sponsorCode: u.fields.SponsorCode,
      submittedBy: u.fields.SubmittedBy,
      submittedAt: u.fields.SubmittedAt,
    }));

    // Get overdue children (if requested)
    let overdueChildren: Array<{ childName: string; sponsorCode: string; daysSinceUpdate: number }> = [];
    let totalActive = 0;

    if (includeOverdue !== false) {
      const overdueResult = await listOverdueTool({ thresholdDays: overdueThresholdDays });
      if (overdueResult.success && overdueResult.data) {
        overdueChildren = overdueResult.data.overdueChildren.map(c => ({
          childName: c.childName,
          sponsorCode: c.sponsorCode,
          daysSinceUpdate: c.daysSinceUpdate,
        }));
        totalActive = overdueResult.data.totalActive;
      }
    } else {
      // Just get total count
      const sponsorships = await findAllActiveSponsorships();
      totalActive = sponsorships.length;
    }

    // Generate email HTML
    const html = generateDigestHtml({
      pendingUpdates: pendingData,
      overdueChildren,
      totalActive,
      generatedAt,
    });

    // Send the email
    const result: EmailSendResult = await sendEmail({
      to: { email: adminEmail, name: 'Be A Number Admin' },
      subject: `Admin Digest: ${pendingData.length} pending, ${overdueChildren.length} overdue`,
      html,
    });

    if (!result.success) {
      logger.error('send-admin-digest-tool failed', {
        adminEmail: logger.maskEmail(adminEmail),
        error: result.error,
      });

      return {
        success: false,
        error: result.error,
      };
    }

    // 3. Log success
    logger.info('send-admin-digest-tool completed successfully', {
      adminEmail: logger.maskEmail(adminEmail),
      pendingUpdates: pendingData.length,
      overdueChildren: overdueChildren.length,
      provider: result.data?.provider,
    });

    // 4. Return structured output
    return {
      success: true,
      data: {
        messageId: result.data?.messageId,
        provider: result.data?.provider || 'disabled',
        summary: {
          pendingUpdates: pendingData.length,
          overdueChildren: overdueChildren.length,
          totalActiveSponsorships: totalActive,
        },
        generatedAt,
      },
    };
  } catch (error) {
    // 5. Handle errors gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    logger.error('send-admin-digest-tool unexpected error', error, {
      adminEmail: logger.maskEmail(adminEmail),
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Default export for convenience
export default sendAdminDigestTool;
