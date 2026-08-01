"use client"

import { motion } from "framer-motion"
import { Users, Target, Lightbulb, Award, Sparkles, PhoneCall, Leaf, Calendar, Globe } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const values = [
  { icon: Users, titleKey: "about.value1Title", descKey: "about.value1Desc", color: "from-emerald-500 to-green-600" },
  { icon: Award, titleKey: "about.value2Title", descKey: "about.value2Desc", color: "from-teal-500 to-cyan-600" },
  { icon: Lightbulb, titleKey: "about.value3Title", descKey: "about.value3Desc", color: "from-amber-500 to-orange-600" },
  { icon: Target, titleKey: "about.value4Title", descKey: "about.value4Desc", color: "from-lime-500 to-green-600" },
] as const

const impactPills = [
  { icon: PhoneCall, key: "about.pillVoice" },
  { icon: Leaf, key: "about.pillDiagnosis" },
  { icon: Calendar, key: "about.pillCalendar" },
  { icon: Globe, key: "about.pillLanguages" },
] as const

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-gray-950/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("about.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 px-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              {t("about.title")}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t("about.subtitle")}
          </p>
        </motion.div>

        {/* Impact highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-14 overflow-hidden rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-8 sm:p-10 shadow-xl"
        >
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("about.impactTitle")}</h2>
            <p className="text-emerald-50/95 max-w-2xl mx-auto mb-6 leading-relaxed">{t("about.impactDesc")}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {impactPills.map(({ icon: Icon, key }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm"
                >
                  <Icon className="h-4 w-4" />
                  {t(key)}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200/60 dark:border-gray-800 hover:shadow-lg transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mb-5 shadow-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("about.mission")}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t("about.missionText")}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-md border border-gray-200/60 dark:border-gray-800 hover:shadow-lg transition-all"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 mb-5 shadow-md">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("about.vision")}</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t("about.visionText")}</p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {t("about.values")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={value.titleKey}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200/60 dark:border-gray-800 text-center hover:shadow-md transition-all"
                >
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${value.color} mx-auto mb-4 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
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
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-emerald-950 dark:from-gray-900 dark:to-green-950 p-8 sm:p-12 text-white shadow-2xl border border-emerald-900/30"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("about.story")}</h2>
            <div className="space-y-4 text-emerald-50/90 leading-relaxed text-base sm:text-lg">
              <p>{t("about.storyP1")}</p>
              <p>{t("about.storyP2")}</p>
              <p>{t("about.storyP3")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
