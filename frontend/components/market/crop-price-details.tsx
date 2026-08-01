"use client"

import { MarketPrice } from "@/lib/market-api"
import { getCropEmoji, translateCropName, t } from "@/lib/translations"
import { ArrowLeft, TrendingDown, TrendingUp, Minus, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"

interface CropPriceDetailsProps {
    price: MarketPrice
    selectedLanguage: string
    onBack: () => void
}

export default function CropPriceDetails({ price, selectedLanguage, onBack }: CropPriceDetailsProps) {
    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-green-700 dark:text-green-400"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-4xl">{getCropEmoji(price.commodity)}</span>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {translateCropName(price.commodity, selectedLanguage)}
                        </h2>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            <span>{price.market}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Cards */}
            <div className="space-y-4">
                {/* Minimum Price - Reddish */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-xl p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {t('minimumPrice', selectedLanguage)}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                            ₹ {price.minPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-red-600/70 dark:text-red-400/70">
                            / {t('quintal', selectedLanguage) || 'Quintal'}
                        </div>
                    </div>
                </motion.div>

                {/* Average Price - Yellowish */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                            <Minus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {t('averagePrice', selectedLanguage)}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                            ₹ {price.modalPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-amber-600/70 dark:text-amber-400/70">
                            / {t('quintal', selectedLanguage) || 'Quintal'}
                        </div>
                    </div>
                </motion.div>

                {/* Maximum Price - Greenish */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl p-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            {t('maximumPrice', selectedLanguage)}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                            ₹ {price.maxPrice.toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-green-600/70 dark:text-green-400/70">
                            / {t('quintal', selectedLanguage) || 'Quintal'}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Information */}
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4 mt-8">
                <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>{t('priceDate', selectedLanguage)}: {price.priceDate}</span>
                </div>
                <span>{t('source', selectedLanguage) || 'Source'}: AGMARKNET</span>
            </div>
        </div>
    )
}
