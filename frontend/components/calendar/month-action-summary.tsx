"use client"

import type { CropEntry, Season } from "@/lib/crop-calendar/types"
import { MONTH_NAMES } from "@/lib/crop-calendar/types"
import { getActionsForMonth, formatDateRange, isWeedingAction } from "@/lib/crop-calendar/cropScheduleData"

interface MonthActionSummaryProps {
    month: number
    crops: CropEntry[]
    seasonFilter: Season | "All"
    state: string
    soil: string
}

function actionBadge(action: { crop: string; type: "sow" | "harvest" }) {
    if (action.type === "harvest") {
        return {
            label: "🌾 Harvest",
            className: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700",
            aria: "Harvesting",
        }
    }
    if (isWeedingAction(action.crop)) {
        return {
            label: "🌿 Weeding",
            className: "bg-yellow-200 dark:bg-yellow-500/30 text-yellow-900 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-500 font-semibold ring-1 ring-yellow-300/60",
            aria: "Weeding",
        }
    }
    return {
        label: "🌱 Sow",
        className: "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700",
        aria: "Sowing",
    }
}

export function MonthActionSummary({ month, crops, seasonFilter, state, soil }: MonthActionSummaryProps) {
    const actions = getActionsForMonth(crops, month, seasonFilter)

    if (actions.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 text-center shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No major sowing or harvesting this month for <span className="font-medium text-gray-700 dark:text-gray-300">{state}</span> / <span className="font-medium text-gray-700 dark:text-gray-300">{soil}</span>.
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/30">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    This month&apos;s actions — {MONTH_NAMES[month - 1]}
                </h3>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-800" role="list">
                {actions.map((action, i) => {
                    const badge = actionBadge(action)
                    return (
                        <li
                            key={`${action.crop}-${action.type}-${i}`}
                            className="px-4 sm:px-6 py-3 flex items-start gap-3 hover:bg-gray-50/60 dark:hover:bg-slate-800/30 transition-colors"
                        >
                            <span
                                className={`mt-0.5 flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg ${badge.className}`}
                                aria-label={badge.aria}
                            >
                                {badge.label}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{action.crop}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {formatDateRange(action.startMonth, action.startDay, action.endMonth, action.endDay)}
                                    {" · "}
                                    <span className="font-medium">{action.season}</span>
                                </p>
                                {action.note && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 italic">{action.note}</p>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
