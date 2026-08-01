export type Season = "Kharif" | "Rabi" | "Zaid"

export type SoilType =
    | "Alluvial Soil"
    | "Black Soil (Regur)"
    | "Red & Yellow Soil"
    | "Laterite Soil"
    | "Desert / Arid Soil"
    | "Mountain / Forest Soil"
    | "Saline / Alkaline Soil"
    | "Peaty / Marshy Soil"

export type RegionTag = "north" | "south" | "east" | "west" | "central" | "northeast" | "desert" | "mountain" | "coastal"

export interface CropEntry {
    crop: string
    season: Season
    sowStart: string
    sowEnd: string
    harvestStart: string
    harvestEnd: string
    note?: string
}

export interface DateWindow {
    startMonth: number
    startDay: number
    endMonth: number
    endDay: number
}

export interface MonthAction {
    crop: string
    season: Season
    type: "sow" | "harvest"
    startMonth: number
    startDay: number
    endMonth: number
    endDay: number
    note?: string
}

export const STORAGE_KEYS = {
    state: "cropcal_state",
    soil: "cropcal_soil",
    hasSaved: "cropcal_has_saved",
} as const

export const DEFAULT_STATE = "Gujarat"

export const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
] as const

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

export const WEEKDAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const
