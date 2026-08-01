"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function LanguagesPage() {
  const { t, languages } = useLanguage()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 mb-4">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("features.langBadge")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-4">{t("features.langTitle")}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t("features.langSubtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {languages.map((lang) => (
            <motion.div
              key={lang.code}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-800 text-center cursor-pointer group"
            >
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{lang.code === "en" ? "🇬🇧" : "🇮🇳"}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{lang.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{lang.nativeName}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
