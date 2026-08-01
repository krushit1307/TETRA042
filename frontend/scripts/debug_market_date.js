const https = require('https');

const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// Test with a known market (e.g. Surat, Gujarat)
const state = 'Gujarat';
const district = 'Surat';
const market = 'Surat';

const url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=5&filters[state]=${state}&filters[district]=${district}&filters[market]=${market}`;

console.log(`Fetching data from: ${url}`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.records && json.records.length > 0) {
                console.log('--- API Response Records (First 3) ---');
                json.records.slice(0, 3).forEach(r => {
                    console.log(`Commodity: ${r.commodity}, Date: ${r.arrival_date}, Modal Price: ${r.modal_price}`);
                });
            } else {
                console.log('No records found.');
                console.log('Full response:', JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err);
});
