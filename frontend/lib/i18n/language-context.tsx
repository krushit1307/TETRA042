"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { LANGUAGES, STORAGE_KEY, isSupportedLanguage, type SupportedLanguage } from "./languages"
import { translate } from "./translate"

interface LanguageContextValue {
    language: SupportedLanguage
    setLanguage: (lang: SupportedLanguage) => void
    t: (key: string) => string
    languages: typeof LANGUAGES
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<SupportedLanguage>("en")

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && isSupportedLanguage(saved)) {
            setLanguageState(saved)
            document.documentElement.lang = saved === "en" ? "en" : saved
        }
    }, [])

    const setLanguage = useCallback((lang: SupportedLanguage) => {
        setLanguageState(lang)
        localStorage.setItem(STORAGE_KEY, lang)
        document.documentElement.lang = lang === "en" ? "en" : lang
    }, [])

    const t = useCallback((key: string) => translate(key, language), [language])

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext)
    if (!ctx) {
        throw new Error("useLanguage must be used within LanguageProvider")
    }
    return ctx
}
