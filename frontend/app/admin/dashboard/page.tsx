"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"
import { fetchAllNewsForAdmin, NewsArticle, deleteNews } from "@/lib/news-service"
import { Plus, Edit, Trash2, Loader2, Star, FileText, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AdminLayout } from "@/components/admin/admin-layout"
import { motion } from "framer-motion"

export default function AdminDashboard() {
    const router = useRouter()
    const [news, setNews] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkUser()
        loadNews()
    }, [])

    const checkUser = () => {
        if (!isAuthenticated()) {
            router.push("/admin")
        }
    }

    const loadNews = async () => {
        setLoading(true)
        const data = await fetchAllNewsForAdmin()
        setNews(data)
        setLoading(false)
    }


    // ... (inside component)

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news?")) return

        try {
            await deleteNews(id)
            // Update local state to remove the item immediately (works for both DB and Mock)
            setNews(current => current.filter(n => n.id !== id))
        } catch (error) {
            console.error(error)
            alert("Failed to delete")
        }
    }

    const topNewsCount = news.filter(n => n.is_top_news).length
    const totalNewsCount = news.length

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
                <Loader2 className="w-10 h-10 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <AdminLayout
            title="Dashboard Overview"
            description="Welcome back, Admin. Here's what's happening with your content."
            actions={
                <Link
                    href="/admin/news/add"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" /> Write New Article
                </Link>
            }
        >
            <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText className="w-24 h-24 text-green-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalNewsCount}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Total Articles Published</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star className="w-24 h-24 text-amber-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{topNewsCount}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Featured Top Stories</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-green-600 to-emerald-700 p-6 rounded-2xl shadow-lg shadow-green-600/20 text-white relative overflow-hidden cursor-pointer"
                        onClick={() => router.push('/admin/news/add')}
                    >
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1">Create Content</h3>
                                <p className="text-green-100 text-sm">Draft and publish new updates instantly.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Content Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Articles</h2>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Article</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {news.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-full">
                                                    <FileText className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p>No content yet. Start writing!</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    news.map((item) => (
                                        <tr key={item.id} className="group hover:bg-gray-50/80 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 flex-shrink-0 border border-gray-200 dark:border-gray-700 relative shadow-sm">
                                                        {item.urlToImage ? (
                                                            <img src={item.urlToImage} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xl">📄</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-1 max-w-[240px]">{item.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 uppercase tracking-wider font-medium">
                                                                {item.language}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.is_top_news ? (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                                        Featured
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
                                                        Standard
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => router.push(`/admin/news/edit?id=${item.id}`)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => item.id && handleDelete(item.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
