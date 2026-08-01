/**
 * Sanitize user input to prevent XSS and other attacks
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input) return ''
  
  // Trim whitespace
  let sanitized = input.trim()
  
  // Limit length
  sanitized = sanitized.slice(0, maxLength)
  
  // Remove potentially dangerous characters
  // Note: This is basic sanitization. For production, consider using a library like DOMPurify
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  return sanitized
}

/**
 * Validate file upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  } = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  } = options

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / 1024 / 1024}MB`
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Validate audio file
 */
export function validateAudioFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): { valid: boolean; error?: string } {
  const allowedTypes = ['audio/wav', 'audio/webm', 'audio/mp3', 'audio/mpeg', 'audio/ogg']

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Audio file must be less than ${maxSize / 1024 / 1024}MB`
    }
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid audio format. Please use WAV, WebM, MP3, or OGG.'
    }
  }

  return { valid: true }
}
