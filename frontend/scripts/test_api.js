// const fetch = require('node-fetch'); // Use native fetch 
const API_BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
// Using the key from the earlier successful logs or env
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Test fetching by District only to see available market names
async function testDistrict(state, district) {
    console.log(`Testing fetch for District: ${state}, ${district}`);
    const apiKey = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    const params = new URLSearchParams({
        'api-key': apiKey,
        format: 'json',
        limit: '1000', // Increased limit
        'filters[state]': state,
        'filters[district]': district,
    });

    try {
        const url = `${API_BASE_URL}?${params}`;
        console.log(`URL: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return;
        }
        const data = await response.json();
        const records = data.records || [];
        // Log unique market names found
        const markets = [...new Set(records.map(r => r.market))];
        console.log(`Markets found in ${district} (Count: ${markets.length}):`, markets);
    } catch (e) {
        console.error('Exception:', e);
    }
}

// Global search for market name in State
async function searchMarket(state, marketQuery) {
    console.log(`Searching for market containing '${marketQuery}' in ${state}`);
    const apiKey = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

    const params = new URLSearchParams({
        'api-key': apiKey,
        format: 'json',
        limit: '2000', // Search broadly
        'filters[state]': state,
    });

    try {
        const url = `${API_BASE_URL}?${params}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error: ${response.status}`);
            return;
        }
        const data = await response.json();
        const records = data.records || [];

        // Filter locally because API filters are exact match usually
        const matches = records.filter(r => r.market && r.market.toLowerCase().includes(marketQuery.toLowerCase()));

        const uniqueMatches = [...new Set(matches.map(r => `${r.market} (${r.district})`))];
        console.log(`Matches for '${marketQuery}':`, uniqueMatches);
    } catch (e) {
        console.error('Exception:', e);
    }
}

// Run tests
(async () => {
    await testDistrict('Gujarat', 'Bhavnagar');
    await searchMarket('Gujarat', 'Bhavnagar');
})();
