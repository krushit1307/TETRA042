"use client"

import { STATES, getSoilsForState } from "@/lib/crop-calendar/cropCalendarData"
import type { SoilType } from "@/lib/crop-calendar/types"
import { MapPin, Layers } from "lucide-react"

interface StateSoilSelectorsProps {
    state: string
    soil: string
    onStateChange: (state: string) => void
    onSoilChange: (soil: string) => void
    isDetecting?: boolean
}

export function StateSoilSelectors({
    state,
    soil,
    onStateChange,
    onSoilChange,
    isDetecting,
}: StateSoilSelectorsProps) {
    const soilOptions = getSoilsForState(state)

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="cropcal-state" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <MapPin className="w-4 h-4 text-green-600" aria-hidden="true" />
                    State / UT
                    {isDetecting && (
                        <span className="text-xs text-gray-400 font-normal ml-1">(detecting…)</span>
                    )}
                </label>
                <select
                    id="cropcal-state"
                    value={state}
                    onChange={(e) => onStateChange(e.target.value)}
                    aria-label="Select your state or union territory"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
                >
                    {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="cropcal-soil" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <Layers className="w-4 h-4 text-green-600" aria-hidden="true" />
                    Soil Type
                </label>
                <select
                    id="cropcal-soil"
                    value={soil}
                    onChange={(e) => onSoilChange(e.target.value)}
                    aria-label="Select your soil type"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm"
                >
                    {soilOptions.map((s: SoilType) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
