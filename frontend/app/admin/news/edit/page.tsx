"use client"

import { useEffect, useState, Suspense } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { NewsForm } from "@/components/admin/news-form"
import { getNewsById, NewsArticle } from "@/lib/news-service"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

function EditNewsContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [news, setNews] = useState<NewsArticle | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const id = searchParams.get("id")
        if (id) {
            loadNews(id)
        } else {
            router.push('/admin/dashboard')
        }
    }, [searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

    const loadNews = async (id: string) => {
        setLoading(true)
        const data = await getNewsById(id)
        if (!data) {
            router.push('/admin/dashboard')
        } else {
            setNews(data)
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <AdminLayout
            title="Edit Article"
            description="Update content, media, or settings for this article."
        >
            <div className="max-w-6xl mx-auto">
                {news && <NewsForm initialData={news} />}
            </div>
        </AdminLayout>
    )
}

export default function EditNewsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        }>
            <EditNewsContent />
        </Suspense>
    )
}
