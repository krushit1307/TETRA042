"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Calendar, Globe, ExternalLink } from "lucide-react"
import { NewsArticle } from "@/lib/news-service"
import { useLanguage } from "@/lib/i18n/language-context"
import { translate } from "@/lib/i18n/translate"

interface NewsCardProps {
    article: NewsArticle
    onClick: () => void
}

export function NewsCard({ article, onClick }: NewsCardProps) {
    const { language } = useLanguage()
    const timeAgo = new Date(article.publishedAt).toLocaleDateString(undefined, {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    const readMore = translate("news.readMore", language);

    const handleClick = () => {
        // If it's an external URL (starts with http), redirect
        if (article.url && article.url.startsWith('http')) {
            window.open(article.url, '_blank', 'noopener,noreferrer');
        } else {
            // Otherwise open modal
            onClick();
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            onClick={handleClick}
            className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-300 flex flex-col h-full"
        >
            {/* Image/Video Section */}
            <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                {article.urlToImage ? (
                    <Image
                        src={article.urlToImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : article.videoUrl ? (
                    <video
                        src={article.videoUrl}
                        className="w-full h-full object-cover"
                        controls={false}
                        muted
                        loop
                        autoPlay
                        playsInline
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">
                        <Globe className="w-12 h-12 opacity-20" />
                    </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium shadow-sm">
                    {article.source.name}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {article.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {article.description || readMore + "..."}
                </p>

                <div className="flex items-center justify-between mt-auto text-xs text-gray-500 dark:text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {readMore} <ExternalLink className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
