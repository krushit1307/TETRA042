// API Integration for data.gov.in Market Prices
// Fetches real-time commodity prices from government API with transparent fallback

import { CROP_EMOJIS } from './translations'
import { fetchCropsFromAPI, fetchPriceFromAPI, fetchNearbyMarketsFromAPI } from '@/app/actions/market-actions'
import { getFallbackPricesForMarket } from './market-fallback-data'
import { STATE_DISTRICTS_MARKETS } from './indian-markets-data'

export interface MarketPrice {
    state: string
    district: string
    market: string
    commodity: string
    variety: string
    minPrice: number
    maxPrice: number
    modalPrice: number
    priceDate: string
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

// Cache management
interface CacheEntry {
    data: any
    timestamp: number
}

function getCacheKey(state: string, district: string, market: string): string {
    return `market_${state}_${district}_${market}`.toLowerCase().replace(/\s+/g, '_')
}

function getFromCache(key: string): any | null {
    if (typeof window === 'undefined') return null

    try {
        const cached = localStorage.getItem(key)
        if (!cached) return null

        const entry: CacheEntry = JSON.parse(cached)
        const now = Date.now()

        if (now - entry.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key)
            return null
        }

        return entry.data
    } catch (error) {
        return null
    }
}

function saveToCache(key: string, data: any): void {
    if (typeof window === 'undefined') return

    try {
        const entry: CacheEntry = {
            data,
            timestamp: Date.now()
        }
        localStorage.setItem(key, JSON.stringify(entry))
    } catch (error) {
        console.error('Cache save error:', error)
    }
}

function cleanMarketName(name: string): string {
    return name
        .replace(/\s+(Market Yard|Market|APMC|Mandi|Sub Yard)$/i, '')
        .replace(/\(.*\)/, '')
        .trim()
}

// Fetch all prices for a market (optimized with transparent fallback)
export async function getAllPricesForMarket(
    state: string,
    district: string,
    market: string
): Promise<MarketPrice[]> {
    const cacheKey = `all_prices_${getCacheKey(state, district, market)}`
    const cached = getFromCache(cacheKey)
    if (cached && cached.length > 0) return cached

    try {
        // STRATEGY 1: Exact Match (Government API call)
        console.log(`[getAllPricesForMarket] trying exact match: ${market}`)
        let records = await fetchCropsFromAPI(state, district, market)

        if (!records || records.length === 0) {
            // STRATEGY 2: Cleaned Name (Government API call)
            const cleaned = cleanMarketName(market)
            if (cleaned !== market) {
                console.log(`[getAllPricesForMarket] trying cleaned name: ${cleaned}`)
                records = await fetchCropsFromAPI(state, district, cleaned)
            }
        }

        if (!records || records.length === 0) {
            // STRATEGY 3: District Fetch and Fuzzy Match (Government API call)
            console.log(`[getAllPricesForMarket] trying district fetch for: ${district}`)
            const districtRecords = await getDistrictData(state, district)

            if (districtRecords && districtRecords.length > 0) {
                const cleanedTarget = cleanMarketName(market).toLowerCase()
                records = districtRecords.filter((r: any) => {
                    const rMarket = (r.market || '').toLowerCase()
                    return rMarket.includes(cleanedTarget)
                })
                console.log(`[getAllPricesForMarket] District fuzzy match found: ${records.length} records`)
            }
        }

        // Process API records if returned successfully
        if (records && records.length > 0) {
            const priceMap = new Map<string, MarketPrice>()

            records.forEach((record: any) => {
                const commodity = record.commodity
                if (!commodity) return

                const price: MarketPrice = {
                    state: record.state || state,
                    district: record.district || district,
                    market: record.market || market,
                    commodity: commodity,
                    variety: record.variety || 'Local',
                    minPrice: parseFloat(record.min_price) || 0,
                    maxPrice: parseFloat(record.max_price) || 0,
                    modalPrice: parseFloat(record.modal_price) || 0,
                    priceDate: record.arrival_date || new Date().toISOString().split('T')[0],
                }

                if (!priceMap.has(commodity)) {
                    priceMap.set(commodity, price)
                } else {
                    const existing = priceMap.get(commodity)!
                    if (price.modalPrice > existing.modalPrice) {
                        priceMap.set(commodity, price)
                    }
                }
            })

            const allPrices = Array.from(priceMap.values())
            if (allPrices.length > 0) {
                saveToCache(cacheKey, allPrices)
                return allPrices
            }
        }

        // TRANSPARENT FALLBACK: Log and switch to fallback dataset when Government API returns 0 records
        console.warn("Government API unavailable. Using local fallback dataset.")
        const fallbackPrices = getFallbackPricesForMarket(state, district, market)
        saveToCache(cacheKey, fallbackPrices)
        return fallbackPrices

    } catch (error) {
        console.warn("Government API unavailable. Using local fallback dataset.")
        const fallbackPrices = getFallbackPricesForMarket(state, district, market)
        return fallbackPrices
    }
}

// Fetch all data for a district and cache it
async function getDistrictData(state: string, district: string): Promise<any[]> {
    const cacheKey = `district_data_${getCacheKey(state, district, 'ALL')}`
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    try {
        console.log(`[getDistrictData] Fetching full district data for ${district}`)
        const records = await fetchCropsFromAPI(state, district, '')
        saveToCache(cacheKey, records || [])
        return records || []
    } catch (error) {
        console.error(`[getDistrictData] Error fetching for ${district}:`, error)
        return []
    }
}

// Fetch crops available in a market
export async function getCropsForMarket(
    state: string,
    district: string,
    market: string
): Promise<string[]> {
    const prices = await getAllPricesForMarket(state, district, market)
    if (prices.length > 0) {
        return prices.map(p => p.commodity).sort()
    }
    return getDefaultCrops()
}

// Fetch price for a specific crop
export async function getPriceForCrop(
    state: string,
    district: string,
    market: string,
    crop: string
): Promise<MarketPrice | null> {
    const cacheKey = `price_${getCacheKey(state, district, market)}_${crop.toLowerCase().replace(/\s+/g, '_')}`
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    try {
        const allPrices = await getAllPricesForMarket(state, district, market)
        const price = allPrices.find(p => p.commodity === crop)

        if (price) {
            saveToCache(cacheKey, price)
            return price
        }

        console.warn("Government API unavailable. Using local fallback dataset.")
        const fallbackPrices = getFallbackPricesForMarket(state, district, market)
        const fallbackPrice = fallbackPrices.find(p => p.commodity === crop) || fallbackPrices[0] || null
        if (fallbackPrice) {
            saveToCache(cacheKey, fallbackPrice)
        }
        return fallbackPrice

    } catch (error) {
        console.warn("Government API unavailable. Using local fallback dataset.")
        const fallbackPrices = getFallbackPricesForMarket(state, district, market)
        return fallbackPrices.find(p => p.commodity === crop) || fallbackPrices[0] || null
    }
}

// Find nearby markets with prices for the same crop
export async function findNearbyMarkets(
    state: string,
    district: string,
    crop: string
): Promise<MarketPrice[]> {
    try {
        const records = await fetchNearbyMarketsFromAPI(state, crop)

        if (records && records.length > 0) {
            return records
                .filter((r: any) => r.district !== district)
                .slice(0, 5)
                .map((r: any) => ({
                    state: r.state || state,
                    district: r.district || '',
                    market: r.market || '',
                    commodity: r.commodity || crop,
                    variety: r.variety || 'Local',
                    minPrice: parseFloat(r.min_price) || 0,
                    maxPrice: parseFloat(r.max_price) || 0,
                    modalPrice: parseFloat(r.modal_price) || 0,
                    priceDate: r.arrival_date || new Date().toISOString().split('T')[0],
                }))
        }

        console.warn("Government API unavailable. Using local fallback dataset.")
        const districts = Object.keys(STATE_DISTRICTS_MARKETS[state] || {})
        const nearbyDistricts = districts.filter(d => d !== district).slice(0, 3)
        const nearbyPrices: MarketPrice[] = []

        nearbyDistricts.forEach(d => {
            const markets = STATE_DISTRICTS_MARKETS[state][d]
            if (markets && markets.length > 0) {
                const prices = getFallbackPricesForMarket(state, d, markets[0])
                const cropPrice = prices.find(p => p.commodity === crop) || prices[0]
                if (cropPrice) nearbyPrices.push(cropPrice)
            }
        })

        return nearbyPrices
    } catch (error) {
        console.warn("Government API unavailable. Using local fallback dataset.")
        return []
    }
}

// Default crops list
function getDefaultCrops(): string[] {
    return Object.keys(CROP_EMOJIS).sort()
}
