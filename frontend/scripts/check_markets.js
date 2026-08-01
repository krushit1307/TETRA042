
const API_KEY = process.env.DATA_GOV_API_KEY || '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

const DISTRICTS = [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar',
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
    'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
];

async function checkDistrict(district) {
    const params = new URLSearchParams({
        'api-key': API_KEY,
        'format': 'json',
        'limit': '1000', // Fetch enough to see unique markets
        'filters[state]': 'Gujarat',
        'filters[district]': district,
    });

    try {
        const response = await fetch(`${API_URL}?${params.toString()}`);
        if (!response.ok) {
            return { district, status: 'ERROR', error: `HTTP ${response.status}`, markets: [] };
        }

        const data = await response.json();
        const records = data.records || [];
        const markets = [...new Set(records.map(r => r.market))].sort();

        return {
            district,
            status: markets.length > 0 ? 'ACTIVE' : 'NO DATA',
            count: markets.length,
            markets: markets
        };
    } catch (error) {
        return { district, status: 'ERROR', error: error.message, markets: [] };
    }
}

async function run() {
    console.log(`Scanning ${DISTRICTS.length} districts in Gujarat for Market Data...\n`);

    const results = [];

    // Run sequentially to avoid rate limiting
    for (const district of DISTRICTS) {
        process.stdout.write(`Checking ${district.padEnd(20)} ... `);
        const result = await checkDistrict(district);
        results.push(result);

        if (result.status === 'ACTIVE') {
            console.log(`✅ FOUND ${result.count} markets: ${result.markets.slice(0, 3).join(', ')}${result.count > 3 ? '...' : ''}`);
        } else if (result.status === 'NO DATA') {
            console.log(`⚠️  NO DATA`);
        } else {
            console.log(`❌ ERROR: ${result.error}`);
        }

        // Small delay to be nice to the API
        await new Promise(r => setTimeout(r, 200));
    }

    console.log('\n--- Summary ---');
    const active = results.filter(r => r.status === 'ACTIVE');
    const empty = results.filter(r => r.status === 'NO DATA');
    const errors = results.filter(r => r.status === 'ERROR');

    console.log(`Active Districts: ${active.length}`);
    console.log(`Empty Districts:  ${empty.length}`);
    console.log(`Errors:           ${errors.length}`);

    if (empty.length > 0) {
        console.log('\nDistricts with NO DATA today:');
        console.log(empty.map(r => r.district).join(', '));
    }
}

run();
