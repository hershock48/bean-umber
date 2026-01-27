/**
 * Input validation and sanitization utilities
 * Provides type-safe validation for all user inputs
 */

import { ERROR_MESSAGES, VALIDATION, SPONSOR_CODE_PATTERN } from './constants';

// ============================================================================
// VALIDATION RESULT TYPE
// ============================================================================

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export function success<T>(data: T): ValidationResult<T> {
  return { success: true, data };
}

export function failure<T = never>(error: string): ValidationResult<T> {
  return { success: false, error };
}

// ============================================================================
// STRING VALIDATION & SANITIZATION
// ============================================================================

/**
 * Sanitize string input (trim and remove null bytes)
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  return input.trim().replace(/\0/g, '');
}

/**
 * Escape string for safe use in Airtable formulas
 * Prevents formula injection attacks
 */
export function escapeForAirtable(input: string): string {
  // Airtable formulas use double quotes for strings
  // Escape quotes, backslashes, and control characters
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Sanitize email for safe use in queries
 * Only allows valid email characters to prevent injection
 */
export function sanitizeEmail(input: unknown): string {
  const sanitized = sanitizeString(input);
  
  // Only allow characters valid in email addresses
  // This prevents injection in Airtable formulas and SQL-like contexts
  return sanitized
    .toLowerCase()
    .replace(/[^a-z0-9._%+\-@]/g, '')
    .slice(0, 254); // Max email length per RFC
}

/**
 * Sanitize sponsor code - only allows expected format characters
 */
export function sanitizeSponsorCode(input: unknown): string {
  const sanitized = sanitizeString(input);
  
  // Only allow alphanumeric and hyphens
  return sanitized
    .toUpperCase()
    .replace(/[^A-Z0-9\-]/g, '')
    .slice(0, 12); // Max length: BAN-YYYY-XXX = 12 chars
}

/**
 * Validate required string field
 */
export function validateRequiredString(
  value: unknown,
  fieldName: string,
  minLength = 1,
  maxLength = 1000
): ValidationResult<string> {
  const sanitized = sanitizeString(value);

  if (!sanitized) {
    return failure(ERROR_MESSAGES.MISSING_REQUIRED_FIELD(fieldName));
  }

  if (sanitized.length < minLength) {
    return failure(`${fieldName} must be at least ${minLength} characters long.`);
  }

  if (sanitized.length > maxLength) {
    return failure(`${fieldName} must be no more than ${maxLength} characters long.`);
  }

  return success(sanitized);
}

/**
 * Validate optional string field
 */
export function validateOptionalString(
  value: unknown,
  maxLength = 1000
): ValidationResult<string | undefined> {
  if (value === undefined || value === null || value === '') {
    return success(undefined);
  }

  const sanitized = sanitizeString(value);

  if (sanitized.length > maxLength) {
    return failure(`Value must be no more than ${maxLength} characters long.`);
  }

  return success(sanitized);
}

// ============================================================================
// EMAIL VALIDATION
// ============================================================================

/**
 * Validate email address
 */
export function validateEmail(email: unknown): ValidationResult<string> {
  const sanitized = sanitizeString(email).toLowerCase();

  if (!sanitized) {
    return failure(ERROR_MESSAGES.MISSING_REQUIRED_FIELD('Email'));
  }

  if (!VALIDATION.EMAIL_REGEX.test(sanitized)) {
    return failure(ERROR_MESSAGES.INVALID_EMAIL);
  }

  // Additional checks
  if (sanitized.length > 254) {
    return failure('Email address is too long.');
  }

  return success(sanitized);
}

// ============================================================================
// SPONSOR CODE VALIDATION
// ============================================================================

/**
 * Validate sponsor code format (BAN-YYYY-XXX)
 */
export function validateSponsorCode(code: unknown): ValidationResult<string> {
  const sanitized = sanitizeString(code).toUpperCase();

  if (!sanitized) {
    return failure(ERROR_MESSAGES.MISSING_REQUIRED_FIELD('Sponsor code'));
  }

  if (!SPONSOR_CODE_PATTERN.test(sanitized)) {
    return failure(ERROR_MESSAGES.INVALID_SPONSOR_CODE);
  }

  return success(sanitized);
}

// ============================================================================
// NUMBER VALIDATION
// ============================================================================

/**
 * Validate number input
 */
export function validateNumber(
  value: unknown,
  fieldName: string,
  min?: number,
  max?: number
): ValidationResult<number> {
  const num = typeof value === 'string' ? parseFloat(value) : Number(value);

  if (isNaN(num) || !isFinite(num)) {
    return failure(`${fieldName} must be a valid number.`);
  }

  if (min !== undefined && num < min) {
    return failure(`${fieldName} must be at least ${min}.`);
  }

  if (max !== undefined && num > max) {
    return failure(`${fieldName} must be no more than ${max}.`);
  }

  return success(num);
}

/**
 * Validate donation amount
 */
export function validateDonationAmount(amount: unknown): ValidationResult<number> {
  const result = validateNumber(
    amount,
    'Donation amount',
    VALIDATION.DONATION.MIN_AMOUNT,
    VALIDATION.DONATION.MAX_AMOUNT
  );

  if (!result.success) {
    return failure(ERROR_MESSAGES.INVALID_DONATION_AMOUNT);
  }

  // Ensure it's a positive integer (cents)
  const cents = Math.round(result.data! * 100);

  if (cents < VALIDATION.DONATION.MIN_AMOUNT * 100) {
    return failure(ERROR_MESSAGES.INVALID_DONATION_AMOUNT);
  }

  return success(cents);
}

// ============================================================================
// BOOLEAN VALIDATION
// ============================================================================

/**
 * Validate boolean input
 */
export function validateBoolean(value: unknown): ValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return success(value);
  }

  if (value === 'true' || value === '1' || value === 1) {
    return success(true);
  }

  if (value === 'false' || value === '0' || value === 0) {
    return success(false);
  }

  return failure('Value must be true or false.');
}

// ============================================================================
// ENUM VALIDATION
// ============================================================================

/**
 * Validate value is in allowed list
 */
export function validateEnum<T extends string>(
  value: unknown,
  allowedValues: readonly T[],
  fieldName: string
): ValidationResult<T> {
  const sanitized = sanitizeString(value);

  if (!sanitized) {
    return failure(ERROR_MESSAGES.MISSING_REQUIRED_FIELD(fieldName));
  }

  if (!allowedValues.includes(sanitized as T)) {
    return failure(
      `${fieldName} must be one of: ${allowedValues.join(', ')}.`
    );
  }

  return success(sanitized as T);
}

// ============================================================================
// UPDATE VALIDATION
// ============================================================================

/**
 * Validate update title
 */
export function validateUpdateTitle(title: unknown): ValidationResult<string> {
  return validateRequiredString(
    title,
    'Title',
    VALIDATION.UPDATE.TITLE_MIN_LENGTH,
    VALIDATION.UPDATE.TITLE_MAX_LENGTH
  );
}

/**
 * Validate update content
 */
export function validateUpdateContent(content: unknown): ValidationResult<string> {
  return validateRequiredString(
    content,
    'Content',
    VALIDATION.UPDATE.CONTENT_MIN_LENGTH,
    VALIDATION.UPDATE.CONTENT_MAX_LENGTH
  );
}

// ============================================================================
// COMPOSITE VALIDATION
// ============================================================================

/**
 * Validate login credentials
 */
export interface LoginCredentials {
  email: string;
  code: string;
}

export function validateLoginCredentials(data: unknown): ValidationResult<LoginCredentials> {
  if (!data || typeof data !== 'object') {
    return failure('Invalid request data.');
  }

  const obj = data as Record<string, unknown>;

  const emailResult = validateEmail(obj.email);
  if (!emailResult.success) {
    return failure(emailResult.error!);
  }

  const codeResult = validateSponsorCode(obj.code);
  if (!codeResult.success) {
    return failure(codeResult.error!);
  }

  return success({
    email: emailResult.data!,
    code: codeResult.data!,
  });
}

/**
 * Validate donation request
 */
export interface DonationRequest {
  amount: number; // in cents
  recurring: boolean;
  email?: string;
}

export function validateDonationRequest(data: unknown): ValidationResult<DonationRequest> {
  if (!data || typeof data !== 'object') {
    return failure('Invalid request data.');
  }

  const obj = data as Record<string, unknown>;

  const amountResult = validateDonationAmount(obj.amount);
  if (!amountResult.success) {
    return failure(amountResult.error!);
  }

  const recurringResult = validateBoolean(obj.recurring);
  if (!recurringResult.success) {
    return failure('Recurring field must be true or false.');
  }

  let email: string | undefined;
  if (obj.email) {
    const emailResult = validateEmail(obj.email);
    if (!emailResult.success) {
      return failure(emailResult.error!);
    }
    email = emailResult.data;
  }

  return success({
    amount: amountResult.data!,
    recurring: recurringResult.data!,
    email,
  });
}

/**
 * Validate update submission
 */
export interface UpdateSubmission {
  childId: string;
  sponsorCode?: string;
  updateType: string;
  title: string;
  content: string;
  submittedBy: string;
}

export function validateUpdateSubmission(data: unknown): ValidationResult<UpdateSubmission> {
  if (!data || typeof data !== 'object') {
    return failure('Invalid request data.');
  }

  const obj = data as Record<string, unknown>;

  const childIdResult = validateRequiredString(obj.childId, 'Child ID', 1, 100);
  if (!childIdResult.success) {
    return failure(childIdResult.error!);
  }

  const titleResult = validateUpdateTitle(obj.title);
  if (!titleResult.success) {
    return failure(titleResult.error!);
  }

  const contentResult = validateUpdateContent(obj.content);
  if (!contentResult.success) {
    return failure(contentResult.error!);
  }

  const updateTypeResult = validateRequiredString(obj.updateType, 'Update type', 1, 100);
  if (!updateTypeResult.success) {
    return failure(updateTypeResult.error!);
  }

  const submittedByResult = validateRequiredString(obj.submittedBy, 'Submitted by', 1, 100);
  if (!submittedByResult.success) {
    return failure(submittedByResult.error!);
  }

  const sponsorCodeResult = validateOptionalString(obj.sponsorCode, 50);
  if (!sponsorCodeResult.success) {
    return failure(sponsorCodeResult.error!);
  }

  return success({
    childId: childIdResult.data!,
    sponsorCode: sponsorCodeResult.data,
    updateType: updateTypeResult.data!,
    title: titleResult.data!,
    content: contentResult.data!,
    submittedBy: submittedByResult.data!,
  });
}

// ============================================================================
// REQUEST BODY PARSING
// ============================================================================

/**
 * Safely parse JSON request body
 */
export async function parseRequestBody<T = unknown>(request: Request): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    return success(body as T);
  } catch (error) {
    return failure('Invalid JSON in request body.');
  }
}
