"use client"

import { useState, useEffect, useCallback } from "react"
import { DEFAULT_STATE, STORAGE_KEYS } from "@/lib/crop-calendar/types"
import { normalizeStateName } from "@/lib/crop-calendar/cropCalendarData"

export type LocationStatus = "idle" | "detecting" | "success" | "denied" | "error" | "skipped"

interface UseCropLocationResult {
    detectedState: string | null
    status: LocationStatus
    notice: string | null
    detectLocation: (force?: boolean) => void
    isDetecting: boolean
}

const GEO_TIMEOUT_MS = 8000

async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=5&addressdetails=1`
    const response = await fetch(url, {
        headers: { "Accept-Language": "en", "User-Agent": "SasyaAI-CropCalendar/1.0" },
    })
    if (!response.ok) throw new Error("Reverse geocoding failed")

    const data = await response.json()
    const state =
        data?.address?.state ||
        data?.address?.region ||
        data?.address?.state_district ||
        null

    if (!state) return null
    return normalizeStateName(state)
}

function getPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"))
            return
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: GEO_TIMEOUT_MS,
            maximumAge: 300000,
        })
    })
}

export function useCropLocation(): UseCropLocationResult {
    const [detectedState, setDetectedState] = useState<string | null>(null)
    const [status, setStatus] = useState<LocationStatus>("idle")
    const [notice, setNotice] = useState<string | null>(null)
    const [isDetecting, setIsDetecting] = useState(false)

    const detectLocation = useCallback(async (force = false) => {
        if (!force && typeof window !== "undefined") {
            const hasSaved = localStorage.getItem(STORAGE_KEYS.hasSaved) === "true"
            const savedState = localStorage.getItem(STORAGE_KEYS.state)
            if (hasSaved && savedState) {
                setDetectedState(savedState)
                setStatus("skipped")
                console.log("[CropCalendar] Using saved state:", savedState)
                return
            }
        }

        setIsDetecting(true)
        setStatus("detecting")
        setNotice(null)

        try {
            const position = await getPosition()
            const { latitude, longitude } = position.coords
            const state = await reverseGeocode(latitude, longitude)

            if (state) {
                setDetectedState(state)
                setStatus("success")
                localStorage.setItem(STORAGE_KEYS.state, state)
                console.log("[CropCalendar] Detected state:", state)
            } else {
                setDetectedState(DEFAULT_STATE)
                setStatus("error")
                setNotice("Couldn't detect location — please select your state manually.")
                console.log("[CropCalendar] State not matched, defaulting to", DEFAULT_STATE)
            }
        } catch (err: unknown) {
            const geoErr = err as GeolocationPositionError
            setDetectedState(DEFAULT_STATE)

            if (geoErr?.code === 1) {
                setStatus("denied")
                setNotice("Couldn't detect location — please select your state manually.")
            } else {
                setStatus("error")
                setNotice("Couldn't detect location — please select your state manually.")
            }
            console.log("[CropCalendar] Location detection failed, defaulting to", DEFAULT_STATE, err)
        } finally {
            setIsDetecting(false)
        }
    }, [])

    useEffect(() => {
        detectLocation()
    }, [detectLocation])

    return { detectedState, status, notice, detectLocation, isDetecting }
}
