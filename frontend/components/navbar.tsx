"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface NavbarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "home", label: "Home" },
    { id: "assistant", label: "Assistant" },
    { id: "diagnosis", label: "Diagnosis" },
    { id: "market-yard", label: "Market Yard" },
    { id: "news", label: "Farmer News" },
    { id: "features", label: "Features" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ]

  // Prevent body scroll when mobile menu is open
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
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 cursor-pointer z-50"
              onClick={() => {
                onNavigate("home")
                setIsMobileMenuOpen(false)
                // Scroll to top smoothly
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
                <span className="font-bold text-xl text-green-600 dark:text-green-400">Sasya AI</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">The Future grow here.</span>
              </div>
            </motion.div>

            {/* Desktop Navigation Items */}
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
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden z-50">
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

      {/* Mobile Menu Overlay and Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Top-Down Menu */}
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
