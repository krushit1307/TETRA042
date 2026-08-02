# Project Statement of Work (SOW)

**An Indo-French AI Innovation Sprint · Navrachana Innovation Foundation (NIF)**

**Project:** Sasya AI (KrishiMitra)  
**Team:** TETRA042  
**Repository:** https://github.com/krushit1307/TETRA042  
**Live API:** https://neel2601-sasya-ai-backend.hf.space

---

## Team & Submission Details

| Field | Answer |
|-------|--------|
| **Team Name** | TETRA042 |
| **Team Lead Name** | _[Fill in]_ |
| **Team Lead Email** | _[Fill in]_ |
| **Team Lead Phone** | _[Fill in]_ |
| **Date Submitted** | _[Fill in]_ |

---

## Sector Track

**Selected track:** ☑ **AgriTech**

- ☐ HealthTech  
- ☐ FinTech  
- ☑ **AgriTech**  
- ☐ EdTech  

---

## Project Information

| Field | Answer |
|-------|--------|
| **Project / Solution Name** | **Sasya AI** (frontend: **KrishiMitra**) — AI-powered multilingual agricultural advisory platform for Indian farmers |
| **Problem Statement No.** | _[Fill in official problem statement number from sprint brief]_ |
| **Industry Partner (if applicable)** | Open data via [data.gov.in](https://data.gov.in) / Agmarknet (mandi prices); optional WhatsApp outreach via Twilio Sandbox |

### What problem are we solving?

Indian farmers often lack **timely, expert, and language-accessible** guidance on crop diseases, treatment, market prices, and seasonal farming decisions. Extension services are stretched thin, literacy and connectivity vary, and most digital tools are English-first. Sasya AI bridges this gap with **AI-driven diagnosis, multilingual chat/voice advisory, mandi prices, crop calendars, and WhatsApp access** — designed for inclusive reach in 10+ Indian languages.

---

## Assumptions

1. **Data availability**
   - Agmarknet mandi price data is accessible via the **data.gov.in API** with a valid API key.
   - Crop disease labels and agricultural Q&A are available from team-curated datasets and `disease_info.json` / RAG knowledge base.
   - Historical market and weather datasets exist in-repo for analysis; live mandi UI depends on API uptime.

2. **Models & APIs**
   - Disease CNN (`Neel2601/sasya-disease-v2`), TinyLlama LoRA adapter, NLLB-200, and Whisper can be loaded from **Hugging Face** on the sprint backend (HF Space).
   - Optional: **ElevenLabs** for premium TTS; falls back to edge-tts / gTTS if unavailable.
   - Optional: **Twilio** WhatsApp Sandbox for farmer messaging during demo.

3. **Infrastructure**
   - Backend is deployed on **Hugging Face Spaces** (CPU/GPU as available); frontend on **Vercel** or local Next.js dev server.
   - Farmers have basic smartphone access (web browser or WhatsApp) — no native app install required for core flows.

4. **Constraints**
   - 36-hour sprint scope prioritizes **working prototype** over production-grade security, billing, or full KVK integration.
   - Admin panel uses simple client-side auth for demo (not production IAM).
   - Full RAG knowledge base (`agricultural_kb.json`, ~66 MB) may not be in git; chat still works with disease metadata + fallback responses.

5. **Language**
   - Primary UX supports **10 languages**: English, Gujarati, Hindi, Marathi, Punjabi, Tamil, Telugu, Kannada, Bengali, Odia.
   - Translation quality depends on NLLB-200; domain-specific agricultural terms may need post-editing at scale.

---

## Scope of Work

### In scope (36-hour sprint)

| Module | What we build |
|--------|----------------|
| **Crop disease diagnosis** | Upload leaf image → EfficientNet-V2 CNN → disease name, confidence, cause, treatment, prevention (localized) |
| **Multilingual AI assistant** | Text + voice Q&A in 10 Indian languages; grounded advisory via TinyLlama + RAG |
| **Voice / call agent** | Whisper STT → advisory pipeline → TTS playback; `/voice-chat` API for short spoken answers |
| **WhatsApp agent** | Twilio webhook → text questions + crop photos → same backend pipeline |
| **Market yard** | State → district → market mandi prices via data.gov.in Agmarknet API |
| **Crop calendar** | Seasonal sowing/harvest guidance by state and soil type |
| **Farmer news** | Curated agri news with admin CMS for team updates |
| **Web platform** | Responsive Next.js UI, i18n, home/features/about/contact, admin login |
| **Deployment** | HF Space backend + Vercel/static frontend; demo-ready endpoints |

### Out of scope (for this sprint)

- Native mobile app store release (Capacitor scaffold may exist; not sprint deliverable)
- Payment, subscription, or farmer onboarding at scale
- Integration with government KVK / e-NAM transaction systems beyond read-only price data
- Offline-first sync for entire knowledge base on device
- Clinical-grade regulatory certification for diagnosis

### Boundaries

- **One unified advisory pipeline** serves web, voice, and WhatsApp with channel-specific formatting.
- Diagnosis supports **38 crop/disease classes** in the trained CNN — not exhaustive for all Indian crops.
- WhatsApp demo limited to **Twilio Sandbox** participants unless Business API is provisioned.

---

## Project Goals

1. **Deliver a working end-to-end prototype** where a farmer can ask a question (text, voice, or image) and receive actionable advice in their language within seconds.
2. **Demonstrate inclusive AI** — low-literacy-friendly voice UI, 10-language support, and WhatsApp as a zero-install channel.
3. **Combine vision + language AI** — disease detection CNN paired with LLM advisory grounded on agricultural facts (reduced hallucination).
4. **Surface real-world utility** — live mandi prices and crop calendar alongside chat/diagnosis.
5. **Prepare for judges/demo** — stable deployed backend, clear user flows, pitch-ready narrative on AI for inclusive growth.

---

## Impact & Scalability

**Theme: AI for Inclusive Growth and Scalable Impact**

| Dimension | How Sasya AI addresses it |
|-----------|---------------------------|
| **Inclusion** | Voice-first and WhatsApp reach farmers with limited English literacy; UI and brand localized in 10 Indian languages |
| **Economic impact** | Faster disease identification reduces crop loss; mandi price visibility supports better selling decisions |
| **Scalability** | Cloud-hosted ML on Hugging Face; stateless API scales horizontally; channel-agnostic pipeline (web → WhatsApp → future IVR) |
| **Beyond sprint** | Partner with KVKs, FPOs, and state agri departments; fine-tune models on regional crops; USSD/IVR for 2G phones |
| **Sustainability** | Freemium or B2G (government / NGO) licensing; optional premium voice (ElevenLabs); data partnerships with Agmarknet |

**Target users:** Small and marginal farmers, agri-entrepreneurs, extension workers, and rural youth seeking quick crop guidance.

---

## Project Deliverables

| # | Deliverable | Status / Location |
|---|-------------|-------------------|
| 1 | **Working web prototype** | `frontend/` — Next.js app (Assistant, Diagnosis, Market Yard, Calendar, News) |
| 2 | **AI backend API** | `backend/` — FastAPI on HF Space; OpenAPI docs at `/docs` |
| 3 | **Source code repository** | https://github.com/krushit1307/TETRA042 |
| 4 | **Demo video** | _[Link to 3–5 min demo — fill in after recording]_ |
| 5 | **Pitch deck** | _[Link to slides — fill in]_ |
| 6 | **Technical README** | [README.md](./README.md) — setup, architecture, API reference |
| 7 | **This Statement of Work** | [PROJECT_SOW.md](./PROJECT_SOW.md) |

---

## Team Structure

| Name | Role on Project | Institution | Email |
|------|-----------------|-------------|-------|
| _[Name]_ | Team Lead / Project Manager | _[Institution]_ | _[email]_ |
| _[Name]_ | AI / ML Engineer (CNN, LLM, RAG) | _[Institution]_ | _[email]_ |
| _[Name]_ | Backend Engineer (FastAPI, HF deploy) | _[Institution]_ | _[email]_ |
| _[Name]_ | Frontend Engineer (Next.js, i18n, UI/UX) | _[Institution]_ | _[email]_ |
| _[Name]_ | Voice / WhatsApp Integration | _[Institution]_ | _[email]_ |
| _[Name]_ | Data / Agri Domain & QA | _[Institution]_ | _[email]_ |

_Roles aligned with README team focus: AI/Backend, Frontend, Voice/Outreach._

---

## Proposed Tech Stack

### Frontend
- **Next.js 16**, React 18, TypeScript  
- **Tailwind CSS**, Framer Motion, Radix UI  
- **Capacitor** (optional mobile wrapper)  
- **Twilio** SDK (WhatsApp webhook route)  
- **EmailJS** (contact form)

### Backend & ML
- **FastAPI** + **Gradio** (Hugging Face Space)  
- **PyTorch** — EfficientNet-V2 (disease CNN)  
- **TinyLlama-1.1B + LoRA** — agricultural advisory  
- **NLLB-200-distilled-600M** — translation (10+ languages)  
- **OpenAI Whisper-small** — speech-to-text  
- **TTS:** ElevenLabs → edge-tts → gTTS (fallback chain)

### Data & Integrations
- **data.gov.in** Agmarknet API — mandi prices  
- **Twilio** — WhatsApp Sandbox  
- Team-curated **agricultural_kb.json** (RAG), **disease_info.json**

### DevOps & Hosting
- **Hugging Face Spaces** (Docker) — backend  
- **Vercel** — frontend + serverless WhatsApp API  
- **GitHub** — version control & collaboration

---

## Future Cost to Scale

_Rough order-of-magnitude (INR / USD) if taken beyond hackathon to pilot or startup — not precise estimates._

| Category | Pilot (1 state, 10K MAU) | Scale (multi-state, 500K+ MAU) |
|----------|--------------------------|--------------------------------|
| **Cloud / GPU inference** | ₹50K–2L / $600–2.5K / month (HF Pro + GPU hours) | ₹5–20L+ / $6K–25K+ / month |
| **WhatsApp / SMS (Twilio)** | ₹10–50K / $120–600 / month | ₹2–10L+ / $2.5K–12K+ / month |
| **TTS (ElevenLabs)** | ₹5–20K / $60–250 / month | ₹1–5L / $1.2K–6K / month |
| **Data APIs & storage** | ₹5–15K / $60–180 / month | ₹50K–2L / $600–2.5K / month |
| **Engineering team (6–12 mo)** | ₹15–40L / $18K–48K (contract / small team) | ₹1–3Cr+ / $120K–360K+ |
| **Compliance, legal, field ops** | ₹2–5L / $2.5K–6K | ₹20L–1Cr+ / $24K–120K+ |

**Total ballpark to launch a credible pilot:** **₹25–70L (~$30K–85K)** over 6–12 months including team, infra, and limited field partnerships.

**Cost reduction strategies:** Open-source models on own GPU, government cloud credits, B2G grants (NIF / agri schemes), volunteer KVK champions for distribution.

---

## Quick Reference — Q&A Summary

| Question | Short answer |
|----------|--------------|
| **What is the product?** | Sasya AI — multilingual AgriTech platform for disease diagnosis, AI advisory, mandi prices, and farmer outreach |
| **Which sector?** | AgriTech |
| **Who is it for?** | Indian farmers and extension workers, especially non-English speakers |
| **What’s unique?** | Vision + LLM + voice + WhatsApp in one pipeline, 10 Indian languages |
| **What’s deployed?** | HF Space backend + Next.js frontend |
| **Main deliverables?** | Prototype, repo, demo video, pitch deck |
| **Scale path?** | KVK/FPO partnerships, IVR/USSD, regional model fine-tuning |

---

*Document prepared for Navrachana Innovation Foundation (NIF) — Indo-French AI Innovation Sprint. Update bracketed fields before final submission.*
