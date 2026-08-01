"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addNews, updateNews, NewsArticle, LANGUAGES, SupportedLanguage } from "@/lib/news-service"
import { Loader2, Image as ImageIcon, Video, X, Globe, Star, AlignLeft, Check, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NewsFormProps {
    initialData?: NewsArticle
}

export function NewsForm({ initialData }: NewsFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        content: initialData?.content || "",
        language: (initialData?.language as SupportedLanguage) || "en",
        is_top_news: initialData?.is_top_news || false,
        articleUrl: initialData?.url || "",
        publishedAt: initialData?.publishedAt ? new Date(initialData.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // YYYY-MM-DD
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.urlToImage || null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const processFile = (file: File) => {
        setImageFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const clearImage = () => {
        setImageFile(null)
        setPreviewUrl(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (initialData?.id) {
                // Update Mode
                await updateNews(initialData.id, {
                    title: formData.title,
                    content: formData.content,
                    language: formData.language,
                    is_top_news: formData.is_top_news,
                    imageFile: imageFile || undefined,
                    videoFile: videoFile || undefined,
                    articleUrl: formData.articleUrl || undefined,
                    publishedAt: new Date(formData.publishedAt).toISOString(),
                })
            } else {
                // Add Mode
                await addNews({
                    title: formData.title,
                    content: formData.content,
                    language: formData.language,
                    is_top_news: formData.is_top_news,
                    imageFile: imageFile || undefined,
                    videoFile: videoFile || undefined,
                    articleUrl: formData.articleUrl || undefined, // Pass external URL
                    description: formData.content.substring(0, 150) + "...",
                    urlToImage: null,
                    publishedAt: new Date(formData.publishedAt).toISOString()
                })
            }
            router.push("/admin/dashboard")
            router.refresh()
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to save news")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Article Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-lg placeholder:text-gray-400 font-medium"
                                    placeholder="Enter an engaging headline..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                                <div className="relative">
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        required
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-y placeholder:text-gray-400 leading-relaxed"
                                        placeholder="Write your article content here..."
                                    />
                                    <div className="absolute top-3 right-3 text-gray-400">
                                        <AlignLeft className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                    {/* Actions Panel */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Publishing</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Language</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select
                                        value={formData.language}
                                        onChange={(e) => setFormData({ ...formData, language: e.target.value as SupportedLanguage })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none appearance-none font-medium"
                                    >
                                        {LANGUAGES.map((lang) => (
                                            <option key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Publish Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.publishedAt}
                                        onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                <label className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_top_news}
                                        onChange={(e) => setFormData({ ...formData, is_top_news: e.target.checked })}
                                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <div>
                                        <span className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">Feature Story</span>
                                        <span className="block text-xs text-gray-500">Pin to top carousel</span>
                                    </div>
                                    <Star className={`w-4 h-4 ml-auto ${formData.is_top_news ? 'text-amber-500 fill-current' : 'text-gray-300'}`} />
                                </label>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (initialData ? "Update Article" : "Publish Article")}
                            </button>
                        </div>
                    </div>


                    {/* Media Upload Panel */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Media</h3>

                        <div className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Detailed Image</label>
                                <div
                                    className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${dragActive
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                                        : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 bg-gray-50 dark:bg-slate-800/30'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />

                                    {previewUrl ? (
                                        <div className="relative group">
                                            <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-20 pointer-events-none">
                                                <span className="text-white font-medium text-sm">Click to change</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    clearImage()
                                                }}
                                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 hover:text-red-700 z-30 shadow-sm hover:scale-110 transition-transform"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="py-8 flex flex-col items-center justify-center text-center p-4">
                                            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-sm flex items-center justify-center mb-3">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Click to upload Image</p>
                                            <p className="text-xs text-gray-500 mb-4">or drag and drop</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Video Upload - using simple file input for now */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Video (Optional)</label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setVideoFile(e.target.files[0])
                                            }
                                        }}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                    />
                                </div>
                                {videoFile && <p className="text-xs text-green-600 mt-1">Video selected: {videoFile.name}</p>}
                            </div>

                            {/* Article URL */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">External Article URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.articleUrl || ''}
                                    onChange={(e) => setFormData({ ...formData, articleUrl: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                                    placeholder="https://example.com/news/..."
                                />
                                <p className="text-[10px] text-gray-400 mt-1">If provided, users will be redirected to this URL.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="fixed bottom-6 right-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 shadow-lg animate-in slide-in-from-bottom-5">
                    {error}
                </div>
            )}
        </form>
    )
}
