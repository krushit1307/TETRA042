"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

const contactMethods = [
  {
    icon: Mail,
    titleKey: "contact.email" as const,
    value: "sasyaaihelp@gmail.com",
    link: "mailto:sasyaaihelp@gmail.com",
    color: "from-emerald-500 to-green-600",
    bgGradient: "from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10",
  },
  {
    icon: Phone,
    titleKey: "contact.phone" as const,
    value: "1234567890",
    link: "tel:1234567890",
    color: "from-teal-500 to-cyan-600",
    bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10",
  },
  {
    icon: MapPin,
    titleKey: "contact.location" as const,
    value: "Vadodara, Gujarat, India",
    link: "https://share.google/qn53yJiZzkKPqCRuR",
    color: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10",
  },
]

export default function ContactPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
    }

    import("@emailjs/browser").then((emailjs) => {
      emailjs
        .send("service_0akf3cf", "template_hm93tmh", templateParams, "guUlCZsW5GDKUm8-6")
        .then(
          () => {
            setFormData({ name: "", email: "", subject: "", message: "" })
            setTimeout(() => {
              setSubmitted(false)
            }, 5000)
          },
          () => {
            alert(t("contact.emailFailed"))
            setSubmitted(false)
          },
        )
    })
  }

  return (
    <div className="min-h-screen bg-stone-50/50 dark:bg-gray-950/20 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full mb-6">
            <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{t("contact.badge")}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4 px-4">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              {t("contact.title")}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-4">
            {contactMethods.map((contact, index) => {
              const Icon = contact.icon
              return (
                <motion.a
                  key={contact.titleKey}
                  href={contact.link}
                  target={contact.titleKey === "contact.location" ? "_blank" : undefined}
                  rel={contact.titleKey === "contact.location" ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`group block rounded-2xl border border-gray-200/60 dark:border-gray-800 bg-gradient-to-br ${contact.bgGradient} p-5 shadow-sm hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${contact.color} shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t(contact.titleKey)}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{contact.value}</p>
                    </div>
                  </div>
                </motion.a>
              )
            })}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 shadow-lg border border-gray-200/60 dark:border-gray-800"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t("contact.sendMessage")}
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("contact.thankYou")}</h3>
                <p className="text-gray-600 dark:text-gray-400">{t("contact.thankYouDesc")}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    placeholder={t("contact.namePlaceholder")}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[44px] transition-shadow"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder={t("contact.emailPlaceholder")}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[44px] transition-shadow"
                  />
                </div>

                <input
                  type="text"
                  name="subject"
                  placeholder={t("contact.subjectPlaceholder")}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[44px] transition-shadow"
                />

                <textarea
                  name="message"
                  placeholder={t("contact.messagePlaceholder")}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-shadow"
                />

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all min-h-[48px]"
                >
                  <Send className="w-5 h-5" />
                  {t("contact.sendButton")}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
