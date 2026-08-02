"use client"

import AppContent from "@/components/app-content"
import Footer from "@/components/footer"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground" suppressHydrationWarning>
      <AppContent />
      <Footer />
    </div>
  )
}
