import { isWeedingAction } from "./cropScheduleData"

type TFunc = (key: string) => string

const MONTH_KEYS = [
    "month.jan", "month.feb", "month.mar", "month.apr", "month.may", "month.jun",
    "month.jul", "month.aug", "month.sep", "month.oct", "month.nov", "month.dec",
] as const

export const CROP_KEYS: Record<string, string> = {
    "Rice (Paddy)": "calCrop.ricePaddy",
    "Maize (Kharif)": "calCrop.maizeKharif",
    "Cotton": "calCrop.cotton",
    "Soybean": "calCrop.soybean",
    "Groundnut (Kharif)": "calCrop.groundnutKharif",
    "Bajra (Pearl Millet)": "calCrop.bajraPearlMillet",
    "Jowar (Sorghum, Kharif)": "calCrop.jowarSorghumKharif",
    "Tur/Arhar (Pigeon Pea)": "calCrop.turArhar",
    "Moong (Kharif)": "calCrop.moongKharif",
    "Urad": "calCrop.urad",
    "Castor": "calCrop.castor",
    "Sugarcane": "calCrop.sugarcane",
    "Jute": "calCrop.jute",
    "Wheat": "calCrop.wheat",
    "Mustard": "calCrop.mustard",
    "Cumin": "calCrop.cumin",
    "Gram/Chana": "calCrop.gramChana",
    "Barley": "calCrop.barley",
    "Masur/Lentil": "calCrop.masurLentil",
    "Peas": "calCrop.peas",
    "Potato": "calCrop.potato",
    "Watermelon": "calCrop.watermelon",
    "Muskmelon": "calCrop.muskmelon",
    "Cucumber": "calCrop.cucumber",
    "Summer Moong": "calCrop.summerMoong",
    "Fodder/Vegetables": "calCrop.fodderVegetables",
    "Boro Rice": "calCrop.boroRice",
    "Moth Bean": "calCrop.mothBean",
}

export const OP_KEYS: Record<string, string> = {
    "Seed Treatment": "calOp.seedTreatment",
    "1st Weeding": "calOp.firstWeeding",
    "2nd Weeding": "calOp.secondWeeding",
    "IPM Spray": "calOp.ipmSpray",
    "N Top-dress": "calOp.nTopDress",
    "Irrigation (Flowering)": "calOp.irrigationFlowering",
    "Pre-emergence Weedicide": "calOp.preEmergenceWeedicide",
    "Gypsum (Pegging)": "calOp.gypsumPegging",
    "Foliar Urea (1st)": "calOp.foliarUrea1",
    "Foliar Urea (2nd)": "calOp.foliarUrea2",
    "Pest Spray": "calOp.pestSpray",
    "Basal Fertilizer": "calOp.basalFertilizer",
    "CRI Irrigation": "calOp.criIrrigation",
    "Herbicide Spray": "calOp.herbicideSpray",
    "Tillering Irrigation": "calOp.tilleringIrrigation",
    "Jointing Irrigation": "calOp.jointingIrrigation",
    "Flowering Irrigation": "calOp.floweringIrrigation",
    "Milk Stage Irrigation": "calOp.milkStageIrrigation",
    "Light Irrigation": "calOp.lightIrrigation",
    "Disease Spray": "calOp.diseaseSpray",
    "Gap Filling": "calOp.gapFilling",
    "Pest Management": "calOp.pestManagement",
    "Irrigation (Spike Dev)": "calOp.irrigationSpikeDev",
    "Aphid Spray": "calOp.aphidSpray",
    "Nursery Prep": "calOp.nurseryPrep",
    "Panicle Irrigation": "calOp.panicleIrrigation",
    "Tassel Irrigation": "calOp.tasselIrrigation",
    "Pod Irrigation": "calOp.podIrrigation",
    "Rhizobium Treatment": "calOp.rhizobiumTreatment",
    "Pod Borer Spray": "calOp.podBorerSpray",
    "Irrigation (Tillering)": "calOp.irrigationTillering",
    "Earthing Up": "calOp.earthingUp",
    "Blight Spray": "calOp.blightSpray",
    "Irrigation (Tuber)": "calOp.irrigationTuber",
    "Irrigation (Grand Growth)": "calOp.irrigationGrandGrowth",
    "Irrigation (Fruit Set)": "calOp.irrigationFruitSet",
    "Irrigation (Fruit Dev)": "calOp.irrigationFruitDev",
    "Shoot Fly Spray": "calOp.shootFlySpray",
    "Irrigation": "calOp.irrigation",
}

const SEASON_KEYS: Record<string, string> = {
    Kharif: "season.kharif",
    Rabi: "season.rabi",
    Zaid: "season.zaid",
}

export const NOTE_KEYS: Record<string, string> = {
    "Thiram/Carbendazim at sowing": "calNote.thiramAtSowing",
    "Keep field weed-free up to 60 days": "calNote.weedFree60Days",
    "Scout pink bollworm & whitefly; neem/IPM": "calNote.scoutBollworm",
    "Critical irrigation at flowering & boll development": "calNote.criticalIrrigationBoll",
    "Optional, within 2 days of sowing": "calNote.optionalWithin2Days",
    "Calcium at pegging stage": "calNote.calciumPegging",
    "2% urea spray": "calNote.ureaSpray2Pct",
    "Critical at flowering, pegging, pod formation": "calNote.criticalFloweringPegging",
    "Leaf miner / Spodoptera / tikka as needed": "calNote.leafMinerSpodoptera",
    "N-P-K at sowing": "calNote.npkAtSowing",
    "Remaining N with 1st irrigation": "calNote.remainingN",
    "2,4-D / Pendimethalin / Sulfosulfuron": "calNote.herbicideMix",
    "Shallow-rooted; light frequent irrigation": "calNote.shallowLightIrrigation",
    "Watch wilt/blight/powdery mildew": "calNote.watchDisease",
    "Sucking pests & semilooper": "calNote.suckingPests",
    "Thinning & first weeding": "calNote.thinningWeeding",
    "At flowering & siliqua formation": "calNote.floweringSiliqua",
    "Spray at flowering": "calNote.sprayAtFlowering",
    "Stem borer / leaf folder IPM": "calNote.stemBorerIpm",
    "Critical at flowering & grain filling": "calNote.criticalGrainFilling",
    "Fall armyworm / stem borer": "calNote.armywormBorer",
    "Girdle beetle / semilooper IPM": "calNote.girdleBeetle",
    "Pod borer / wilt management": "calNote.podBorerWilt",
}

function translateBase(base: string, t: TFunc): string {
    const key = CROP_KEYS[base]
    return key ? t(key) : base
}

function translateSuffix(suffix: string, t: TFunc): string {
    const key = OP_KEYS[suffix]
    return key ? t(key) : suffix
}

export function translateCropLabel(cropString: string, t: TFunc): string {
    const [base, suffix] = cropString.split(" — ")
    const translatedBase = translateBase(base, t)
    if (!suffix) return translatedBase
    return `${translatedBase} — ${translateSuffix(suffix, t)}`
}

export function translateCropShort(cropString: string, t: TFunc): string {
    const base = cropString.split(" — ")[0]
    const translated = translateBase(base, t)
    if (isWeedingAction(cropString)) {
        const phase = cropString.includes("2nd") ? "W2" : "W1"
        return `${translated} ${phase}`
    }
    return translated
}

export function translateSeason(season: string, t: TFunc): string {
    const key = SEASON_KEYS[season]
    return key ? t(key) : season
}

export function translateNote(note: string | undefined, t: TFunc): string | undefined {
    if (!note) return undefined
    const key = NOTE_KEYS[note]
    return key ? t(key) : note
}

export function formatLocalizedDateRange(
    startMonth: number,
    startDay: number,
    endMonth: number,
    endDay: number,
    t: TFunc,
): string {
    const sm = t(MONTH_KEYS[startMonth - 1])
    const em = t(MONTH_KEYS[endMonth - 1])
    if (startMonth === endMonth) return `${sm} ${startDay}–${endDay}`
    return `${sm} ${startDay} – ${em} ${endDay}`
}
