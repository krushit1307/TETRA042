import { NAV_FOOTER_TRANSLATIONS } from "./nav-footer"
import { HOME_TRANSLATIONS } from "./home"
import { ABOUT_CONTACT_TRANSLATIONS } from "./about-contact"
import { ASSISTANT_DIAGNOSIS_TRANSLATIONS } from "./assistant-diagnosis"
import { FEATURES_TRANSLATIONS } from "./features"
import { NEWS_CALENDAR_TRANSLATIONS } from "./news-calendar"
import { CALENDAR_CROP_TRANSLATIONS } from "./calendar-crops"
import { CALENDAR_LOCATION_TRANSLATIONS } from "./calendar-locations"
import type { TranslationSet } from "../helpers"

export const SITE_TRANSLATIONS: Record<string, TranslationSet> = {
    ...NAV_FOOTER_TRANSLATIONS,
    ...HOME_TRANSLATIONS,
    ...ABOUT_CONTACT_TRANSLATIONS,
    ...ASSISTANT_DIAGNOSIS_TRANSLATIONS,
    ...FEATURES_TRANSLATIONS,
    ...NEWS_CALENDAR_TRANSLATIONS,
    ...CALENDAR_CROP_TRANSLATIONS,
    ...CALENDAR_LOCATION_TRANSLATIONS,
}
