
const fs = require('fs');
const path = require('path');

// Read the data file content (since we can't import TS directly easily in simple node script without compilation, we'll regex it or just paste the data structure if it was small, but it's large)
// Actually, I can just read the file as text and parse the JSON-like structure or just regex for the keys.
// The structure is: export const STATE_DISTRICTS_MARKETS: { [state: string]: { [district: string]: string[] } } = { ... }

const dataPath = path.join(__dirname, '../lib/indian-markets-data.ts');
const content = fs.readFileSync(dataPath, 'utf8');

// Regex to find " 'DistrictName': ["
// This matches the structure in the file: 'Ahmedabad': ['...'],
const districtRegex = /^\s*'([^']+)'\s*:\s*\[/gm;

const allDistricts = new Set();
let match;

while ((match = districtRegex.exec(content)) !== null) {
    if (match[1] !== 'Gujarat' && match[1] !== 'Maharashtra' && !match[1].includes(' Pradesh')) { // Exclude state keys if they accidentally match, but the indentation makes them distinct usually. 
        // Actually, state keys are 'StateName': {
        // District keys are 'DistrictName': [
        // My regex includes the `[` so it should only match districts.
        allDistricts.add(match[1]);
    }
}

// Manual verify some might be missed if formatting differs
const districts = Array.from(allDistricts).sort();

console.log(`Found ${districts.length} districts.`);
console.log(JSON.stringify(districts, null, 2));
