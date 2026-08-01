"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import MarketHeader from "@/components/market/market-header"
import MarketStats from "@/components/market/market-stats"
import CommodityGrid from "@/components/market/commodity-grid"
import CropPriceDetails from "@/components/market/crop-price-details"
import WelcomeCard from "@/components/market/welcome-card"
import { getCropsForMarket, getPriceForCrop, getAllPricesForMarket, type MarketPrice } from "@/lib/market-api"
import { LANGUAGES, t } from "@/lib/translations"
import { Loader2 } from "lucide-react"

export default function MarketYardPage() {
    const router = useRouter()
    const [selectedLanguage, setSelectedLanguage] = useState('en') // Default to English as per request
    const [selectedState, setSelectedState] = useState('') // Default to Empty
    const [selectedDistrict, setSelectedDistrict] = useState('')
    const [selectedMarket, setSelectedMarket] = useState('')
    const [selectedCrop, setSelectedCrop] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const [availableCrops, setAvailableCrops] = useState<string[]>([])
    const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([])
    const [isLoadingCrops, setIsLoadingCrops] = useState(false)
    const [isLoadingPrices, setIsLoadingPrices] = useState(false)
    const [selectedCropPrice, setSelectedCropPrice] = useState<MarketPrice | null>(null)

    // Handle navigation from Navbar
    const handleNavigate = (page: string) => {
        if (page === 'market-yard') return
        if (page === 'news') {
            router.push('/news')
            return
        }
        if (page === 'calendar') {
            router.push('/calendar')
            return
        }
        router.push(`/?page=${page}`)
    }

    // Load all market data when market is selected
    useEffect(() => {
        if (selectedState && selectedDistrict && selectedMarket) {
            loadMarketData()
            setSelectedCrop('')
            setSelectedCropPrice(null)
        } else {
            setAvailableCrops([])
            setMarketPrices([])
        }
    }, [selectedState, selectedDistrict, selectedMarket])

    const loadMarketData = async () => {
        setIsLoadingCrops(true)
        setIsLoadingPrices(true)
        try {
            // Fetch all prices in one go
            const allPrices = await getAllPricesForMarket(selectedState, selectedDistrict, selectedMarket)

            // Sort by Modal Price Descending to get Top Prices
            const sortedPrices = [...allPrices].sort((a, b) => b.modalPrice - a.modalPrice)

            // Top 7 for ticker
            setMarketPrices(sortedPrices.slice(0, 7))

            // Available crops list (sorted alphabetically)
            const crops = allPrices.map(p => p.commodity).sort()
            setAvailableCrops(crops.length > 0 ? crops : [])
        } catch (err) {
            console.error('Error loading market data:', err)
            setAvailableCrops([])
            setMarketPrices([])
        } finally {
            setIsLoadingCrops(false)
            setIsLoadingPrices(false)
        }
    }

    const handleCropSelect = async (crop: string) => {
        setSelectedCrop(crop)

        // Smooth scroll to top when crop is selected
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })

        // Check if we already have the price in our full list?
        // getAllPricesForMarket caches data, so calling getPriceForCrop is likely fast/cached too
        // But we can also look it up from a state if we kept allPrices.
        // For simplicity and consistency with existing API, let's just call getPriceForCrop
        // It will hit the cache we just populated in getAllPricesForMarket.

        setIsLoadingPrices(true)
        try {
            const price = await getPriceForCrop(selectedState, selectedDistrict, selectedMarket, crop)
            if (price) {
                setSelectedCropPrice(price)
            } else {
                setSelectedCropPrice(null)
            }
        } catch (err) {
            console.error('Error fetching single crop price:', err)
            setSelectedCropPrice(null)
        } finally {
            setIsLoadingPrices(false)
        }
    }

    const handleBackToGrid = () => {
        setSelectedCrop('')
        setSelectedCropPrice(null)
    }

    // Filter crops based on search term
    const filteredCrops = availableCrops.filter(crop =>
        crop.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900">
            <Navbar currentPage="market-yard" onNavigate={handleNavigate} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Sticky Header - No Border/Shadow as requested */}
                <div className="sticky top-16 z-20 bg-[#FDFBF7] dark:bg-gray-900 pt-4 pb-2 -mt-4 transition-all duration-300">
                    <MarketHeader
                        selectedState={selectedState}
                        selectedDistrict={selectedDistrict}
                        selectedMarket={selectedMarket}
                        searchTerm={searchTerm}
                        selectedLanguage={selectedLanguage}
                        onStateChange={(state) => {
                            setSelectedState(state)
                            setSelectedDistrict('')
                            setSelectedMarket('')
                        }}
                        onDistrictChange={(district) => {
                            setSelectedDistrict(district)
                            setSelectedMarket('')
                        }}
                        onMarketChange={setSelectedMarket}
                        onSearchChange={setSearchTerm}
                        onLanguageChange={setSelectedLanguage}
                    />
                </div>

                {/* Main Content Area */}
                {selectedMarket ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedCropPrice ? (
                            <CropPriceDetails
                                price={selectedCropPrice}
                                selectedLanguage={selectedLanguage}
                                onBack={handleBackToGrid}
                            />
                        ) : selectedCrop ? (
                            // Show "No Data" state for selected crop
                            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <h3 className="text-4xl">{/* We can try to get emoji if available, or just generic */}🌱</h3>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {selectedCrop}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        {/* Use translation key if available, else static fallback */}
                                        Price data not available for this crop in {selectedMarket}
                                    </p>
                                </div>
                                <button
                                    onClick={handleBackToGrid}
                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                >
                                    {t('selectAnotherCrop', selectedLanguage)}
                                </button>
                            </div>
                        ) : (
                            /* Prices List or No Data */
                            marketPrices.length > 0 || isLoadingPrices ? (
                                <MarketStats
                                    prices={marketPrices}
                                    loading={isLoadingPrices && marketPrices.length === 0}
                                    selectedLanguage={selectedLanguage}
                                />
                            ) : (
                                <div className="w-full bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-12 text-center animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-4xl text-green-600 dark:text-green-400">📉</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('noDataAvailable', selectedLanguage)}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto text-sm">
                                        {/* We can leave this empty or add a generic 'Please try another market' if needed */}
                                    </p>
                                </div>
                            )
                        )}

                        {/* Crop Grid - Always Visible */}
                        <CommodityGrid
                            crops={filteredCrops}
                            selectedCrop={selectedCrop}
                            onSelectCrop={handleCropSelect}
                            selectedLanguage={selectedLanguage}
                            loading={isLoadingCrops}
                        />
                    </div>
                ) : (
                    /* Empty State / Prompt */
                    <WelcomeCard selectedLanguage={selectedLanguage} />
                )}
            </main>
        </div>
    )
}
