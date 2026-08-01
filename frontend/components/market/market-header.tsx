"use client"

import { Search, MapPin, Building2, Home, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import {
    getAllStates,
    getDistrictsForState,
    getMarketsForDistrict
} from "@/lib/indian-markets-data"
import { LANGUAGES, translateStateName, translateDistrictName, translateMarketName, t } from "@/lib/translations"

interface MarketHeaderProps {
    selectedState: string
    selectedDistrict: string
    selectedMarket: string
    searchTerm: string
    selectedLanguage: string
    onStateChange: (state: string) => void
    onDistrictChange: (district: string) => void
    onMarketChange: (market: string) => void
    onSearchChange: (term: string) => void
    onLanguageChange: (lang: string) => void
}

export default function MarketHeader({
    selectedState,
    selectedDistrict,
    selectedMarket,
    searchTerm,
    selectedLanguage,
    onStateChange,
    onDistrictChange,
    onMarketChange,
    onSearchChange,
    onLanguageChange
}: MarketHeaderProps) {
    const states = getAllStates()
    const districts = selectedState ? getDistrictsForState(selectedState) : []
    const markets = selectedState && selectedDistrict ? getMarketsForDistrict(selectedState, selectedDistrict) : []

    return (
        <div className="space-y-6 mb-8 pt-4"> {/* Added padding top for sticky breathing room */}
            {/* Dropdowns Row */}
            <div className="flex flex-wrap gap-3 items-center justify-between">

                <div className="flex flex-wrap gap-3 items-center">
                    {/* State Selector */}
                    <div className="relative group">
                        <select
                            value={selectedState}
                            onChange={(e) => onStateChange(e.target.value)}
                            className="appearance-none bg-green-800 text-white pl-10 pr-8 py-2 rounded-full font-medium hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-none"
                        >
                            <option value="">{t('selectState', selectedLanguage)}</option>
                            {states.map(state => (
                                <option key={state} value={state} className="text-gray-900 bg-white">
                                    {translateStateName(state, selectedLanguage)}
                                </option>
                            ))}
                        </select>
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-200 pointer-events-none" />
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                    </div>

                    {/* District Selector */}
                    {selectedState && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative group"
                        >
                            <select
                                value={selectedDistrict}
                                onChange={(e) => onDistrictChange(e.target.value)}
                                className="appearance-none bg-green-800 text-white pl-10 pr-8 py-2 rounded-full font-medium hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-none"
                            >
                                <option value="">{t('selectDistrict', selectedLanguage)}</option>
                                {districts.map(district => (
                                    <option key={district} value={district} className="text-gray-900 bg-white">
                                        {translateDistrictName(district, selectedLanguage)}
                                    </option>
                                ))}
                            </select>
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-200 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </motion.div>
                    )}

                    {/* Market Selector */}
                    {selectedDistrict && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative group"
                        >
                            <select
                                value={selectedMarket}
                                onChange={(e) => onMarketChange(e.target.value)}
                                className="appearance-none bg-green-800 text-white pl-10 pr-8 py-2 rounded-full font-medium hover:bg-green-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-none"
                            >
                                <option value="">{t('selectMarket', selectedLanguage)}</option>
                                {markets.map(market => (
                                    <option key={market} value={market} className="text-gray-900 bg-white">
                                        {translateMarketName(market, selectedLanguage)}
                                    </option>
                                ))}
                            </select>
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-200 pointer-events-none" />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
                        </motion.div>
                    )
                    }
                </div >

                <div className="flex items-center gap-3">
                    {/* Language Selector - Now Inline */}
                    <div className="relative">
                        <select
                            value={selectedLanguage}
                            onChange={(e) => onLanguageChange(e.target.value)}
                            className="bg-white dark:bg-gray-800 border-none text-gray-700 dark:text-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            {LANGUAGES.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.nativeName}</option>
                            ))}
                        </select>
                    </div>
                </div>

            </div >

            {/* Title & Search Row */}
            {
                selectedMarket && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex items-center gap-2 text-green-800 dark:text-green-400">
                            <MapPin className="w-5 h-5 fill-current" />
                            <h2 className="text-xl font-bold">
                                {translateMarketName(selectedMarket, selectedLanguage)}
                            </h2>
                        </div>


                    </motion.div>
                )
            }
        </div >
    )
}
