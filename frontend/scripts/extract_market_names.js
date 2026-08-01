
const fs = require('fs');
const path = require('path');

// Read the data file content directly
const dataFilePath = path.join(__dirname, '../lib/indian-markets-data.ts');
const content = fs.readFileSync(dataFilePath, 'utf8');

// Regex to find the arrays of market names
// Matches: 'DistrictName': ['Market1', 'Market2', ...]
const marketRegex = /'[^']+':\s*\[(.*?)\]/g;
const stringRegex = /'([^']+)'/g;

const allMarkets = new Set();

let match;
while ((match = marketRegex.exec(content)) !== null) {
    const marketArrayString = match[1];
    let marketMatch;
    while ((marketMatch = stringRegex.exec(marketArrayString)) !== null) {
        allMarkets.add(marketMatch[1]);
    }
}

// Function to clean market names (remove suffixes)
function getBaseName(fullName) {
    return fullName
        .replace(/ Market Yard$/i, '')
        .replace(/ APMC$/i, '')
        .replace(/ Market$/i, '')
        .replace(/ Mandi$/i, '')
        .trim();
}

const uniqueBaseNames = new Set();

allMarkets.forEach(market => {
    const base = getBaseName(market);
    uniqueBaseNames.add(base);
});

const sortedBaseNames = Array.from(uniqueBaseNames).sort();

// Create the output content
let output = "# Unique Market Place Names (For Translation)\n\n";
output += "Please provide translations for the following place names. The suffixes (Market Yard, APMC, etc.) are handled separately.\n\n";
// Using a simpler list format for easier copy-pasting if there are many
output += "| Place Name | Gujarati | Hindi | Marathi | (Add others) |\n";
output += "|---|---|---|---|---|\n";

sortedBaseNames.forEach(name => {
    output += `| ${name} |  |  |  |  |\n`;
});

const outputPath = path.join(__dirname, '../market_translation_template.md');
fs.writeFileSync(outputPath, output);

console.log(`Extracted ${allMarkets.size} total markets.`);
console.log(`Found ${uniqueBaseNames.size} unique base names.`);
console.log(`Template saved to: ${outputPath}`);
