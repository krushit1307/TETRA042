"use client"

import { useState } from "react"
import type { CropEntry, Season } from "@/lib/crop-calendar/types"
import { DAYS_IN_MONTH } from "@/lib/crop-calendar/types"
import { getDayActions, getFirstDayOffset, isWeedingAction } from "@/lib/crop-calendar/cropScheduleData"
import { translateCropShort } from "@/lib/crop-calendar/calendar-i18n"
import { DayDetailModal } from "@/components/calendar/day-detail-modal"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface MonthCalendarGridProps {
    month: number
    crops: CropEntry[]
    seasonFilter: Season | "All"
    onMonthChange: (month: number) => void
}

const MONTH_KEYS = [
    "month.jan", "month.feb", "month.mar", "month.apr", "month.may", "month.jun",
    "month.jul", "month.aug", "month.sep", "month.oct", "month.nov", "month.dec",
] as const

const WEEKDAY_KEYS = [
    "week.sun", "week.mon", "week.tue", "week.wed", "week.thu", "week.fri", "week.sat",
] as const

const MAX_VISIBLE_CHIPS = 2

function chipLabel(crop: string, t: (key: string) => string): string {
    return translateCropShort(crop, t)
}

export function MonthCalendarGrid({ month, crops, seasonFilter, onMonthChange }: MonthCalendarGridProps) {
    const { t } = useLanguage()
    const [selectedDay, setSelectedDay] = useState<number | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const daysInMonth = DAYS_IN_MONTH[month - 1]
    const firstOffset = getFirstDayOffset()
    const totalCells = Math.ceil((daysInMonth + firstOffset) / 7) * 7
    const monthName = t(MONTH_KEYS[month - 1])

    const prevMonth = () => onMonthChange(month === 1 ? 12 : month - 1)
    const nextMonth = () => onMonthChange(month === 12 ? 1 : month + 1)

    const openDay = (dayNum: number) => {
        setSelectedDay(dayNum)
        setModalOpen(true)
    }

    const closeDay = () => {
        setModalOpen(false)
        setSelectedDay(null)
    }

    const selectedSow = selectedDay ? getDayActions(crops, month, selectedDay, seasonFilter).sow : []
    const selectedHarvest = selectedDay ? getDayActions(crops, month, selectedDay, seasonFilter).harvest : []

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
                {/* Month navigation */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={prevMonth}
                        aria-label={t("calendar.prev")}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" /> {t("calendar.prev")}
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white" aria-live="polite">
                        {monthName}
                    </h2>
                    <button
                        onClick={nextMonth}
                        aria-label={t("calendar.next")}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all"
                    >
                        {t("calendar.next")} <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 px-2 sm:px-3 pt-3" role="row">
                    {WEEKDAY_KEYS.map((key, idx) => (
                        <div
                            key={key}
                            role="columnheader"
                            className={`py-3 text-center text-sm sm:text-base font-bold uppercase tracking-wider rounded-lg ${
                                idx === 0
                                    ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20"
                                    : "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/60"
                            }`}
                        >
                            {t(key)}
                        </div>
                    ))}
                </div>

                {/* Day grid — boxed cells */}
                <div
                    className="grid grid-cols-7 gap-1.5 sm:gap-2 p-2 sm:p-3"
                    role="grid"
                    aria-label={`Crop calendar for ${monthName}`}
                >
                    {Array.from({ length: totalCells }, (_, i) => {
                        const dayNum = i - firstOffset + 1
                        const isValid = dayNum >= 1 && dayNum <= daysInMonth
                        const isSunday = i % 7 === 0

                        if (!isValid) {
                            return <div key={`empty-${i}`} className="min-h-[120px] sm:min-h-[150px]" aria-hidden="true" />
                        }

                        const { sow, harvest } = getDayActions(crops, month, dayNum, seasonFilter)
                        const weeding = sow.filter((c) => isWeedingAction(c.crop))
                        const sowing = sow.filter((c) => !isWeedingAction(c.crop))
                        const allChips = [...sowing, ...weeding, ...harvest]
                        const totalChips = allChips.length
                        const hasActivity = totalChips > 0
                        const isSelected = selectedDay === dayNum && modalOpen

                        const visibleSowing = sowing.slice(0, 1)
                        const visibleWeeding = weeding.slice(0, 1)
                        const visibleHarvest = harvest.slice(0, Math.max(0, MAX_VISIBLE_CHIPS - visibleSowing.length - visibleWeeding.length))
                        const hiddenCount = totalChips - visibleSowing.length - visibleWeeding.length - visibleHarvest.length

                        return (
                            <button
                                key={dayNum}
                                type="button"
                                role="gridcell"
                                aria-label={`${monthName} ${dayNum}${hasActivity ? `, ${totalChips} ${t("calendar.activities")}` : ""}`}
                                onClick={() => openDay(dayNum)}
                                className={`min-h-[120px] sm:min-h-[150px] rounded-xl border-2 flex flex-col transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 ${
                                    isSelected
                                        ? "border-green-500 dark:border-green-500 ring-2 ring-green-400/50 bg-green-50/50 dark:bg-green-900/20"
                                        : hasActivity
                                          ? "border-green-200 dark:border-green-800 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-green-400 dark:hover:border-green-600"
                                          : isSunday
                                            ? "border-red-100 dark:border-red-900/30 bg-red-50/40 dark:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800"
                                            : "border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-gray-600"
                                }`}
                            >
                                {/* Day number badge */}
                                <div className="flex justify-end p-2 pb-1">
                                    <span
                                        className={`inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-base sm:text-lg font-bold ${
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
                                <div className="flex-1 flex flex-col gap-1 px-1.5 pb-2 overflow-hidden pointer-events-none">
                                    {visibleSowing.map((c) => (
                                        <span
                                            key={`sow-${c.crop}`}
                                            className="text-sm sm:text-base leading-snug px-2 py-1.5 rounded-md bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700 font-semibold truncate shadow-sm"
                                        >
                                            🌱 {chipLabel(c.crop, t)}
                                        </span>
                                    ))}
                                    {visibleWeeding.map((c) => (
                                        <span
                                            key={`weed-${c.crop}`}
                                            className="text-sm sm:text-base leading-snug px-2 py-1.5 rounded-md bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-500 font-bold truncate shadow-sm ring-1 ring-yellow-300/60"
                                        >
                                            🌿 {chipLabel(c.crop, t)}
                                        </span>
                                    ))}
                                    {visibleHarvest.map((c) => (
                                        <span
                                            key={`harv-${c.crop}`}
                                            className="text-sm sm:text-base leading-snug px-2 py-1.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700 font-semibold truncate shadow-sm"
                                        >
                                            🌾 {chipLabel(c.crop, t)}
                                        </span>
                                    ))}
                                    {hiddenCount > 0 && (
                                        <span className="text-sm sm:text-base text-green-700 dark:text-green-400 font-bold mt-auto">
                                            +{hiddenCount} {t("calendar.more")}
                                        </span>
                                    )}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <DayDetailModal
                day={selectedDay}
                month={month}
                crops={crops}
                sowToday={selectedSow}
                harvestToday={selectedHarvest}
                isOpen={modalOpen}
                onClose={closeDay}
            />
        </>
    )
}
