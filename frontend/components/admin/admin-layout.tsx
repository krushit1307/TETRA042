"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Search,
    ExternalLink
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface AdminLayoutProps {
    children: React.ReactNode
    title: string
    description?: string
    actions?: React.ReactNode
}

export function AdminLayout({ children, title, description, actions }: AdminLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const checkScreen = () => {
            setIsMobile(window.innerWidth < 1024)
            if (window.innerWidth < 1024) setIsSidebarOpen(false)
            else setIsSidebarOpen(true)
        }
        checkScreen()
        window.addEventListener('resize', checkScreen)
        return () => window.removeEventListener('resize', checkScreen)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/admin")
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Add News', href: '/admin/news/add', icon: PlusCircle },
        // { name: 'Settings', href: '/admin/settings', icon: Settings }, 
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex font-sans">
            {/* Sidebar Backdrop (Mobile) */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarOpen ? 280 : 0,
                    opacity: isSidebarOpen ? 1 : 0
                }}
                className={`fixed lg:sticky top-0 h-screen bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-800 z-50 overflow-hidden flex flex-col shrink-0 ${isMobile && !isSidebarOpen ? 'hidden' : 'flex'}`}
            >
                <div className="p-6 flex items-center gap-3">
                    <Image
                        src="/Sasya_bg.png"
                        alt="Sasya AI"
                        width={140}
                        height={40}
                        className="object-contain h-8 w-auto"
                    />
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 font-semibold shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-r-full"
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                                <span>{item.name}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-green-600/50" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors text-sm font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg text-gray-500 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="lg:hidden">
                            <Image
                                src="/Sasya_bg.png"
                                alt="Sasya AI"
                                width={100}
                                height={30}
                                className="object-contain h-6 w-auto"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            <ExternalLink className="w-4 h-4" /> <span className="hidden md:inline">Go to Website</span>
                        </Link>

                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
                                {description && <p className="text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
                            </div>
                            {actions}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
