const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

function getAPIKey() {
    // Try both standard and public env vars to be safe, but prefer standard on server
    return process.env.DATA_GOV_API_KEY || process.env.NEXT_PUBLIC_DATA_GOV_API_KEY || ''
}

export async function fetchCropsFromAPI(state: string, district: string, market: string) {
    const apiKey = getAPIKey()
    if (!apiKey) {
        console.error('API Key missing on server')
        return null
    }

    try {
        const params = new URLSearchParams({
            'api-key': apiKey,
            format: 'json',
            limit: '1000',
            'filters[state]': state,
            'filters[district]': district,
        })

        if (market) {
            params.append('filters[market]', market)
        }

        const debugUrl = `${API_BASE_URL}?${params.toString().replace(apiKey, '***')}`
        console.log(`[fetchCropsFromAPI] Requesting: ${debugUrl}`)

        const response = await fetch(`${API_BASE_URL}?${params}`)

        if (!response.ok) {
            console.error(`[fetchCropsFromAPI] Request failed: ${response.status} ${response.statusText}`)
            return null
        }

        const data = await response.json()
        console.log(`[fetchCropsFromAPI] Success: ${data.records ? data.records.length : 0} records found`)
        return data.records || []
    } catch (error) {
        console.error('Server Action Error (fetchCrops):', error)
        return null
    }
}

export async function fetchPriceFromAPI(state: string, district: string, market: string, crop: string) {
    const apiKey = getAPIKey()
    if (!apiKey) return null

    try {
        const params = new URLSearchParams({
            'api-key': apiKey,
            format: 'json',
            limit: '10',
            'filters[state]': state,
            'filters[district]': district,
            'filters[market]': market,
            'filters[commodity]': crop,
        })

        const response = await fetch(`${API_BASE_URL}?${params}`)

        if (!response.ok) return null

        const data = await response.json()
        return data.records || []
    } catch (error) {
        console.error('Server Action Error (fetchPrice):', error)
        return null
    }
}

export async function fetchNearbyMarketsFromAPI(state: string, crop: string) {
    const apiKey = getAPIKey()
    if (!apiKey) return null

    try {
        const params = new URLSearchParams({
            'api-key': apiKey,
            format: 'json',
            limit: '50',
            'filters[state]': state,
            'filters[commodity]': crop,
        })

        const response = await fetch(`${API_BASE_URL}?${params}`)

        if (!response.ok) return null

        const data = await response.json()
        return data.records || []
    } catch (error) {
        console.error('Server Action Error (fetchNearby):', error)
        return null
    }
}
