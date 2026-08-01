"use client"

import { motion } from "framer-motion"
import { MapPin, Store, TrendingUp } from "lucide-react"
import Image from "next/image"
import { t } from "@/lib/translations"

interface WelcomeCardProps {
    selectedLanguage: string
}

export default function WelcomeCard({ selectedLanguage }: WelcomeCardProps) {
    const steps = [
        {
            icon: MapPin,
            title: t('step1Title', selectedLanguage),
            desc: t('step1Desc', selectedLanguage),
            color: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
        },
        {
            icon: Store,
            title: t('step2Title', selectedLanguage),
            desc: t('step2Desc', selectedLanguage),
            color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
        },
        {
            icon: TrendingUp,
            title: t('step3Title', selectedLanguage),
            desc: t('step3Desc', selectedLanguage),
            color: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
        }
    ]

    return (
        <div className="w-full max-w-6xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
            {/* Main Card with Glassmorphism and Stronger Green Gradient Theme */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-50 dark:from-green-900/40 dark:via-gray-900 dark:to-emerald-900/20 border border-green-300/60 dark:border-green-700/40 rounded-[2rem] shadow-xl shadow-green-200/50 dark:shadow-green-900/20 p-6 sm:p-8 md:p-10">

                {/* Decorative Background Elements - More Vibrant Green */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[30rem] h-[30rem] bg-gradient-to-br from-green-400/20 to-emerald-300/20 rounded-full blur-[80px] animate-pulse delay-700 opacity-60"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[30rem] h-[30rem] bg-gradient-to-tr from-teal-300/20 to-green-300/20 rounded-full blur-[80px] animate-pulse opacity-60"></div>

                {/* Content Container */}
                <div className="relative z-10 text-center mb-8 sm:mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Logo */}
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 transform hover:scale-105 transition-transform duration-300 drop-shadow-lg">
                            <Image
                                src="/Sasya_bg.png"
                                alt="Sasya AI Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>

                        {/* Title - Stronger Green Text - Single Line on Desktop */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight text-green-800 dark:text-green-300 drop-shadow-sm whitespace-normal lg:whitespace-nowrap tracking-tight">
                            {t('welcomeTitle', selectedLanguage)}
                        </h2>

                        {/* Description */}
                        <p className="text-base sm:text-lg md:text-xl text-green-900/80 dark:text-green-100/80 max-w-3xl mx-auto leading-relaxed font-semibold px-4">
                            {t('welcomeDesc', selectedLanguage)}
                        </p>
                    </motion.div>
                </div>

                {/* Steps Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                            className="bg-white/70 dark:bg-gray-800/50 rounded-2xl p-6 border border-green-100/50 dark:border-gray-700 shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="flex flex-col items-center">
                                <div className={`p-4 rounded-2xl mb-4 ${step.color} group-hover:scale-110 transition-transform duration-300 shadow-sm ring-1 ring-black/5 dark:ring-white/5`}>
                                    <step.icon className="w-8 h-8" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium leading-relaxed">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Live Data Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute top-6 right-6"
                >
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100/80 dark:bg-green-900/40 backdrop-blur-md rounded-full border border-green-200/60 dark:border-green-800/60 shadow-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600 dark:bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold text-green-800 dark:text-green-300 tracking-wide uppercase">
                            {t('liveData', selectedLanguage)}
                        </span>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
