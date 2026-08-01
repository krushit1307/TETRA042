"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, MapPin, RefreshCw, CalendarDays } from "lucide-react"
import { useCropLocation } from "@/hooks/use-crop-location"
import { StateSoilSelectors } from "@/components/calendar/state-soil-selectors"
import { MonthCalendarGrid } from "@/components/calendar/month-calendar-grid"
import { MonthActionSummary } from "@/components/calendar/month-action-summary"
import { getDefaultSoilForState } from "@/lib/crop-calendar/cropCalendarData"
import { getScheduleForStateSoil } from "@/lib/crop-calendar/cropScheduleData"
import { DEFAULT_STATE, STORAGE_KEYS, type Season, type SoilType } from "@/lib/crop-calendar/types"
import { useLanguage } from "@/lib/i18n/language-context"

export function CropCalendarPage() {
    const { t } = useLanguage()
    const { detectedState, status, notice, detectLocation, isDetecting } = useCropLocation()

    const [state, setState] = useState(DEFAULT_STATE)
    const [soil, setSoil] = useState<SoilType>(() => getDefaultSoilForState(DEFAULT_STATE))
    const [month, setMonth] = useState(() => new Date().getMonth() + 1)
    const [seasonFilter, setSeasonFilter] = useState<Season | "All">("All")
    const [initialized, setInitialized] = useState(false)

    // Restore saved preferences or apply detected state
    useEffect(() => {
        if (initialized) return

        const hasSaved = localStorage.getItem(STORAGE_KEYS.hasSaved) === "true"
        const savedState = localStorage.getItem(STORAGE_KEYS.state)
        const savedSoil = localStorage.getItem(STORAGE_KEYS.soil)

        if (hasSaved && savedState) {
            setState(savedState)
            setSoil((savedSoil as SoilType) || getDefaultSoilForState(savedState))
            setInitialized(true)
            return
        }

        if (detectedState && status !== "detecting" && status !== "idle") {
            setState(detectedState)
            setSoil(getDefaultSoilForState(detectedState))
            setInitialized(true)
        }
    }, [detectedState, status, initialized])

    // Persist state/soil changes
    const persistSelection = useCallback((newState: string, newSoil: string) => {
        localStorage.setItem(STORAGE_KEYS.state, newState)
        localStorage.setItem(STORAGE_KEYS.soil, newSoil)
        localStorage.setItem(STORAGE_KEYS.hasSaved, "true")
    }, [])

    const handleStateChange = (newState: string) => {
        const newSoil = getDefaultSoilForState(newState)
        setState(newState)
        setSoil(newSoil)
        persistSelection(newState, newSoil)
    }

    const handleSoilChange = (newSoil: string) => {
        setSoil(newSoil as SoilType)
        persistSelection(state, newSoil)
    }

    const handleRefreshLocation = () => {
        setInitialized(false)
        detectLocation(true)
    }

    const crops = getScheduleForStateSoil(state, soil)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <CalendarDays className="w-7 h-7 text-green-600" aria-hidden="true" />
                        <span>{t("calendar.title")}</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {t("calendar.subtitle")}
                    </p>
                </div>
                <button
                    onClick={handleRefreshLocation}
                    disabled={isDetecting}
                    aria-label={t("calendar.detectLocation")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {isDetecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    {t("calendar.detectLocation")}
                </button>
            </div>

            {/* Location notice */}
            {isDetecting && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/50 rounded-lg px-4 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" aria-hidden="true" />
                    {t("calendar.detecting")}
                </div>
            )}
            {notice && !isDetecting && (
                <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-4 py-2.5" role="status">
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {t("calendar.locationFailed")}
                </div>
            )}
            {status === "success" && !notice && !isDetecting && detectedState && (
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-2.5" role="status">
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    {t("calendar.locationDetected")} <span className="font-medium">{detectedState}</span>
                </div>
            )}

            {/* State & Soil selectors */}
            <StateSoilSelectors
                state={state}
                soil={soil}
                onStateChange={handleStateChange}
                onSoilChange={handleSoilChange}
                isDetecting={isDetecting}
            />

            {/* Season filter + Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-sm sm:text-base">
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-green-500 shadow-sm" aria-hidden="true" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t("calendar.sow")}</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-yellow-400 border border-yellow-500 shadow-sm" aria-hidden="true" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t("calendar.weeding")}</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded bg-amber-500 shadow-sm" aria-hidden="true" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{t("calendar.harvest")}</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="season-filter" className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400">{t("calendar.season")}</label>
                    <select
                        id="season-filter"
                        value={seasonFilter}
                        onChange={(e) => setSeasonFilter(e.target.value as Season | "All")}
                        aria-label="Filter by crop season"
                        className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white text-sm sm:text-base focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="All">{t("season.all")}</option>
                        <option value="Kharif">{t("season.kharif")}</option>
                        <option value="Rabi">{t("season.rabi")}</option>
                        <option value="Zaid">{t("season.zaid")}</option>
                    </select>
                </div>
            </div>

            {/* Calendar grid */}
            <MonthCalendarGrid
                key={`${state}-${soil}`}
                month={month}
                crops={crops}
                seasonFilter={seasonFilter}
                onMonthChange={setMonth}
            />

            {/* Month summary */}
            <MonthActionSummary
                key={`summary-${state}-${soil}`}
                month={month}
                crops={crops}
                seasonFilter={seasonFilter}
                state={state}
                soil={soil}
            />

            {/* Disclaimer */}
            <footer className="text-center text-xs text-gray-400 dark:text-gray-500 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                {t("calendar.disclaimer")}
            </footer>
        </div>
    )
}
