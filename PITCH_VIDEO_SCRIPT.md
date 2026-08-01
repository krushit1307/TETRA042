# Sasya AI — 6–7 Minute Demo Pitch Script

**Team:** TETRA042  
**Event:** Indo-French AI Innovation Sprint · Navrachana Innovation Foundation (NIF)  
**Track:** AgriTech  
**Theme:** AI for Inclusive Growth and Scalable Impact  
**Target length:** 6 minutes 30 seconds (~390 sec) · stretch to 7 min if needed  

---

## Before you record

| Item | Tip |
|------|-----|
| **Language** | Record narration in English; switch UI to **Gujarati** or **Hindi** for 1–2 live demos to show inclusivity |
| **Screen** | 1920×1080, hide bookmarks bar, close extra tabs, use light mode or consistent dark mode |
| **Backend** | Confirm https://neel2601-sasya-ai-backend.hf.space `/health` is up before recording |
| **Assets** | Keep a **crop leaf photo** ready for diagnosis; phone ready for **WhatsApp** clip |
| **Pace** | Speak clearly at ~130 words/min; pause 2 sec after each feature transition |

---

## Scene breakdown (timing)

| Time | Section | Duration |
|------|---------|----------|
| 0:00 | Cold open — the farmer’s problem | 0:45 |
| 0:45 | Introducing Sasya AI | 0:30 |
| 1:15 | Multilingual AI Assistant (text + voice) | 1:00 |
| 2:15 | Crop disease diagnosis + voice call | 1:00 |
| 3:15 | Market Yard — live mandi prices | 0:45 |
| 4:00 | Smart crop calendar | 0:45 |
| 4:45 | Farmer news + WhatsApp agent | 0:30 |
| 5:15 | How it works (AI stack) + admin | 0:30 |
| 5:45 | Impact, scale & closing | 0:45 |
| **Total** | | **~6:30** |

---

## FULL NARRATION SCRIPT

### SCENE 1 — Cold open (0:00 – 0:45)
**Visual:** B-roll of farmland / farmer in field (stock or team footage). Optional text overlay: *“600+ million farmers. One extension officer for thousands.”*

**NARRATION:**

> Imagine you’re a farmer in rural Gujarat. Your cotton leaves are turning yellow — but the nearest agriculture expert is hours away, and every app you open is in English.
>
> Crop loss isn’t just a bad season. For smallholders, one wrong treatment decision can wipe out an entire year’s income.
>
> India’s farmers don’t lack knowledge — they lack **timely, trustworthy, and language-accessible** advice.
>
> That’s the gap we set out to close — in 36 hours, with AI built for **inclusive growth**.

**On-screen text (end of scene):**  
**Sasya AI** · Team TETRA042 · AgriTech

---

### SCENE 2 — Introducing Sasya AI (0:45 – 1:15)
**Visual:** Open homepage. Show logo, hero line, language dropdown → switch to **ગુજરાતી (Gujarati)**. Scroll briefly through core feature cards.

**NARRATION:**

> Meet **Sasya AI** — your intelligent agricultural advisor, available **24/7 in your language**.
>
> KrishiMitra is our farmer-facing web platform. One backend powers the website, voice, and WhatsApp — so a farmer never needs to install a complex app.
>
> We support **ten Indian languages** — from Hindi and Gujarati to Tamil, Telugu, Bengali, and Odia. The entire interface — including our brand name — adapts when you change language.

**Action on screen:**
- Switch language to Gujarati
- Point to hero subtitle and “Start with Sasya AI” button in local script
- Quick scroll: Disease detection · Multilingual chat · Calendar · Market · Voice · WhatsApp cards

---

### SCENE 3 — Multilingual AI Assistant (1:15 – 2:15)
**Visual:** Navigate to **Assistant** page.

**NARRATION:**

> Let’s start with the **AI Assistant** — the heart of Sasya AI.
>
> A farmer can **type** a question in any supported language. Watch — I’ll ask in Gujarati: *“મારા ટમેટાના પાન પર પીળા ડાઘ છે, શું કરું?”*
>
> Behind the scenes, our pipeline detects the language, translates to English, retrieves facts from our agricultural knowledge base, and uses **TinyLlama** — fine-tuned for farming — to generate a **grounded** answer. No hallucinated pesticides. Real, actionable guidance.
>
> The reply comes back in Gujarati — cause, treatment, and prevention.
>
> But many farmers can’t type comfortably. So we built **voice-first** access. Tap the microphone — speak your question — **Whisper** converts speech to text — and Sasya AI **reads the answer aloud** with text-to-speech.
>
> This is farming advice that works in the field, hands-free, in the language farmers actually speak.

**Action on screen:**
1. Type or paste a farming question in Gujarati/Hindi → send → show AI reply
2. Tap **mic** → speak a short question (5–8 sec) → show transcript + spoken reply
3. Optional: show language selector on assistant page

**Demo question (English backup):**  
*"My tomato plants have yellow spots on lower leaves. What should I do?"*

---

### SCENE 4 — Crop disease diagnosis + voice call (2:15 – 3:15)
**Visual:** Navigate to **Diagnosis** page.

**NARRATION:**

> Photos tell the story faster than words. On our **Image Diagnosis** page, a farmer uploads a photo of an affected crop leaf.
>
> Our **EfficientNet-V2** model — trained on Indian crop diseases — classifies the image across **38 disease classes**. In seconds you get: disease name, confidence score, cause, treatment, and prevention — all translated to the farmer’s language.
>
> Vision AI alone isn’t enough. If confidence is low, we don’t leave the farmer guessing. A **live voice call** option appears — connect instantly with Sasya AI for spoken, step-by-step expert guidance, like having an agronomist on the phone.
>
> The same diagnosis API powers our WhatsApp channel — send a photo on WhatsApp, get a diagnosis back. One model, many channels.

**Action on screen:**
1. Upload a leaf/crop image → wait for results
2. Highlight: disease name, confidence %, treatment bullets
3. If low confidence UI exists → show **Call Now** / voice overlay briefly
4. Optional split-screen: same image sent on WhatsApp → reply appears on phone

**B-roll insert (5 sec):** Architecture mini-diagram — Image → CNN → LLM advisory → Localized response

---

### SCENE 5 — Market Yard (3:15 – 4:00)
**Visual:** Navigate to **Market Yard**.

**NARRATION:**

> Knowing *what* to grow is half the battle. Knowing *when and where to sell* is the other half.
>
> **Market Yard** connects live **mandi prices** from the Government of India’s **Agmarknet** API via data.gov.in.
>
> Select your state, district, and market — browse crop-wise prices — and make informed selling decisions instead of relying on middlemen’s word alone.
>
> The entire flow is multilingual — state and district names translate too — so a farmer in Maharashtra or Punjab sees familiar place names in their own script.

**Action on screen:**
1. Select state → district → market
2. Show commodity grid or price list for 1–2 crops (e.g. Cotton, Wheat)
3. Briefly switch language to show translated labels

---

### SCENE 6 — Smart crop calendar (4:00 – 4:45)
**Visual:** Navigate to **Calendar**.

**NARRATION:**

> Timing is everything in agriculture. Our **Smart Crop Calendar** gives personalized **sowing and harvesting** schedules based on **state, soil type, and season**.
>
> With optional **GPS location detection**, the calendar adapts to where the farmer actually farms — not a generic national schedule.
>
> Tap any day to see what action to take: irrigation, fertilizer, pest watch, or harvest prep. It’s a digital extension worker in your pocket — organized month by month.

**Action on screen:**
1. Select state + soil type (or allow GPS)
2. Show monthly calendar with color-coded actions
3. Open **day detail modal** for one date — show tasks/advice

---

### SCENE 7 — Farmer news + WhatsApp (4:45 – 5:15)
**Visual:** **News** page → quick scroll. Cut to phone **WhatsApp** demo.

**NARRATION:**

> Farmers also need to stay informed. **Farmer News** curates agriculture updates — government schemes, weather alerts, market trends — with multilingual support. Our team manages content through a simple **admin panel**.
>
> And here’s the channel that changes reach: **WhatsApp**. No app download. After one website visit, farmers can message Sasya AI on WhatsApp anytime — ask a text question or **send a crop photo** — and get diagnosis or advice in their language.
>
> Built on **Twilio**, our webhook routes every message through the same Sasya AI backend. Web, voice, WhatsApp — one brain, three doors in.

**Action on screen:**
1. Scroll news carousel / open one article
2. Phone screen: send WhatsApp text → get reply
3. Phone screen: send crop photo → get diagnosis summary

---

### SCENE 8 — How it works + tech (5:15 – 5:45)
**Visual:** Architecture diagram (from README) or simple slide. Optional: HF Space `/docs` or admin login flash.

**NARRATION:**

> Under the hood, Sasya AI is a **FastAPI** service on **Hugging Face Spaces**, paired with a **Next.js** frontend.
>
> **EfficientNet** for vision. **TinyLlama plus LoRA** for grounded chat. **NLLB-200** for translation across Indian languages. **Whisper** for speech. **ElevenLabs** or open TTS for voice output.
>
> Every answer follows the same pipeline: detect language → retrieve facts → generate → translate → format for the channel — web bullets, voice short sentences, or WhatsApp compact text.
>
> We deployed a working prototype in 36 hours. It’s live. It’s scalable. And it’s built for farmers who were never the first audience for AI — until now.

**On-screen text (bullet list):**
- Vision: EfficientNet-V2 · 38 classes  
- Language: TinyLlama + RAG · NLLB-200  
- Voice: Whisper STT · TTS  
- Channels: Web · Voice · WhatsApp  
- Data: Agmarknet · Curated agri KB  

---

### SCENE 9 — Impact & closing (5:45 – 6:30)
**Visual:** Return to homepage hero or team photo. End card with logo, GitHub, live URL.

**NARRATION:**

> Sasya AI is **AI for inclusive growth**.
>
> We reach farmers in **their language**, on **their phone**, with **vision and voice** — not just English chatbots.
>
> Faster diagnosis means less crop loss. Mandi prices mean fairer sales. Calendars mean better planning. WhatsApp means zero friction.
>
> From here, we scale through **KVK partnerships**, **FPO networks**, and state agriculture departments — and eventually **IVR and USSD** for farmers on basic phones.
>
> We are **Team TETRA042**. We built Sasya AI at the Indo-French AI Innovation Sprint because the future of Indian agriculture shouldn’t depend on which language you speak.
>
> **Sasya AI — the future grows here.** Thank you.

**End card (hold 5 sec):**
```
Sasya AI · Team TETRA042
AgriTech · NIF Indo-French AI Innovation Sprint

🌐 Live demo · GitHub · Contact
github.com/krushit1307/TETRA042
```

---

## Optional 30-second extension (if you need ~7:00)

**Add after Scene 6 or weave into Scene 8:**

> One more thing — our **Features** and **About** pages walk through every capability: live voice calls, irrigation advice, fertilizer guidance, and platform policies. We also built **offline indicators** and responsive design so the app works on low-end smartphones in rural connectivity. Every detail is designed around the farmer — not the demo judge.

**Visual:** Quick montage — Features page → About → Contact form → mobile viewport toggle.

---

## Feature checklist (ensure all are shown)

| Feature | Covered in scene |
|---------|-------------------|
| Multilingual UI (10 languages) | 2, 3, 5 |
| AI text chat assistant | 3 |
| Voice input + TTS output | 3 |
| Image disease diagnosis | 4 |
| Voice call on low confidence | 4 |
| Market Yard / mandi prices | 5 |
| Crop calendar (state, soil, GPS) | 6 |
| Farmer news | 7 |
| Admin panel (news CMS) | 7 |
| WhatsApp agent | 7 |
| Unified backend pipeline | 8 |
| Impact & scalability | 9 |

---

## Recording roles (suggested)

| Role | Responsibility |
|------|----------------|
| **Presenter** | Narration + on-screen clicks |
| **Voice demo** | Second speaker for mic/WhatsApp clip (optional) |
| **Editor** | Cut B-roll, add subtitles in EN + one Indian language |
| **Slide designer** | Architecture + end card |

---

## Subtitle & accessibility tips

- Burn in **English subtitles** for judges; optional **Gujarati/Hindi** subtitles for farmer-facing version  
- Add **chapter markers** in YouTube at each scene timestamp  
- Keep background music low (-20 dB) under narration  

---

## One-paragraph elevator pitch (for video description / judges)

> **Sasya AI** (Team TETRA042) is a multilingual AgriTech platform that gives Indian farmers 24/7 access to AI-powered crop disease diagnosis, voice and text advisory in 10 languages, live mandi prices, smart crop calendars, farmer news, and WhatsApp support — through a single unified ML pipeline (EfficientNet-V2, TinyLlama+RAG, NLLB-200, Whisper). Built for the NIF Indo-French AI Innovation Sprint, Sasya AI puts inclusive, scalable AI directly in farmers’ hands — on the web, by voice, and on WhatsApp.

---

*Customize team names, problem statement number, and live URLs before publishing. Good luck with the recording!*
