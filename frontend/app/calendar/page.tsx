"use client"

import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { CropCalendarPage } from "@/components/calendar/crop-calendar-page"

export default function CalendarRoutePage() {
    const router = useRouter()

    const handleNavigate = (page: string) => {
        if (page === "calendar") return
        if (page === "market-yard") {
            router.push("/market-yard")
            return
        }
        if (page === "news") {
            router.push("/news")
            return
        }
        router.push(`/?page=${page}`)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <Navbar currentPage="calendar" onNavigate={handleNavigate} />
            <CropCalendarPage />
        </div>
    )
}
