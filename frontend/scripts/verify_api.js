
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b'; // Fallback to key seen in logs
const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

async function checkMarket(state, district, marketQuery) {
    console.log(`\n--- Checking Data for: ${district}, ${marketQuery} ---`);
    const params = new URLSearchParams({
        'api-key': API_KEY,
        'format': 'json',
        'limit': '10',
        'filters[state]': state,
        'filters[district]': district,
    });

    // We fetch district data first to see what's actually there
    const url = `${API_URL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log(`Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.log(`Response: ${text}`);
            return;
        }

        const data = await response.json();
        const records = data.records || [];
        console.log(`Records found in ${district}: ${records.length}`);

        if (records.length > 0) {
            console.log('Sample Markets in District:');
            // Show unique unique markets in this district
            const markets = [...new Set(records.map(r => r.market))];
            markets.slice(0, 10).forEach(m => console.log(` - ${m}`));

            // Check if our specific market exists
            const match = markets.find(m => m.toLowerCase().includes(marketQuery.toLowerCase()));
            if (match) {
                console.log(`\n✅ SUCCESS: Found market matching "${marketQuery}": "${match}"`);
            } else {
                console.log(`\n❌ FAILURE: No market found matching "${marketQuery}" in ${district}`);
                console.log(`Available markets are: ${markets.join(', ')}`);
            }
        } else {
            console.log(`\n❌ FAILURE: API returned 0 records for District: ${district}`);
        }

    } catch (error) {
        console.error('Fetch error:', error.message);
    }
}

async function runTests() {
    console.log('Starting API Verification...');
    await checkMarket('Gujarat', 'Amreli', 'Lathi');
    await checkMarket('Gujarat', 'Bhavnagar', 'Bhavnagar');
    await checkMarket('Gujarat', 'Surat', 'Surat');
    console.log('\nVerification Complete.');
}

runTests();
