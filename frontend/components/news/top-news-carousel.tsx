
"use client"

import { useRef, useEffect, useState } from "react"
import { NewsArticle } from "@/lib/news-service"
import { motion, useAnimation, useMotionValue } from "framer-motion"
import { Calendar, User } from "lucide-react"

interface TopNewsCarouselProps {
    articles: NewsArticle[]
    onArticleClick: (article: NewsArticle) => void
}

export function TopNewsCarousel({ articles, onArticleClick }: TopNewsCarouselProps) {
    // Use the passed articles directly, duplication happens in render for the loop
    const displayArticles = articles;

    return (
        <div className="w-full overflow-hidden py-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-y border-green-100 dark:border-green-900/30">
            <div className="max-w-7xl mx-auto px-4 mb-4">
                <h2 className="text-xl font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-600 rounded-full inline-block"></span>
                    Top Stories
                </h2>
            </div>

            <div className="relative w-full overflow-hidden">
                <motion.div
                    className="flex"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 40,
                        ease: "linear",
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* Set 1 */}
                    <div className="flex gap-6 pr-6 shrink-0">
                        {displayArticles.map((article, idx) => (
                            <NewsCard key={`set1-${article.id}-${idx}`} article={article} onClick={onArticleClick} />
                        ))}
                    </div>
                    {/* Set 2 - Duplicate for seamless loop */}
                    <div className="flex gap-6 pr-6 shrink-0">
                        {displayArticles.map((article, idx) => (
                            <NewsCard key={`set2-${article.id}-${idx}`} article={article} onClick={onArticleClick} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )


}

function NewsCard({ article, onClick }: { article: NewsArticle; onClick: (article: NewsArticle) => void }) {
    return (
        <div
            onClick={() => onClick(article)}
            className="w-[300px] sm:w-[350px] flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group border border-gray-100 dark:border-gray-800"
        >
            <div className="relative h-48 overflow-hidden">
                {article.urlToImage ? (
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-400 text-4xl">📰</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    TOP NEWS
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
                    {article.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {article.author || 'Editor'}
                    </span>
                </div>
            </div>
        </div>
    )
}
