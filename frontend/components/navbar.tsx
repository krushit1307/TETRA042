"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Globe } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SupportedLanguage } from "@/lib/i18n/languages"

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { t, language, setLanguage, languages } = useLanguage()

  const navItems = [
    { id: "home", label: t("nav.home") },
    { id: "assistant", label: t("nav.assistant") },
    { id: "diagnosis", label: t("nav.diagnosis") },
    { id: "market-yard", label: t("nav.marketYard") },
    { id: "calendar", label: t("nav.calendar") },
    { id: "news", label: t("nav.farmerNews") },
    { id: "features", label: t("nav.features") },
    { id: "about", label: t("nav.about") },
    { id: "contact", label: t("nav.contact") },
  ]

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  const handleMobileNavigate = (page: string) => {
    onNavigate(page)
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer z-50"
              onClick={() => {
                onNavigate("home")
                setIsMobileMenuOpen(false)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              <div className="relative w-25 h-16 flex-shrink-0 pointer-events-none">
                <Image
                  src="/Sasya_bg.png"
                  alt="Sasya AI Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col pointer-events-none">
                <span className="font-bold text-xl text-green-600 dark:text-green-400">{t("nav.brandName")}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{t("nav.tagline")}</span>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === item.id
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              ))}

              <div className="relative ml-2">
                <Globe className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-green-600 pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                  aria-label={t("nav.selectLanguage")}
                  className="pl-8 pr-2 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:hidden flex items-center gap-2 z-50">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                aria-label={t("nav.selectLanguage")}
                className="px-2 py-2 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 max-w-[100px]"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95 min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-16 left-0 right-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xl z-50 md:hidden overflow-hidden"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    onClick={() => handleMobileNavigate(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-between group ${currentPage === item.id
                      ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                  >
                    <span>{item.label}</span>
                    {currentPage === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="w-1.5 h-1.5 rounded-full bg-green-500"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
