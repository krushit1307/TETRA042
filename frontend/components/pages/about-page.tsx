"use client"

import { motion } from "framer-motion"
import { Users, Target, Lightbulb, Award } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-4">{t("about.title")}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t("about.subtitle")}
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <Target className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.mission")}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.missionText")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <Lightbulb className="w-12 h-12 text-amber-600 dark:text-amber-400 mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.vision")}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {t("about.visionText")}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">{t("about.values")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Users, titleKey: "about.value1Title", descKey: "about.value1Desc" },
              { icon: Award, titleKey: "about.value2Title", descKey: "about.value2Desc" },
              { icon: Lightbulb, titleKey: "about.value3Title", descKey: "about.value3Desc" },
              { icon: Target, titleKey: "about.value4Title", descKey: "about.value4Desc" },
            ].map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-800 text-center"
                >
                  <Icon className="w-10 h-10 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{t(value.titleKey)}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t(value.descKey)}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 rounded-2xl p-8 sm:p-12 text-white shadow-2xl"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("about.story")}</h2>
          <p className="text-lg leading-relaxed mb-4">
            {t("about.storyP1")}
          </p>
          <p className="text-lg leading-relaxed mb-4">
            {t("about.storyP2")}
          </p>
          <p className="text-lg leading-relaxed">
            {t("about.storyP3")}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
