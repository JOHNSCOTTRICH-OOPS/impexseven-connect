/**
 * Centralized error handler for user-facing error messages.
 * Masks technical database/system errors to prevent information leakage.
 */

export function getUserFriendlyError(error: any): string {
  // Log full error for debugging (server-side logs only)
  console.error('Operation error:', error);
  
  // Handle null/undefined errors
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.code || '';

  // Map specific PostgreSQL error codes to safe messages
  if (errorCode === '23505') {
    return 'This item already exists.';
  }
  if (errorCode === '23503') {
    return 'Referenced item not found.';
  }
  if (errorCode === '23502') {
    return 'Required information is missing.';
  }
  if (errorCode === '23514') {
    return 'The provided data is invalid.';
  }
  if (errorCode?.startsWith('42')) {
    return 'Invalid operation.';
  }
  if (errorCode === 'PGRST116') {
    return 'The requested item was not found.';
  }

  // Map RLS/permission errors
  if (errorMessage.includes('rls') || 
      errorMessage.includes('policy') || 
      errorMessage.includes('permission') ||
      errorMessage.includes('denied') ||
      errorMessage.includes('unauthorized')) {
    return 'Access denied. Please ensure you are logged in.';
  }

  // Map authentication errors
  if (errorMessage.includes('invalid login') || 
      errorMessage.includes('invalid credentials')) {
    return 'Invalid email or password.';
  }
  if (errorMessage.includes('email already') || 
      errorMessage.includes('user already')) {
    return 'An account with this email already exists.';
  }
  if (errorMessage.includes('password') && errorMessage.includes('weak')) {
    return 'Password is too weak. Please use a stronger password.';
  }
  if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
    return 'Please enter a valid email address.';
  }

  // Map network/connection errors
  if (errorMessage.includes('network') || 
      errorMessage.includes('fetch') ||
      errorMessage.includes('connection')) {
    return 'Connection error. Please check your internet and try again.';
  }

  // Map timeout errors
  if (errorMessage.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Map storage errors
  if (errorMessage.includes('storage') || 
      errorMessage.includes('upload') ||
      errorMessage.includes('file')) {
    return 'File upload failed. Please try again.';
  }

  // Default safe message
  return 'An error occurred. Please try again.';
}

/**
 * Get a user-friendly error for authentication operations
 */
export function getAuthError(error: any): string {
  if (!error) {
    return 'Authentication failed. Please try again.';
  }

  const errorMessage = error.message?.toLowerCase() || '';

  if (errorMessage.includes('invalid login') || 
      errorMessage.includes('invalid credentials')) {
    return 'Invalid email or password.';
  }
  if (errorMessage.includes('email already') || 
      errorMessage.includes('user already registered')) {
    return 'An account with this email already exists.';
  }
  if (errorMessage.includes('password') && errorMessage.includes('weak')) {
    return 'Password is too weak. Please use at least 6 characters.';
  }
  if (errorMessage.includes('email') && errorMessage.includes('invalid')) {
    return 'Please enter a valid email address.';
  }
  if (errorMessage.includes('rate limit')) {
    return 'Too many attempts. Please wait and try again.';
  }

  return 'Authentication failed. Please try again.';
}
