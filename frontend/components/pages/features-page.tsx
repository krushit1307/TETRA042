"use client"

import { motion } from "framer-motion"
import { Leaf, Upload, TrendingUp, BookOpen, Smartphone, Globe, Zap, Sparkles, Mic, Languages, MapPin, Handshake, PhoneCall, Calendar, Newspaper, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

export default function FeaturesPage() {
  const { t, languages } = useLanguage()

  const features = [
    {
      icon: Upload,
      titleKey: "features.card1Title",
      descKey: "features.card1Desc",
      color: "from-teal-500 to-cyan-600",
      bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10",
    },
    {
      icon: Calendar,
      titleKey: "features.card2Title",
      descKey: "features.card2Desc",
      color: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10",
    },
    {
      icon: TrendingUp,
      titleKey: "features.card3Title",
      descKey: "features.card3Desc",
      color: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10",
    },
    {
      icon: Newspaper,
      titleKey: "features.card4Title",
      descKey: "features.card4Desc",
      color: "from-sky-500 to-blue-600",
      bgGradient: "from-sky-50 to-blue-50 dark:from-sky-900/10 dark:to-blue-900/10",
    },
    {
      icon: BookOpen,
      titleKey: "features.card5Title",
      descKey: "features.card5Desc",
      color: "from-lime-500 to-green-600",
      bgGradient: "from-lime-50 to-green-50 dark:from-lime-900/10 dark:to-green-900/10",
    },
    {
      icon: Smartphone,
      titleKey: "features.card6Title",
      descKey: "features.card6Desc",
      color: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10",
    },
    {
      icon: MessageCircle,
      titleKey: "features.card7Title",
      descKey: "features.card7Desc",
      color: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10",
    },
  ]

  const heroPoints = [
    "features.heroPoint1",
    "features.heroPoint2",
    "features.heroPoint3",
  ]

  const whatsappPoints = [
    "features.whatsappPoint1",
    "features.whatsappPoint2",
    "features.whatsappPoint3",
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      },
    },
  }

  const languageFeatures = [
    {
      titleKey: "features.langFeat1Title",
      descKey: "features.langFeat1Desc",
      color: "from-green-400 to-emerald-600",
      bg: "bg-green-50 text-green-700",
      border: "border-green-100 hover:border-green-300",
      cardBg: "from-white to-green-50/50",
      icon: Mic,
    },
    {
      titleKey: "features.langFeat2Title",
      descKey: "features.langFeat2Desc",
      color: "from-blue-400 to-cyan-600",
      bg: "bg-blue-50 text-blue-700",
      border: "border-blue-100 hover:border-blue-300",
      cardBg: "from-white to-blue-50/50",
      icon: Languages,
    },
    {
      titleKey: "features.langFeat3Title",
      descKey: "features.langFeat3Desc",
      color: "from-amber-400 to-orange-600",
      bg: "bg-amber-50 text-amber-700",
      border: "border-amber-100 hover:border-amber-300",
      cardBg: "from-white to-amber-50/50",
      icon: MapPin,
    },
    {
      titleKey: "features.langFeat4Title",
      descKey: "features.langFeat4Desc",
      color: "from-lime-400 to-green-600",
      bg: "bg-lime-50 text-lime-700",
      border: "border-lime-100 hover:border-lime-300",
      cardBg: "from-white to-lime-50/50",
      icon: Handshake,
    },
  ]

  const whyChooseItems = [
    {
      icon: Zap,
      titleKey: "features.why1Title",
      descKey: "features.why1Desc",
      color: "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200 shadow-lg",
      borderColor: "group-hover:border-amber-200",
    },
    {
      icon: Globe,
      titleKey: "features.why2Title",
      descKey: "features.why2Desc",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-blue-200 shadow-lg",
      borderColor: "group-hover:border-blue-200",
    },
    {
      icon: Leaf,
      titleKey: "features.why3Title",
      descKey: "features.why3Desc",
      color: "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-green-200 shadow-lg",
      borderColor: "group-hover:border-green-200",
    },
    {
      icon: TrendingUp,
      titleKey: "features.why4Title",
      descKey: "features.why4Desc",
      color: "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-emerald-200 shadow-lg",
      borderColor: "group-hover:border-emerald-200",
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-gray-950/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Sparkle Effect */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6"
          >
            <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("features.poweredByAi")}</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 px-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              {t("features.title")}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4 leading-relaxed">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Flagship Voice Calling Feature */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mb-16 overflow-hidden rounded-3xl border border-emerald-200/70 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-8 sm:p-12 shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-emerald-50 backdrop-blur-sm mb-5">
                <Sparkles className="h-4 w-4" />
                {t("features.heroBadge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {t("features.heroTitle")}
              </h2>
              <p className="text-emerald-50/95 text-lg leading-relaxed mb-6 max-w-2xl">
                {t("features.heroDesc")}
              </p>
              <ul className="space-y-3">
                {heroPoints.map((pointKey) => (
                  <li key={pointKey} className="flex items-start gap-3 text-emerald-50">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">✓</span>
                    <span className="text-base">{t(pointKey)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-white/10" />
                <div className="absolute inset-8 rounded-full bg-white/15" />
                <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-white text-emerald-700 shadow-2xl">
                  <PhoneCall className="h-14 w-14 sm:h-16 sm:w-16" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp Chat Feature */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="relative mb-16 overflow-hidden rounded-3xl border border-green-200/70 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 p-8 sm:p-12 shadow-2xl"
        >
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 items-center">
            <div className="flex justify-center lg:justify-start order-2 lg:order-1">
              <div className="relative flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-white/10" />
                <div className="absolute inset-8 rounded-full bg-white/15" />
                <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full bg-white text-green-700 shadow-2xl">
                  <MessageCircle className="h-14 w-14 sm:h-16 sm:w-16" />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-green-50 backdrop-blur-sm mb-5">
                <MessageCircle className="h-4 w-4" />
                {t("features.whatsappBadge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                {t("features.whatsappTitle")}
              </h2>
              <p className="text-green-50/95 text-lg leading-relaxed mb-6 max-w-2xl">
                {t("features.whatsappDesc")}
              </p>
              <ul className="space-y-3">
                {whatsappPoints.map((pointKey) => (
                  <li key={pointKey} className="flex items-start gap-3 text-green-50">
                    <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">✓</span>
                    <span className="text-base">{t(pointKey)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Features Grid with Enhanced Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-20 blur transition-all duration-500`} />

                {/* Card */}
                <div className={`relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 h-full`}>
                  {/* Icon with Animated Background */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t(feature.descKey)}
                  </p>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute bottom-6 right-6 text-green-600 dark:text-green-400"
                  >
                    →
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Languages Section with Minimal Design */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("features.multilingualSupport")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              {t("features.supportedLanguages")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              {t("features.languagesDesc")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
          >
            {languages.map((lang) => (
              <motion.div
                key={lang.code}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:border-green-400 transition-all duration-300">
                  <div className="flex flex-col items-center">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-700 transition-colors">{lang.name}</h3>
                    <div className="px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full group-hover:bg-green-100 transition-colors">
                      <p className="text-xs font-medium text-green-700 dark:text-green-400">{lang.nativeName}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Language Features with Modern Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-200 dark:border-gray-800"
          >
            <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900 dark:text-white">{t("features.languageFeatures")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {languageFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`group flex gap-5 p-6 rounded-2xl bg-gradient-to-br ${feature.cardBg} dark:bg-gray-800 border shadow-sm hover:shadow-md transition-all duration-300 ${feature.border}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-lg group-hover:text-green-700 transition-colors">{t(feature.titleKey)}</h4>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{t(feature.descKey)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 sm:p-12 shadow-lg border border-emerald-100 dark:border-green-800"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200/40 dark:bg-green-900/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200/40 dark:bg-emerald-900/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-emerald-950 dark:text-emerald-50">{t("features.whyChoose")}</h2>
            <p className="text-emerald-700 dark:text-emerald-400 mb-8 text-lg">{t("features.whyChooseDesc")}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyChooseItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className={`group flex gap-5 p-8 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 border border-green-50/50 ${item.borderColor}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${item.color} dark:bg-gray-700 dark:text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">{t(item.titleKey)}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{t(item.descKey)}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
