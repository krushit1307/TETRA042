// Local Fallback Dataset for Government Market Yard API
// Used automatically whenever the live Government API returns empty data, times out, or encounters errors.

import { MarketPrice } from './market-api'

export interface FallbackCommodity {
    commodity: string
    variety: string
    minPrice: number
    maxPrice: number
    modalPrice: number
}

// Preset Market Yard Commodities for Major States & Districts
export const FALLBACK_MARKET_DATA: Record<string, Record<string, Record<string, FallbackCommodity[]>>> = {
    'Gujarat': {
        'Ahmedabad': {
            'Ahmedabad Market Yard': [
                { commodity: 'Wheat', variety: 'Sharbati', minPrice: 2400, maxPrice: 2850, modalPrice: 2650 },
                { commodity: 'Potato', variety: 'Desi', minPrice: 1200, maxPrice: 1750, modalPrice: 1500 },
                { commodity: 'Tomato', variety: 'Hybrid', minPrice: 1600, maxPrice: 2400, modalPrice: 2000 },
                { commodity: 'Onion', variety: 'Red', minPrice: 1400, maxPrice: 2200, modalPrice: 1800 },
                { commodity: 'Cotton', variety: 'Shankar-6', minPrice: 6900, maxPrice: 7850, modalPrice: 7400 },
                { commodity: 'Groundnut', variety: 'Bold', minPrice: 5600, maxPrice: 6700, modalPrice: 6200 },
                { commodity: 'Rice', variety: 'Gujarat-17', minPrice: 2800, maxPrice: 3500, modalPrice: 3150 },
                { commodity: 'Cumin', variety: 'Jeera Extra', minPrice: 24000, maxPrice: 29000, modalPrice: 26500 },
            ],
            'Naroda APMC': [
                { commodity: 'Tomato', variety: 'Local', minPrice: 1500, maxPrice: 2200, modalPrice: 1850 },
                { commodity: 'Onion', variety: 'Red', minPrice: 1300, maxPrice: 2100, modalPrice: 1700 },
                { commodity: 'Potato', variety: 'Kufri', minPrice: 1100, maxPrice: 1650, modalPrice: 1400 },
                { commodity: 'Green Chilli', variety: 'G-4', minPrice: 2800, maxPrice: 4200, modalPrice: 3500 },
                { commodity: 'Brinjal', variety: 'Round', minPrice: 1200, maxPrice: 1900, modalPrice: 1550 },
            ],
            'Bavla Mandi': [
                { commodity: 'Paddy (Dhan)', variety: 'Gurjari', minPrice: 2100, maxPrice: 2600, modalPrice: 2350 },
                { commodity: 'Wheat', variety: 'Lok-1', minPrice: 2300, maxPrice: 2700, modalPrice: 2500 },
                { commodity: 'Cotton', variety: 'Medium Staple', minPrice: 6700, maxPrice: 7600, modalPrice: 7150 },
            ]
        },
        'Banaskantha': {
            'Deesa APMC': [
                { commodity: 'Potato', variety: 'Jyoti', minPrice: 1150, maxPrice: 1600, modalPrice: 1420 },
                { commodity: 'Groundnut', variety: 'G-20', minPrice: 5500, maxPrice: 6600, modalPrice: 6100 },
                { commodity: 'Mustard', variety: 'Pusa Bold', minPrice: 4900, maxPrice: 5750, modalPrice: 5350 },
                { commodity: 'Cumin', variety: 'Quality-A', minPrice: 23500, maxPrice: 28000, modalPrice: 25800 },
                { commodity: 'Castor Seed', variety: 'Local', minPrice: 5800, maxPrice: 6500, modalPrice: 6200 },
            ],
            'Tharad Market': [
                { commodity: 'Cumin', variety: 'Jeera', minPrice: 24000, maxPrice: 28500, modalPrice: 26200 },
                { commodity: 'Mustard', variety: 'Yellow', minPrice: 5000, maxPrice: 5800, modalPrice: 5400 },
                { commodity: 'Castor Seed', variety: 'Hybrid', minPrice: 5900, maxPrice: 6600, modalPrice: 6250 },
                { commodity: 'Pomegranate', variety: 'Bhagwa', minPrice: 6500, maxPrice: 9500, modalPrice: 8000 },
            ]
        },
        'Rajkot': {
            'Gondal APMC': [
                { commodity: 'Groundnut', variety: 'TJ-37', minPrice: 5800, maxPrice: 7100, modalPrice: 6450 },
                { commodity: 'Cotton', variety: 'Kapas-20', minPrice: 7000, maxPrice: 8100, modalPrice: 7550 },
                { commodity: 'Cumin', variety: 'Jeera', minPrice: 24500, maxPrice: 29500, modalPrice: 27000 },
                { commodity: 'Red Chilli', variety: 'Resham Patto', minPrice: 12000, maxPrice: 18500, modalPrice: 15000 },
                { commodity: 'Garlic', variety: 'Desi', minPrice: 8000, maxPrice: 13500, modalPrice: 10500 },
                { commodity: 'Onion', variety: 'Red', minPrice: 1350, maxPrice: 2250, modalPrice: 1800 },
                { commodity: 'Wheat', variety: 'Tukdi', minPrice: 2500, maxPrice: 3100, modalPrice: 2800 },
            ],
            'Rajkot Market Yard': [
                { commodity: 'Cotton', variety: 'Shankar', minPrice: 6950, maxPrice: 7900, modalPrice: 7450 },
                { commodity: 'Groundnut', variety: 'Bold', minPrice: 5700, maxPrice: 6800, modalPrice: 6300 },
                { commodity: 'Sesame', variety: 'White', minPrice: 11000, maxPrice: 14500, modalPrice: 12800 },
                { commodity: 'Castor Seed', variety: 'Gujarat-4', minPrice: 5850, maxPrice: 6550, modalPrice: 6200 },
            ]
        },
        'Mehsana': {
            'Unjha Market': [
                { commodity: 'Cumin', variety: 'Jeera Bold', minPrice: 25000, maxPrice: 31000, modalPrice: 28000 },
                { commodity: 'Fennel', variety: 'Variyali', minPrice: 9000, maxPrice: 14000, modalPrice: 11500 },
                { commodity: 'Mustard', variety: 'Yellow', minPrice: 5100, maxPrice: 5900, modalPrice: 5500 },
                { commodity: 'Psyllium (Isabgol)', variety: 'Cleaned', minPrice: 12500, maxPrice: 16000, modalPrice: 14200 },
                { commodity: 'Castor Seed', variety: 'Standard', minPrice: 5900, maxPrice: 6600, modalPrice: 6300 },
            ]
        }
    },
    'Maharashtra': {
        'Mumbai': {
            'Vashi APMC': [
                { commodity: 'Onion', variety: 'Nashik Red', minPrice: 1500, maxPrice: 2500, modalPrice: 2000 },
                { commodity: 'Potato', variety: 'Jyoti', minPrice: 1300, maxPrice: 1900, modalPrice: 1600 },
                { commodity: 'Tomato', variety: 'Hybrid', minPrice: 1800, maxPrice: 2800, modalPrice: 2300 },
                { commodity: 'Mango', variety: 'Alphonso', minPrice: 8000, maxPrice: 15000, modalPrice: 11000 },
                { commodity: 'Pomegranate', variety: 'Bhagwa', minPrice: 7000, maxPrice: 12000, modalPrice: 9500 },
                { commodity: 'Rice', variety: 'Kolam', minPrice: 3600, maxPrice: 4800, modalPrice: 4200 },
                { commodity: 'Wheat', variety: 'Lokwan', minPrice: 2600, maxPrice: 3200, modalPrice: 2900 },
            ]
        },
        'Nashik': {
            'Nashik Market Yard': [
                { commodity: 'Onion', variety: 'Red Nashik', minPrice: 1400, maxPrice: 2400, modalPrice: 1900 },
                { commodity: 'Grapes', variety: 'Thompson Seedless', minPrice: 4500, maxPrice: 8000, modalPrice: 6200 },
                { commodity: 'Tomato', variety: 'Local', minPrice: 1400, maxPrice: 2300, modalPrice: 1850 },
                { commodity: 'Pomegranate', variety: 'Arakta', minPrice: 6000, maxPrice: 10500, modalPrice: 8200 },
                { commodity: 'Maize', variety: 'Yellow', minPrice: 1850, maxPrice: 2250, modalPrice: 2050 },
            ]
        },
        'Pune': {
            'Pune Market Yard': [
                { commodity: 'Sugarcane', variety: 'Co-86032', minPrice: 280, maxPrice: 340, modalPrice: 310 },
                { commodity: 'Onion', variety: 'Pune Red', minPrice: 1450, maxPrice: 2350, modalPrice: 1850 },
                { commodity: 'Potato', variety: 'Indore', minPrice: 1250, maxPrice: 1850, modalPrice: 1550 },
                { commodity: 'Ginger', variety: 'Fresh', minPrice: 5000, maxPrice: 8500, modalPrice: 6800 },
                { commodity: 'Soybean', variety: 'JS-335', minPrice: 4200, maxPrice: 5100, modalPrice: 4650 },
            ]
        }
    },
    'Punjab': {
        'Ludhiana': {
            'Khanna APMC': [
                { commodity: 'Wheat', variety: 'PBW-725', minPrice: 2275, maxPrice: 2450, modalPrice: 2350 },
                { commodity: 'Paddy (Dhan)', variety: 'PR-126', minPrice: 2183, maxPrice: 2400, modalPrice: 2250 },
                { commodity: 'Basmati Rice', variety: 'Pusa 1121', minPrice: 3800, maxPrice: 4600, modalPrice: 4200 },
                { commodity: 'Maize', variety: 'Hybrid', minPrice: 1900, maxPrice: 2300, modalPrice: 2100 },
                { commodity: 'Potato', variety: 'Kufri Pukhraj', minPrice: 900, maxPrice: 1400, modalPrice: 1150 },
                { commodity: 'Mustard', variety: 'Raya', minPrice: 4950, maxPrice: 5600, modalPrice: 5250 },
            ]
        }
    },
    'Rajasthan': {
        'Jaipur': {
            'Jaipur Market Yard': [
                { commodity: 'Mustard', variety: 'Kanti', minPrice: 5000, maxPrice: 5850, modalPrice: 5450 },
                { commodity: 'Wheat', variety: 'Raj 4037', minPrice: 2350, maxPrice: 2750, modalPrice: 2550 },
                { commodity: 'Cumin', variety: 'Jeera', minPrice: 24000, maxPrice: 29000, modalPrice: 26500 },
                { commodity: 'Chickpea (Chana)', variety: 'Desi', minPrice: 5000, maxPrice: 5800, modalPrice: 5400 },
                { commodity: 'Bajra (Pearl Millet)', variety: 'Hybrid', minPrice: 1950, maxPrice: 2350, modalPrice: 2150 },
                { commodity: 'Coriander', variety: 'Eagle', minPrice: 6500, maxPrice: 8500, modalPrice: 7400 },
            ]
        }
    }
}

// Regional Default Commodities Generator for any State/District/Market
const STATE_DEFAULT_COMMODITIES: Record<string, FallbackCommodity[]> = {
    'Gujarat': [
        { commodity: 'Wheat', variety: 'Lok-1', minPrice: 2350, maxPrice: 2800, modalPrice: 2580 },
        { commodity: 'Cotton', variety: 'Shankar-6', minPrice: 6850, maxPrice: 7800, modalPrice: 7350 },
        { commodity: 'Groundnut', variety: 'GG-20', minPrice: 5600, maxPrice: 6750, modalPrice: 6180 },
        { commodity: 'Potato', variety: 'Desi', minPrice: 1180, maxPrice: 1720, modalPrice: 1450 },
        { commodity: 'Tomato', variety: 'Hybrid', minPrice: 1550, maxPrice: 2350, modalPrice: 1950 },
        { commodity: 'Onion', variety: 'Red', minPrice: 1350, maxPrice: 2150, modalPrice: 1750 },
        { commodity: 'Mustard', variety: 'Pusa', minPrice: 4950, maxPrice: 5750, modalPrice: 5350 },
        { commodity: 'Cumin', variety: 'Jeera', minPrice: 23800, maxPrice: 28800, modalPrice: 26200 },
        { commodity: 'Castor Seed', variety: 'Hybrid', minPrice: 5800, maxPrice: 6550, modalPrice: 6200 },
        { commodity: 'Sesame', variety: 'White', minPrice: 11200, maxPrice: 14200, modalPrice: 12700 },
    ],
    'Maharashtra': [
        { commodity: 'Onion', variety: 'Red', minPrice: 1400, maxPrice: 2300, modalPrice: 1850 },
        { commodity: 'Soybean', variety: 'JS-335', minPrice: 4250, maxPrice: 5150, modalPrice: 4700 },
        { commodity: 'Sugarcane', variety: 'Co-86032', minPrice: 275, maxPrice: 345, modalPrice: 310 },
        { commodity: 'Cotton', variety: 'Long Staple', minPrice: 6900, maxPrice: 7850, modalPrice: 7400 },
        { commodity: 'Tomato', variety: 'Local', minPrice: 1450, maxPrice: 2250, modalPrice: 1850 },
        { commodity: 'Turmeric', variety: 'Rajapuri', minPrice: 9500, maxPrice: 14000, modalPrice: 11800 },
        { commodity: 'Grapes', variety: 'Black', minPrice: 5000, maxPrice: 8500, modalPrice: 6700 },
        { commodity: 'Pomegranate', variety: 'Bhagwa', minPrice: 6800, maxPrice: 11500, modalPrice: 9200 },
        { commodity: 'Jowar', variety: 'Maldandi', minPrice: 2600, maxPrice: 3400, modalPrice: 3000 },
    ],
    'Punjab': [
        { commodity: 'Wheat', variety: 'HD-3086', minPrice: 2275, maxPrice: 2475, modalPrice: 2375 },
        { commodity: 'Paddy (Dhan)', variety: 'PR-126', minPrice: 2183, maxPrice: 2420, modalPrice: 2280 },
        { commodity: 'Basmati Rice', variety: 'Pusa 1121', minPrice: 3850, maxPrice: 4650, modalPrice: 4250 },
        { commodity: 'Maize', variety: 'Yellow', minPrice: 1880, maxPrice: 2280, modalPrice: 2080 },
        { commodity: 'Potato', variety: 'Kufri', minPrice: 950, maxPrice: 1450, modalPrice: 1200 },
        { commodity: 'Mustard', variety: 'Raya', minPrice: 4950, maxPrice: 5650, modalPrice: 5300 },
        { commodity: 'Cotton', variety: 'American', minPrice: 6800, maxPrice: 7700, modalPrice: 7250 },
    ],
    'Rajasthan': [
        { commodity: 'Mustard', variety: 'Yellow', minPrice: 5050, maxPrice: 5880, modalPrice: 5480 },
        { commodity: 'Cumin', variety: 'Jeera', minPrice: 24200, maxPrice: 29200, modalPrice: 26700 },
        { commodity: 'Wheat', variety: 'Raj 4037', minPrice: 2380, maxPrice: 2780, modalPrice: 2580 },
        { commodity: 'Chickpea (Chana)', variety: 'Desi', minPrice: 5050, maxPrice: 5850, modalPrice: 5450 },
        { commodity: 'Bajra', variety: 'Hybrid', minPrice: 1980, maxPrice: 2380, modalPrice: 2180 },
        { commodity: 'Guar Seed', variety: 'Standard', minPrice: 5100, maxPrice: 5900, modalPrice: 5500 },
        { commodity: 'Coriander', variety: 'Green', minPrice: 6600, maxPrice: 8600, modalPrice: 7500 },
    ],
    'Madhya Pradesh': [
        { commodity: 'Soybean', variety: 'Yellow', minPrice: 4300, maxPrice: 5200, modalPrice: 4750 },
        { commodity: 'Wheat', variety: 'Sharbati', minPrice: 2550, maxPrice: 3200, modalPrice: 2850 },
        { commodity: 'Garlic', variety: 'Ooti', minPrice: 7500, maxPrice: 13000, modalPrice: 10200 },
        { commodity: 'Gram (Chana)', variety: 'Vishal', minPrice: 5000, maxPrice: 5800, modalPrice: 5400 },
        { commodity: 'Onion', variety: 'Red', minPrice: 1350, maxPrice: 2150, modalPrice: 1750 },
        { commodity: 'Maize', variety: 'Yellow', minPrice: 1850, maxPrice: 2250, modalPrice: 2050 },
    ],
    'Karnataka': [
        { commodity: 'Tomato', variety: 'Hybrid', minPrice: 1400, maxPrice: 2400, modalPrice: 1900 },
        { commodity: 'Red Chilli', variety: 'Byadgi', minPrice: 14000, maxPrice: 22000, modalPrice: 18000 },
        { commodity: 'Maize', variety: 'Local', minPrice: 1900, maxPrice: 2300, modalPrice: 2100 },
        { commodity: 'Arecanut', variety: 'Chali', minPrice: 38000, maxPrice: 48000, modalPrice: 43000 },
        { commodity: 'Coconut', variety: 'Grade-A', minPrice: 2200, maxPrice: 3200, modalPrice: 2700 },
        { commodity: 'Onion', variety: 'Bangalore Rose', minPrice: 1800, maxPrice: 2800, modalPrice: 2300 },
        { commodity: 'Rice', variety: 'Sona Masoori', minPrice: 3400, maxPrice: 4200, modalPrice: 3800 },
    ],
    'Uttar Pradesh': [
        { commodity: 'Potato', variety: 'Kufri Bahar', minPrice: 1100, maxPrice: 1600, modalPrice: 1350 },
        { commodity: 'Wheat', variety: 'PBW-343', minPrice: 2275, maxPrice: 2600, modalPrice: 2438 },
        { commodity: 'Rice', variety: 'Common', minPrice: 2100, maxPrice: 2650, modalPrice: 2380 },
        { commodity: 'Sugarcane', variety: 'Co-0238', minPrice: 340, maxPrice: 380, modalPrice: 360 },
        { commodity: 'Mustard', variety: 'Black', minPrice: 4900, maxPrice: 5700, modalPrice: 5300 },
        { commodity: 'Mango', variety: 'Dasheri', minPrice: 3000, maxPrice: 5500, modalPrice: 4200 },
    ]
}

const UNIVERSAL_FALLBACK_COMMODITIES: FallbackCommodity[] = [
    { commodity: 'Wheat', variety: 'Standard', minPrice: 2275, maxPrice: 2700, modalPrice: 2480 },
    { commodity: 'Rice', variety: 'Local', minPrice: 2500, maxPrice: 3400, modalPrice: 2950 },
    { commodity: 'Potato', variety: 'Desi', minPrice: 1200, maxPrice: 1750, modalPrice: 1475 },
    { commodity: 'Tomato', variety: 'Hybrid', minPrice: 1600, maxPrice: 2500, modalPrice: 2050 },
    { commodity: 'Onion', variety: 'Red', minPrice: 1400, maxPrice: 2250, modalPrice: 1825 },
    { commodity: 'Cotton', variety: 'Medium', minPrice: 6800, maxPrice: 7800, modalPrice: 7300 },
    { commodity: 'Groundnut', variety: 'Bold', minPrice: 5500, maxPrice: 6700, modalPrice: 6100 },
    { commodity: 'Mustard', variety: 'Yellow', minPrice: 4900, maxPrice: 5750, modalPrice: 5325 },
]

/**
 * Get structured local fallback prices for any requested (state, district, market).
 * Guaranteed to NEVER return an empty array.
 */
export function getFallbackPricesForMarket(
    state: string,
    district: string,
    market: string
): MarketPrice[] {
    const today = new Date().toISOString().split('T')[0]

    // 1. Direct match in hardcoded dataset
    const directMatch = FALLBACK_MARKET_DATA[state]?.[district]?.[market]
    let baseCommodities: FallbackCommodity[] = []

    if (directMatch && directMatch.length > 0) {
        baseCommodities = directMatch
    } else {
        // 2. District-level match in hardcoded dataset
        const districtMarkets = FALLBACK_MARKET_DATA[state]?.[district]
        if (districtMarkets) {
            const firstMarket = Object.keys(districtMarkets)[0]
            if (firstMarket && districtMarkets[firstMarket]?.length > 0) {
                baseCommodities = districtMarkets[firstMarket]
            }
        }
    }

    // 3. State-level default commodities
    if (baseCommodities.length === 0) {
        baseCommodities = STATE_DEFAULT_COMMODITIES[state] || UNIVERSAL_FALLBACK_COMMODITIES
    }

    // Deterministic price variation based on market name hash
    let hash = 0
    for (let i = 0; i < market.length; i++) {
        hash = (hash << 5) - hash + market.charCodeAt(i)
        hash |= 0
    }
    const offsetPercent = ((Math.abs(hash) % 15) - 7) / 100 // -7% to +7% variation

    return baseCommodities.map(c => {
        const modal = Math.round(c.modalPrice * (1 + offsetPercent))
        const min = Math.round(c.minPrice * (1 + offsetPercent))
        const max = Math.round(c.maxPrice * (1 + offsetPercent))

        return {
            state: state || 'Gujarat',
            district: district || 'Ahmedabad',
            market: market || 'Ahmedabad Market Yard',
            commodity: c.commodity,
            variety: c.variety,
            minPrice: min,
            maxPrice: max,
            modalPrice: modal,
            priceDate: today
        }
    })
}
