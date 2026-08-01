import { translations as marketTranslations } from "@/lib/translations"
import { applyBrandName } from "./helpers"
import { SITE_TRANSLATIONS } from "./site"
import type { SupportedLanguage } from "./languages"

export function translate(key: string, lang: SupportedLanguage): string {
    const raw =
        SITE_TRANSLATIONS[key]?.[lang] ??
        marketTranslations[key]?.[lang] ??
        marketTranslations[key]?.en ??
        SITE_TRANSLATIONS[key]?.en ??
        key

    return applyBrandName(raw, lang)
}
