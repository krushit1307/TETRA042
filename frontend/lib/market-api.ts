// API Integration for data.gov.in Market Prices
// Fetches real-time commodity prices from government API

import { CROP_EMOJIS } from './translations'
import { fetchCropsFromAPI, fetchPriceFromAPI, fetchNearbyMarketsFromAPI } from '@/app/actions/market-actions'

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
    // Remove common suffixes like "Market", "Market Yard", "APMC", "Mandi", "Sub Yard"
    // and also remove anything in brackets like (Grain), (Veg) to get base name
    // Case insensitive, at the end of the string
    return name
        .replace(/\s+(Market Yard|Market|APMC|Mandi|Sub Yard)$/i, '')
        .replace(/\(.*\)/, '') // Remove (Grain), (Veg), etc.
        .trim()
}

// Fetch all prices for a market (optimized for top prices ticker)
export async function getAllPricesForMarket(
    state: string,
    district: string,
    market: string
): Promise<MarketPrice[]> {
    const cacheKey = `all_prices_${getCacheKey(state, district, market)}`
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    try {
        // STRATEGY 1: Exact Match
        console.log(`[getAllPricesForMarket] trying exact match: ${market}`)
        let records = await fetchCropsFromAPI(state, district, market)

        if (!records || records.length === 0) {
            // STRATEGY 2: Cleaned Name
            const cleaned = cleanMarketName(market)
            if (cleaned !== market) {
                console.log(`[getAllPricesForMarket] trying cleaned name: ${cleaned}`)
                records = await fetchCropsFromAPI(state, district, cleaned)
            }
        }

        if (!records || records.length === 0) {
            // STRATEGY 3: Fetch ALL District Data and Fuzzy Match
            // This is the "fix for all" fallback
            console.log(`[getAllPricesForMarket] trying district fetch for: ${district}`)

            // Use optimal district fetch with caching
            const districtRecords = await getDistrictData(state, district)

            if (districtRecords && districtRecords.length > 0) {
                const cleanedTarget = cleanMarketName(market).toLowerCase()

                // Filter records where the market name *contains* our target base name
                // e.g. Target "Ahmedabad" matches "Ahmedabad(Grain)", "Ahmedabad(Veg)"
                records = districtRecords.filter((r: any) => {
                    const rMarket = (r.market || '').toLowerCase()
                    return rMarket.includes(cleanedTarget)
                })
                console.log(`[getAllPricesForMarket] District fuzzy match found: ${records.length} records`)
            }
        }

        if (!records || records.length === 0) {
            console.warn(`[getAllPricesForMarket] No records found for ${market} after all strategies`)
            // Do NOT cache empty results to prevent stuck "No Data" states during debugging or API issues
            // saveToCache(cacheKey, [])
            return []
        }

        // Process records to find unique commodities
        const priceMap = new Map<string, MarketPrice>()

        records.forEach((record: any) => {
            const commodity = record.commodity
            if (!commodity) return

            const price: MarketPrice = {
                state: record.state || state,
                district: record.district || district,
                market: record.market || market, // Keep original requested market matching for UI
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
                // Keep the variant with higher price
                if (price.modalPrice > existing.modalPrice) {
                    priceMap.set(commodity, price)
                }
            }
        })

        const allPrices = Array.from(priceMap.values())

        saveToCache(cacheKey, allPrices)
        return allPrices
    } catch (error) {
        console.error('Error fetching all prices:', error)
        return []
    }
}

// Fetch all data for a district and cache it
// This prevents repeated calls when searching for multiple markets in the same district
async function getDistrictData(state: string, district: string): Promise<any[]> {
    const cacheKey = `district_data_${getCacheKey(state, district, 'ALL')}`
    const cached = getFromCache(cacheKey)
    if (cached) return cached

    try {
        console.log(`[getDistrictData] Fetching full district data for ${district}`)
        const records = await fetchCropsFromAPI(state, district, '')

        // Always cache result, even if empty, to protect API
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
    // We can reuse the optimized function here
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
        // Reuse the logic from getAllPricesForMarket by getting all and finding the crop
        // This leverages the powerful fallback logic we just wrote
        const allPrices = await getAllPricesForMarket(state, district, market)
        const price = allPrices.find(p => p.commodity === crop)

        if (price) {
            saveToCache(cacheKey, price)
            return price
        }

        console.warn('No price data found for this selection')
        return null

    } catch (error) {
        console.error('Error fetching price:', error)
        return null
    }
}

// Find nearby markets with prices for the same crop
export async function findNearbyMarkets(
    state: string,
    district: string,
    crop: string
): Promise<MarketPrice[]> {
    try {
        // Use Server Action
        const records = await fetchNearbyMarketsFromAPI(state, crop)

        if (!records) return []

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
    } catch (error) {
        console.error('Error finding nearby markets:', error)
        return []
    }
}

// Default crops list
function getDefaultCrops(): string[] {
    return Object.keys(CROP_EMOJIS).sort()
}
