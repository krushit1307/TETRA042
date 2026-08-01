"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import HomePage from "@/components/pages/home-page"
import AssistantPage from "@/components/pages/assistant-page"
import ImageDiagnosisPage from "@/components/pages/image-diagnosis-page"
import FeaturesPage from "@/components/pages/features-page"
import AboutPage from "@/components/pages/about-page"
import ContactPage from "@/components/pages/contact-page"

function AppContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pageParam = searchParams?.get('page')
  const [currentPage, setCurrentPage] = useState(pageParam || "home")

  const handleNavigate = (page: string) => {
    if (page === "market-yard") {
      router.push("/market-yard")
    } else if (page === "news") {
      router.push("/news")
    } else {
      setCurrentPage(page)
    }
  }

  // Update page when URL parameter changes
  useEffect(() => {
    if (pageParam) {
      if (pageParam === "market-yard") {
        router.push("/market-yard")
      } else if (pageParam === "news") {
        router.push("/news")
      } else {
        setCurrentPage(pageParam)
      }
    }
  }, [pageParam, router])

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
    </>
  )
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Suspense fallback={<div className="min-h-screen" />}>
        <AppContent />
      </Suspense>
      <Footer />
    </div>
  )
}
