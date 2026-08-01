
const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../market_translations_source.md');
const content = fs.readFileSync(sourcePath, 'utf8');

// Function to convert language name header to code
const langMap = {
    'Gujarati': 'gu',
    'Hindi': 'hi',
    'Marathi': 'mr',
    'Punjabi': 'pa',
    'Tamil': 'ta',
    'Telugu': 'te',
    'Kannada': 'kn',
    'Bengali': 'bn',
    'Odia': 'or',
    'English': 'en' // Though usually we key by English name
};

// Regex to match table rows
// | Place Name | English | Gujarati | ...
const rowRegex = /^\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/gm;

const translations = {};
const lines = content.split('\n');

lines.forEach(line => {
    // Basic check for data row (starts with | and doesn't contain --)
    if (line.trim().startsWith('|') && !line.includes('---') && !line.includes('Place Name')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p !== '');
        if (parts.length >= 11) {
            const key = parts[0]; // Place Name column as key
            translations[key] = {
                en: parts[1],
                gu: parts[2],
                hi: parts[3],
                mr: parts[4],
                pa: parts[5],
                ta: parts[6],
                te: parts[7],
                kn: parts[8],
                bn: parts[9],
                or: parts[10]
            };
        }
    }
});

let tsOutput = "// Auto-generated place name translations\n";
tsOutput += "export const placeNameTranslations: { [key: string]: { [lang: string]: string } } = {\n";

Object.keys(translations).sort().forEach(key => {
    const t = translations[key];
    tsOutput += `    '${key}': { en: '${t.en}', gu: '${t.gu}', hi: '${t.hi}', mr: '${t.mr}', pa: '${t.pa}', ta: '${t.ta}', te: '${t.te}', kn: '${t.kn}', bn: '${t.bn}', or: '${t.or}' },\n`;
});

tsOutput += "}\n";

console.log(tsOutput);
