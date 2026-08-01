import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import { ErrorBoundary } from "@/components/error-boundary"
import { OfflineIndicator } from "@/components/offline-indicator"
import { AppProviders } from "@/components/providers"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sasya.ai"),
  title: "Sasya AI - The Future Grows Here",
  description: "AI-powered farmer support and advisory system",
  generator: "v0.app",
  verification: {
    google: "FPKVDy8KVvBOnJoSE8YMG6a8xXDTVquTkVCupWIcDi0",
  },
  icons: [
    { rel: "icon", url: "/Sasya_bg.png", sizes: "any" },
    { rel: "icon", url: "/Sasya_bg.png", type: "image/png" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <AppProviders>
            {children}
            <OfflineIndicator />
          </AppProviders>
          <Analytics />
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </ErrorBoundary>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Sasya AI",
              url: "https://www.sasya.ai",
              logo: "https://www.sasya.ai/Sasya_bg.png",
            }),
          }}
        />
      </body>
    </html>
  )
}
