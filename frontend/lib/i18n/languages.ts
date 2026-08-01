export type SupportedLanguage =
    | "en"
    | "gu"
    | "hi"
    | "mr"
    | "pa"
    | "ta"
    | "te"
    | "kn"
    | "bn"
    | "or"

export interface LanguageOption {
    code: SupportedLanguage
    name: string
    nativeName: string
}

export const LANGUAGES: LanguageOption[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
    { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
]

export const STORAGE_KEY = "sasya_language"

export function isSupportedLanguage(value: string): value is SupportedLanguage {
    return LANGUAGES.some((lang) => lang.code === value)
}
