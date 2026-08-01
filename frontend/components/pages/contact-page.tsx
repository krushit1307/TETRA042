"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

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

    // EmailJS Integration
    // Service ID: service_0akf3cf
    // Template ID: template_hm93tmh
    // Public Key: guUlCZsW5GDKUm8-6

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
          (result) => {
            console.log("Email sent successfully:", result.text)
            setFormData({ name: "", email: "", subject: "", message: "" })
            // Keep the success message visible for a bit or let the user see it
            // The original code set submitted to false after 3 seconds, we might want to keep it true or reset it
            setTimeout(() => {
              setSubmitted(false)
            }, 5000)
          },
          (error) => {
            console.error("Email sending failed:", error.text)
            alert(t("contact.emailFailed"))
            setSubmitted(false)
          },
        )
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 px-4">{t("contact.title")}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            {t("contact.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          {[
            {
              icon: Mail,
              title: t("contact.email"),
              value: "sasyaaihelp@gmail.com",
              link: "mailto:sasyaaihelp@gmail.com",
            },
            {
              icon: Phone,
              title: t("contact.phone"),
              value: "1234567890",
              link: "tel:1234567890",
            },
            {
              icon: MapPin,
              title: t("contact.location"),
              value: "Vadodara, Gujarat, India",
              link: "https://share.google/qn53yJiZzkKPqCRuR",
            },
          ].map((contact, index) => {
            const Icon = contact.icon
            return (
              <motion.a
                key={index}
                href={contact.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all text-center"
              >
                <Icon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{contact.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{contact.value}</p>
              </motion.a>
            )
          })}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("contact.sendMessage")}</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t("contact.thankYou")}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t("contact.thankYouDesc")}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder={t("contact.namePlaceholder")}
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                />
                <input
                  type="email"
                  name="email"
                  placeholder={t("contact.emailPlaceholder")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder={t("contact.subjectPlaceholder")}
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[44px]"
              />

              <textarea
                name="message"
                placeholder={t("contact.messagePlaceholder")}
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all min-h-[44px]"
              >
                <Send className="w-5 h-5" />
                {t("contact.sendButton")}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  )
}
