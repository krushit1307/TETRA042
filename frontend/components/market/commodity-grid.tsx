"use client"

import { getCropEmoji, translateCropName, t } from "@/lib/translations"
import { motion } from "framer-motion"

interface CommodityGridProps {
    crops: string[]
    selectedCrop: string
    onSelectCrop: (crop: string) => void
    selectedLanguage: string
    loading: boolean
}

export default function CommodityGrid({
    crops,
    selectedCrop,
    onSelectCrop,
    selectedLanguage,
    loading
}: CommodityGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        )
    }

    if (crops.length === 0) return null

    return (
        <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 ml-1">
                {t('selectCrop', selectedLanguage)}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {crops.map((crop, index) => (
                    <motion.button
                        key={crop}
                        onClick={() => onSelectCrop(crop)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all
                            ${selectedCrop === crop
                                ? 'bg-green-50 border-green-500 shadow-md ring-2 ring-green-200 dark:bg-green-900/20 dark:border-green-400 dark:ring-green-800'
                                : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700 dark:hover:border-green-600'
                            }
                        `}
                    >
                        <span className="text-3xl mb-2">{getCropEmoji(crop)}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center line-clamp-2">
                            {translateCropName(crop, selectedLanguage)}
                        </span>

                        {selectedCrop === crop && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
