const fs = require('fs');
const path = require('path');

const missingPath = path.join(__dirname, '../missing.json');
// Output to the artifact directory passed as argument
const outputPath = process.argv[2];

if (!outputPath) {
    console.error("Please provide output path");
    process.exit(1);
}

const fileContent = fs.readFileSync(missingPath, 'utf8');
const missing = JSON.parse(fileContent.replace(/^\uFEFF/, ''));
const langs = ['gu', 'hi', 'mr', 'pa', 'ta', 'te', 'kn', 'bn', 'or'];

let content = `// Missing Place Name Translations
// Copy this object into lib/translations.ts (inside placeNameTranslations) or merge it.

export const missingPlaceNameTranslations = {\n`;

missing.forEach(place => {
    // Generate line: 'Place': { en: 'Place', gu: '', ... },
    let line = `    '${place}': { en: '${place}', `;
    langs.forEach(l => line += `${l}: '', `);
    line = line.slice(0, -2); // remove last comma
    line += ` },\n`;
    content += line;
});

content += `}\n`;

fs.writeFileSync(outputPath, content, 'utf8');
console.log(`Generated template at ${outputPath}`);
