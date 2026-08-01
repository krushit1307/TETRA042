
const fs = require('fs');
const path = require('path');

const marketsDataPath = path.join(__dirname, '../lib/indian-markets-data.ts');
const translationsPath = path.join(__dirname, '../lib/translations.ts');

const marketsContent = fs.readFileSync(marketsDataPath, 'utf8');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

// internal regex from previous step
const districtRegex = /^\s*'([^']+)'\s*:\s*\[/gm;
const allDistricts = new Set();
let match;
while ((match = districtRegex.exec(marketsContent)) !== null) {
    if (match[1] !== 'Gujarat' && match[1] !== 'Maharashtra' && !match[1].includes(' Pradesh') && match[1] !== 'West Bengal' && match[1] !== 'Tamil Nadu' && match[1] !== 'Karnataka' && match[1] !== 'Telangana' && match[1] !== 'Kerala' && match[1] !== 'Assam' && match[1] !== 'Chhattisgarh' && match[1] !== 'Jharkhand' && match[1] !== 'Uttarakhand' && match[1] !== 'Himachal Pradesh' && match[1] !== 'Goa' && match[1] !== 'Bihar' && match[1] !== 'Odisha' && match[1] !== 'Punjab' && match[1] !== 'Haryana' && match[1] !== 'Rajasthan') {
        allDistricts.add(match[1]);
    }
}

// Regex to find keys in districtTranslations
// Matches: 'Ahmedabad': {
const translationKeyRegex = /^\s*'([^']+)'\s*:\s*\{/gm;
const translatedDistricts = new Set();
// We need to look only inside the districtTranslations block
// Let's find the content between "export const districtTranslations" and the closing "}"
const districtBlockMatch = translationsContent.match(/export const districtTranslations[\s\S]*?^}/m);

if (districtBlockMatch) {
    const block = districtBlockMatch[0];
    while ((match = translationKeyRegex.exec(block)) !== null) {
        translatedDistricts.add(match[1]);
    }
}

const missing = [];
allDistricts.forEach(d => {
    if (!translatedDistricts.has(d)) {
        missing.push(d);
    }
});

console.log(JSON.stringify(missing.sort(), null, 2));
