const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

// We want to remove lines 128-132 (inclusive, 1-based index)
// And lines 1141-1239 (inclusive, 1-based index)

// Adjust to 0-based index
const range1Start = 127;
const range1End = 132; // Slice is exclusive at end, so 132 means up to 131. Wait, let's be precise.
// 128 -> index 127.
// 132 -> index 131.
// We want to remove 127, 128, 129, 130, 131. 
// lines.splice(127, 5).

// range2: 1141-1239.
// 1141 -> index 1140.
// 1239 -> index 1238.
// Count: 1238 - 1140 + 1 = 99 lines.

// We should check content to be sure.
console.log('Line 128:', lines[127]); // Should be '}'
console.log('Line 130:', lines[129]); // Should be 'export function t...'

console.log('Line 1141:', lines[1140]); // Should be '    welcomeTitle: {'
console.log('Line 1239:', lines[1238]); // Should be '    },'

// Splice from end to start to avoid index shifting.

// Remove range 2
// Check if line 1140 fits logic.
if (lines[1140].trim().startsWith('welcomeTitle:')) {
    console.log('Removing bottom duplicate block...');
    lines.splice(1140, 99);
} else {
    console.log('Bottom block not found at expected index, skipping or adjusting...');
    // Search for welcomeTitle near 1140
}

// Remove range 1
if (lines[127].trim() === '}') {
    console.log('Removing top premature close...');
    lines.splice(127, 5);
} else {
    console.log('Top block not found at expected index');
}

fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
console.log('Fixed translations.ts');
