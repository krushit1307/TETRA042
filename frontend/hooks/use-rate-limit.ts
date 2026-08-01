import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface RateLimitOptions {
  maxRequests?: number
  windowMs?: number
  message?: string
}

export function useRateLimit(options: RateLimitOptions = {}) {
  const {
    maxRequests = 10,
    windowMs = 60000, // 1 minute
    message = 'Too many requests. Please wait a moment.'
  } = options

  const [requests, setRequests] = useState<number[]>([])

  const checkRateLimit = useCallback((): boolean => {
    const now = Date.now()
    const recentRequests = requests.filter(time => now - time < windowMs)

    if (recentRequests.length >= maxRequests) {
      toast.error(message)
      return false
    }

    setRequests([...recentRequests, now])
    return true
  }, [requests, maxRequests, windowMs, message])

  const reset = useCallback(() => {
    setRequests([])
  }, [])

  return { checkRateLimit, reset }
}
