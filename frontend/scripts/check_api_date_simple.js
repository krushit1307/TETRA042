const https = require('https');

const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const state = 'Gujarat';
const district = 'Surat';
const market = 'Surat';

const url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=5&filters[state]=${state}&filters[district]=${district}&filters[market]=${market}`;

console.log(`Fetching: ${url}`);

const options = {
    rejectUnauthorized: false // Ignore SSL certificate errors
};

https.get(url, options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Request Failed. Status Code: ${res.statusCode}`);
            return;
        }
        try {
            const json = JSON.parse(data);
            if (json.records && json.records.length > 0) {
                console.log('--- API Success ---');
                console.log(`First Record Date: ${json.records[0].arrival_date}`);
                console.log(`First Record Price: ${json.records[0].modal_price}`);
            } else {
                console.log('API Success but No Records Found.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });

}).on('error', (err) => {
    console.error('Network Error:', err.message);
});
