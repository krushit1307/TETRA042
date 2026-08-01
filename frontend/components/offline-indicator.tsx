'use client'

import { useEffect, useState } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/language-context'

export function OfflineIndicator() {
  const { t } = useLanguage()
  const [isOffline, setIsOffline] = useState(false)
  const [showReconnected, setShowReconnected] = useState(false)

  useEffect(() => {
    // Check initial status
    setIsOffline(!navigator.onLine)

    const handleOnline = () => {
      setIsOffline(false)
      setShowReconnected(true)
      setTimeout(() => setShowReconnected(false), 3000)
    }

    const handleOffline = () => {
      setIsOffline(true)
      setShowReconnected(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <WifiOff className="h-5 w-5 animate-pulse" />
              <div>
                <p className="font-semibold">{t("offline.noConnection")}</p>
                <p className="text-xs text-red-100">{t("offline.checkNetwork")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReconnected && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <Wifi className="h-5 w-5" />
              <div>
                <p className="font-semibold">{t("offline.backOnline")}</p>
                <p className="text-xs text-green-100">{t("offline.connectionRestored")}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
