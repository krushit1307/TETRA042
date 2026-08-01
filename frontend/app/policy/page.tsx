"use client"

import { useEffect } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Shield, FileText, ChevronRight } from "lucide-react"

export default function PolicyPage() {

    // Handle hash scrolling on load
    useEffect(() => {
        const hash = window.location.hash
        if (hash) {
            setTimeout(() => {
                const element = document.getElementById(hash.replace('#', ''))
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, 500)
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-gray-800 dark:text-gray-200">
            <Navbar
                currentPage="policy"
                onNavigate={(page) => window.location.href = page === 'home' ? '/' : `/?page=${page}`}
            />

            <main className="pt-24 pb-16">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-900 to-amber-900 text-white py-16 mb-12">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4"
                        >
                            Sasya AI Policies
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-green-100 text-lg opacity-90"
                        >
                            Transparency and trust for sustainable agriculture.
                        </motion.p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 space-y-24">

                    {/* Privacy Policy Section */}
                    <section id="privacy" className="scroll-mt-32">
                        <div
                            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-green-100 dark:border-green-900/30"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold text-green-900 dark:text-green-400">Privacy Policy</h2>
                            </div>

                            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p>
                                    At Sasya AI, we are committed to protecting the privacy and security of our users like farmers, traders, and agricultural stakeholders. This Privacy Policy outlines how we collect, use, and safeguard your information.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-green-500" />
                                        1. Information Collection
                                    </h3>
                                    <p className="pl-7">
                                        We collect minimal personal data necessary to provide our services, such as location data for market prices and weather updates. We do not sell your personal data to third parties.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-green-500" />
                                        2. Use of AI Data
                                    </h3>
                                    <p className="pl-7">
                                        Images uploaded for disease diagnosis are processed by our AI models to provide insights. These images may be used anonymously to improve our diagnosis accuracy, but will never be linked to your personal identity publicly.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-green-500" />
                                        3. Data Security
                                    </h3>
                                    <p className="pl-7">
                                        We employ industry-standard encryption and security protocols to protect your data from unauthorized access or disclosure.
                                    </p>
                                </div>

                                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-800 dark:text-green-200">
                                    Last Updated: February 2026
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Terms & Conditions Section */}
                    <section id="terms" className="scroll-mt-32">
                        <div
                            className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-amber-100 dark:border-amber-900/30"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                                <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold text-amber-900 dark:text-amber-500">Terms & Conditions</h2>
                            </div>

                            <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                                <p>
                                    By accessing or using Sasya AI ("the Platform"), you agree to comply with and be bound by these Terms & Conditions.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-amber-500" />
                                        1. Accuracy of Information
                                    </h3>
                                    <p className="pl-7">
                                        While we strive for accuracy, market prices and AI diagnoses are for informational purposes only. Farmers are advised to consult local experts before making critical financial decisions. Sasya AI is not liable for losses incurred based on this data.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-amber-500" />
                                        2. User Conduct
                                    </h3>
                                    <p className="pl-7">
                                        Users must not misuse the platform, attempt to breach security, or upload malicious content. We reserve the right to terminate access for violations.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <ChevronRight className="w-5 h-5 text-amber-500" />
                                        3. Intellectual Property
                                    </h3>
                                    <p className="pl-7">
                                        All content, design, and AI models on Sasya AI are the intellectual property of Sasya AI and protected by applicable laws.
                                    </p>
                                </div>

                                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm text-amber-800 dark:text-amber-200">
                                    Effective Date: February 2026
                                </div>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    )
}
