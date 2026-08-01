"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { NewsArticle } from "@/lib/news-service"
import Image from "next/image"
import { Calendar, Globe, ExternalLink, Share2, User } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { translate } from "@/lib/i18n/translate"

interface NewsDetailModalProps {
    article: NewsArticle | null
    isOpen: boolean
    onClose: () => void
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
    const { language } = useLanguage()

    if (!article) return null

    const timeAgo = new Date(article.publishedAt).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    const readFull = translate("news.readFull", language)
    const share = translate("news.share", language)

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <div className="relative w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800">
                    {article.urlToImage ? (
                        <Image
                            src={article.urlToImage}
                            alt={article.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <Globe className="w-16 h-16 opacity-20" />
                        </div>
                    )}
                    <div className="absolute top-4 left-4">
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                            {article.source.name}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                            {article.title}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {timeAgo}
                            </span>
                            {article.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="w-4 h-4" />
                                    {article.author}
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                            {article.content
                                ? article.content.split('[')[0] // Content often has "[+1234 chars]" at end in free tier
                                : article.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                {readFull} <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                                onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: article.title,
                                            text: article.description,
                                            url: article.url
                                        }).catch(console.error);
                                    } else {
                                        navigator.clipboard.writeText(article.url);
                                        // Could show toast here
                                    }
                                }}
                                className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium transition-colors"
                                title={share}
                            >
                                <Share2 className="w-4 h-4" />
                                {share}
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
