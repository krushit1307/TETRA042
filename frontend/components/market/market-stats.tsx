"use client"

import { MarketPrice } from "@/lib/market-api"
import { getCropEmoji, translateCropName, t } from "@/lib/translations"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MarketStatsProps {
    prices: MarketPrice[]
    loading: boolean
    selectedLanguage: string
}

export default function MarketStats({ prices, loading, selectedLanguage }: MarketStatsProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex gap-4 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="min-w-[280px] bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700">
                            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (prices.length === 0) {
        return null
    }

    // Duplicate prices to ensure seamless loop
    const carouselPrices = [...prices, ...prices]

    return (
        <div className="space-y-4 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {t('topMarketPrices', selectedLanguage)}
                </h3>
            </div>

            <div className="relative w-full overflow-hidden gradient-mask-r-0">
                <div className="flex items-center animate-scroll whitespace-nowrap hover:pause">
                    {carouselPrices.map((price, index) => (
                        <div
                            key={`${price.commodity}-${index}`}
                            className="inline-block min-w-[300px] max-w-[300px] mr-4 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-2 border-green-500 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-3xl">{getCropEmoji(price.commodity)}</span>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                        ₹ {price.modalPrice.toLocaleString('en-IN')}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        per Quintal
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-base font-bold text-gray-900 dark:text-white truncate" title={translateCropName(price.commodity, selectedLanguage)}>
                                    {translateCropName(price.commodity, selectedLanguage)}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {price.commodity}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 50s linear infinite;
                    width: max-content;
                }
                .hover\\:pause:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    )
}
