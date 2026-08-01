const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/translations.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Helper to find line index containing exact text
function findLine(text, start = 0) {
    for (let i = start; i < lines.length; i++) {
        if (lines[i].includes(text)) return i;
    }
    return -1;
}

// 1. Locate start of stateTranslations (line ~24)
const stateTransStart = findLine('export const stateTranslations');
// 2. Locate line 45 ('Goa')
const goaLineIdx = findLine("'Goa': {", stateTransStart);

if (goaLineIdx === -1) {
    console.error('Could not find Goa line');
    process.exit(1);
}

// 3. Identify the block to extract/delete
// We verified lines 46-229 are the mess.
// Line 46 starts 'welcomeTitle'.
// Line 229 is '}'.
// Line 230 is empty? 
// Line 231 is 'import ...'.

const blockStart = goaLineIdx + 1; // 46
const importLine = findLine('import { allDistrictTranslations }', blockStart);
// Note: Imports might be at 231.
const blockEnd = importLine - 1; // 230

// Verify block content
console.log('Block Start Line:', lines[blockStart]); // '    welcomeTitle: {'
console.log('Block End Line:', lines[blockEnd]); // Should be empty or '}'

// Extract Content
// We want:
// A: 46 (welcomeTitle) to 126 (end of topMarketPrices)
// B: 161 (step1Title) to 226 (end of step3Desc)

// Find 126: end of topMarketPrices.
// Look for 'topMarketPrices'
const topPriceIdx = findLine('topMarketPrices:', blockStart);
// Find matching closing brace for topMarketPrices
// It ends around line 126.
let ptr = topPriceIdx;
while (!lines[ptr].trim().startsWith('},')) {
    ptr++;
}
const endOfPartA = ptr; // 126

// Find start of step1Title
const step1Idx = findLine('step1Title:', blockStart);
const startOfPartB = step1Idx; // 161

// Find end of step3Desc
const step3Idx = findLine('step3Desc:', blockStart);
ptr = step3Idx;
while (!lines[ptr].trim().startsWith('},')) {
    ptr++;
}
const endOfPartB = ptr; // 226

// Construct extracted content
const partA = lines.slice(blockStart, endOfPartA + 1).join('\n');
const partB = lines.slice(startOfPartB, endOfPartB + 1).join('\n');

const extractedContent = partA + '\n' + partB;

// 4. Modify lines
// A. Insert '};' at blockStart position (closing stateTranslations)
// B. Delete from blockStart to blockEnd (inclusive)
// But wait, step 4A inserts a line.

// Let's create a new array.
const newLines = [];
// Copy up to goaLineIdx (inclusive)
for (let i = 0; i <= goaLineIdx; i++) {
    newLines.push(lines[i]);
}
// Close stateTranslations
newLines.push('};'); // This replaces the implicit continuation

// Push lines AFTER empty block (imports, functions...)
// importLine is where we resume.
// But we need to find where 'export const translations' starts (the second one).
const transStart = findLine('export const translations:', importLine);

// Copy from importLine to transStart (exclusive)
for (let i = importLine; i < transStart; i++) {
    newLines.push(lines[i]);
}

// Push 'export const translations: ... = {'
newLines.push(lines[transStart]);

// INSERT EXTRACTED CONTENT HERE
newLines.push(extractedContent);

// Copy the rest of the file
for (let i = transStart + 1; i < lines.length; i++) {
    newLines.push(lines[i]);
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('Fixed translations.ts final');
