type TFunc = (key: string) => string

export const STATE_KEYS: Record<string, string> = {
    "Andhra Pradesh": "calState.andhraPradesh",
    "Arunachal Pradesh": "calState.arunachalPradesh",
    "Assam": "calState.assam",
    "Bihar": "calState.bihar",
    "Chhattisgarh": "calState.chhattisgarh",
    "Goa": "calState.goa",
    "Gujarat": "calState.gujarat",
    "Haryana": "calState.haryana",
    "Himachal Pradesh": "calState.himachalPradesh",
    "Jharkhand": "calState.jharkhand",
    "Karnataka": "calState.karnataka",
    "Kerala": "calState.kerala",
    "Madhya Pradesh": "calState.madhyaPradesh",
    "Maharashtra": "calState.maharashtra",
    "Manipur": "calState.manipur",
    "Meghalaya": "calState.meghalaya",
    "Mizoram": "calState.mizoram",
    "Nagaland": "calState.nagaland",
    "Odisha": "calState.odisha",
    "Punjab": "calState.punjab",
    "Rajasthan": "calState.rajasthan",
    "Sikkim": "calState.sikkim",
    "Tamil Nadu": "calState.tamilNadu",
    "Telangana": "calState.telangana",
    "Tripura": "calState.tripura",
    "Uttar Pradesh": "calState.uttarPradesh",
    "Uttarakhand": "calState.uttarakhand",
    "West Bengal": "calState.westBengal",
    "Andaman and Nicobar Islands": "calState.andamanNicobar",
    "Chandigarh": "calState.chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu": "calState.dadraNagarHaveli",
    "Delhi": "calState.delhi",
    "Jammu and Kashmir": "calState.jammuKashmir",
    "Ladakh": "calState.ladakh",
    "Lakshadweep": "calState.lakshadweep",
    "Puducherry": "calState.puducherry",
}

export const SOIL_KEYS: Record<string, string> = {
    "Alluvial Soil": "calSoil.alluvial",
    "Black Soil (Regur)": "calSoil.blackRegur",
    "Red & Yellow Soil": "calSoil.redYellow",
    "Laterite Soil": "calSoil.laterite",
    "Desert / Arid Soil": "calSoil.desertArid",
    "Mountain / Forest Soil": "calSoil.mountainForest",
    "Saline / Alkaline Soil": "calSoil.salineAlkaline",
    "Peaty / Marshy Soil": "calSoil.peatyMarshy",
}

export function translateState(state: string, t: TFunc): string {
    const key = STATE_KEYS[state]
    return key ? t(key) : state
}

export function translateSoil(soil: string, t: TFunc): string {
    const key = SOIL_KEYS[soil]
    return key ? t(key) : soil
}
