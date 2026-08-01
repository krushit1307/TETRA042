"use client"

import type { CropEntry } from "@/lib/crop-calendar/types"
import { formatDateRange, isWeedingAction, parseDateWindow } from "@/lib/crop-calendar/cropScheduleData"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Calendar, Sprout, Wheat, Shovel, Info } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface DayDetailModalProps {
    day: number | null
    month: number
    crops: CropEntry[]
    sowToday: CropEntry[]
    harvestToday: CropEntry[]
    isOpen: boolean
    onClose: () => void
}

const MONTH_KEYS = [
    "month.jan", "month.feb", "month.mar", "month.apr", "month.may", "month.jun",
    "month.jul", "month.aug", "month.sep", "month.oct", "month.nov", "month.dec",
] as const

function cropBaseName(crop: string): string {
    return crop.split(" — ")[0]
}

function formatWindow(start: string, end: string): string {
    if (start === "02-29" && end === "02-29") return ""
    const w = parseDateWindow(start, end)
    return formatDateRange(w.startMonth, w.startDay, w.endMonth, w.endDay)
}

function getMainEntry(allCrops: CropEntry[], entry: CropEntry): CropEntry {
    const base = cropBaseName(entry.crop)
    return allCrops.find((c) => c.crop === base) ?? entry
}

export function DayDetailModal({
    day,
    month,
    crops,
    sowToday,
    harvestToday,
    isOpen,
    onClose,
}: DayDetailModalProps) {
    const { t } = useLanguage()

    if (day === null) return null

    const allToday = [...sowToday, ...harvestToday]
    const monthName = t(MONTH_KEYS[month - 1])

    const getTodayActionLabel = (entry: CropEntry, isHarvest: boolean): string => {
        if (isHarvest) return t("calendar.harvesting")
        if (isWeedingAction(entry.crop)) {
            const suffix = entry.crop.split(" — ")[1]
            return suffix || t("calendar.weeding")
        }
        if (entry.crop.includes(" — ")) {
            return entry.crop.split(" — ")[1]
        }
        return t("calendar.sowing")
    }

    const actionStyle = (type: "sow" | "harvest" | "weeding" | "operation") => {
        switch (type) {
            case "harvest":
                return {
                    badge: `🌾 ${t("calendar.harvest")}`,
                    className: "bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700",
                }
            case "weeding":
                return {
                    badge: `🌿 ${t("calendar.weeding")}`,
                    className: "bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-100 border-yellow-400 dark:border-yellow-500",
                }
            case "sow":
                return {
                    badge: `🌱 ${t("calendar.sow")}`,
                    className: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
                }
            default:
                return {
                    badge: `📋 ${t("calendar.fieldWork")}`,
                    className: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
                }
        }
    }

    const classifyEntry = (entry: CropEntry, harvestList: CropEntry[]): "sow" | "harvest" | "weeding" | "operation" => {
        if (harvestList.some((h) => h.crop === entry.crop)) return "harvest"
        if (isWeedingAction(entry.crop)) return "weeding"
        if (!entry.crop.includes(" — ")) return "sow"
        return "operation"
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-green-600" />
                        {monthName} {day}
                    </DialogTitle>
                    <DialogDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                        {allToday.length > 0
                            ? `${allToday.length} ${t("calendar.dayActivities")}`
                            : t("calendar.noDayActivities")}
                    </DialogDescription>
                </DialogHeader>

                {allToday.length === 0 ? (
                    <div className="py-8 text-center text-gray-500 dark:text-gray-400 text-base">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>{t("calendar.noCropActions")} {monthName} {day}.</p>
                        <p className="text-sm mt-1">{t("calendar.tryAnotherDay")}</p>
                    </div>
                ) : (
                    <ul className="space-y-4 mt-2" role="list">
                        {allToday.map((entry) => {
                            const isHarvest = harvestToday.some((h) => h.crop === entry.crop)
                            const main = getMainEntry(crops, entry)
                            const type = classifyEntry(entry, harvestToday)
                            const style = actionStyle(type)
                            const sowWindow = formatWindow(main.sowStart, main.sowEnd)
                            const harvestWindow = formatWindow(main.harvestStart, main.harvestEnd)
                            const todayLabel = getTodayActionLabel(entry, isHarvest)

                            return (
                                <li
                                    key={entry.crop}
                                    className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/50 p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                                {cropBaseName(entry.crop)}
                                            </h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                {entry.season} {t("calendar.seasonSuffix")}
                                            </p>
                                        </div>
                                        <span
                                            className={`flex-shrink-0 text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-lg border ${style.className}`}
                                        >
                                            {style.badge}
                                        </span>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
                                            {type === "harvest" ? (
                                                <Wheat className="w-4 h-4" />
                                            ) : type === "weeding" ? (
                                                <Shovel className="w-4 h-4" />
                                            ) : (
                                                <Sprout className="w-4 h-4" />
                                            )}
                                            {t("calendar.today")} {todayLabel}
                                        </p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                                            {sowWindow && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-green-600 dark:text-green-400 font-medium whitespace-nowrap">🌱 {t("calendar.sow")}:</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{sowWindow}</span>
                                                </div>
                                            )}
                                            {harvestWindow && (
                                                <div className="flex items-start gap-2">
                                                    <span className="text-amber-600 dark:text-amber-400 font-medium whitespace-nowrap">🌾 {t("calendar.harvest")}:</span>
                                                    <span className="text-gray-700 dark:text-gray-300">{harvestWindow}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {(entry.note || main.note) && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-start gap-1.5 italic">
                                            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                            {entry.note || main.note}
                                        </p>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                )}
            </DialogContent>
        </Dialog>
    )
}
