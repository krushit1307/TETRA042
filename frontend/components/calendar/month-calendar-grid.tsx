"use client"

import { useState } from "react"
import type { CropEntry, Season } from "@/lib/crop-calendar/types"
import { DAYS_IN_MONTH, MONTH_NAMES, WEEKDAY_HEADERS } from "@/lib/crop-calendar/types"
import { getDayActions, getFirstDayOffset, isWeedingAction } from "@/lib/crop-calendar/cropScheduleData"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthCalendarGridProps {
    month: number
    crops: CropEntry[]
    seasonFilter: Season | "All"
    onMonthChange: (month: number) => void
}

const MAX_VISIBLE_CHIPS = 3

function chipLabel(crop: string): string {
    const base = crop.split(" — ")[0].split(" ")[0]
    if (isWeedingAction(crop)) {
        const phase = crop.includes("2nd") ? "W2" : "W1"
        return `${base} ${phase}`
    }
    return base
}

export function MonthCalendarGrid({ month, crops, seasonFilter, onMonthChange }: MonthCalendarGridProps) {
    const [expandedDay, setExpandedDay] = useState<number | null>(null)
    const daysInMonth = DAYS_IN_MONTH[month - 1]
    const firstOffset = getFirstDayOffset()
    const totalCells = Math.ceil((daysInMonth + firstOffset) / 7) * 7

    const prevMonth = () => onMonthChange(month === 1 ? 12 : month - 1)
    const nextMonth = () => onMonthChange(month === 12 ? 1 : month + 1)

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
            {/* Month navigation */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={prevMonth}
                    aria-label="Previous month"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all"
                >
                    <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                    {MONTH_NAMES[month - 1]}
                </h2>
                <button
                    onClick={nextMonth}
                    aria-label="Next month"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all"
                >
                    Next <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-2 sm:px-3 pt-3" role="row">
                {WEEKDAY_HEADERS.map((day, idx) => (
                    <div
                        key={day}
                        role="columnheader"
                        className={`py-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg ${
                            idx === 0
                                ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                : "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/60"
                        }`}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Day grid — boxed cells */}
            <div
                className="grid grid-cols-7 gap-1.5 sm:gap-2 p-2 sm:p-3"
                role="grid"
                aria-label={`Crop calendar for ${MONTH_NAMES[month - 1]}`}
            >
                {Array.from({ length: totalCells }, (_, i) => {
                    const dayNum = i - firstOffset + 1
                    const isValid = dayNum >= 1 && dayNum <= daysInMonth
                    const isSunday = i % 7 === 0

                    if (!isValid) {
                        return <div key={`empty-${i}`} className="min-h-[88px] sm:min-h-[108px]" aria-hidden="true" />
                    }

                    const { sow, harvest } = getDayActions(crops, month, dayNum, seasonFilter)
                    const weeding = sow.filter((c) => isWeedingAction(c.crop))
                    const sowing = sow.filter((c) => !isWeedingAction(c.crop))
                    const allChips = [...sowing, ...weeding, ...harvest]
                    const totalChips = allChips.length
                    const isExpanded = expandedDay === dayNum
                    const hasActivity = totalChips > 0

                    const visibleSowing = isExpanded ? sowing : sowing.slice(0, 1)
                    const visibleWeeding = isExpanded ? weeding : weeding.slice(0, 1)
                    const visibleHarvest = isExpanded
                        ? harvest
                        : harvest.slice(0, Math.max(0, MAX_VISIBLE_CHIPS - visibleSowing.length - visibleWeeding.length))
                    const visibleCount = visibleSowing.length + visibleWeeding.length + visibleHarvest.length
                    const hiddenCount = totalChips - visibleCount

                    return (
                        <div
                            key={dayNum}
                            role="gridcell"
                            aria-label={`${MONTH_NAMES[month - 1]} ${dayNum}`}
                            className={`min-h-[88px] sm:min-h-[108px] rounded-xl border-2 flex flex-col transition-all duration-200 ${
                                hasActivity
                                    ? "border-green-200 dark:border-green-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-green-400 dark:hover:border-green-600"
                                    : isSunday
                                      ? "border-red-100 dark:border-red-900/30 bg-red-50/40 dark:bg-red-900/10"
                                      : "border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-slate-800/40 hover:border-gray-200 dark:hover:border-gray-700"
                            }`}
                        >
                            {/* Day number badge */}
                            <div className="flex justify-end p-1.5 pb-0">
                                <span
                                    className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[11px] sm:text-xs font-bold ${
                                        hasActivity
                                            ? "bg-green-600 text-white shadow-sm"
                                            : isSunday
                                              ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                                              : "bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                                    }`}
                                >
                                    {dayNum}
                                </span>
                            </div>

                            {/* Activity chips */}
                            <div className="flex-1 flex flex-col gap-0.5 px-1 pb-1.5 overflow-hidden">
                                {visibleSowing.map((c) => (
                                    <span
                                        key={`sow-${c.crop}`}
                                        className="text-[8px] sm:text-[9px] leading-tight px-1 py-0.5 rounded-md bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 font-medium truncate shadow-sm"
                                        aria-label={`Sow ${c.crop}`}
                                    >
                                        🌱 {chipLabel(c.crop)}
                                    </span>
                                ))}
                                {visibleWeeding.map((c) => (
                                    <span
                                        key={`weed-${c.crop}`}
                                        className="text-[8px] sm:text-[9px] leading-tight px-1 py-0.5 rounded-md bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-500 font-semibold truncate shadow-sm ring-1 ring-yellow-300/60"
                                        aria-label={`Weeding ${c.crop}`}
                                    >
                                        🌿 {chipLabel(c.crop)}
                                    </span>
                                ))}
                                {visibleHarvest.map((c) => (
                                    <span
                                        key={`harv-${c.crop}`}
                                        className="text-[8px] sm:text-[9px] leading-tight px-1 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700 font-medium truncate shadow-sm"
                                        aria-label={`Harvest ${c.crop}`}
                                    >
                                        🌾 {chipLabel(c.crop)}
                                    </span>
                                ))}
                                {hiddenCount > 0 && (
                                    <button
                                        onClick={() => setExpandedDay(isExpanded ? null : dayNum)}
                                        className="text-[8px] sm:text-[9px] text-green-700 dark:text-green-400 font-semibold hover:underline text-left mt-auto"
                                        aria-label={`Show ${hiddenCount} more on day ${dayNum}`}
                                    >
                                        +{hiddenCount} more
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
