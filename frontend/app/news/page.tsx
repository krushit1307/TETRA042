"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/navbar"
import { NewsCard } from "@/components/news/news-card"
import { NewsFilter } from "@/components/news/news-filter"
import { NewsDetailModal } from "@/components/news/news-detail-modal"
import { fetchAgricultureNews, NewsArticle } from "@/lib/news-service"
import { AlertCircle, RefreshCw } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SupportedLanguage } from "@/lib/i18n/languages"

import { TopNewsCarousel } from "@/components/news/top-news-carousel"

export default function NewsPage() {
    const router = useRouter()
    const { language, setLanguage, t } = useLanguage()
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Handle navigation from Navbar
    const handleNavigate = (page: string) => {
        if (page === 'news') return
        if (page === 'market-yard') {
            router.push('/market-yard')
            return
        }
        if (page === 'calendar') {
            router.push('/calendar')
            return
        }
        router.push(`/?page=${page}`)
    }

    const loadNews = async (lang: SupportedLanguage) => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchAgricultureNews(lang)
            setNews(data)
        } catch (err: any) {
            console.error("Failed to load news:", err)
            setError(err.message || t("news.fetchFailed"))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNews(language)
    }, [language])

    const handleArticleClick = (article: NewsArticle) => {
        setSelectedArticle(article)
        setIsModalOpen(true)
    }

    const topNews = news.filter(a => a.is_top_news)
    const otherNews = news.filter(a => !a.is_top_news)
    // If no top news defined, maybe take first 5? For now, purely based on flag.
    // If no filtered top news but we have news, maybe just show all in grid? 
    // Let's stick to strict separation for now or fallback if topNews is empty.
    const displayTopNews = topNews.length > 0 ? topNews : []
    const displayOtherNews = topNews.length > 0 ? otherNews : news

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <Navbar currentPage="news" onNavigate={handleNavigate} />

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-16 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                {t("news.title")}
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t("news.subtitle")}
                            </p>
                        </div>
                        <NewsFilter
                            currentLanguage={language}
                            onLanguageChange={setLanguage}
                            disabled={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Top News Carousel (Only show if not loading and has data) */}
            {!loading && displayTopNews.length > 0 && (
                <TopNewsCarousel articles={displayTopNews} onArticleClick={handleArticleClick} />
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("news.unableToLoad")}</h3>
                        <p className="text-gray-500 max-w-md mb-6">{error}</p>
                        <button
                            onClick={() => loadNews(language)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> {t("common.tryAgain")}
                        </button>
                    </div>
                ) : loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-xl h-80 animate-pulse border border-gray-100 dark:border-gray-800">
                                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-t-xl" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                                    <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
                            <NewspaperIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t("news.noArticles")}</h3>
                        <p className="text-gray-500">
                            {t("news.noArticlesLang")}
                        </p>
                    </div>
                ) : (
                    <>
                        {displayTopNews.length > 0 && <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t("news.latestUpdates")}</h2>}
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayOtherNews.map((article, index) => (
                                    <NewsCard
                                        key={`${article.url}-${index}`}
                                        article={article}
                                        onClick={() => handleArticleClick(article)}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </main>

            <NewsDetailModal
                article={selectedArticle}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

function NewspaperIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
        </svg>
    )
}
