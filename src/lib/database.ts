/**
 * Database abstraction layer (Supabase)
 * Replaces Airtable with same function signatures for backward compatibility
 */

import { getSupabaseClient } from './supabase';
import { logger, startTimer } from './logger';
import { DatabaseError } from './errors';
import { AUTH_STATUS, UPDATE_STATUS, SPONSORSHIP_STATUS, CACHE } from './constants';
import type {
  AirtableSponsorshipRecord,
  AirtableUpdateRecord,
  SponsorshipFields,
  ChildProfile,
  SponsorUpdate,
} from './types/airtable';

// ============================================================================
// TYPE CONVERSIONS (Supabase row → Airtable-compatible record)
// ============================================================================

interface SupabaseSponsorshipRow {
  id: string;
  sponsor_code: string;
  sponsor_email: string;
  sponsor_name: string | null;
  child_id: string;
  child_display_name: string;
  child_photo: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
  }> | null;
  child_age: string | null;
  child_location: string | null;
  sponsorship_start_date: string | null;
  auth_status: 'Active' | 'Inactive' | 'Suspended';
  status: 'Active' | 'Paused' | 'Ended' | 'Awaiting Sponsor' | null;
  visible_to_sponsor: boolean;
  last_request_at: string | null;
  next_request_eligible_at: string | null;
  created_at: string;
}

interface SupabaseUpdateRow {
  id: string;
  child_id: string;
  sponsor_code: string | null;
  update_type: 'Progress Report' | 'Photo Update' | 'Special Note' | 'Holiday Greeting' | 'Milestone';
  title: string;
  content: string;
  photos: Array<{
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    width?: number;
    height?: number;
  }> | null;
  status: 'Pending Review' | 'Published' | 'Rejected';
  visible_to_sponsor: boolean;
  requested_by_sponsor: boolean | null;
  requested_at: string | null;
  published_at: string | null;
  submitted_by: string | null;
  submitted_at: string | null;
  created_at: string;
}

function toAirtableSponsorshipRecord(row: SupabaseSponsorshipRow): AirtableSponsorshipRecord {
  return {
    id: row.id,
    fields: {
      SponsorCode: row.sponsor_code,
      SponsorEmail: row.sponsor_email,
      SponsorName: row.sponsor_name || undefined,
      ChildID: row.child_id,
      ChildDisplayName: row.child_display_name,
      ChildPhoto: row.child_photo || undefined,
      ChildAge: row.child_age || undefined,
      ChildLocation: row.child_location || undefined,
      SponsorshipStartDate: row.sponsorship_start_date || undefined,
      AuthStatus: row.auth_status,
      Status: row.status || undefined,
      VisibleToSponsor: row.visible_to_sponsor,
      LastRequestAt: row.last_request_at || undefined,
      NextRequestEligibleAt: row.next_request_eligible_at || undefined,
    },
    createdTime: row.created_at,
  };
}

function toAirtableUpdateRecord(row: SupabaseUpdateRow): AirtableUpdateRecord {
  return {
    id: row.id,
    fields: {
      ChildID: row.child_id,
      SponsorCode: row.sponsor_code || undefined,
      UpdateType: row.update_type,
      Title: row.title,
      Content: row.content,
      Photos: row.photos || undefined,
      Status: row.status,
      VisibleToSponsor: row.visible_to_sponsor,
      RequestedBySponsor: row.requested_by_sponsor || undefined,
      RequestedAt: row.requested_at || undefined,
      PublishedAt: row.published_at || undefined,
      SubmittedBy: row.submitted_by || undefined,
      SubmittedAt: row.submitted_at || undefined,
    },
    createdTime: row.created_at,
  };
}

// ============================================================================
// SPONSORSHIPS QUERIES
// ============================================================================

/**
 * Find sponsorship by email and code
 */
export async function findSponsorshipByCredentials(
  email: string,
  code: string
): Promise<AirtableSponsorshipRecord | null> {
  logger.dbQuery('sponsorships', 'findByCredentials', {
    email: logger.maskEmail(email),
    code: logger.maskSponsorCode(code),
  });

  const timer = startTimer('findSponsorshipByCredentials');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('sponsor_email', email)
      .eq('sponsor_code', code)
      .eq('auth_status', AUTH_STATUS.ACTIVE)
      .eq('visible_to_sponsor', true)
      .limit(1)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      logger.dbError('sponsorships', 'findByCredentials', error);
      throw new DatabaseError('Failed to find sponsorship');
    }

    return data ? toAirtableSponsorshipRecord(data as SupabaseSponsorshipRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'findByCredentials', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Find sponsorship by code (for session validation)
 */
export async function findSponsorshipByCode(
  code: string
): Promise<AirtableSponsorshipRecord | null> {
  logger.dbQuery('sponsorships', 'findByCode', {
    code: logger.maskSponsorCode(code),
  });

  const timer = startTimer('findSponsorshipByCode');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('sponsor_code', code)
      .eq('auth_status', AUTH_STATUS.ACTIVE)
      .eq('visible_to_sponsor', true)
      .limit(1)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      logger.dbError('sponsorships', 'findByCode', error);
      throw new DatabaseError('Failed to find sponsorship');
    }

    return data ? toAirtableSponsorshipRecord(data as SupabaseSponsorshipRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'findByCode', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Update sponsorship request tracking fields
 */
export async function updateSponsorshipRequestTracking(
  recordId: string,
  lastRequestAt: string,
  nextEligibleAt: string
): Promise<void> {
  logger.dbQuery('sponsorships', 'updateRequestTracking', { recordId });

  const timer = startTimer('updateSponsorshipRequestTracking');

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('sponsorships')
      .update({
        last_request_at: lastRequestAt,
        next_request_eligible_at: nextEligibleAt,
      })
      .eq('id', recordId);

    timer.end();

    if (error) {
      logger.dbError('sponsorships', 'updateRequestTracking', error);
      throw new DatabaseError('Failed to update sponsorship');
    }
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'updateRequestTracking', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Transform sponsorship record to child profile
 */
export function sponsorshipToChildProfile(
  record: AirtableSponsorshipRecord
): ChildProfile {
  const fields = record.fields;

  return {
    id: fields.ChildID,
    displayName: fields.ChildDisplayName,
    age: fields.ChildAge,
    location: fields.ChildLocation,
    photo: fields.ChildPhoto?.[0]
      ? {
          url: fields.ChildPhoto[0].url,
          filename: fields.ChildPhoto[0].filename,
        }
      : undefined,
    sponsorshipStartDate: fields.SponsorshipStartDate,
  };
}

// ============================================================================
// UPDATES QUERIES
// ============================================================================

/**
 * Find updates for a child
 */
export async function findUpdatesForChild(
  childId: string
): Promise<AirtableUpdateRecord[]> {
  logger.dbQuery('updates', 'findForChild', { childId });

  const timer = startTimer('findUpdatesForChild');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('child_id', childId)
      .eq('status', UPDATE_STATUS.PUBLISHED)
      .eq('visible_to_sponsor', true)
      .order('published_at', { ascending: false });

    timer.end();

    if (error) {
      logger.dbError('updates', 'findForChild', error);
      throw new DatabaseError('Failed to find updates');
    }

    return (data || []).map((row) => toAirtableUpdateRecord(row as SupabaseUpdateRow));
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'findForChild', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Create update request
 */
export async function createUpdateRequest(
  childId: string,
  sponsorCode: string
): Promise<AirtableUpdateRecord> {
  logger.dbQuery('updates', 'createRequest', {
    childId,
    sponsorCode: logger.maskSponsorCode(sponsorCode),
  });

  const timer = startTimer('createUpdateRequest');
  const now = new Date().toISOString();

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .insert({
        child_id: childId,
        sponsor_code: sponsorCode,
        status: UPDATE_STATUS.PENDING_REVIEW,
        requested_by_sponsor: true,
        requested_at: now,
        visible_to_sponsor: false,
        title: 'Update Requested',
        content: 'Sponsor requested a new update.',
        update_type: 'Progress Report',
      })
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('updates', 'createRequest', error);
      throw new DatabaseError('Failed to create update request');
    }

    return toAirtableUpdateRecord(data as SupabaseUpdateRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'createRequest', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Submit update from field team
 */
export async function submitUpdate(data: {
  childId: string;
  sponsorCode?: string;
  updateType: string;
  title: string;
  content: string;
  submittedBy: string;
}): Promise<AirtableUpdateRecord> {
  logger.dbQuery('updates', 'submit', {
    childId: data.childId,
    updateType: data.updateType,
    submittedBy: data.submittedBy,
  });

  const timer = startTimer('submitUpdate');
  const now = new Date().toISOString();

  try {
    const supabase = getSupabaseClient();
    const insertData: Record<string, unknown> = {
      child_id: data.childId,
      update_type: data.updateType,
      title: data.title,
      content: data.content,
      submitted_by: data.submittedBy,
      submitted_at: now,
      status: UPDATE_STATUS.PENDING_REVIEW,
      visible_to_sponsor: false,
    };

    if (data.sponsorCode) {
      insertData.sponsor_code = data.sponsorCode;
    }

    const { data: result, error } = await supabase
      .from('updates')
      .insert(insertData)
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('updates', 'submit', error);
      throw new DatabaseError('Failed to submit update');
    }

    return toAirtableUpdateRecord(result as SupabaseUpdateRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'submit', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Transform update record to sponsor update
 */
export function updateRecordToSponsorUpdate(
  record: AirtableUpdateRecord
): SponsorUpdate {
  const fields = record.fields;

  return {
    id: record.id,
    type: fields.UpdateType,
    title: fields.Title,
    content: fields.Content,
    photos: fields.Photos?.map((photo) => ({
      url: photo.url,
      filename: photo.filename,
    })),
    publishedAt: fields.PublishedAt,
    submittedBy: fields.SubmittedBy,
  };
}

// ============================================================================
// CACHING WRAPPER
// ============================================================================

/**
 * Cache wrapper for Next.js fetch with revalidation
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  revalidate: number = CACHE.REVALIDATE.SPONSORSHIP_DATA
): Promise<T> {
  // For now, just call the fetcher directly
  // In the future, we can add Redis or similar caching layer
  return fetcher();
}

/**
 * Get sponsorship with caching
 */
export async function getCachedSponsorshipByCode(
  code: string
): Promise<AirtableSponsorshipRecord | null> {
  return withCache(
    `sponsorship:${code}`,
    () => findSponsorshipByCode(code),
    CACHE.REVALIDATE.SPONSORSHIP_DATA
  );
}

/**
 * Get updates for child with caching
 */
export async function getCachedUpdatesForChild(
  childId: string
): Promise<AirtableUpdateRecord[]> {
  return withCache(
    `updates:${childId}`,
    () => findUpdatesForChild(childId),
    CACHE.REVALIDATE.UPDATES_LIST
  );
}

// ============================================================================
// ADMIN UPDATES QUERIES
// ============================================================================

/**
 * Find all pending updates (for admin review)
 */
export async function findPendingUpdates(): Promise<AirtableUpdateRecord[]> {
  logger.dbQuery('updates', 'findPending', {});

  const timer = startTimer('findPendingUpdates');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('status', UPDATE_STATUS.PENDING_REVIEW)
      .order('submitted_at', { ascending: false });

    timer.end();

    if (error) {
      logger.dbError('updates', 'findPending', error);
      throw new DatabaseError('Failed to find pending updates');
    }

    return (data || []).map((row) => toAirtableUpdateRecord(row as SupabaseUpdateRow));
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'findPending', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Get a single update by ID
 */
export async function getUpdateById(
  updateId: string
): Promise<AirtableUpdateRecord | null> {
  logger.dbQuery('updates', 'getById', { updateId });

  const timer = startTimer('getUpdateById');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('id', updateId)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      logger.dbError('updates', 'getById', error);
      throw new DatabaseError('Failed to get update');
    }

    return data ? toAirtableUpdateRecord(data as SupabaseUpdateRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'getById', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Publish an update (set status to Published, make visible to sponsor)
 */
export async function publishUpdate(
  updateId: string
): Promise<AirtableUpdateRecord> {
  logger.dbQuery('updates', 'publish', { updateId });

  const timer = startTimer('publishUpdate');
  const now = new Date().toISOString();

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .update({
        status: UPDATE_STATUS.PUBLISHED,
        visible_to_sponsor: true,
        published_at: now,
      })
      .eq('id', updateId)
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('updates', 'publish', error);
      throw new DatabaseError('Failed to publish update');
    }

    return toAirtableUpdateRecord(data as SupabaseUpdateRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'publish', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Reject an update
 */
export async function rejectUpdate(
  updateId: string
): Promise<AirtableUpdateRecord> {
  logger.dbQuery('updates', 'reject', { updateId });

  const timer = startTimer('rejectUpdate');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .update({
        status: UPDATE_STATUS.REJECTED,
        visible_to_sponsor: false,
      })
      .eq('id', updateId)
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('updates', 'reject', error);
      throw new DatabaseError('Failed to reject update');
    }

    return toAirtableUpdateRecord(data as SupabaseUpdateRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'reject', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Find sponsorship by sponsor code (for notifications)
 */
export async function findSponsorshipBySponsorCode(
  sponsorCode: string
): Promise<AirtableSponsorshipRecord | null> {
  logger.dbQuery('sponsorships', 'findBySponsorCode', {
    sponsorCode: logger.maskSponsorCode(sponsorCode),
  });

  const timer = startTimer('findSponsorshipBySponsorCode');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('sponsor_code', sponsorCode)
      .limit(1)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      logger.dbError('sponsorships', 'findBySponsorCode', error);
      throw new DatabaseError('Failed to find sponsorship');
    }

    return data ? toAirtableSponsorshipRecord(data as SupabaseSponsorshipRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'findBySponsorCode', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Find all active sponsorships
 */
export async function findAllActiveSponsorships(): Promise<AirtableSponsorshipRecord[]> {
  logger.dbQuery('sponsorships', 'findAllActive', {});

  const timer = startTimer('findAllActiveSponsorships');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('auth_status', AUTH_STATUS.ACTIVE)
      .eq('visible_to_sponsor', true)
      .order('sponsor_code', { ascending: true });

    timer.end();

    if (error) {
      logger.dbError('sponsorships', 'findAllActive', error);
      throw new DatabaseError('Failed to find active sponsorships');
    }

    return (data || []).map((row) => toAirtableSponsorshipRecord(row as SupabaseSponsorshipRow));
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'findAllActive', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Find the most recent published update for a child
 */
export async function findMostRecentUpdateForChild(
  childId: string
): Promise<AirtableUpdateRecord | null> {
  logger.dbQuery('updates', 'findMostRecentForChild', { childId });

  const timer = startTimer('findMostRecentUpdateForChild');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('child_id', childId)
      .eq('status', UPDATE_STATUS.PUBLISHED)
      .order('published_at', { ascending: false })
      .limit(1)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      logger.dbError('updates', 'findMostRecentForChild', error);
      throw new DatabaseError('Failed to find update');
    }

    return data ? toAirtableUpdateRecord(data as SupabaseUpdateRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'findMostRecentForChild', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Find all published updates (for overdue calculation)
 */
export async function findAllPublishedUpdates(): Promise<AirtableUpdateRecord[]> {
  logger.dbQuery('updates', 'findAllPublished', {});

  const timer = startTimer('findAllPublishedUpdates');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('updates')
      .select('*')
      .eq('status', UPDATE_STATUS.PUBLISHED)
      .order('published_at', { ascending: false });

    timer.end();

    if (error) {
      logger.dbError('updates', 'findAllPublished', error);
      throw new DatabaseError('Failed to find published updates');
    }

    return (data || []).map((row) => toAirtableUpdateRecord(row as SupabaseUpdateRow));
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('updates', 'findAllPublished', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

// ============================================================================
// SPONSORSHIP CATALOG QUERIES
// ============================================================================

/**
 * Find all children awaiting sponsors
 */
export async function findAvailableChildren(): Promise<AirtableSponsorshipRecord[]> {
  logger.dbQuery('sponsorships', 'findAvailable', {});

  const timer = startTimer('findAvailableChildren');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('status', SPONSORSHIP_STATUS.AWAITING_SPONSOR)
      .order('child_display_name', { ascending: true });

    timer.end();

    if (error) {
      logger.dbError('sponsorships', 'findAvailable', error);
      throw new DatabaseError('Failed to find available children');
    }

    return (data || []).map((row) => toAirtableSponsorshipRecord(row as SupabaseSponsorshipRow));
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'findAvailable', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Create a new sponsorship record
 */
export async function createSponsorship(data: {
  sponsorEmail: string;
  sponsorName?: string;
  childId: string;
  childDisplayName: string;
  childPhoto?: SponsorshipFields['ChildPhoto'];
  childAge?: string;
  childLocation?: string;
}): Promise<AirtableSponsorshipRecord> {
  logger.dbQuery('sponsorships', 'create', {
    email: logger.maskEmail(data.sponsorEmail),
    childId: data.childId,
  });

  const timer = startTimer('createSponsorship');

  // Generate sponsor code: BAN-YYYY-XXX
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
  const sponsorCode = `BAN-${year}-${randomNum}`;

  try {
    const supabase = getSupabaseClient();
    const insertData: Record<string, unknown> = {
      sponsor_code: sponsorCode,
      sponsor_email: data.sponsorEmail,
      child_id: data.childId,
      child_display_name: data.childDisplayName,
      auth_status: AUTH_STATUS.ACTIVE,
      status: SPONSORSHIP_STATUS.ACTIVE,
      visible_to_sponsor: true,
      sponsorship_start_date: new Date().toISOString().split('T')[0],
    };

    if (data.sponsorName) {
      insertData.sponsor_name = data.sponsorName;
    }
    if (data.childAge) {
      insertData.child_age = data.childAge;
    }
    if (data.childLocation) {
      insertData.child_location = data.childLocation;
    }
    if (data.childPhoto) {
      insertData.child_photo = data.childPhoto;
    }

    const { data: result, error } = await supabase
      .from('sponsorships')
      .insert(insertData)
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('sponsorships', 'create', error);
      throw new DatabaseError('Failed to create sponsorship');
    }

    return toAirtableSponsorshipRecord(result as SupabaseSponsorshipRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'create', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Update a sponsorship record (for assigning sponsor to awaiting child)
 */
export async function assignSponsorToChild(
  recordId: string,
  sponsorData: {
    sponsorEmail: string;
    sponsorName?: string;
    sponsorCode: string;
  }
): Promise<AirtableSponsorshipRecord> {
  logger.dbQuery('sponsorships', 'assignSponsor', {
    recordId,
    email: logger.maskEmail(sponsorData.sponsorEmail),
  });

  const timer = startTimer('assignSponsorToChild');

  try {
    const supabase = getSupabaseClient();
    const updateData: Record<string, unknown> = {
      sponsor_code: sponsorData.sponsorCode,
      sponsor_email: sponsorData.sponsorEmail,
      auth_status: AUTH_STATUS.ACTIVE,
      status: SPONSORSHIP_STATUS.ACTIVE,
      visible_to_sponsor: true,
      sponsorship_start_date: new Date().toISOString().split('T')[0],
    };

    if (sponsorData.sponsorName) {
      updateData.sponsor_name = sponsorData.sponsorName;
    }

    const { data, error } = await supabase
      .from('sponsorships')
      .update(updateData)
      .eq('id', recordId)
      .select()
      .single();

    timer.end();

    if (error) {
      logger.dbError('sponsorships', 'assignSponsor', error);
      throw new DatabaseError('Failed to assign sponsor');
    }

    return toAirtableSponsorshipRecord(data as SupabaseSponsorshipRow);
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'assignSponsor', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

/**
 * Get sponsorship by record ID
 */
export async function getSponsorshipById(
  recordId: string
): Promise<AirtableSponsorshipRecord | null> {
  logger.dbQuery('sponsorships', 'getById', { recordId });

  const timer = startTimer('getSponsorshipById');

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('sponsorships')
      .select('*')
      .eq('id', recordId)
      .single();

    timer.end();

    if (error && error.code !== 'PGRST116') {
      logger.dbError('sponsorships', 'getById', error);
      throw new DatabaseError('Failed to get sponsorship');
    }

    return data ? toAirtableSponsorshipRecord(data as SupabaseSponsorshipRow) : null;
  } catch (error) {
    timer.end();
    if (error instanceof DatabaseError) throw error;
    logger.dbError('sponsorships', 'getById', error);
    throw new DatabaseError('Failed to connect to database');
  }
}

// ============================================================================
// SUPABASE CLIENT EXPORT (for advanced usage)
// ============================================================================

/**
 * Map table names to Supabase table names
 */
const TABLE_MAP: Record<string, string> = {
  sponsorships: 'sponsorships',
  updates: 'updates',
  children: 'children',
  child_updates: 'child_updates',
};

/**
 * Map Airtable field names to Supabase column names
 */
const FIELD_MAP: Record<string, string> = {
  Status: 'status',
  VisibleToSponsor: 'visible_to_sponsor',
  PublishedAt: 'published_at',
  // Add more as needed
};

/**
 * Convert Airtable-style fields to Supabase columns
 */
function mapFieldsToColumns(fields: Record<string, unknown>): Record<string, unknown> {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    const columnName = FIELD_MAP[key] || key.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
    mapped[columnName] = value;
  }
  return mapped;
}

/**
 * Export a database client interface for advanced usage
 * Provides direct Supabase access when needed
 */
export const databaseClient = {
  getClient: getSupabaseClient,
  
  /**
   * Update a record in a table (backward compatible with Airtable API)
   */
  async updateRecord<T>(
    tableName: string,
    recordId: string,
    fields: Record<string, unknown>
  ): Promise<T> {
    const timer = startTimer(`updateRecord:${tableName}`);
    const supabase = getSupabaseClient();
    const supabaseTable = TABLE_MAP[tableName] || tableName;
    const mappedFields = mapFieldsToColumns(fields);

    try {
      const { data, error } = await supabase
        .from(supabaseTable)
        .update(mappedFields)
        .eq('id', recordId)
        .select()
        .single();

      timer.end();

      if (error) {
        logger.dbError(tableName, 'updateRecord', error);
        throw new DatabaseError(`Failed to update record in ${tableName}`);
      }

      return data as T;
    } catch (error) {
      timer.end();
      if (error instanceof DatabaseError) throw error;
      logger.dbError(tableName, 'updateRecord', error);
      throw new DatabaseError('Failed to connect to database');
    }
  },
};

// Backward compatible alias
export { databaseClient as airtableClient };
