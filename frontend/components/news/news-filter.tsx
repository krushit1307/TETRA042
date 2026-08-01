"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { SupportedLanguage } from "@/lib/i18n/languages"
import { useLanguage } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"

interface NewsFilterProps {
    currentLanguage: SupportedLanguage
    onLanguageChange: (lang: SupportedLanguage) => void
    disabled?: boolean
}

export function NewsFilter({ currentLanguage, onLanguageChange, disabled }: NewsFilterProps) {
    const { t, languages } = useLanguage()

    return (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Globe className="w-4 h-4 text-green-600 dark:text-green-500" />
                <span className="hidden sm:inline">{t("news.selectLanguage")}</span>
            </div>

            <Select
                value={currentLanguage}
                onValueChange={(val) => onLanguageChange(val as SupportedLanguage)}
                disabled={disabled}
            >
                <SelectTrigger className="w-[180px] h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-green-500">
                    <SelectValue placeholder={t("common.selectLanguage")} />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code} className="cursor-pointer">
                            <span className="font-medium mr-2">{lang.nativeName}</span>
                            <span className="text-xs text-gray-500">({lang.name})</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
