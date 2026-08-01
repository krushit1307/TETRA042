"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, login } from "@/lib/auth"
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function AdminLoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated()) {
            router.push("/admin/dashboard")
        }

        const savedEmail = localStorage.getItem("adminEmail")
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberMe(true)
        }
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const success = login(email, password)

            if (!success) {
                throw new Error("Invalid email or password")
            }

            if (rememberMe) {
                localStorage.setItem("adminEmail", email)
            } else {
                localStorage.removeItem("adminEmail")
            }
            router.push("/admin/dashboard")
        } catch (err: any) {
            console.error(err)
            setError(err.message || "Failed to login")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative max-w-md w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-800"
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to website
                </Link>

                <div className="flex flex-col items-center mb-8">
                    <div className="mb-6">
                        <Image
                            src="/Sasya_bg.png"
                            alt="Sasya AI Logo"
                            width={180}
                            height={60}
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to manage Sasya AI News</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all pr-10"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                        </label>
                        <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5 transform transition-all duration-200"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Default credentials: <span className="font-semibold text-green-600">admin@sasyaai.com</span> / <span className="font-semibold text-green-600">admin123</span>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
