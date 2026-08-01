
import { supabase } from "@/lib/supabase";


export interface NewsArticle {
    id?: string; // Optional for new articles
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string; // Internal link or external
    urlToImage: string | null;
    videoUrl?: string | null; // Added for video support
    publishedAt: string;
    content: string | null;
    language: string;
    is_top_news: boolean;
}

export type SupportedLanguage =
    | 'en' // English
    | 'hi' // Hindi
    | 'gu' // Gujarati
    | 'mr' // Marathi
    | 'pa' // Punjabi
    | 'ta' // Tamil
    | 'te' // Telugu
    | 'kn' // Kannada
    | 'bn' // Bengali
    | 'or' // Odia

export const LANGUAGES: { code: SupportedLanguage; name: string; localName: string }[] = [
    { code: 'en', name: 'English', localName: 'English' },
    { code: 'gu', name: 'Gujarati', localName: 'ગુજરાતી' },
    { code: 'hi', name: 'Hindi', localName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', localName: 'मराठी' },
    { code: 'pa', name: 'Punjabi', localName: 'ਪੰਜਾਬੀ' },
    { code: 'ta', name: 'Tamil', localName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', localName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', localName: 'ಕನ್ನಡ' },
    { code: 'bn', name: 'Bengali', localName: 'বাংলা' },
    { code: 'or', name: 'Odia', localName: 'ଓଡ଼ିଆ' },
]

// --- UI TRANSLATIONS ---
export const UI_TRANSLATIONS: Record<SupportedLanguage, { readMore: string; readFull: string; share: string; close: string; loading: string; noNews: string }> = {
    en: { readMore: "Read More", readFull: "Read Full Article", share: "Share", close: "Close", loading: "Loading...", noNews: "No news found" },
    hi: { readMore: "और पढ़ें", readFull: "पूरा लेख पढ़ें", share: "साझा करें", close: "बंद करें", loading: "लोड हो रहा है...", noNews: "कोई समाचार नहीं मिला" },
    gu: { readMore: "વધુ વાંચો", readFull: "સંપૂર્ણ લેખ વાંચો", share: "શેર કરો", close: "બંધ કરો", loading: "લોડ થઈ રહ્યું છે...", noNews: "કોઈ સમાચાર મળ્યા નથી" },
    mr: { readMore: "अधिक वाचा", readFull: "पूर्ण लेख वाचा", share: "शेअर करा", close: "बंद करा", loading: "लोड होत आहे...", noNews: "कोणतीही बातमी सापडली नाही" },
    pa: { readMore: "ਹੋਰ ਪੜ੍ਹੋ", readFull: "ਪੂਰਾ ਲੇਖ ਪੜ੍ਹੋ", share: "ਸਾਂਝਾ ਕਰੋ", close: "ਬੰਦ ਕਰੋ", loading: "ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...", noNews: "ਕੋਈ ਖ਼ਬਰ ਨਹੀਂ ਮਿਲੀ" },
    ta: { readMore: "மேலும் படிக்க", readFull: "முழு கட்டுரையை படிக்கவும்", share: "பகிர்", close: "மூடு", loading: "ஏற்றப்படுகிறது...", noNews: "செய்திகள் எதுவும் இல்லை" },
    te: { readMore: "మరింత చదవండి", readFull: "పూర్తి కథనాన్ని చదవండి", share: "భాగస్వామ్యం చేయండి", close: "మూసివేయి", loading: "లోడ్ అవుతోంది...", noNews: "వార్తలు కనుగొనబడలేదు" },
    kn: { readMore: "ಮತ್ತಷ್ಟು ಓದಿ", readFull: "ಪೂರ್ಣ ಲೇಖನ ಓದಿ", share: "ಹಂಚಿಕೊಳ್ಳಿ", close: "ಮುಚ್ಚಿ", loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...", noNews: "ಯಾವುದೇ ಸುದ್ದಿ ಕಂಡುಬಂದಿಲ್ಲ" },
    bn: { readMore: "আরও পড়ুন", readFull: "সম্পূর্ণ নিবন্ধ পড়ুন", share: "শেয়ার করুন", close: "বন্ধ করুন", loading: "লোড হচ্ছে...", noNews: "কোন খবর পাওয়া যায়নি" },
    or: { readMore: "ଅଧିକ ପଢନ୍ତୁ", readFull: "ସମ୍ପୂର୍ଣ୍ଣ ଲେଖା ପଢନ୍ତୁ", share: "ସେୟାର କରନ୍ତୁ", close: "ବନ୍ଦ କରନ୍ତୁ", loading: "ଲୋଡ୍ ହେଉଛି ...", noNews: "କୌଣସି ଖବର ମିଳିଲା ନାହିଁ" },
};

export async function fetchAgricultureNews(language: SupportedLanguage): Promise<NewsArticle[]> {
    try {
        // 1. Fetch any overrides/new items from Supabase
        const { data: dbData, error } = await supabase
            .from('news')
            .select('*')
            .eq('language', language)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Supabase error:", error);
            // Fallback to pure mock data if DB fails
            return getMockNews(language);
        }

        const dbNewsMap = new Map((dbData || []).map((item: any) => [item.id, item]));

        // 2. Get Mock Data
        const mockNews = getMockNews(language);

        // 3. Merge: Prefer DB item if ID matches, otherwise use Mock. Add new DB items.
        const mergedNews: NewsArticle[] = [];
        const processedIds = new Set<string>();

        // Process Mock items (overriding with DB if exists)
        mockNews.forEach(mockItem => {
            const dbItemRaw = dbNewsMap.get(mockItem.id as string);
            processedIds.add(mockItem.id as string);

            if (dbItemRaw) {
                // Use DB item but mapped to our interface
                mergedNews.push({
                    id: dbItemRaw.id,
                    source: { id: 'sasyaai', name: dbItemRaw.source_name || 'Sasya AI News' },
                    author: dbItemRaw.author || 'Admin',
                    title: dbItemRaw.title,
                    description: dbItemRaw.content ? dbItemRaw.content.substring(0, 150) + "..." : "",
                    url: dbItemRaw.article_url || `/news/${dbItemRaw.id}`,
                    urlToImage: dbItemRaw.image_url,
                    videoUrl: dbItemRaw.video_url,
                    publishedAt: dbItemRaw.created_at,
                    content: dbItemRaw.content,
                    language: dbItemRaw.language,
                    is_top_news: dbItemRaw.is_top_news
                });
            } else {
                mergedNews.push(mockItem);
            }
        });

        // Process remaining DB items (newly added by Admin)
        dbData?.forEach((item: any) => {
            if (!processedIds.has(item.id)) {
                mergedNews.push({
                    id: item.id,
                    source: { id: 'sasyaai', name: item.source_name || 'Sasya AI News' },
                    author: item.author || 'Admin',
                    title: item.title,
                    description: item.content ? item.content.substring(0, 150) + "..." : "",
                    url: item.article_url || `/news/${item.id}`,
                    urlToImage: item.image_url,
                    videoUrl: item.video_url,
                    publishedAt: item.created_at,
                    content: item.content,
                    language: item.language,
                    is_top_news: item.is_top_news
                });
            }
        });

        // Sort by is_top_news then date
        return mergedNews.sort((a, b) => {
            if (a.is_top_news === b.is_top_news) {
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            }
            return a.is_top_news ? -1 : 1;
        });

    } catch (error) {
        console.error("Failed to fetch news:", error);
        return getMockNews(language);
    }
}

export async function fetchAllNewsForAdmin(): Promise<NewsArticle[]> {
    // Uses the same merge logic but for 'en' (or we could fetch all langs if needed, but usually admin manages one base)
    // For simplicity, let's treat Admin as managing 'en' base or just listing all DB items + non-overridden overrides?
    // Actually, Admin needs to see EVERYTHING.
    // Simplifying: Admin mostly edits 'en' or specific language items. Use 'en' merge for now.
    return fetchAgricultureNews('en');
}

// --- Admin Operations ---

export async function addNews(news: Omit<NewsArticle, 'id' | 'source' | 'author' | 'url' | 'publishedAt'> & { imageFile?: File, videoFile?: File, articleUrl?: string, publishedAt?: string }) {
    let imageUrl = news.urlToImage;
    let videoUrl = news.videoUrl;

    // Upload Image
    if (news.imageFile) {
        const fileExt = news.imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `news-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(filePath, news.imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
    }

    // Upload Video (if any)
    if (news.videoFile) {
        const fileExt = news.videoFile.name.split('.').pop();
        const fileName = `vid-${Math.random()}.${fileExt}`;
        const filePath = `news-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(filePath, news.videoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
        videoUrl = data.publicUrl;
    }

    const { data, error } = await supabase
        .from('news')
        .insert([
            {
                title: news.title,
                content: news.content,
                image_url: imageUrl,
                video_url: videoUrl,
                article_url: news.articleUrl,
                language: news.language,
                is_top_news: news.is_top_news,
                created_at: news.publishedAt || new Date().toISOString()
            }
        ])
        .select();

    if (error) throw error;
    return data;
}

export async function updateNews(id: string, news: Partial<NewsArticle> & { imageFile?: File, videoFile?: File, articleUrl?: string }) {
    let imageUrl = news.urlToImage;
    let videoUrl = news.videoUrl;

    // Upload Image if changed
    if (news.imageFile) {
        const fileExt = news.imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `news-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(filePath, news.imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
    }

    // Upload Video if changed
    if (news.videoFile) {
        const fileExt = news.videoFile.name.split('.').pop();
        const fileName = `vid-${Math.random()}.${fileExt}`;
        const filePath = `news-videos/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('news-images')
            .upload(filePath, news.videoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('news-images').getPublicUrl(filePath);
        videoUrl = data.publicUrl;
    }

    const updates: any = {
        title: news.title,
        content: news.content,
        language: news.language,
        is_top_news: news.is_top_news,
        article_url: news.articleUrl,
        ...(imageUrl && { image_url: imageUrl }),
        ...(videoUrl && { video_url: videoUrl }),
        ...(news.publishedAt && { created_at: news.publishedAt })
    };

    // 1. Try to Update
    const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        console.warn("Update failed:", error);
        return null; // Or throw
    }

    // 2. If no data returned (meaning row didn't exist, e.g. it was a pure Mock item), we need to UPSERT/INSERT it.
    if (!data || data.length === 0) {
        // Find the original mock item to fill in missing fields
        // We assume 'en' as base or try to find the item in MASTER_NEWS_DATA directly.
        // But MASTER_NEWS_DATA items don't strictly have a 'language' property on the root, they have translations.
        // Effectively, when we edit a mock item, we are "instantiating" it into the DB.

        const mockItem = MASTER_NEWS_DATA.find(m => m.id === id);

        if (mockItem) {
            const lang = news.language || 'en';
            // @ts-ignore
            const translation = mockItem.translations[lang] || mockItem.translations['en'];

            const newItemPayload = {
                id: id, // KEEP the same ID so future updates work
                title: updates.title || translation.title,
                content: updates.content || translation.content,
                image_url: updates.image_url || mockItem.image,
                video_url: updates.video_url, // Mock doesn't have video usually, but ok
                article_url: updates.article_url || mockItem.link,
                language: lang,
                is_top_news: updates.is_top_news ?? mockItem.is_top,
                created_at: updates.created_at || mockItem.date
            };

            const { data: insertData, error: insertError } = await supabase
                .from('news')
                .insert([newItemPayload])
                .select();

            if (insertError) {
                console.error("Failed to materialize mock item:", insertError);
                throw insertError;
            }
            return insertData;
        }
    }

    return data;
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
    // 1. Try fetching from Supabase
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

    if (!error && data) {
        return {
            id: data.id,
            source: { id: 'sasyaai', name: 'Sasya AI News' },
            author: 'Admin',
            title: data.title,
            description: data.content ? data.content.substring(0, 150) + "..." : "",
            url: data.article_url || `/news/${data.id}`,
            urlToImage: data.image_url,
            videoUrl: data.video_url,
            publishedAt: data.created_at,
            content: data.content,
            language: data.language,
            is_top_news: data.is_top_news
        };
    }

    // 2. Fallback: Search in Mock Data
    const allMock = getMockNews('en');
    const mockItem = allMock.find(n => n.id === id);
    return mockItem || null;
}

export async function deleteNews(id: string) {
    if (id.startsWith('mock-') || id.length < 5) {
        // It's a mock item, treat as success
        return true;
    }
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw error;
    return true;
}

// --- Mock Data ---
// --- Mock Data ---

const MASTER_NEWS_DATA = [
    {
        id: "00000000-0000-0000-0000-000000000001",
        publisher: "Tractor Junction",
        author: "Editorial Team",
        date: "2026-01-29T00:00:00Z",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800",
        link: "https://www.tractorjunction.com/agriculture-news/farmers-7-big-expectations-from-budget-2026/",
        is_top: true,
        translations: {
            en: { title: "Farmers' 7 Big Expectations from Union Budget 2026", content: "Farmers across India listed key expectations from Budget 2026 including higher PM-KISAN support, MSP expansion, better crop insurance, irrigation funding and affordable credit." },
            hi: { title: "केंद्रीय बजट 2026 से किसानों की 7 बड़ी उम्मीदें", content: "किसानों ने पीएम-किसान सहायता बढ़ाने, एमएसपी विस्तार, बेहतर फसल बीमा और सिंचाई निवेश की मांग की।" },
            gu: { title: "કેન્દ્રીય બજેટ 2026 થી ખેડૂતોની 7 મોટી અપેક્ષાઓ", content: "ખેડૂતોએ PM-KISAN વધારો, MSP વિસ્તરણ અને પાક વીમા સુધારણાની માંગ કરી છે." },
            mr: { title: "केंद्रीय अर्थसंकल्प 2026 कडून शेतकऱ्यांच्या 7 मोठ्या अपेक्षा", content: "पीएम-किसान वाढ, एमएसपी विस्तार आणि सिंचन निधीची मागणी." },
            pa: { title: "ਕੇਂਦਰੀ ਬਜਟ 2026 ਤੋਂ ਕਿਸਾਨਾਂ ਦੀਆਂ 7 ਵੱਡੀਆਂ ਉਮੀਦਾਂ", content: "PM-KISAN ਵਧਾਉਣ ਅਤੇ MSP ਵਿਸਤਾਰ ਦੀ ਮੰਗ ਕੀਤੀ ਗਈ ਹੈ।" },
            ta: { title: "மத்திய பட்ஜெட் 2026 - விவசாயிகளின் 7 முக்கிய எதிர்பார்ப்புகள்", content: "PM-KISAN உயர்வு மற்றும் MSP விரிவாக்கம் கோரிக்கை." },
            te: { title: "కేంద్ర బడ్జెట్ 2026పై రైతుల 7 ప్రధాన ఆశలు", content: "PM-KISAN పెంపు మరియు MSP విస్తరణ డిమాండ్." },
            kn: { title: "ಕೇಂದ್ರ ಬಜೆಟ್ 2026 ರಿಂದ ರೈತರ 7 ಪ್ರಮುಖ ನಿರೀಕ್ಷೆಗಳು", content: "PM-KISAN ಹೆಚ್ಚಳ ಮತ್ತು MSP ವಿಸ್ತರಣೆ ಬೇಡಿಕೆ." },
            bn: { title: "কেন্দ্রীয় বাজেট 2026 থেকে কৃষকদের 7টি বড় প্রত্যাশা", content: "PM-KISAN বৃদ্ধি এবং MSP সম্প্রসারণের দাবি।" },
            or: { title: "କେନ୍ଦ୍ରୀୟ ବଜେଟ୍ 2026 ରୁ ଚାଷୀଙ୍କ 7 ଟି ବଡ ଆଶା", content: "PM-KISAN ବୃଦ୍ଧି ଏବଂ MSP ସମ୍ପ୍ରସାରଣ ଦାବି।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000002",
        publisher: "Aaj Tak",
        author: "Weather Desk",
        date: "2026-01-31T00:00:00Z",
        image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800",
        link: "https://www.aajtak.in/agriculture/agriculture-rural-news/story/february-2026-weather-forecast-india-imd-rabi-crops-farmers-impact-2454039",
        is_top: true,
        translations: {
            en: { title: "Weather Alert: Low Rainfall and High Temperature May Affect Rabi Crops", content: "IMD warned that February may witness lower rainfall and higher temperatures affecting wheat, mustard and gram crops." },
            hi: { title: "मौसम चेतावनी: रबी फसलों पर असर", content: "कम बारिश और ज्यादा तापमान से गेहूं और चने की फसल प्रभावित हो सकती है।" },
            gu: { title: "હવામાન ચેતવણી: રવિ પાકને અસર", content: "ઓછો વરસાદ અને ઊંચા તાપમાનથી ઘઉં અને ચણાના પાકને નુકસાન થઈ શકે છે." },
            mr: { title: "हवामान इशारा: रब्बी पिकांवर परिणाम", content: "कमी पाऊस आणि उच्च तापमानामुळे गहू आणि हरभरा पिकांवर परिणाम होऊ शकतो." },
            pa: { title: "ਮੌਸਮ ਚੇਤਾਵਨੀ: ਰਬੀ ਫਸਲਾਂ 'ਤੇ ਅਸਰ", content: "ਘੱਟ ਬਾਰਸ਼ ਅਤੇ ਵੱਧ ਤਾਪਮਾਨ ਕਾਰਨ ਕਣਕ ਦੀ ਫਸਲ ਪ੍ਰਭਾਵਿਤ ਹੋ ਸਕਦੀ ਹੈ।" },
            ta: { title: "வானிலை எச்சரிக்கை: ரபி பயிர்கள் பாதிப்பு", content: "குறைந்த மழைப்பொழிவு மற்றும் அதிக வெப்பநிலை ரபி பயிர்களை பாதிக்கலாம்." },
            te: { title: "వాతావరణ హెచ్చరిక: రబీ పంటలపై ప్రభావం", content: "తక్కువ వర్షపాతం మరియు అధిక ఉష్ణోగ్రతలు రబీ పంటలను దెబ్బతీస్తాయి." },
            kn: { title: "ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ: ರಬಿ ಬೆಳೆಗಳ ಮೇಲೆ ಪರಿಣಾಮ", content: "ಕಡಿಮೆ ಮಳೆ ಮತ್ತು ಹೆಚ್ಚಿನ ತಾಪಮಾನವು ರಬಿ ಬೆಳೆಗಳಿಗೆ ಹಾನಿ ಮಾಡಬಹುದು." },
            bn: { title: "আবহাওয়া সতর্কতা: রবি শস্যের ক্ষতি", content: "কম বৃষ্টিপাত এবং উচ্চ তাপমাত্রা গম ও সরিষার ক্ষতি করতে পারে।" },
            or: { title: "ପାଣିପାଗ ସତର୍କତା: ରବି ଫସଲ ଉପରେ ପ୍ରଭାବ", content: "କମ୍ ବର୍ଷା ଓ ଅଧିକ ତାପମାତ୍ରା ଯୋଗୁଁ ଫସଲ ନଷ୍ଟ ହୋଇପାରେ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000003",
        publisher: "Times of India",
        author: "Maharashtra Bureau",
        date: "2026-01-31T00:00:00Z",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800",
        link: "https://timesofindia.indiatimes.com/city/nashik/unseasonal-jan-end-rainfall-damages-rabi-crops/articleshow/127948453.cms",
        is_top: false,
        translations: {
            en: { title: "Unseasonal Rain Damages Rabi Crops in Maharashtra", content: "Unseasonal rainfall damaged wheat, onion and pulse crops across Maharashtra." },
            hi: { title: "बेमौसम बारिश से रबी फसलों को नुकसान", content: "महाराष्ट्र में गेहूं और प्याज की फसल प्रभावित हुई।" },
            gu: { title: "કમોસમી વરસાદથી મહારાષ્ટ્રમાં પાક નુકસાન", content: "મહારાષ્ટ્રમાં ઘઉં અને ડુંગળીના પાકને નુકસાન." },
            mr: { title: "अवकाळी पावसाने रब्बी पिकांचे नुकसान", content: "विदर्भ आणि मराठवाड्यात गारपिटीमुळे पिकांचे मोठे नुकसान." },
            pa: { title: "ਬੇਮੌਸਮੀ ਬਾਰਸ਼ ਨਾਲ ਮਹਾਰਾਸ਼ਟਰ ਵਿੱਚ ਫਸਲਾਂ ਦਾ ਨੁਕਸਾਨ", content: "ਮਹਾਰਾਸ਼ਟਰ ਵਿੱਚ ਕਣਕ ਅਤੇ ਪਿਆਜ਼ ਦੀ ਫਸਲ ਬਰਬਾਦ." },
            ta: { title: "மகாராஷ்டிராவில் பருவமிலா மழையால் பயிர் சேதம்", content: "மகாராஷ்டிராவில் கோதுமை மற்றும் வெங்காய பயிர்கள் சேதம்." },
            te: { title: "మహారాష్ట్రలో అకాల వర్షాలతో పంట నష్టం", content: "గోధుమ, ఉల్లి పంటలకు తీవ్ర నష్టం." },
            kn: { title: "ಮಹಾರಾಷ್ಟ್ರದಲ್ಲಿ ಅಕಾಲಿಕ ಮಳೆಯಿಂದ ಬೆಳೆ ಹಾನಿ", content: "ಗೋಧಿ ಮತ್ತು ಈರುಳ್ಳಿ ಬೆಳೆಗಳಿಗೆ ಹಾನಿ." },
            bn: { title: "মহারাষ্ট্রে অকাল বৃষ্টিতে শস্যের ক্ষতি", content: "গম ও পেঁয়াজ চাষ ক্ষতিগ্রস্ত।" },
            or: { title: "ମହାରାଷ୍ଟ୍ରରେ ଅଦିନିଆ ବର୍ଷା ଯୋଗୁଁ ଫସଲ ନଷ୍ଟ", content: "ଗହମ ଓ ପିଆଜ ଚାଷ କ୍ଷତିଗ୍ରସ୍ତ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000004",
        publisher: "Business Standard",
        author: "Industry Desk",
        date: "2026-02-01T00:00:00Z",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
        link: "https://www.business-standard.com/industry/agriculture/india-logs-record-phosphatic-potassic-fertiliser-output-in-january-2026-126020601625_1.html",
        is_top: false,
        translations: {
            en: { title: "India Records Highest Phosphatic and Potassic Fertiliser Output", content: "Record fertiliser production improved availability for farmers." },
            hi: { title: "उर्वरक उत्पादन में रिकॉर्ड", content: "खाद की उपलब्धता बढ़ी।" },
            gu: { title: "ખાતર ઉત્પાદનમાં રેકોર્ડ", content: "ખેડૂતો માટે ખાતરની ઉપલબ્ધતા વધી." },
            mr: { title: "खत उत्पादनात उच्चांक", content: "शेतकऱ्यांसाठी खत उपलब्धता वाढली." },
            pa: { title: "ਖਾਦ ਉਤਪਾਦਨ ਵਿੱਚ ਰਿਕਾਰਡ", content: "ਕਿਸਾਨਾਂ ਲਈ ਖਾਦ ਦੀ ਉਪਲਬਧਤਾ ਵਧੀ." },
            ta: { title: "உர உற்பத்தியில் சாதனை", content: "விவசாயிகளுக்கு உரத் தட்டுப்பாடு குறையும்." },
            te: { title: "ఎరువుల ఉత్పత్తిలో రికార్డు", content: "రైతులకు ఎరువుల లభ్యత పెరిగింది." },
            kn: { title: "ಗೊಬ್ಬರ ಉತ್ಪಾದನೆಯಲ್ಲಿ ದಾಖಲೆ", content: "ರೈತರಿಗೆ ಗೊಬ್ಬರ ಲಭ್ಯತೆ ಹೆಚ್ಚಳ." },
            bn: { title: "সার উৎপাদনে রেকর্ড", content: "কৃষকদের জন্য সারের প্রাপ্যতা বৃদ্ধি." },
            or: { title: "ସାର ଉତ୍ପାଦନରେ ରେକର୍ଡ", content: "ଚାଷୀଙ୍କ ପାଇଁ ସାର ଉପଲବ୍ଧତା ବୃଦ୍ଧି।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000005",
        publisher: "Moneycontrol",
        author: "Opinion Desk",
        date: "2026-02-02T00:00:00Z",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
        link: "https://www.moneycontrol.com/news/opinion/india-us-interim-agreement-likely-impact-on-agriculture-13817187.html",
        is_top: false,
        translations: {
            en: { title: "India–US Interim Trade Deal: Likely Impact on Agriculture", content: "Experts analysed the effect of the trade deal on Indian agriculture." },
            hi: { title: "भारत-अमेरिका व्यापार समझौते का असर", content: "कृषि पर प्रभाव का विश्लेषण।" },
            gu: { title: "ભારત-અમેરિકા વેપાર કરારની અસર", content: "કૃષિ ક્ષેત્રે અસરોનું વિશ્લેષણ." },
            mr: { title: "भारत-अमेरिका व्यापार कराराचा परिणाम", content: "कृषी क्षेत्रावरील परिणामांचे विश्लेषण." },
            pa: { title: "ਭਾਰਤ-ਅਮਰੀਕਾ ਵਪਾਰ ਸਮਝੌਤੇ ਦਾ ਅਸਰ", content: "ਖੇਤੀਬਾੜੀ 'ਤੇ ਪ੍ਰਭਾਵ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ." },
            ta: { title: "இந்தியா-அமெரிக்க வர்த்தக ஒப்பந்தத்தின் தாக்கம்", content: "விவசாயத்தில் ஏற்படும் தாக்கம் குறித்த ஆய்வு." },
            te: { title: "భారత్-అమెరికా వాణిజ్య ఒప్పందం ప్రభావం", content: "వ్యవసాయంపై ప్రభావం విశ్లేషణ." },
            kn: { title: "ಭಾರತ-ಅಮೇರಿಕಾ ವ್ಯಾಪಾರ ಒಪ್ಪಂದದ ಪರಿಣಾಮ", content: "ಕೃಷಿ ಕ್ಷೇತ್ರದ ಮೇಲಿನ ಪರಿಣಾಮದ ವಿಶ್ಲೇಷಣೆ." },
            bn: { title: "ভারত-আমেরিকা বাণিজ্য চুক্তির প্রভাব", content: "কৃষিতে প্রভাবের বিশ্লেষণ।" },
            or: { title: "ଭାରତ-ଆମେରିକା ବ୍ୟାପାର ଚୁକ୍ତିର ପ୍ରଭାବ", content: "କୃଷି ଉପରେ ପ୍ରଭାବର ବିଶ୍ଳେଷଣ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000006",
        publisher: "Krishak Jagat",
        author: "Trade Desk",
        date: "2026-02-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800",
        link: "https://www.krishakjagat.org/national-news/the-india-us-trade-agreement-is-being-finalized-on-paper-with-preparations-underway-to-eliminate-tariffs-on-us-agricultural-products/",
        is_top: false,
        translations: {
            en: { title: "India–US Trade Agreement Being Finalised, Zero Tariff on US Farm Goods Considered", content: "India and the US are finalising a trade agreement with discussions on reducing or eliminating tariffs on selected agricultural imports." },
            hi: { title: "भारत-अमेरिका व्यापार समझौता अंतिम चरण में", content: "कुछ कृषि आयातों पर शुल्क घटाने या हटाने पर चर्चा चल रही है।" },
            gu: { title: "ભારત-અમેરિકા વેપાર કરાર અંતિમ તબક્કામાં", content: "કેટલાક કૃષિ આયાત પર ટેરિફ ઘટાડવાની ચર્ચા." },
            mr: { title: "भारत-अमेरिका व्यापार करार अंतिम टप्प्यात", content: "कृषी आयातीवरील शुल्क कमी करण्याची शक्यता." },
            pa: { title: "ਭਾਰਤ-ਅਮਰੀਕਾ ਵਪਾਰ ਸਮਝੌਤਾ ਅੰਤਿਮ ਪੜਾਅ ਵਿੱਚ", content: "ਖੇਤੀਬਾੜੀ ਆਯਾਤ ‘ਤੇ ਟੈਰਿਫ ਘਟਾਉਣ ਦੀ ਗੱਲਬਾਤ." },
            ta: { title: "இந்தியா-அமெரிக்க வர்த்தக ஒப்பந்தம் இறுதி கட்டத்தில்", content: "சில விவசாய இறக்குமதிகளுக்கு சுங்கம் குறைக்கலாம்." },
            te: { title: "భారత్-అమెరికా వాణిజ్య ఒప్పందం తుది దశలో", content: "కొన్ని వ్యవసాయ దిగుమతులపై సుంకం తగ్గింపు చర్చ." },
            kn: { title: "ಭಾರತ-ಅಮೇರಿಕಾ ವ್ಯಾಪಾರ ಒಪ್ಪಂದ ಅಂತಿಮ ಹಂತದಲ್ಲಿ", content: "ಕೆಲವು ಕೃಷಿ ಆಮದುಗಳ ಮೇಲಿನ ತೆರಿಗೆ ಕಡಿತ ಚರ್ಚೆ." },
            bn: { title: "ভারত-আমেরিকা বাণিজ্য চুক্তি চূড়ান্ত পর্যায়ে", content: "কিছু কৃষি পণ্যে শুল্ক হ্রাসের আলোচনা।" },
            or: { title: "ଭାରତ-ଆମେରିକା ବ୍ୟାପାର ଚୁକ୍ତି ଅନ୍ତିମ ପର୍ଯ୍ୟାୟରେ", content: "କିଛି କୃଷି ଆମଦାନୀରେ ଶୁଳ୍କ କମାଇବା ଆଲୋଚନା।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000007",
        publisher: "Krishak Jagat",
        author: "Policy Desk",
        date: "2026-02-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=800",
        link: "https://www.krishakjagat.org/national-news/the-us-india-trade-deal-will-benefit-farmers-fishermen-and-the-dairy-sector-says-union-minister-goyal/",
        is_top: false,
        translations: {
            en: { title: "Government Says India–US Trade Deal Will Benefit Farmers and Dairy Sector", content: "The government stated that the trade deal will protect farmer interests and benefit agriculture, fisheries and dairy sectors." },
            hi: { title: "सरकार का दावा: व्यापार समझौते से किसानों को फायदा", content: "कृषि और डेयरी क्षेत्र को लाभ मिलेगा।" },
            gu: { title: "સરકારનો દાવો: વેપાર કરારથી ખેડૂતોને લાભ", content: "કૃષિ અને ડેરી ક્ષેત્રને ફાયદો." },
            mr: { title: "सरकारचा दावा: व्यापार करार शेतकऱ्यांसाठी फायदेशीर", content: "कृषी व दुग्धव्यवसायाला लाभ." },
            pa: { title: "ਸਰਕਾਰ ਦਾ ਦਾਅਵਾ: ਵਪਾਰ ਸਮਝੌਤੇ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਲਾਭ", content: "ਖੇਤੀ ਅਤੇ ਡੇਅਰੀ ਖੇਤਰ ਨੂੰ ਫਾਇਦਾ." },
            ta: { title: "அரசு: வர்த்தக ஒப்பந்தம் விவசாயிகளுக்கு நன்மை", content: "பால் மற்றும் மீன்வளத்திற்கும் ஆதரவு." },
            te: { title: "ప్రభుత్వం: వాణిజ్య ఒప్పందం రైతులకు లాభం", content: "వ్యవసాయం, డెయిరీ రంగాలకు మేలు." },
            kn: { title: "ಸರ್ಕಾರ: ವ್ಯಾಪಾರ ಒಪ್ಪಂದ ರೈತರಿಗೆ ಲಾಭ", content: "ಕೃಷಿ ಮತ್ತು ಹಾಲು ಉತ್ಪಾದನೆಗೆ ಬೆಂಬಲ." },
            bn: { title: "সরকার: বাণিজ্য চুক্তি কৃষকদের উপকারে", content: "ডেয়ারি ও মৎস্য খাত উপকৃত।" },
            or: { title: "ସରକାର: ବ୍ୟାପାର ଚୁକ୍ତି ଚାଷୀଙ୍କୁ ଲାଭ", content: "ଡେୟାରି ଓ ମତ୍ସ୍ୟ କ୍ଷେତ୍ର ଉପକୃତ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000008",
        publisher: "Aaj Tak",
        author: "Trade Analysis",
        date: "2026-02-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&q=80&w=800",
        link: "https://www.aajtak.in/agriculture/agriculture-rural-news/story/wto-agriculture-agreement-india-us-farmer-subsidy-trade-deal-impact-indian-farmers-2459099",
        is_top: false,
        translations: {
            en: { title: "How International Trade Agreements Are Impacting Indian Farmers", content: "The report explained how WTO rules and trade agreements affect farm subsidies and MSP." },
            hi: { title: "अंतरराष्ट्रीय समझौते किसानों को कैसे प्रभावित कर रहे हैं", content: "सब्सिडी और एमएसपी पर असर." },
            gu: { title: "આંતરરાષ્ટ્રીય કરારો ખેડૂતો પર કેવી અસર કરે છે", content: "સબસિડી અને MSP પર અસર." },
            mr: { title: "आंतरराष्ट्रीय करारांचा शेतकऱ्यांवर परिणाम", content: "अनुदान व एमएसपीवर परिणाम." },
            pa: { title: "ਅੰਤਰਰਾਸ਼ਟਰੀ ਸਮਝੌਤਿਆਂ ਦਾ ਕਿਸਾਨਾਂ ‘ਤੇ ਅਸਰ", content: "ਸਬਸਿਡੀ ਅਤੇ MSP ਪ੍ਰਭਾਵ." },
            ta: { title: "சர்வதேச வர்த்தக ஒப்பந்தங்களின் விவசாய தாக்கம்", content: "MSP மற்றும் மானியங்கள் பாதிப்பு." },
            te: { title: "అంతర్జాతీయ ఒప్పందాల వ్యవసాయ ప్రభావం", content: "సబ్సిడీలు, MSPపై ప్రభావం." },
            kn: { title: "ಅಂತರರಾಷ್ಟ್ರೀಯ ಒಪ್ಪಂದಗಳ ಕೃಷಿ ಪರಿಣಾಮ", content: "MSP ಮತ್ತು ಸಬ್ಸಿಡಿ ಪರಿಣಾಮ." },
            bn: { title: "আন্তর্জাতিক চুক্তির কৃষিতে প্রভাব", content: "MSP ও ভর্তুকির প্রভাব." },
            or: { title: "ଆନ୍ତର୍ଜାତୀୟ ଚୁକ୍ତିର କୃଷି ପ୍ରଭାବ", content: "MSP ଓ ସବସିଡି ଉପରେ ପ୍ରଭାବ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000009",
        publisher: "Times of India",
        author: "Farm Bureau",
        date: "2026-02-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
        link: "https://timesofindia.indiatimes.com/business/india-business/farmers-question-import-of-animal-feed-soybean-oil/articleshow/128048802.cms",
        is_top: false,
        translations: {
            en: { title: "Farmers Question Import of Animal Feed and Soybean Oil Under Trade Deal", content: "Farmers raised concerns that increased imports could crash domestic prices." },
            hi: { title: "किसानों ने पशु आहार और सोयाबीन आयात पर सवाल उठाए", content: "घरेलू कीमतें गिरने की आशंका." },
            gu: { title: "પશુ આહાર અને સોયાબીન આયાત પર ખેડૂતોની ચિંતા", content: "ભાવ ઘટવાની ભીતિ." },
            mr: { title: "पशुखाद्य व सोयाबीन आयातीवर शेतकऱ्यांची चिंता", content: "देशांतर्गत दर घसरण्याची भीती." },
            pa: { title: "ਪਸ਼ੂ ਚਾਰੇ ਅਤੇ ਸੋਯਾਬੀਨ ਆਯਾਤ ‘ਤੇ ਕਿਸਾਨਾਂ ਦੀ ਚਿੰਤਾ", content: "ਦੇਸੀ ਕੀਮਤਾਂ ਡਿੱਗਣ ਦਾ ਡਰ." },
            ta: { title: "மிருக உணவு மற்றும் சோயாபீன் இறக்குமதி குறித்து விவசாயிகள் கவலை", content: "உள்நாட்டு விலை வீழ்ச்சி பயம்." },
            te: { title: "పశు ఆహారం, సోయాబీన్ దిగుమతులపై రైతుల ఆందోళన", content: "దేశీయ ధరలు పడిపోతాయన్న భయం." },
            kn: { title: "ಪಶು ಆಹಾರ ಮತ್ತು ಸೋಯಾಬೀನ್ ಆಮದು ಬಗ್ಗೆ ರೈತರ ಆತಂಕ", content: "ಬೆಲೆ ಕುಸಿತದ ಭೀತಿ." },
            bn: { title: "পশুখাদ্য ও সয়াবিন আমদানিতে কৃষকদের উদ্বেগ", content: "দেশীয় দাম পড়ে যাওয়ার আশঙ্কা." },
            or: { title: "ପଶୁ ଆହାର ଓ ସୋୟାବିନ ଆମଦାନୀ ଉପରେ ଚାଷୀଙ୍କ ଚିନ୍ତା", content: "ଦେଶୀୟ ଦର କମିବାର ଭୟ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000010",
        publisher: "Times of India",
        author: "Chandigarh Bureau",
        date: "2026-02-05T00:00:00Z",
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800",
        link: "https://timesofindia.indiatimes.com/city/chandigarh/interim-trade-deal-with-us-total-surrender-by-govt-farm-forums-demand-resignation/articleshow/128044838.cms",
        is_top: false,
        translations: {
            en: { title: "Farm Forums Call India–US Trade Deal a Surrender", content: "Farmer groups criticised the trade deal and demanded stronger protection." },
            hi: { title: "किसान संगठनों ने व्यापार समझौते की आलोचना की", content: "अधिक सुरक्षा की मांग." },
            gu: { title: "ખેડૂત સંગઠનોની વેપાર કરાર પર ટીકા", content: "વધુ સુરક્ષા માંગ." },
            mr: { title: "शेतकरी संघटनांची व्यापार करारावर टीका", content: "अधिक संरक्षणाची मागणी." },
            pa: { title: "ਕਿਸਾਨ ਜਥੇਬੰਦੀਆਂ ਵੱਲੋਂ ਵਪਾਰ ਸਮਝੌਤੇ ਦੀ ਆਲੋਚਨਾ", content: "ਹੋਰ ਸੁਰੱਖਿਆ ਦੀ ਮੰਗ." },
            ta: { title: "இந்தியா-அமெரிக்க வர்த்தக ஒப்பந்தத்திற்கு எதிர்ப்பு", content: "விவசாயிகள் பாதுகாப்பு கோரிக்கை." },
            te: { title: "భారత్-అమెరికా వాణిజ్య ఒప్పందంపై రైతుల విమర్శ", content: "రక్షణ చర్యల డిమాండ్." },
            kn: { title: "ಭಾರತ-ಅಮೇರಿಕಾ ವ್ಯಾಪಾರ ಒಪ್ಪಂದಕ್ಕೆ ರೈತರ ವಿರೋಧ", content: "ಹೆಚ್ಚು ರಕ್ಷಣೆಯ ಬೇಡಿಕೆ." },
            bn: { title: "ভারত-আমেরিকা চুক্তির বিরোধিতা কৃষকদের", content: "অধিক সুরক্ষার দাবি." },
            or: { title: "ଭାରତ-ଆମେରିକା ଚୁକ୍ତିକୁ ଚାଷୀଙ୍କ ବିରୋଧ", content: "ଅଧିକ ସୁରକ୍ଷା ଦାବି।" }
        }
    }
];

function getMockNews(lang: string): NewsArticle[] {
    return MASTER_NEWS_DATA.map(item => {
        // @ts-ignore - Dynamic access to translations
        const translation = item.translations[lang] || item.translations['en'];

        return {
            id: item.id,
            source: { id: 'mock', name: item.publisher },
            author: item.author,
            title: translation.title,
            description: translation.content,
            url: item.link,
            urlToImage: item.image,
            publishedAt: item.date,
            content: translation.content,
            language: lang,
            is_top_news: item.is_top
        };
    });
}
