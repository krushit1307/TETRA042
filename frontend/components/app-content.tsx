"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import HomePage from "@/components/pages/home-page"
import AssistantPage from "@/components/pages/assistant-page"
import ImageDiagnosisPage from "@/components/pages/image-diagnosis-page"
import FeaturesPage from "@/components/pages/features-page"
import AboutPage from "@/components/pages/about-page"
import ContactPage from "@/components/pages/contact-page"

function SearchParamsSync({ onPageChange }: { onPageChange: (page: string) => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pageParam = searchParams?.get('page')

  useEffect(() => {
    if (pageParam) {
      if (pageParam === "market-yard") {
        router.push("/market-yard")
      } else if (pageParam === "news") {
        router.push("/news")
      } else if (pageParam === "calendar") {
        router.push("/calendar")
      } else {
        onPageChange(pageParam)
      }
    } else {
      onPageChange("home")
    }
  }, [pageParam, router, onPageChange])

  return null
}

export default function AppContent() {
  const [currentPage, setCurrentPage] = useState("home")
  const router = useRouter()

  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page)
  }, [])

  const handleNavigate = (page: string) => {
    if (page === "market-yard") {
      router.push("/market-yard")
    } else if (page === "news") {
      router.push("/news")
    } else if (page === "calendar") {
      router.push("/calendar")
    } else {
      setCurrentPage(page)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={setCurrentPage} />
      case "assistant":
        return <AssistantPage />
      case "diagnosis":
        return <ImageDiagnosisPage />
      case "market-yard":
        return null
      case "features":
        return <FeaturesPage />
      case "about":
        return <AboutPage />
      case "contact":
        return <ContactPage />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <>
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">{renderPage()}</main>
      <Suspense fallback={null}>
        <SearchParamsSync onPageChange={handlePageChange} />
      </Suspense>
    </>
  )
}
