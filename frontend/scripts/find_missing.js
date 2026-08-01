const fs = require('fs');
const path = require('path');

// Adjusted paths assuming script is in ./scripts/
const marketsPath = path.join(__dirname, '../lib/indian-markets-data.ts');
const translationsPath = path.join(__dirname, '../lib/translations.ts');

const marketsContent = fs.readFileSync(marketsPath, 'utf8');
const translationsContent = fs.readFileSync(translationsPath, 'utf8');

const marketSuffixes = [' Market Yard', ' APMC', ' Market', ' Mandi'];

// 1. Extract Market Names
// Simple regex to find strings ending with suffixes.
// Since file content might use single or double quotes, match both.
const marketNameRegex = /['"]([^'"]+)['"]/g;
let match;
const allMarkets = [];
while ((match = marketNameRegex.exec(marketsContent)) !== null) {
    const s = match[1];
    if (marketSuffixes.some(suffix => s.endsWith(suffix))) {
        allMarkets.push(s);
    }
}

// 2. Extract Keys
function getKeys(content, objectName) {
    // Find "export const objectName ... = {" ignoring type definitions
    // Look for the pattern: objectName (any chars) = {
    // We use [\s\S] to match newlines if split across lines
    const startRegex = new RegExp(`export const ${objectName}[\\s\\S]*?=\\s*\\{`);
    const startMatch = content.match(startRegex);
    if (!startMatch) return [];

    const startIndex = startMatch.index + startMatch[0].length;
    let openBraces = 1;
    let index = startIndex;
    let block = '';

    while (openBraces > 0 && index < content.length) {
        const char = content[index];
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (openBraces > 0) block += char; // capturing inside block
        index++;
    }

    // Extract keys: 'Key': or "Key":
    const keys = [];
    const keyRegex = /['"]([^'"]+)['"]\s*:/g;
    let keyMatch;
    while ((keyMatch = keyRegex.exec(block)) !== null) {
        keys.push(keyMatch[1]);
    }
    return keys;
}

const placeKeys = getKeys(translationsContent, 'placeNameTranslations');
const districtKeys = getKeys(translationsContent, 'districtTranslations');
const knownPrefixes = new Set([...placeKeys, ...districtKeys]);

// 3. Find Missing
const missing = new Set();
const missingRaw = [];

allMarkets.forEach(market => {
    // Check if covered by known prefix
    let isCovered = false;
    for (const key of knownPrefixes) {
        if (market.startsWith(key)) {
            isCovered = true;
            break;
        }
    }

    if (!isCovered) {
        // Extract the prefix part
        let prefix = market;
        for (const suffix of marketSuffixes) {
            if (market.endsWith(suffix)) {
                prefix = market.substring(0, market.length - suffix.length);
                break;
            }
        }
        missing.add(prefix);
        missingRaw.push({ market, prefix });
    }
});

const sortedMissing = [...missing].sort();

console.log(JSON.stringify(sortedMissing, null, 2));
// console.log(`Total missing prefixes: ${sortedMissing.length}`);
// console.log(`Total missing markets: ${missingRaw.length}`);
