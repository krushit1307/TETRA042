import type { SupportedLanguage } from "./languages"

export type TranslationSet = Record<SupportedLanguage, string>

/** Localized brand name shown across the site */
export const BRAND_NAMES = {
    en: "Sasya AI",
    gu: "સસ્ય એઆઈ",
    hi: "सस्य एआई",
    mr: "सस्य एआय",
    pa: "ਸਸਿਆ ਏਆਈ",
    ta: "சச்யா ஏஐ",
    te: "సస్య ఏఐ",
    kn: "ಸಸ್ಯ ಎಐ",
    bn: "শস্য এআই",
    or: "ଶସ୍ୟ ଏଆଇ",
} satisfies TranslationSet

const BRAND_PLACEHOLDER = "Sasya AI"

export function getBrandName(lang: SupportedLanguage): string {
    return BRAND_NAMES[lang]
}

export function applyBrandName(text: string, lang: SupportedLanguage): string {
    return text.split(BRAND_PLACEHOLDER).join(getBrandName(lang))
}

/** Build a hardcoded translation entry for all 10 supported languages */
export function L(
    en: string,
    gu: string,
    hi: string,
    mr: string,
    pa: string,
    ta: string,
    te: string,
    kn: string,
    bn: string,
    or: string,
): TranslationSet {
    return { en, gu, hi, mr, pa, ta, te, kn, bn, or }
}
