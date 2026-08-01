import { translations as marketTranslations } from "@/lib/translations"
import { SITE_TRANSLATIONS } from "./site"
import type { SupportedLanguage } from "./languages"

export function translate(key: string, lang: SupportedLanguage): string {
    return SITE_TRANSLATIONS[key]?.[lang] ?? marketTranslations[key]?.[lang] ?? marketTranslations[key]?.en ?? SITE_TRANSLATIONS[key]?.en ?? key
}
