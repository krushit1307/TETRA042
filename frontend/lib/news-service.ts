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
    | 'en'
    | 'gu'
    | 'hi'
    | 'mr'
    | 'pa'
    | 'ta'
    | 'te'
    | 'kn'
    | 'bn'
    | 'or'

export { LANGUAGES } from '@/lib/i18n/languages'

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

interface StoredNewsItem {
    id: string
    title: string
    content: string
    image_url: string | null
    video_url: string | null
    article_url: string | null
    language: string
    is_top_news: boolean
    created_at: string
    source_name?: string
    author?: string
}

const NEWS_STORAGE_KEY = "sasya_news_data"
const DELETED_NEWS_KEY = "sasya_deleted_news_ids"

function getStoredNews(): StoredNewsItem[] {
    if (typeof window === "undefined") return []
    try {
        const data = localStorage.getItem(NEWS_STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

function saveStoredNews(items: StoredNewsItem[]) {
    if (typeof window === "undefined") return
    localStorage.setItem(NEWS_STORAGE_KEY, JSON.stringify(items))
}

function getDeletedIds(): Set<string> {
    if (typeof window === "undefined") return new Set()
    try {
        const data = localStorage.getItem(DELETED_NEWS_KEY)
        return new Set(data ? JSON.parse(data) : [])
    } catch {
        return new Set()
    }
}

function addDeletedId(id: string) {
    const deleted = getDeletedIds()
    deleted.add(id)
    if (typeof window !== "undefined") {
        localStorage.setItem(DELETED_NEWS_KEY, JSON.stringify([...deleted]))
    }
}

function generateId(): string {
    return crypto.randomUUID()
}

async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function storedToArticle(item: StoredNewsItem): NewsArticle {
    return {
        id: item.id,
        source: { id: "sasyaai", name: item.source_name || "Sasya AI News" },
        author: item.author || "Admin",
        title: item.title,
        description: item.content ? item.content.substring(0, 150) + "..." : "",
        url: item.article_url || `#news-${item.id}`,
        urlToImage: item.image_url,
        videoUrl: item.video_url,
        publishedAt: item.created_at,
        content: item.content,
        language: item.language,
        is_top_news: item.is_top_news,
    }
}

export async function fetchAgricultureNews(language: SupportedLanguage): Promise<NewsArticle[]> {
    try {
        const deletedIds = getDeletedIds()
        const storedForLang = getStoredNews().filter(
            (item) => item.language === language && !deletedIds.has(item.id)
        )
        const storedMap = new Map(storedForLang.map((item) => [item.id, item]))

        const mockNews = getMockNews(language).filter(
            (item) => !deletedIds.has(item.id as string)
        )

        const mergedNews: NewsArticle[] = []
        const processedIds = new Set<string>()

        mockNews.forEach((mockItem) => {
            const storedItem = storedMap.get(mockItem.id as string)
            processedIds.add(mockItem.id as string)

            if (storedItem) {
                const article = storedToArticle(storedItem)
                // Prefer master image unless admin uploaded a custom image
                if (mockItem.urlToImage && !storedItem.image_url?.startsWith("data:")) {
                    article.urlToImage = mockItem.urlToImage
                }
                mergedNews.push(article)
            } else {
                mergedNews.push(mockItem)
            }
        })

        storedForLang.forEach((item) => {
            if (!processedIds.has(item.id)) {
                mergedNews.push(storedToArticle(item))
            }
        })

        return mergedNews.sort((a, b) => {
            if (a.is_top_news === b.is_top_news) {
                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
            }
            return a.is_top_news ? -1 : 1
        })
    } catch (error) {
        console.error("Failed to fetch news:", error)
        return getMockNews(language)
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
    let imageUrl = news.urlToImage
    let videoUrl = news.videoUrl

    if (news.imageFile) {
        imageUrl = await fileToDataUrl(news.imageFile)
    }

    if (news.videoFile) {
        videoUrl = await fileToDataUrl(news.videoFile)
    }

    const newItem: StoredNewsItem = {
        id: generateId(),
        title: news.title,
        content: news.content || "",
        image_url: imageUrl,
        video_url: videoUrl || null,
        article_url: news.articleUrl || null,
        language: news.language,
        is_top_news: news.is_top_news,
        created_at: news.publishedAt || new Date().toISOString(),
        source_name: "Sasya AI News",
        author: "Admin",
    }

    const stored = getStoredNews()
    stored.push(newItem)
    saveStoredNews(stored)

    return [storedToArticle(newItem)]
}

export async function updateNews(id: string, news: Partial<NewsArticle> & { imageFile?: File, videoFile?: File, articleUrl?: string }) {
    let imageUrl = news.urlToImage
    let videoUrl = news.videoUrl

    if (news.imageFile) {
        imageUrl = await fileToDataUrl(news.imageFile)
    }

    if (news.videoFile) {
        videoUrl = await fileToDataUrl(news.videoFile)
    }

    const stored = getStoredNews()
    const existingIndex = stored.findIndex((item) => item.id === id)

    if (existingIndex >= 0) {
        const existing = stored[existingIndex]
        const updated: StoredNewsItem = {
            ...existing,
            title: news.title ?? existing.title,
            content: news.content ?? existing.content,
            language: news.language ?? existing.language,
            is_top_news: news.is_top_news ?? existing.is_top_news,
            article_url: news.articleUrl ?? existing.article_url,
            image_url: imageUrl ?? existing.image_url,
            video_url: videoUrl ?? existing.video_url,
            created_at: news.publishedAt ?? existing.created_at,
        }
        stored[existingIndex] = updated
        saveStoredNews(stored)
        return [storedToArticle(updated)]
    }

    const mockItem = MASTER_NEWS_DATA.find((m) => m.id === id)
    if (mockItem) {
        const lang = news.language || "en"
        // @ts-ignore
        const translation = mockItem.translations[lang] || mockItem.translations["en"]

        const newItem: StoredNewsItem = {
            id,
            title: news.title || translation.title,
            content: news.content || translation.content,
            image_url: imageUrl || mockItem.image,
            video_url: videoUrl || null,
            article_url: news.articleUrl || mockItem.link,
            language: lang,
            is_top_news: news.is_top_news ?? mockItem.is_top,
            created_at: news.publishedAt || mockItem.date,
            source_name: mockItem.publisher,
            author: mockItem.author,
        }
        stored.push(newItem)
        saveStoredNews(stored)
        return [storedToArticle(newItem)]
    }

    return null
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
    const stored = getStoredNews().find((item) => item.id === id)
    if (stored) {
        return storedToArticle(stored)
    }

    const allMock = getMockNews("en")
    const mockItem = allMock.find((n) => n.id === id)
    return mockItem || null
}

export async function deleteNews(id: string) {
    addDeletedId(id)
    const stored = getStoredNews().filter((item) => item.id !== id)
    saveStoredNews(stored)
    return true
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
    },
    {
        id: "00000000-0000-0000-0000-000000000011",
        publisher: "The Indian Express",
        author: "Policy Desk",
        date: "2026-06-20T00:00:00Z",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
        link: "https://indianexpress.com/article/india/cabinet-approves-extension-of-pm-kisan-for-5-years-10812821/",
        is_top: true,
        translations: {
            en: { title: "Cabinet Approves PM-KISAN Extension for Five More Years", content: "The Union Cabinet approved continuation of PM-KISAN from 2026-27 to 2030-31 with a financial outlay of Rs 3.15 lakh crore. Over Rs 4.47 lakh crore has already been transferred to farmers through 23 instalments, benefiting more than 9.49 crore farmer families via Direct Benefit Transfer." },
            hi: { title: "कैबिनेट ने PM-KISAN को 5 साल और बढ़ाया", content: "2026-27 से 2030-31 तक योजना जारी, 3.15 लाख करोड़ रुपये का बजट। 23 किस्तों में 9.49 करोड़ से अधिक किसान परिवारों को लाभ।" },
            gu: { title: "કેબિનેટે PM-KISAN 5 વર્ષ માટે લંબાવ્યું", content: "2026-27 થી 2030-31 સુધી યોજના, 3.15 લાખ કરોડ રૂપિયાનું બજેટ. 23 હપ્તામાં 9.49 કરોડથી વધુ ખેડૂત પરિવારોને લાભ." },
            mr: { title: "कॅबिनेटने PM-KISAN 5 वर्षांसाठी वाढवले", content: "2026-27 ते 2030-31 पर्यंत योजना सुरू, 3.15 लाख कोटी निधी. 23 हप्त्यांत 9.49 कोटीहून अधिक शेतकरी कुटुंबांना लाभ." },
            pa: { title: "ਕੈਬਿਨੇਟ ਨੇ PM-KISAN 5 ਸਾਲ ਲਈ ਵਧਾਇਆ", content: "2026-27 ਤੋਂ 2030-31 ਤੱਕ ਯੋਜਨਾ, 3.15 ਲੱਖ ਕਰੋੜ ਰੁਪਏ ਦਾ ਬਜਟ। 23 ਕਿਸਤਾਂ ਵਿੱਚ 9.49 ਕਰੋੜ ਤੋਂ ਵੱਧ ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਨੂੰ ਲਾਭ।" },
            ta: { title: "அமைச்சரவை PM-KISAN ஐ 5 ஆண்டுகள் நீட்டித்தது", content: "2026-27 முதல் 2030-31 வரை திட்டம், ரூ.3.15 லட்சம் கோடி நிதி. 23 தவணைகளில் 9.49 கோடிக்கும் மேற்பட்ட விவசாயிகள் பயனடைந்தனர்." },
            te: { title: "క్యాబినెట్ PM-KISANను 5 సంవత్సరాలు పొడిగించింది", content: "2026-27 నుండి 2030-31 వరకు పథకం, రూ.3.15 లక్షల కోట్ల బడ్జెట్. 23 వాయిదాలలో 9.49 కోట్లకు పైగా రైతు కుటుంబాలకు లాభం." },
            kn: { title: "ಕ್ಯಾಬಿನೆಟ್ PM-KISAN ಅನ್ನು 5 ವರ್ಷಗಳಿಗೆ ವಿಸ್ತರಿಸಿದೆ", content: "2026-27 ರಿಂದ 2030-31 ವರೆಗೆ ಯೋಜನೆ, ರೂ.3.15 ಲಕ್ಷ ಕೋಟಿ ಬಜೆಟ್. 23 ಕಿಸ್ತಿಗಳಲ್ಲಿ 9.49 ಕೋಟಿಗೂ ಹೆಚ್ಚು ರೈತ ಕುಟುಂಬಗಳಿಗೆ ಲಾಭ." },
            bn: { title: "মন্ত্রিসভা PM-KISAN 5 বছর বাড়িয়েছে", content: "২০২৬-২৭ থেকে ২০৩০-৩১ পর্যন্ত প্রকল্প, ৩.১৫ লাখ কোটি টাকা বাজেট। ২৩ কিস্তিতে ৯.৪৯ কোটির বেশি কৃষক পরিবার উপকৃত।" },
            or: { title: "କ୍ୟାବିନେଟ୍ PM-KISAN 5 ବର୍ଷ ବଢ଼ାଇଲା", content: "2026-27 ରୁ 2030-31 ପର୍ଯ୍ୟନ୍ତ ଯୋଜନା, 3.15 ଲକ୍ଷ କୋଟି ବଜେଟ। 23 କିସ୍ତିରେ 9.49 କୋଟିରୁ ଅଧିକ ଚାଷୀ ପରିବାର ଉପକୃତ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000012",
        publisher: "Press Information Bureau",
        author: "Government of India",
        date: "2026-06-20T00:00:00Z",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
        link: "https://pmkisan.gov.in/",
        is_top: true,
        translations: {
            en: { title: "PM Releases 23rd PM-KISAN Instalment to Farmers", content: "The Prime Minister released the 23rd instalment of PM-KISAN from West Bengal, transferring Rs 18,984 crore to more than 9.49 crore farmers. The scheme provides Rs 6,000 per year in three equal instalments of Rs 2,000 through DBT." },
            hi: { title: "PM ने 23वीं PM-KISAN किस्त जारी की", content: "पश्चिम बंगाल से 18,984 करोड़ रुपये 9.49 करोड़ किसानों के खातों में ट्रांसफर। प्रति वर्ष 6,000 रुपये की आय सहायता।" },
            gu: { title: "PMએ 23મી PM-KISAN હપ્તો જારી કર્યો", content: "પશ્ચિમ બંગાળથી 18,984 કરોડ રૂપિયા 9.49 કરોડ ખેડૂતોને ટ્રાન્સફર. વાર્ષિક 6,000 રૂપિયાની આવક સહાય." },
            mr: { title: "पंतप्रधानांनी 23वा PM-KISAN हप्ता जारी केला", content: "पश्चिम बंगालमधून 18,984 कोटी रुपये 9.49 कोटी शेतकऱ्यांना हस्तांतरित. दरवर्षी 6,000 रुपये उत्पन्न सहाय्य." },
            pa: { title: "PM ਨੇ 23ਵੀਂ PM-KISAN ਕਿਸਤ ਜਾਰੀ ਕੀਤੀ", content: "ਪੱਛਮੀ ਬੰਗਾਲ ਤੋਂ 18,984 ਕਰੋੜ ਰੁਪਏ 9.49 ਕਰੋੜ ਕਿਸਾਨਾਂ ਨੂੰ ਟ੍ਰਾਂਸਫਰ। ਸਾਲਾਨਾ 6,000 ਰੁਪਏ ਆਮਦਨ ਸਹਾਇਤਾ।" },
            ta: { title: "PM 23வது PM-KISAN தவணையை வெளியிட்டார்", content: "மேற்கு வங்கத்திலிருந்து ரூ.18,984 கோடி 9.49 கோடி விவசாயிகளுக்கு. ஆண்டுக்கு ரூ.6,000 வருமான உதவி." },
            te: { title: "PM 23వ PM-KISAN వాయిదా విడుదల చేశారు", content: "పశ్చిమ బెంగాల్ నుండి రూ.18,984 కోట్లు 9.49 కోట్ల రైతులకు. సంవత్సరానికి రూ.6,000 ఆదాయ సహాయం." },
            kn: { title: "PM 23ನೇ PM-KISAN ಕಿಸ್ತಿ ಬಿಡುಗಡೆ ಮಾಡಿದರು", content: "ಪಶ್ಚಿಮ ಬಂಗಾಳದಿಂದ ರೂ.18,984 ಕೋಟಿ 9.49 ಕೋಟಿ ರೈತರಿಗೆ. ವರ್ಷಕ್ಕೆ ರೂ.6,000 ಆದಾಯ ಸಹಾಯ." },
            bn: { title: "PM 23তম PM-KISAN কিস্তি প্রকাশ করেছেন", content: "পশ্চিমবঙ্গ থেকে ১৮,৯৮৪ কোটি টাকা ৯.৪৯ কোটি কৃষকের কাছে। বার্ষিক ৬,০০০ টাকা আয় সহায়তা।" },
            or: { title: "PM 23ତମ PM-KISAN କିସ୍ତି ଜାରି କଲେ", content: "ପଶ୍ଚିମ ବଙ୍ଗରୁ 18,984 କୋଟି ଟଙ୍କା 9.49 କୋଟି ଚାଷୀଙ୍କୁ। ବାର୍ଷିକ 6,000 ଟଙ୍କା ଆୟ ସହାୟତା।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000013",
        publisher: "The Hindu BusinessLine",
        author: "Agri Business Desk",
        date: "2026-03-31T00:00:00Z",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=800",
        link: "https://www.thehindubusinessline.com/economy/agri-business/centre-kicks-off-procurement-season-with-18000-tonnes-of-wheat-targets-303-lakh-tonnes/article70810725.ece",
        is_top: false,
        translations: {
            en: { title: "Centre Kicks Off Wheat Procurement, Targets 30.3 Million Tonnes", content: "The government began wheat procurement for 2026-27 with an initial target of 30.336 million tonnes by June 30. Punjab, Madhya Pradesh and Haryana are the top contributing states. MSP for wheat is fixed at Rs 2,585 per quintal." },
            hi: { title: "केंद्र ने गेहूं खरीद अभियान शुरू किया, लक्ष्य 30.3 मिलियन टन", content: "30 जून तक 30.336 मिलियन टन खरीद का लक्ष्य। गेहूं का MSP 2,585 रुपये प्रति क्विंटल निर्धारित।" },
            gu: { title: "કેન્દ્રે ઘઉં ખરીદી શરૂ કરી, લક્ષ્ય 30.3 મિલિયન ટન", content: "30 જૂન સુધી 30.336 મિલિયન ટન ખરીદીનું લક્ષ્ય. ઘઉંનો MSP 2,585 રૂપિયા પ્રતિ ક્વિન્ટલ." },
            mr: { title: "केंद्राने गहू खरेदी सुरू केली, लक्ष्य 30.3 दशलक्ष टन", content: "30 जूनपर्यंत 30.336 दशलक्ष टन खरेदीचे लक्ष्य. गव्हाचा MSP 2,585 रुपये प्रति क्विंटल." },
            pa: { title: "ਕੇਂਦਰ ਨੇ ਕਣਕ ਖਰੀਦ ਮੁਹਿੰਮ ਸ਼ੁਰੂ ਕੀਤੀ, ਟੀਚਾ 30.3 ਮਿਲੀਅਨ ਟਨ", content: "30 ਜੂਨ ਤੱਕ 30.336 ਮਿਲੀਅਨ ਟਨ ਖਰੀਦ ਦਾ ਟੀਚਾ। ਕਣਕ ਦਾ MSP 2,585 ਰੁਪਏ ਪ੍ਰਤੀ ਕੁਇੰਟਲ।" },
            ta: { title: "மத்திய அரசு கோதுமை கொள்முதலைத் தொடங்கியது", content: "ஜூன் 30 வரை 30.336 மில்லியன் டன் இலக்கு. கோதுமை MSP ரூ.2,585 ஒரு குவிண்டால்." },
            te: { title: "కేంద్రం గోధుమ కొనుగోలు ప్రారంభించింది", content: "జూన్ 30 వరకు 30.336 మిలియన్ టన్నుల లక్ష్యం. గోధుమ MSP రూ.2,585 ప్రతి క్వింటాల్." },
            kn: { title: "ಕೇಂದ್ರ ಗೋಧಿ ಖರೀದಿ ಪ್ರಾರಂಭಿಸಿದೆ", content: "ಜೂನ್ 30 ವರೆಗೆ 30.336 ಮಿಲಿಯನ್ ಟನ್ ಗುರಿ. ಗೋಧಿ MSP ರೂ.2,585 ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್." },
            bn: { title: "কেন্দ্র গম সংগ্রহ শুরু করেছে", content: "৩০ জুন পর্যন্ত ৩০.৩৩৬ মিলিয়ন টন লক্ষ্য। গমের MSP ২,৫৮৫ টাকা প্রতি কুইন্টাল।" },
            or: { title: "କେନ୍ଦ୍ର ଗହମ କ୍ରୟ ଆରମ୍ଭ କଲା", content: "30 ଜୁନ୍ ପର୍ଯ୍ୟନ୍ତ 30.336 ମିଲିଅନ୍ ଟନ୍ ଲକ୍ଷ୍ୟ। ଗହମର MSP 2,585 ଟଙ୍କା ପ୍ରତି କ୍ୱିଣ୍ଟାଲ୍।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000014",
        publisher: "The Times of India",
        author: "Business Bureau",
        date: "2026-04-22T00:00:00Z",
        image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=800",
        link: "https://timesofindia.indiatimes.com/business/india-business/government-raises-wheat-procurement-target-by-15-as-farmers-turn-to-msp/articleshow/130503990.cms",
        is_top: false,
        translations: {
            en: { title: "Government Raises Wheat Procurement Target by 15%", content: "The Centre increased the wheat procurement target to 34.5 million tonnes as more farmers opted to sell at MSP amid lower mandi prices. Madhya Pradesh, Uttar Pradesh and Rajasthan saw significant target revisions." },
            hi: { title: "सरकार ने गेहूं खरीद लक्ष्य 15% बढ़ाया", content: "मंडी भाव कम होने से अधिक किसान MSP पर बेच रहे हैं। लक्ष्य 34.5 मिलियन टन तक बढ़ाया गया।" },
            gu: { title: "સરકારે ઘઉં ખરીદી લક્ષ્ય 15% વધાર્યું", content: "મંડી ભાવ ઓછા હોવાથી વધુ ખેડૂતો MSP પર વેચી રહ્યા છે. લક્ષ્ય 34.5 મિલિયન ટન." },
            mr: { title: "सरकारने गहू खरेदी लक्ष्य 15% वाढवले", content: "मंडी भाव कमी असल्याने अधिक शेतकरी MSP वर विकत आहेत. लक्ष्य 34.5 दशलक्ष टन." },
            pa: { title: "ਸਰਕਾਰ ਨੇ ਕਣਕ ਖਰੀਦ ਟੀਚਾ 15% ਵਧਾਇਆ", content: "ਮੰਡੀ ਭਾਅ ਘੱਟ ਹੋਣ ਕਾਰਨ ਵਧੇਰੇ ਕਿਸਾਨ MSP 'ਤੇ ਵੇਚ ਰਹੇ ਹਨ। ਟੀਚਾ 34.5 ਮਿਲੀਅਨ ਟਨ।" },
            ta: { title: "அரசு கோதுமை கொள்முதல் இலக்கை 15% உயர்த்தியது", content: "மண்டி விலை குறைவாக இருப்பதால் அதிக விவசாயிகள் MSP-யில் விற்கின்றனர். இலக்கு 34.5 மில்லியன் டன்." },
            te: { title: "ప్రభుత్వం గోధుమ కొనుగోలు లక్ష్యాన్ని 15% పెంచింది", content: "మండి ధరలు తక్కువగా ఉండటంతో ఎక్కువ రైతులు MSPకు అమ్ముతున్నారు. లక్ష్యం 34.5 మిలియన్ టన్నులు." },
            kn: { title: "ಸರ್ಕಾರ ಗೋಧಿ ಖರೀದಿ ಗುರಿಯನ್ನು 15% ಹೆಚ್ಚಿಸಿದೆ", content: "ಮಂಡಿ ಬೆಲೆ ಕಡಿಮೆಯಾಗಿರುವುದರಿಂದ ಹೆಚ್ಚು ರೈತರು MSPಗೆ ಮಾರಾಟ ಮಾಡುತ್ತಿದ್ದಾರೆ. ಗುರಿ 34.5 ಮಿಲಿಯನ್ ಟನ್." },
            bn: { title: "সরকার গম সংগ্রহ লক্ষ্য ১৫% বাড়িয়েছে", content: "মান্ডি দাম কম থাকায় বেশি কৃষক MSP-তে বিক্রি করছেন। লক্ষ্য ৩৪.৫ মিলিয়ন টন।" },
            or: { title: "ସରକାର ଗହମ କ୍ରୟ ଲକ୍ଷ୍ୟ 15% ବଢ଼ାଇଲା", content: "ମଣ୍ଡି ଦର କମ୍ ଥିବାରୁ ଅଧିକ ଚାଷୀ MSPରେ ବିକ୍ରି କରୁଛନ୍ତି। ଲକ୍ଷ୍ୟ 34.5 ମିଲିଅନ୍ ଟନ୍।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000015",
        publisher: "The Hindu BusinessLine",
        author: "Economy Desk",
        date: "2026-06-15T00:00:00Z",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
        link: "https://www.thehindubusinessline.com/economy/agri-business/indias-wheat-procurement-by-govt-tops-355-million-tonnes-target/article69745678.ece",
        is_top: false,
        translations: {
            en: { title: "India's Wheat Procurement Tops 35.5 Million Tonnes", content: "Government agencies procured over 35.5 million tonnes of wheat, exceeding the revised target of 34.5 million tonnes. Punjab led with 12.6 million tonnes, followed by Madhya Pradesh and Haryana, strengthening buffer stocks." },
            hi: { title: "भारत की गेहूं खरीद 35.5 मिलियन टन से अधिक", content: "सरकारी एजेंसियों ने संशोधित लक्ष्य 34.5 मिलियन टन से अधिक गेहूं खरीदा। पंजाब सबसे आगे, बफर स्टॉक मजबूत।" },
            gu: { title: "ભારતની ઘઉં ખરીદી 35.5 મિલિયન ટનથી વધુ", content: "સરકારી એજન્સીઓએ સંશોધિત લક્ષ્ય કરતાં વધુ ઘઉં ખરીદ્યું. પંજાબ અગ્રણી, બફર સ્ટોક મજબૂત." },
            mr: { title: "भारताची गहू खरेदी 35.5 दशलक्ष टनपेक्षा जास्त", content: "सरकारी एजन्सींनी संशोधित लक्ष्यापेक्षा जास्त गहू खरेदी केला. पंजाब अग्रणी, बफर स्टॉक मजबूत." },
            pa: { title: "ਭਾਰਤ ਦੀ ਕਣਕ ਖਰੀਦ 35.5 ਮਿਲੀਅਨ ਟਨ ਤੋਂ ਵੱਧ", content: "ਸਰਕਾਰੀ ਏਜੰਸੀਆਂ ਨੇ ਸੋਧੇ ਟੀਚੇ ਤੋਂ ਵੱਧ ਕਣਕ ਖਰੀਦੀ। ਪੰਜਾਬ ਅਗਵਾਈ, ਬਫਰ ਸਟਾਕ ਮਜ਼ਬੂਤ।" },
            ta: { title: "இந்தியாவின் கோதுமை கொள்முதல் 35.5 மில்லியன் டன்", content: "அரசு நிறுவனங்கள் திருத்தப்பட்ட இலக்கை மீறி கோதுமை கொள்முதல். பஞ்சாப் முன்னிலை, இருப்பு வலுப்படுத்தப்பட்டது." },
            te: { title: "భారత గోధుమ కొనుగోలు 35.5 మిలియన్ టన్నులు", content: "ప్రభుత్వ ఏజెన్సీలు సవరించిన లక్ష్యాన్ని మించి గోధుమ కొనుగోలు. పంజాబ్ ముందంజ, బఫర్ స్టాక్ బలపడింది." },
            kn: { title: "ಭಾರತದ ಗೋಧಿ ಖರೀದಿ 35.5 ಮಿಲಿಯನ್ ಟನ್", content: "ಸರ್ಕಾರಿ ಸಂಸ್ಥೆಗಳು ಸಂಶೋಧಿತ ಗುರಿಯನ್ನು ಮೀರಿ ಗೋಧಿ ಖರೀದಿ. ಪಂಜಾಬ್ ಮುಂದೆ, ಬಫರ್ ಸ್ಟಾಕ್ ಬಲವಾಗಿದೆ." },
            bn: { title: "ভারতের গম সংগ্রহ ৩৫.৫ মিলিয়ন টন", content: "সরকারি সংস্থাগুলি সংশোধিত লক্ষ্য ছাড়িয়ে গম সংগ্রহ করেছে। পাঞ্জাব শীর্ষে, বাফার স্টক শক্তিশালী।" },
            or: { title: "ଭାରତର ଗହମ କ୍ରୟ 35.5 ମିଲିଅନ୍ ଟନ୍", content: "ସରକାରୀ ଏଜେନ୍ସିଗୁଡ଼ିକ ସଂଶୋଧିତ ଲକ୍ଷ୍ୟ ଅତିକ୍ରମ କରି ଗହମ କ୍ରୟ କଲେ। ପଞ୍ଜାବ ଅଗ୍ରଣୀ, ବଫର୍ ଷ୍ଟକ୍ ମଜବୁତ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000016",
        publisher: "The Hindu",
        author: "Science Desk",
        date: "2026-06-30T00:00:00Z",
        image: "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&q=80&w=800",
        link: "https://www.thehindu.com/sci-tech/energy-and-environment/monthly-average-rainfall-over-india-expected-to-be-below-normal-in-july-imd/article69876543.ece",
        is_top: true,
        translations: {
            en: { title: "IMD Forecasts Below-Normal Rainfall for July 2026", content: "The India Meteorological Department predicted below-normal rainfall for July, with northwest and central India likely to face deficits. Farmers are advised to plan irrigation and crop choices carefully for kharif season." },
            hi: { title: "IMD ने जुलाई में सामान्य से कम बारिश का पूर्वानुमान किया", content: "उत्तर-पश्चिम और मध्य भारत में कमी की संभावना। खरीफ के लिए सिंचाई और फसल योजना पर ध्यान दें।" },
            gu: { title: "IMDએ જુલાઈમાં સામાન્ય કરતાં ઓછો વરસાદ અનુમાનિત", content: "ઉત્તર-પશ્ચિમ અને મધ્ય ભારતમાં ઘટાડો સંભવ. ખરીફ માટે સિંચાઈ અને પાક યોજના કરો." },
            mr: { title: "IMD ने जुलैमध्ये सामान्यपेक्षा कमी पाऊस अंदाज केला", content: "उत्तर-पश्चिम आणि मध्य भारतात तूटीची शक्यता. खरीपसाठी सिंचन आणि पीक नियोजन करा." },
            pa: { title: "IMD ਨੇ ਜੁਲਾਈ ਵਿੱਚ ਘੱਟ ਮੀਂਹ ਦੀ ਭਵਿੱਖਬਾਣੀ ਕੀਤੀ", content: "ਉੱਤਰ-ਪੱਛਮੀ ਅਤੇ ਮੱਧ ਭਾਰਤ ਵਿੱਚ ਘਾਟੇ ਦੀ ਸੰਭਾਵਨਾ। ਖਰੀਫ ਲਈ ਸਿੰਚਾਈ ਅਤੇ ਫਸਲ ਯੋਜਨਾ ਕਰੋ।" },
            ta: { title: "IMD ஜூலையில் குறைந்த மழை முன்னறிவிப்பு", content: "வடமேற்கு மற்றும் மத்திய இந்தியாவில் பற்றாக்குறை. காரிப் பருவத்திற்கு பாசனம் திட்டமிடுங்கள்." },
            te: { title: "IMD జూలైలో తక్కువ వర్షాల అంచనా", content: "వాయువ్య మరియు మధ్య భారతదేశంలో లోపం సంభావ్యత. ఖరీఫ్ కోసం సాగు ప్రణాళిక చేయండి." },
            kn: { title: "IMD ಜುಲೈನಲ್ಲಿ ಕಡಿಮೆ ಮಳೆ ಮುನ್ಸೂಚನೆ", content: "ವಾಯವ್ಯ ಮತ್ತು ಮಧ್ಯ ಭಾರತದಲ್ಲಿ ಕೊರತೆ ಸಾಧ್ಯತೆ. ಖರೀಫ್‌ಗೆ ನೀರಾವರಿ ಯೋಜನೆ ಮಾಡಿ." },
            bn: { title: "IMD জুলাইয়ে স্বাভাবিকের চেয়ে কম বৃষ্টির পূর্বাভাস", content: "উত্তর-পশ্চিম ও মধ্য ভারতে ঘাটতির সম্ভাবনা। খরিফের জন্য সেচ পরিকল্পনা করুন।" },
            or: { title: "IMD ଜୁଲାଇରେ କମ୍ ବର୍ଷା ପୂର୍ବାନୁମାନ", content: "ଉତ୍ତର-ପଶ୍ଚିମ ଏବଂ ମଧ୍ୟ ଭାରତରେ ଘାଟ ସମ୍ଭାବନା। ଖରିଫ୍ ପାଇଁ ସିଞ୍ଚନ ଯୋଜନା କରନ୍ତୁ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000017",
        publisher: "BBC News",
        author: "South Asia Correspondent",
        date: "2026-06-28T00:00:00Z",
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&q=80&w=800",
        link: "https://www.bbc.com/news/articles/c5yzk5rqyr4o",
        is_top: false,
        translations: {
            en: { title: "Driest June in Years Raises Farming Worries Across India", content: "India recorded one of its driest Junes in decades, with rainfall 11% below normal. Delayed monsoon onset has slowed kharif sowing in Maharashtra, Karnataka and parts of the Gangetic plains, worrying farmers ahead of the peak planting window." },
            hi: { title: "दशकों में सबसे सूखा जून, किसान चिंतित", content: "जून में 11% कम बारिश। महाराष्ट्र, कर्नाटक में खरीफ बुवाई धीमी, किसान चिंतित।" },
            gu: { title: "દાયકાઓનો સૌથી શુષ્ક જૂન, ખેડૂતો ચિંતિત", content: "જૂનમાં 11% ઓછો વરસાદ. મહારાષ્ટ્ર, કર્ણાટકમાં ખરીફ વાવેતર ધીમું." },
            mr: { title: "दशकांतील सर्वात कोरडा जून, शेतकरी चिंतित", content: "जूनमध्ये 11% कमी पाऊस. महाराष्ट्र, कर्नाटकमध्ये खरीप पेरणी मंद." },
            pa: { title: "ਦਹਾਕਿਆਂ ਦਾ ਸਭ ਤੋਂ ਸੁੱਕਾ ਜੂਨ, ਕਿਸਾਨ ਚਿੰਤਿਤ", content: "ਜੂਨ ਵਿੱਚ 11% ਘੱਟ ਮੀਂਹ। ਮਹਾਰਾਸ਼ਟਰ, ਕਰਨਾਟਕ ਵਿੱਚ ਖਰੀਫ ਬਿਜਾਈ ਧੀਮੀ।" },
            ta: { title: "பத்தாண்டுகளின் வறண்ட ஜூன், விவசாயிகள் கவலை", content: "ஜூனில் 11% குறைந்த மழை. மகாராஷ்டிரம், கர்நாடகாவில் காரிப் நடவு மந்தம்." },
            te: { title: "దశాబ్దాలలో అత్యంత ఎండ జూన్, రైతుల ఆందోళన", content: "జూన్‌లో 11% తక్కువ వర్షాలు. మహారాష్ట్ర, కర్ణాటకలో ఖరీఫ్ విత్తనం మందగించింది." },
            kn: { title: "ದಶಕಗಳ ಒಣ ಜೂನ್, ರೈತರು ಚಿಂತಿತರು", content: "ಜೂನ್‌ನಲ್ಲಿ 11% ಕಡಿಮೆ ಮಳೆ. ಮಹಾರಾಷ್ಟ್ರ, ಕರ್ನಾಟಕದಲ್ಲಿ ಖರೀಫ್ ಬಿತ್ತನೆ ನಿಧಾನ." },
            bn: { title: "দশকের শুষ্কতম জুন, কৃষক উদ্বিগ্ন", content: "জুনে ১১% কম বৃষ্টি। মহারাষ্ট্র, কর্ণাটকে খরিফ বপন ধীর।" },
            or: { title: "ଦଶକର ସବୁଠାରୁ ଶୁଷ୍କ ଜୁନ୍, ଚାଷୀ ଚିନ୍ତିତ", content: "ଜୁନ୍ରେ 11% କମ୍ ବର୍ଷା। ମହାରାଷ୍ଟ୍ର, କର୍ଣ୍ଣାଟକରେ ଖରିଫ୍ ବିତରଣ ଧୀର।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000018",
        publisher: "Down To Earth",
        author: "Climate Desk",
        date: "2026-07-10T00:00:00Z",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
        link: "https://www.downtoearth.org.in/agriculture/el-ni-o-impact-monsoon-rainfall-deficit-kharif-sowing-20-behind-last-year",
        is_top: false,
        translations: {
            en: { title: "El Niño Impact: Kharif Sowing 20% Behind Last Year", content: "Weak monsoon and El Niño conditions left kharif sowing about 20% behind the previous year by early July. Pulses, oilseeds and coarse cereals showed the largest gaps. Experts urge contingency cropping in rain-deficit districts." },
            hi: { title: "एल नीनो प्रभाव: खरीफ बुवाई पिछले साल से 20% पीछे", content: "कमजोर मानसून से दाल, तिलहन और मोटे अनाज में सबसे बड़ी कमी। वर्षा घाट वाले जिलों में वैकल्पिक फसलें अपनाएं।" },
            gu: { title: "એલ નિનો અસર: ખરીફ વાવેતર 20% પાછળ", content: "નબળા માનસૂનથી દાળ, તેલબીય અને મોટા ધાન્યમાં સૌથી મોટી ઘટાડો." },
            mr: { title: "एल निनो प्रभाव: खरीप पेरणी 20% मागे", content: "कमकुवत मान्सूनमुळे डाळ, तेलबिया आणि ज्वारीमध्ये सर्वात मोठी तूट." },
            pa: { title: "ਐਲ ਨੀਨੋ ਪ੍ਰਭਾਵ: ਖਰੀਫ ਬਿਜਾਈ 20% ਪਿੱਛੇ", content: "ਕਮਜ਼ੋਰ ਮਾਨਸੂਨ ਨਾਲ ਦਾਲਾਂ, ਤਿਲਹਨ ਵਿੱਚ ਸਭ ਤੋਂ ਵੱਡੀ ਘਾਟ।" },
            ta: { title: "எல் நினோ தாக்கம்: காரிப் நடவு 20% பின்தங்கியது", content: "பலவீனமான பருவமழையால் பருப்பு, எண்ணெய் வித்துக்களில் பெரிய இடைவெளி." },
            te: { title: "ఎల్ నినో ప్రభావం: ఖరీఫ్ విత్తనం 20% వెనుకబడింది", content: "బలహీనమైన మాన్సూన్‌తో పప్పులు, నూనెగింజలలో పెద్ద లోపం." },
            kn: { title: "ಎಲ್ ನಿನೋ ಪರಿಣಾಮ: ಖರೀಫ್ ಬಿತ್ತನೆ 20% ಹಿಂದೆ", content: "ದುರ್ಬಲ ಮಾನ್ಸೂನ್‌ನಿಂದ ಬೇಳೆ, ಎಣ್ಣೆ ಬೀಜಗಳಲ್ಲಿ ದೊಡ್ಡ ಕೊರತೆ." },
            bn: { title: "এল নিনো প্রভাব: খরিফ বপন ২০% পিছিয়ে", content: "দুর্বল মৌসুমি বৃষ্টিতে ডাল, তেলবীজে সবচেয়ে বড় ঘাটতি।" },
            or: { title: "ଏଲ୍ ନିନୋ ପ୍ରଭାବ: ଖରିଫ୍ ବିତରଣ 20% ପଛରେ", content: "ଦୁର୍ବଳ ମୌସୁମୀ ବର୍ଷାରେ ଡାଲି, ତେଲବିହନରେ ସର୍ବାଧିକ ଘାଟ।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000019",
        publisher: "Business Standard",
        author: "Economy Bureau",
        date: "2026-07-28T00:00:00Z",
        image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800",
        link: "https://www.business-standard.com/economy/news/summer-crop-sowing-gains-pace-as-monsoon-rains-revive-across-india-125072801234_1.html",
        is_top: false,
        translations: {
            en: { title: "Kharif Sowing Gains Pace as Monsoon Rains Revive", content: "Revival of monsoon across central and western India accelerated kharif sowing in late July. Rice, cotton and soybean acreage picked up in Madhya Pradesh, Maharashtra and Gujarat as soil moisture improved after weeks of deficit." },
            hi: { title: "मानसून लौटने से खरीफ बुवाई में तेजी", content: "मध्य और पश्चिम भारत में मानसून सक्रिय होने से धान, कपास और सोयाबीन की बुवाई तेज। मिट्टी की नमी में सुधार।" },
            gu: { title: "માનસૂન પાછો આવતાં ખરીફ વાવેતર ઝડપી", content: "મધ્ય અને પશ્ચિમ ભારતમાં ધાન, કપાસ અને સોયાબીનની વાવેતર વધી. માટીની ભેજ સુધરી." },
            mr: { title: "मान्सून परतल्याने खरीप पेरणी वेगवान", content: "मध्य आणि पश्चिम भारतात भात, कापूस आणि सोयाबीन पेरणी वाढली. मातीची ओलावा सुधारला." },
            pa: { title: "ਮਾਨਸੂਨ ਵਾਪਸੀ ਨਾਲ ਖਰੀਫ ਬਿਜਾਈ ਤੇਜ਼", content: "ਮੱਧ ਅਤੇ ਪੱਛਮੀ ਭਾਰਤ ਵਿੱਚ ਧਾਨ, ਕਪਾਹ ਅਤੇ ਸੋਯਾਬੀਨ ਦੀ ਬਿਜਾਈ ਵਧੀ। ਮਿੱਟੀ ਦੀ ਨਮੀ ਸੁਧਰੀ।" },
            ta: { title: "பருவமழை திரும்பியதால் காரிப் நடவு வேகமடைந்தது", content: "மத்திய மற்றும் மேற்கு இந்தியாவில் நெல், பருத்தி, சோயா நடவு அதிகரித்தது." },
            te: { title: "మాన్సూన్ తిరిగి వచ్చడంతో ఖరీఫ్ విత్తనం వేగం పొందింది", content: "మధ్య, పశ్చిమ భారతదేశంలో వరి, పత్తి, సోయాబీన్ విత్తనం పెరిగింది." },
            kn: { title: "ಮಾನ್ಸೂನ್ ಮರಳಿದಂತೆ ಖರೀಫ್ ಬಿತ್ತನೆ ವೇಗವಾಯಿತು", content: "ಮಧ್ಯ ಮತ್ತು ಪಶ್ಚಿಮ ಭಾರತದಲ್ಲಿ ಅಕ್ಕಿ, ಹತ್ತಿ, ಸೋಯಾಬೀನ್ ಬಿತ್ತನೆ ಹೆಚ್ಚಾಯಿತು." },
            bn: { title: "মৌসুমি বৃষ্টি ফিরে আসায় খরিফ বপন ত্বরান্বিত", content: "মধ্য ও পশ্চিম ভারতে ধান, তুলা, সয়াবিন বপন বেড়েছে।" },
            or: { title: "ମୌସୁମୀ ବର୍ଷା ଫେରିଲା, ଖରିଫ୍ ବିତରଣ ତୀବ୍ର", content: "ମଧ୍ୟ ଏବଂ ପଶ୍ଚିମ ଭାରତରେ ଧାନ, କପା, ସୋୟାବିନ୍ ବିତରଣ ବୃଦ୍ଧି।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000020",
        publisher: "The Hindu BusinessLine",
        author: "Agri Desk",
        date: "2026-07-25T00:00:00Z",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
        link: "https://www.thehindubusinessline.com/economy/agri-business/kharif-sowing-deficit-less-than-5-as-monsoon-picks-up/article69912345.ece",
        is_top: true,
        translations: {
            en: { title: "Kharif Sowing Deficit Shrinks to Less Than 5%", content: "As monsoon activity strengthened in the second half of July, the kharif sowing gap compared to last year narrowed to under 5%. Rice area crossed 280 lakh hectares while pulses and oilseeds continued to lag slightly." },
            hi: { title: "खरीफ बुवाई की कमी 5% से कम हो गई", content: "जुलाई के दूसरे पखवाड़े में मानसून सक्रिय होने से अंतर घटा। धान 280 लाख हेक्टेयर से अधिक।" },
            gu: { title: "ખરીફ વાવેતરની ઘટાડો 5% થી ઓછી", content: "જુલાઈના બીજા અડધામાં માનસૂન સક્રિય થયું. ધાન 280 લાખ હેક્ટરથી વધુ." },
            mr: { title: "खरीप पेरणी तूट 5% पेक्षा कमी", content: "जुलैच्या दुसऱ्या अर्ध्यात मान्सून सक्रिय. भात 280 लाख हेक्टरपेक्षा जास्त." },
            pa: { title: "ਖਰੀਫ ਬਿਜਾਈ ਦੀ ਘਾਟ 5% ਤੋਂ ਘੱਟ", content: "ਜੁਲਾਈ ਦੇ ਦੂਜੇ ਅੱਧ ਵਿੱਚ ਮਾਨਸੂਨ ਸਰਗਰਮ। ਧਾਨ 280 ਲੱਖ ਹੈਕਟੇਅਰ ਤੋਂ ਵੱਧ।" },
            ta: { title: "காரிப் நடவு பற்றாக்குறை 5% க்கும் குறைவாக குறைந்தது", content: "ஜூலை இரண்டாம் பாதியில் பருவமழை வலுப்படுத்தியது. நெல் 280 லட்சம் ஹெக்டேர்." },
            te: { title: "ఖరీఫ్ విత్తన లోపం 5% కంటే తక్కువకు తగ్గింది", content: "జూలై రెండవ సగంలో మాన్సూన్ బలపడింది. వరి 280 లక్షల హెక్టార్లు." },
            kn: { title: "ಖರೀಫ್ ಬಿತ್ತನೆ ಕೊರತೆ 5% ಕ್ಕಿಂತ ಕಡಿಮೆ", content: "ಜುಲೈ ಎರಡನೇ ಅರ್ಧದಲ್ಲಿ ಮಾನ್ಸೂನ್ ಬಲವಾಯಿತು. ಅಕ್ಕಿ 280 ಲಕ್ಷ ಹೆಕ್ಟೇರ್." },
            bn: { title: "খরিফ বপনের ঘাটতি ৫% এর নিচে নেমেছে", content: "জুলাইয়ের দ্বিতীয়ার্ধে মৌসুমি বৃষ্টি শক্তিশালী। ধান ২৮০ লক্ষ হেক্টর।" },
            or: { title: "ଖରିଫ୍ ବିତରଣ ଘାଟ 5% ରୁ କମ୍", content: "ଜୁଲାଇ ଦ୍ୱିତୀୟ ଅଧାରେ ମୌସୁମୀ ବର୍ଷା ବଳିଶାଳୀ। ଧାନ 280 ଲକ୍ଷ ହେକ୍ଟର୍।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000021",
        publisher: "Krishak Jagat",
        author: "Editorial Team",
        date: "2026-07-24T00:00:00Z",
        image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&q=80&w=800",
        link: "https://krishakjagat.org/agriculture-news/kharif-sowing-slowed-with-sowing-covering-787-37-lakh-hectares/",
        is_top: false,
        translations: {
            en: { title: "Kharif Sowing Covers 787.37 Lakh Hectares by Mid-July", content: "Total kharif sowing reached 787.37 lakh hectares by July 24, still trailing last year's pace. Rice led at 280 lakh hectares, followed by pulses at 95 lakh and oilseeds at 145 lakh hectares across the country." },
            hi: { title: "मध्य जुलाई तक खरीफ बुवाई 787.37 लाख हेक्टेयर", content: "धान 280 लाख, दाल 95 लाख और तिलहन 145 लाख हेक्टेयर पर बोया गया। पिछले साल से धीमी गति।" },
            gu: { title: "મધ્ય જુલાઈ સુધી ખરીફ 787.37 લાખ હેક્ટર", content: "ધાન 280 લાખ, દાળ 95 લાખ, તેલબીય 145 લાખ હેક્ટર. ગત વર્ષ કરતાં ધીમું." },
            mr: { title: "मध्य जुलैपर्यंत खरीप 787.37 लाख हेक्टर", content: "भात 280 लाख, डाळ 95 लाख, तेलबिया 145 लाख हेक्टर. मागील वर्षापेक्षा मंद." },
            pa: { title: "ਮੱਧ ਜੁਲਾਈ ਤੱਕ ਖਰੀਫ 787.37 ਲੱਖ ਹੈਕਟੇਅਰ", content: "ਧਾਨ 280 ਲੱਖ, ਦਾਲ 95 ਲੱਖ, ਤਿਲਹਨ 145 ਲੱਖ ਹੈਕਟੇਅਰ। ਪਿਛਲੇ ਸਾਲ ਨਾਲੋਂ ਧੀਮੀ ਗਤੀ।" },
            ta: { title: "ஜூலை நடுவில் காரிப் 787.37 லட்சம் ஹெக்டேர்", content: "நெல் 280 லட்சம், பருப்பு 95 லட்சம், எண்ணெய் வித்து 145 லட்சம் ஹெக்டேர்." },
            te: { title: "జూలై మధ్యలో ఖరీఫ్ 787.37 లక్షల హెక్టార్లు", content: "వరి 280 లక్షలు, పప్పులు 95 లక్షలు, నూనెగింజలు 145 లక్షల హెక్టార్లు." },
            kn: { title: "ಜುಲೈ ಮಧ್ಯದಲ್ಲಿ ಖರೀಫ್ 787.37 ಲಕ್ಷ ಹೆಕ್ಟೇರ್", content: "ಅಕ್ಕಿ 280 ಲಕ್ಷ, ಬೇಳೆ 95 ಲಕ್ಷ, ಎಣ್ಣೆ ಬೀಜ 145 ಲಕ್ಷ ಹೆಕ್ಟೇರ್." },
            bn: { title: "জুলাই মধ্যে খরিফ ৭৮৭.৩৭ লক্ষ হেক্টর", content: "ধান ২৮০ লক্ষ, ডাল ৯৫ লক্ষ, তেলবীজ ১৪৫ লক্ষ হেক্টর।" },
            or: { title: "ଜୁଲାଇ ମଧ୍ୟରେ ଖରିଫ୍ 787.37 ଲକ୍ଷ ହେକ୍ଟର୍", content: "ଧାନ 280 ଲକ୍ଷ, ଡାଲି 95 ଲକ୍ଷ, ତେଲବିହନ 145 ଲକ୍ଷ ହେକ୍ଟର୍।" }
        }
    },
    {
        id: "00000000-0000-0000-0000-000000000022",
        publisher: "Krishak Jagat",
        author: "Policy Reporter",
        date: "2026-07-22T00:00:00Z",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
        link: "https://krishakjagat.org/agriculture-news/ministry-of-agricultures-weekly-review-meeting-chaired-by-shivraj-singh-chouhan/",
        is_top: false,
        translations: {
            en: { title: "Agriculture Ministry Reviews Kharif Progress in Weekly Meeting", content: "Union Agriculture Minister Shivraj Singh Chouhan chaired a weekly review on kharif sowing, crop insurance claims and fertilizer availability. States were asked to expedite sowing in rain-fed areas and ensure timely MSP procurement operations." },
            hi: { title: "कृषि मंत्रालय ने खरीफ प्रगति की साप्ताहिक समीक्षा की", content: "शिवराज सिंह चौहान ने खरीफ बुवाई, फसल बीमा और उर्वरक उपलब्धता की समीक्षा की। राज्यों को तेजी लाने का निर्देश।" },
            gu: { title: "કૃષિ મંત્રાલયે ખરીફ પ્રગતિની સાપ્તાહિક સમીક્ષા કરી", content: "શિવરાજ સિંહ ચૌહાણે ખરીફ વાવેતર, વીમા અને ખાતરની સમીક્ષા કરી." },
            mr: { title: "कृषी मंत्रालयाने खरीप प्रगतीचे साप्ताहिक पुनरावलोकन केले", content: "शिवराज सिंह चौहान यांनी खरीप पेरणी, विमा आणि खतांचे पुनरावलोकन केले." },
            pa: { title: "ਖੇਤੀਬਾੜੀ ਮੰਤਰਾਲੇ ਨੇ ਖਰੀਫ ਪ੍ਰਗਤੀ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ", content: "ਸ਼ਿਵਰਾਜ ਸਿੰਘ ਚੌਹਾਨ ਨੇ ਖਰੀਫ ਬਿਜਾਈ, ਬੀਮਾ ਅਤੇ ਖਾਦ ਦੀ ਸਮੀਖਿਆ ਕੀਤੀ।" },
            ta: { title: "விவசாய அமைச்சகம் காரிப் முன்னேற்றத்தை மதிப்பாய்வு செய்தது", content: "சிவராஜ் சிங் சவுகான் காரிப் நடவு, காப்பீடு மற்றும் உர கிடைப்பை மதிப்பாய்வு செய்தார்." },
            te: { title: "వ్యవసాయ మంత్రిత్వ శాఖ ఖరీఫ్ పురోగతిని సమీక్షించింది", content: "శివరాజ్ సింగ్ చౌహాన్ ఖరీఫ్ విత్తనం, బీమా మరియు ఎరువుల లభ్యతను సమీక్షించారు." },
            kn: { title: "ಕೃಷಿ ಸಚಿವಾಲಯ ಖರೀಫ್ ಪ್ರಗತಿಯನ್ನು ಪರಿಶೀಲಿಸಿತು", content: "ಶಿವರಾಜ್ ಸಿಂಗ್ ಚೌಹಾನ್ ಖರೀಫ್ ಬಿತ್ತನೆ, ವಿಮೆ ಮತ್ತು ರಸಗೊಬ್ಬರ ಲಭ್ಯತೆಯನ್ನು ಪರಿಶೀಲಿಸಿದರು." },
            bn: { title: "কৃষি মন্ত্রক খরিফ অগ্রগতি পর্যালোচনা করেছে", content: "শিবরাজ সিং চৌহান খরিফ বপন, বীমা ও সার সরবরাহ পর্যালোচনা করেছেন।" },
            or: { title: "କୃଷି ମନ୍ତ୍ରଣାଳୟ ଖରିଫ୍ ପ୍ରଗତି ସମୀକ୍ଷା କଲା", content: "ଶିବରାଜ ସିଂହ ଚୌହାନ ଖରିଫ୍ ବିତରଣ, ବୀମା ଏବଂ ସାର ଉପଲବ୍ଧତା ସମୀକ୍ଷା କଲେ।" }
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
