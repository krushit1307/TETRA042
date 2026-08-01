// scripts/check_api_date.js
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

async function checkDate() {
    try {
        const state = 'Gujarat';
        const district = 'Surat';
        const market = 'Surat';

        // Construct URL
        const params = new URLSearchParams({
            'api-key': API_KEY,
            'format': 'json',
            'limit': '5',
            'filters[state]': state,
            'filters[district]': district,
            'filters[market]': market
        });

        const url = `${BASE_URL}?${params.toString()}`;
        console.log(`Fetching: ${url}`);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.records && data.records.length > 0) {
            console.log('--- Records Found ---');
            data.records.forEach(r => {
                console.log(`Commodity: ${r.commodity} | Date: ${r.arrival_date} | Price: ${r.modal_price}`);
            });
        } else {
            console.log('No records found for Surat.');
            console.log('Full Response:', JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error('Fetch failed:', error.message);
    }
}

checkDate();
