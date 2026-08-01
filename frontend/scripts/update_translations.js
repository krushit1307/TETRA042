const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../lib/translations.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Define replacements map
    const replacements = {
        "en: 'Welcome to Market Yard'": "en: 'Welcome to Sasya AI Market Yard'",
        "gu: 'માર્કેટ યાર્ડમાં આપનું સ્વાગત છે'": "gu: 'Sasya AI માર્કેટ યાર્ડમાં આપનું સ્વાગત છે'",
        "hi: 'मार्केट यार्ड में आपका स्वागत है'": "hi: 'Sasya AI मार्केट यार्ड में आपका स्वागत है'",
        "mr: 'बाजार यार्ड मध्ये आपले स्वागत आहे'": "mr: 'Sasya AI बाजार यार्ड मध्ये आपले स्वागत आहे'",
        "pa: 'ਮਾਰਕੀਟ ਯਾਰਡ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ'": "pa: 'Sasya AI ਮਾਰਕੀਟ ਯਾਰਡ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ'",
        "ta: 'சந்தை முற்றத்திற்கு வரவேற்கிறோம்'": "ta: 'Sasya AI சந்தை முற்றத்திற்கு வரவேற்கிறோம்'",
        "te: 'మార్కెట్ యార్డ్‌కు స్వాగతం'": "te: 'Sasya AI మార్కెట్ యార్డ్‌కు స్వాగతం'",
        "kn: 'ಮಾರುಕಟ್ಟೆ ಅಂಗಳಕ್ಕೆ ಸ್ವಾಗತ'": "kn: 'Sasya AI ಮಾರುಕಟ್ಟೆ ಅಂಗಳಕ್ಕೆ ಸ್ವಾಗತ'",
        "bn: 'মার্কেট ইয়ার্ডে স্বাগতম'": "bn: 'Sasya AI মার্কেট ইয়ার্ডে স্বাগতম'"
    };

    let updatedContent = content;
    let changesCount = 0;

    for (const [search, replace] of Object.entries(replacements)) {
        if (updatedContent.includes(search)) {
            updatedContent = updatedContent.replace(search, replace);
            changesCount++;
            console.log(`Replaced: ${search.substring(0, 20)}...`);
        } else {
            console.log(`Not found (might already be updated): ${search.substring(0, 20)}...`);
        }
    }

    if (changesCount > 0) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Successfully updated ${changesCount} translations.`);
    } else {
        console.log("No changes needed or strings not found.");
    }

} catch (err) {
    console.error("Error updating translations:", err);
    process.exit(1);
}
