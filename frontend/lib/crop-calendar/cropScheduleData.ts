import type { CropEntry, DateWindow, MonthAction, Season, SoilType } from "./types"
import { DAYS_IN_MONTH, MONTH_NAMES } from "./types"
import { STATE_REGION_MAP, STATE_SOIL_MAP } from "./cropCalendarData"

// Windows are indicative, based on ICAR/state agri-university crop calendars.
// Farmers should confirm with their local Krishi Vigyan Kendra.
//
// Operation timings indicative, based on ICAR / state agri-university package-of-practices.
// Farmers should confirm with their local Krishi Vigyan Kendra.

interface CropTemplate {
    crop: string
    season: Season
    sowStart: string
    sowEnd: string
    harvestStart: string
    harvestEnd: string
    note?: string
    waterIntensive?: boolean
    temperate?: boolean
    eastOnly?: boolean
    westOnly?: boolean
}

type OpSlot = "sow" | "harvest"

interface CropOperation {
    suffix: string
    dasFrom: number
    dasTo: number
    slot: OpSlot
    note?: string
}

/** Inactive window — Feb 29 is never iterated in the day loop */
const INACTIVE = { start: "02-29", end: "02-29" }

function parseMd(value: string): { month: number; day: number } {
    const [m, d] = value.split("-").map(Number)
    return { month: m, day: d }
}

function formatMd(month: number, day: number): string {
    return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function addDays(month: number, day: number, offset: number): { month: number; day: number } {
    let m = month
    let d = day + offset
    while (d > DAYS_IN_MONTH[m - 1]) {
        d -= DAYS_IN_MONTH[m - 1]
        m = m === 12 ? 1 : m + 1
    }
    while (d < 1) {
        m = m === 1 ? 12 : m - 1
        d += DAYS_IN_MONTH[m - 1]
    }
    return { month: m, day: d }
}

function shiftWindow(start: string, end: string, dayOffset: number): { start: string; end: string } {
    const s = parseMd(start)
    const e = parseMd(end)
    const ns = addDays(s.month, s.day, dayOffset)
    const ne = addDays(e.month, e.day, dayOffset)
    return { start: formatMd(ns.month, ns.day), end: formatMd(ne.month, ne.day) }
}

function dasWindow(sowStart: string, dasFrom: number, dasTo: number): { start: string; end: string } {
    const base = parseMd(sowStart)
    const s = addDays(base.month, base.day, dasFrom)
    const e = addDays(base.month, base.day, dasTo)
    return { start: formatMd(s.month, s.day), end: formatMd(e.month, e.day) }
}

const CROP_OPERATIONS: Record<string, CropOperation[]> = {
    "Cotton": [
        { suffix: "Seed Treatment", dasFrom: 0, dasTo: 2, slot: "sow", note: "Thiram/Carbendazim at sowing" },
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow", note: "Keep field weed-free up to 60 days" },
        { suffix: "IPM Spray", dasFrom: 40, dasTo: 45, slot: "sow", note: "Scout pink bollworm & whitefly; neem/IPM" },
        { suffix: "N Top-dress", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 60, dasTo: 70, slot: "sow" },
        { suffix: "Irrigation (Flowering)", dasFrom: 75, dasTo: 85, slot: "harvest", note: "Critical irrigation at flowering & boll development" },
    ],
    "Groundnut": [
        { suffix: "Pre-emergence Weedicide", dasFrom: 1, dasTo: 2, slot: "sow", note: "Optional, within 2 days of sowing" },
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "Gypsum (Pegging)", dasFrom: 30, dasTo: 35, slot: "sow", note: "Calcium at pegging stage" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Foliar Urea (1st)", dasFrom: 30, dasTo: 32, slot: "sow", note: "2% urea spray" },
        { suffix: "Irrigation (Flowering)", dasFrom: 42, dasTo: 48, slot: "harvest", note: "Critical at flowering, pegging, pod formation" },
        { suffix: "Foliar Urea (2nd)", dasFrom: 60, dasTo: 62, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 50, dasTo: 55, slot: "sow", note: "Leaf miner / Spodoptera / tikka as needed" },
    ],
    "Wheat": [
        { suffix: "Basal Fertilizer", dasFrom: 0, dasTo: 2, slot: "sow", note: "N-P-K at sowing" },
        { suffix: "CRI Irrigation", dasFrom: 20, dasTo: 25, slot: "harvest" },
        { suffix: "1st Weeding", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 45, slot: "sow", note: "Remaining N with 1st irrigation" },
        { suffix: "Herbicide Spray", dasFrom: 30, dasTo: 35, slot: "sow", note: "2,4-D / Pendimethalin / Sulfosulfuron" },
        { suffix: "Tillering Irrigation", dasFrom: 40, dasTo: 45, slot: "harvest" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Jointing Irrigation", dasFrom: 60, dasTo: 65, slot: "harvest" },
        { suffix: "Flowering Irrigation", dasFrom: 85, dasTo: 90, slot: "harvest" },
        { suffix: "Milk Stage Irrigation", dasFrom: 100, dasTo: 105, slot: "harvest" },
    ],
    "Cumin": [
        { suffix: "Light Irrigation", dasFrom: 10, dasTo: 15, slot: "harvest", note: "Shallow-rooted; light frequent irrigation" },
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 50, dasTo: 55, slot: "sow" },
        { suffix: "Disease Spray", dasFrom: 45, dasTo: 55, slot: "sow", note: "Watch wilt/blight/powdery mildew" },
        { suffix: "2nd Irrigation", dasFrom: 50, dasTo: 60, slot: "harvest" },
    ],
    "Castor": [
        { suffix: "Gap Filling", dasFrom: 12, dasTo: 15, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "Pest Management", dasFrom: 35, dasTo: 45, slot: "sow", note: "Sucking pests & semilooper" },
        { suffix: "Irrigation (Spike Dev)", dasFrom: 50, dasTo: 75, slot: "harvest" },
        { suffix: "2nd Weeding", dasFrom: 55, dasTo: 60, slot: "sow" },
    ],
    "Mustard": [
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow", note: "Thinning & first weeding" },
        { suffix: "2nd Weeding", dasFrom: 40, dasTo: 45, slot: "sow" },
        { suffix: "Irrigation (Flowering)", dasFrom: 55, dasTo: 65, slot: "harvest", note: "At flowering & siliqua formation" },
        { suffix: "Aphid Spray", dasFrom: 60, dasTo: 70, slot: "sow", note: "Spray at flowering" },
    ],
    "Rice": [
        { suffix: "Nursery Prep", dasFrom: -15, dasTo: -10, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 50, dasTo: 60, slot: "sow", note: "Stem borer / leaf folder IPM" },
        { suffix: "Panicle Irrigation", dasFrom: 65, dasTo: 75, slot: "harvest", note: "Critical at flowering & grain filling" },
    ],
    "Maize": [
        { suffix: "Gap Filling", dasFrom: 10, dasTo: 12, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 40, dasTo: 50, slot: "sow", note: "Fall armyworm / stem borer" },
        { suffix: "Tassel Irrigation", dasFrom: 55, dasTo: 65, slot: "harvest" },
    ],
    "Soybean": [
        { suffix: "Rhizobium Treatment", dasFrom: 0, dasTo: 1, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 40, dasTo: 45, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 45, dasTo: 55, slot: "sow", note: "Girdle beetle / semilooper IPM" },
        { suffix: "Pod Irrigation", dasFrom: 55, dasTo: 65, slot: "harvest" },
    ],
    "Tur": [
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 50, dasTo: 55, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 60, dasTo: 70, slot: "sow", note: "Pod borer / wilt management" },
        { suffix: "Flowering Irrigation", dasFrom: 75, dasTo: 85, slot: "harvest" },
    ],
    "Bajra": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 40, dasTo: 50, slot: "sow" },
    ],
    "Jowar": [
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Shoot Fly Spray", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "Flowering Irrigation", dasFrom: 55, dasTo: 65, slot: "harvest" },
    ],
    "Moong": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 25, dasTo: 35, slot: "sow" },
    ],
    "Urad": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 30, dasTo: 40, slot: "sow" },
    ],
    "Gram": [
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Pod Borer Spray", dasFrom: 55, dasTo: 65, slot: "sow" },
        { suffix: "Flowering Irrigation", dasFrom: 50, dasTo: 60, slot: "harvest" },
    ],
    "Barley": [
        { suffix: "Basal Fertilizer", dasFrom: 0, dasTo: 2, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Irrigation (Tillering)", dasFrom: 40, dasTo: 45, slot: "harvest" },
        { suffix: "2nd Weeding", dasFrom: 50, dasTo: 55, slot: "sow" },
    ],
    "Potato": [
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "Earthing Up", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 40, dasTo: 45, slot: "sow" },
        { suffix: "Blight Spray", dasFrom: 40, dasTo: 50, slot: "sow" },
        { suffix: "Irrigation (Tuber)", dasFrom: 55, dasTo: 65, slot: "harvest" },
    ],
    "Sugarcane": [
        { suffix: "Gap Filling", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "1st Weeding", dasFrom: 30, dasTo: 40, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 45, dasTo: 55, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 60, dasTo: 70, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 80, dasTo: 90, slot: "sow" },
        { suffix: "Irrigation (Grand Growth)", dasFrom: 90, dasTo: 120, slot: "harvest" },
    ],
    "Watermelon": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Irrigation (Fruit Set)", dasFrom: 40, dasTo: 50, slot: "harvest" },
    ],
    "Muskmelon": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 30, dasTo: 40, slot: "sow" },
        { suffix: "Irrigation (Fruit Dev)", dasFrom: 40, dasTo: 50, slot: "harvest" },
    ],
    "Cucumber": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 30, dasTo: 40, slot: "sow" },
        { suffix: "Irrigation (Flowering)", dasFrom: 35, dasTo: 45, slot: "harvest" },
    ],
    "Moth": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 30, dasTo: 35, slot: "sow" },
    ],
    "Masur": [
        { suffix: "1st Weeding", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Irrigation (Flowering)", dasFrom: 50, dasTo: 60, slot: "harvest" },
    ],
    "Peas": [
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 40, dasTo: 45, slot: "sow" },
        { suffix: "Pest Spray", dasFrom: 35, dasTo: 45, slot: "sow" },
    ],
    "Jute": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 40, dasTo: 45, slot: "sow" },
    ],
    "Boro": [
        { suffix: "1st Weeding", dasFrom: 20, dasTo: 25, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 30, dasTo: 35, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 45, dasTo: 50, slot: "sow" },
        { suffix: "Panicle Irrigation", dasFrom: 60, dasTo: 70, slot: "harvest" },
    ],
    "Fodder": [
        { suffix: "1st Weeding", dasFrom: 15, dasTo: 20, slot: "sow" },
        { suffix: "N Top-dress", dasFrom: 25, dasTo: 30, slot: "sow" },
        { suffix: "2nd Weeding", dasFrom: 35, dasTo: 40, slot: "sow" },
        { suffix: "Irrigation", dasFrom: 35, dasTo: 45, slot: "harvest" },
    ],
}

function matchCropKey(cropName: string): string | null {
    const keys = Object.keys(CROP_OPERATIONS).sort((a, b) => b.length - a.length)
    for (const key of keys) {
        if (cropName === key || cropName.startsWith(key) || cropName.includes(key)) return key
    }
    return null
}

const BASE_CROPS: CropTemplate[] = [
    { crop: "Rice (Paddy)", season: "Kharif", sowStart: "06-15", sowEnd: "06-20", harvestStart: "10-10", harvestEnd: "10-15", waterIntensive: true },
    { crop: "Maize (Kharif)", season: "Kharif", sowStart: "06-20", sowEnd: "06-25", harvestStart: "09-25", harvestEnd: "09-30" },
    { crop: "Cotton", season: "Kharif", sowStart: "06-15", sowEnd: "06-20", harvestStart: "11-01", harvestEnd: "11-05" },
    { crop: "Soybean", season: "Kharif", sowStart: "06-20", sowEnd: "06-25", harvestStart: "10-05", harvestEnd: "10-10" },
    { crop: "Groundnut (Kharif)", season: "Kharif", sowStart: "06-15", sowEnd: "06-20", harvestStart: "10-15", harvestEnd: "10-20" },
    { crop: "Bajra (Pearl Millet)", season: "Kharif", sowStart: "07-01", sowEnd: "07-05", harvestStart: "09-20", harvestEnd: "09-25" },
    { crop: "Jowar (Sorghum, Kharif)", season: "Kharif", sowStart: "06-25", sowEnd: "06-30", harvestStart: "10-01", harvestEnd: "10-05" },
    { crop: "Tur/Arhar (Pigeon Pea)", season: "Kharif", sowStart: "06-20", sowEnd: "06-25", harvestStart: "11-20", harvestEnd: "11-25" },
    { crop: "Moong (Kharif)", season: "Kharif", sowStart: "07-01", sowEnd: "07-05", harvestStart: "09-10", harvestEnd: "09-15" },
    { crop: "Urad", season: "Kharif", sowStart: "07-01", sowEnd: "07-05", harvestStart: "09-15", harvestEnd: "09-20" },
    { crop: "Castor", season: "Kharif", sowStart: "07-01", sowEnd: "07-15", harvestStart: "12-15", harvestEnd: "12-25", westOnly: true },
    { crop: "Sugarcane", season: "Kharif", sowStart: "02-15", sowEnd: "02-20", harvestStart: "01-10", harvestEnd: "01-15", waterIntensive: true },
    { crop: "Jute", season: "Kharif", sowStart: "03-15", sowEnd: "03-20", harvestStart: "07-20", harvestEnd: "07-25", eastOnly: true },
    { crop: "Wheat", season: "Rabi", sowStart: "11-10", sowEnd: "11-15", harvestStart: "03-25", harvestEnd: "03-30" },
    { crop: "Mustard", season: "Rabi", sowStart: "10-15", sowEnd: "10-20", harvestStart: "02-15", harvestEnd: "02-20" },
    { crop: "Cumin", season: "Rabi", sowStart: "11-01", sowEnd: "11-15", harvestStart: "02-15", harvestEnd: "02-28", westOnly: true },
    { crop: "Gram/Chana", season: "Rabi", sowStart: "10-20", sowEnd: "10-25", harvestStart: "03-01", harvestEnd: "03-05" },
    { crop: "Barley", season: "Rabi", sowStart: "11-01", sowEnd: "11-05", harvestStart: "03-20", harvestEnd: "03-25", temperate: true },
    { crop: "Masur/Lentil", season: "Rabi", sowStart: "10-25", sowEnd: "10-30", harvestStart: "03-10", harvestEnd: "03-15" },
    { crop: "Peas", season: "Rabi", sowStart: "10-20", sowEnd: "10-25", harvestStart: "02-20", harvestEnd: "02-25", temperate: true },
    { crop: "Potato", season: "Rabi", sowStart: "10-15", sowEnd: "10-20", harvestStart: "01-20", harvestEnd: "01-25", temperate: true },
    { crop: "Watermelon", season: "Zaid", sowStart: "03-01", sowEnd: "03-05", harvestStart: "05-20", harvestEnd: "05-25" },
    { crop: "Muskmelon", season: "Zaid", sowStart: "03-01", sowEnd: "03-05", harvestStart: "05-25", harvestEnd: "05-30" },
    { crop: "Cucumber", season: "Zaid", sowStart: "03-10", sowEnd: "03-15", harvestStart: "05-15", harvestEnd: "05-20" },
    { crop: "Summer Moong", season: "Zaid", sowStart: "03-15", sowEnd: "03-20", harvestStart: "06-01", harvestEnd: "06-05" },
    { crop: "Fodder/Vegetables", season: "Zaid", sowStart: "03-20", sowEnd: "03-25", harvestStart: "06-05", harvestEnd: "06-10" },
    { crop: "Boro Rice", season: "Zaid", sowStart: "01-15", sowEnd: "01-20", harvestStart: "05-10", harvestEnd: "05-15", eastOnly: true, waterIntensive: true },
    { crop: "Moth Bean", season: "Kharif", sowStart: "07-05", sowEnd: "07-10", harvestStart: "10-01", harvestEnd: "10-05" },
]

function buildOperationEntries(
    template: CropTemplate,
    sowStart: string,
    sowShift: number,
    compact = true,
): CropEntry[] {
    const key = matchCropKey(template.crop)
    if (!key) return []

    const ops = CROP_OPERATIONS[key]
    const entries: CropEntry[] = []
    let weedingAdded = false
    let harvestCareAdded = false

    for (const op of ops) {
        if (compact) {
            const isWeeding = /weeding/i.test(op.suffix)
            const isHarvestCare = op.slot === "harvest" && /irrigation/i.test(op.suffix)
            if (!isWeeding && !isHarvestCare) continue
            if (isWeeding) {
                if (weedingAdded) continue
                weedingAdded = true
            }
            if (isHarvestCare) {
                if (harvestCareAdded) continue
                harvestCareAdded = true
            }
        }

        const shiftedSowStart = shiftWindow(sowStart, sowStart, sowShift).start
        const win = dasWindow(shiftedSowStart, op.dasFrom, op.dasTo)

        if (op.slot === "sow") {
            entries.push({
                crop: `${template.crop} — ${op.suffix}`,
                season: template.season,
                sowStart: win.start,
                sowEnd: win.end,
                harvestStart: INACTIVE.start,
                harvestEnd: INACTIVE.end,
                note: op.note,
            })
        } else {
            entries.push({
                crop: `${template.crop} — ${op.suffix}`,
                season: template.season,
                sowStart: INACTIVE.start,
                sowEnd: INACTIVE.end,
                harvestStart: win.start,
                harvestEnd: win.end,
                note: op.note,
            })
        }
    }

    return entries
}

function expandCrop(template: CropTemplate, sowShift: number, harvestShift: number, compact = true): CropEntry[] {
    const spread = compact ? cropOperationStagger(template.crop) : 0
    const sow = shiftWindow(template.sowStart, template.sowEnd, sowShift + spread)
    const harvest = shiftWindow(template.harvestStart, template.harvestEnd, harvestShift + spread)

    const main: CropEntry = {
        crop: template.crop,
        season: template.season,
        sowStart: sow.start,
        sowEnd: sow.end,
        harvestStart: harvest.start,
        harvestEnd: harvest.end,
        note: template.note,
    }

    const operations = buildOperationEntries(template, template.sowStart, sowShift + spread, compact)
    return [main, ...operations]
}

function soilCategory(soil: SoilType): string {
    if (soil.includes("Desert")) return "desert"
    if (soil.includes("Laterite") || soil.includes("Peaty")) return "laterite"
    if (soil.includes("Mountain")) return "mountain"
    if (soil.includes("Saline")) return "saline"
    if (soil.includes("Black")) return "black"
    if (soil.includes("Alluvial")) return "alluvial"
    if (soil.includes("Red")) return "red"
    return "general"
}

/** Base crop names allowed per soil category (empty = no extra filter) */
const SOIL_CROP_ALLOWLIST: Record<string, string[]> = {
    desert: ["Bajra", "Jowar", "Mustard", "Gram", "Moth", "Cumin", "Castor", "Barley"],
    black: ["Cotton", "Soybean", "Groundnut", "Wheat", "Gram", "Mustard", "Castor"],
    saline: ["Bajra", "Jowar", "Mustard", "Gram", "Wheat", "Barley", "Cotton", "Moth", "Cumin", "Castor"],
    laterite: ["Rice", "Maize", "Groundnut", "Tur", "Moong", "Urad", "Cotton", "Soybean", "Jute", "Boro"],
    red: ["Rice", "Maize", "Groundnut", "Tur", "Moong", "Urad", "Cotton", "Soybean", "Jowar", "Gram", "Mustard", "Bajra"],
    mountain: ["Maize", "Barley", "Potato", "Peas", "Wheat", "Mustard", "Gram", "Masur", "Bajra"],
    alluvial: [],
    general: [],
}

/** Tighter crop list for specific state + soil combos */
const STATE_SOIL_CROP_OVERRIDE: Record<string, Record<string, string[]>> = {
    Gujarat: {
        "Black Soil (Regur)": ["Cotton", "Groundnut", "Soybean", "Wheat", "Gram", "Mustard"],
    },
}

/** Max distinct base crops per schedule — keeps the calendar readable (~3 tasks/day avg) */
const MAX_BASE_CROPS_PER_SCHEDULE = 7

/** Spread field operations across the week so multiple crops don't pile onto one day */
function cropOperationStagger(cropName: string): number {
    let hash = 0
    for (let i = 0; i < cropName.length; i++) hash += cropName.charCodeAt(i)
    return (hash % 7) - 3
}

function cropBaseName(crop: string): string {
    return crop.split(" — ")[0]
}

function limitScheduleDensity(crops: CropEntry[], maxBaseCrops = MAX_BASE_CROPS_PER_SCHEDULE): CropEntry[] {
    const allowedBases = new Set<string>()

    for (const entry of crops) {
        const base = cropBaseName(entry.crop)
        if (!allowedBases.has(base)) {
            if (allowedBases.size >= maxBaseCrops) continue
            allowedBases.add(base)
        }
    }

    if (allowedBases.size === 0) return crops
    return crops.filter((c) => allowedBases.has(cropBaseName(c.crop)))
}

function cropMatchesAllowlist(entry: CropEntry, allowlist: string[]): boolean {
    const base = cropBaseName(entry.crop)
    return allowlist.some((name) => base.includes(name))
}

function filterBySoilCategory(crops: CropEntry[], cat: string): CropEntry[] {
    const allowlist = SOIL_CROP_ALLOWLIST[cat]
    if (!allowlist || allowlist.length === 0) return crops
    const filtered = crops.filter((c) => cropMatchesAllowlist(c, allowlist))
    return filtered.length > 0 ? filtered : crops
}

function applyStateSoilOverride(crops: CropEntry[], state: string, soil: SoilType): CropEntry[] {
    const override = STATE_SOIL_CROP_OVERRIDE[state]?.[soil]
    if (!override) return crops
    const filtered = crops.filter((c) => cropMatchesAllowlist(c, override))
    return filtered.length > 0 ? filtered : crops
}

/** Small sow/harvest shift per soil type so same crop dates differ by soil */
function soilDateShift(cat: string): number {
    switch (cat) {
        case "desert": return -7
        case "black": return 3
        case "saline": return 5
        case "laterite": return 7
        case "mountain": return 14
        case "red": return 2
        default: return 0
    }
}

function buildCropList(state: string, soil: SoilType, regions: string[]): CropEntry[] {
    const cat = soilCategory(soil)
    const isSouth = regions.includes("south")
    const isEast = regions.includes("east")
    const isWest = regions.includes("west")
    const isDesertSoil = cat === "desert"
    const isLateriteSoil = cat === "laterite"
    const isMountainRegion = regions.includes("mountain")
    const isMountainSoil = cat === "mountain"
    const soilShift = soilDateShift(cat)

    const crops: CropEntry[] = []

    for (const template of BASE_CROPS) {
        if (template.eastOnly && !isEast) continue
        if (template.westOnly && !isWest && state !== "Gujarat" && state !== "Rajasthan" && state !== "Maharashtra") continue
        if (template.waterIntensive && isDesertSoil) continue
        if (isLateriteSoil && (template.crop === "Wheat" || template.crop === "Mustard" || template.crop === "Barley" || template.crop === "Cumin")) continue
        if (template.temperate && isDesertSoil) continue
        if (template.crop === "Cotton" && isLateriteSoil) continue
        if (template.crop === "Jute" && !isEast) continue
        if (template.crop === "Cumin" && !isWest && state !== "Gujarat" && state !== "Rajasthan") continue
        if (template.crop === "Castor" && isDesertSoil) continue
        if (template.crop === "Rice" && isDesertSoil) continue
        if (template.crop === "Sugarcane" && (isDesertSoil || cat === "saline")) continue

        let sowShift = soilShift
        let harvestShift = soilShift

        if (isSouth && template.season === "Rabi") {
            sowShift += 21
            harvestShift += 21
        }
        if (isMountainRegion || isMountainSoil) {
            sowShift += 14
            harvestShift += 14
        }

        crops.push(...expandCrop(template, sowShift, harvestShift, true))
    }

    const bySoil = filterBySoilCategory(crops, cat)
    const overridden = applyStateSoilOverride(bySoil, state, soil)
    return limitScheduleDensity(overridden)
}

function generateSchedule(): Record<string, Record<string, CropEntry[]>> {
    const schedule: Record<string, Record<string, CropEntry[]>> = {}

    for (const [state, soils] of Object.entries(STATE_SOIL_MAP)) {
        schedule[state] = {}
        const regions = STATE_REGION_MAP[state] ?? []
        for (const soil of soils) {
            schedule[state][soil] = buildCropList(state, soil as SoilType, regions)
        }
    }

    return schedule
}

export const STATE_SOIL_SCHEDULE: Record<string, Record<string, CropEntry[]>> = generateSchedule()

export function getScheduleForStateSoil(state: string, soil: string): CropEntry[] {
    return STATE_SOIL_SCHEDULE[state]?.[soil] ?? []
}

export function isWeedingAction(cropName: string): boolean {
    return /weeding/i.test(cropName)
}

export function parseDateWindow(start: string, end: string): DateWindow {
    const s = parseMd(start)
    const e = parseMd(end)
    return { startMonth: s.month, startDay: s.day, endMonth: e.month, endDay: e.day }
}

function isDateInWindow(month: number, day: number, window: DateWindow): boolean {
    const startVal = window.startMonth * 100 + window.startDay
    const endVal = window.endMonth * 100 + window.endDay
    const current = month * 100 + day

    if (startVal <= endVal) {
        return current >= startVal && current <= endVal
    }
    return current >= startVal || current <= endVal
}

export function getActionsForMonth(crops: CropEntry[], month: number, seasonFilter?: Season | "All"): MonthAction[] {
    const actions: MonthAction[] = []
    const filtered = seasonFilter && seasonFilter !== "All"
        ? crops.filter((c) => c.season === seasonFilter)
        : crops

    for (const crop of filtered) {
        const sow = parseDateWindow(crop.sowStart, crop.sowEnd)
        const harvest = parseDateWindow(crop.harvestStart, crop.harvestEnd)

        if (sow.startMonth === month || sow.endMonth === month || (sow.startMonth < month && sow.endMonth > month)) {
            let inMonth = false
            for (let day = 1; day <= DAYS_IN_MONTH[month - 1]; day++) {
                if (isDateInWindow(month, day, sow)) { inMonth = true; break }
            }
            if (inMonth) {
                actions.push({
                    crop: crop.crop,
                    season: crop.season,
                    type: "sow",
                    startMonth: sow.startMonth,
                    startDay: sow.startDay,
                    endMonth: sow.endMonth,
                    endDay: sow.endDay,
                    note: crop.note,
                })
            }
        }

        if (harvest.startMonth === month || harvest.endMonth === month || (harvest.startMonth < month && harvest.endMonth > month)) {
            let inMonth = false
            for (let day = 1; day <= DAYS_IN_MONTH[month - 1]; day++) {
                if (isDateInWindow(month, day, harvest)) { inMonth = true; break }
            }
            if (inMonth) {
                actions.push({
                    crop: crop.crop,
                    season: crop.season,
                    type: "harvest",
                    startMonth: harvest.startMonth,
                    startDay: harvest.startDay,
                    endMonth: harvest.endMonth,
                    endDay: harvest.endDay,
                    note: crop.note,
                })
            }
        }
    }

    return actions
}

export function getDayActions(crops: CropEntry[], month: number, day: number, seasonFilter?: Season | "All"): { sow: CropEntry[]; harvest: CropEntry[] } {
    const sow: CropEntry[] = []
    const harvest: CropEntry[] = []
    const filtered = seasonFilter && seasonFilter !== "All"
        ? crops.filter((c) => c.season === seasonFilter)
        : crops

    for (const crop of filtered) {
        const sowWindow = parseDateWindow(crop.sowStart, crop.sowEnd)
        const harvestWindow = parseDateWindow(crop.harvestStart, crop.harvestEnd)

        if (isDateInWindow(month, day, sowWindow)) sow.push(crop)
        if (isDateInWindow(month, day, harvestWindow)) harvest.push(crop)
    }

    return { sow, harvest }
}

export function formatDateRange(startMonth: number, startDay: number, endMonth: number, endDay: number): string {
    const sm = MONTH_NAMES[startMonth - 1]
    const em = MONTH_NAMES[endMonth - 1]
    if (startMonth === endMonth) return `${sm} ${startDay}–${endDay}`
    return `${sm} ${startDay} – ${em} ${endDay}`
}

// Fixed reference: 1st of every month falls on Monday (index 1 in Sun-start grid)
export function getFirstDayOffset(): number {
    return 1
}
