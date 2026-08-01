import type { SupportedLanguage } from "./languages"

export type TranslationSet = Record<SupportedLanguage, string>

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
