"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/lib/i18n/language-context"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-r from-green-900 to-amber-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/Sasya_bg.png"
                  alt={t("nav.brandName")}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">{t("nav.brandName")}</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white transition">{t("nav.home")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("nav.assistant")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("nav.features")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("nav.about")}</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">{t("footer.resources")}</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li><a href="#" className="hover:text-white transition">{t("footer.documentation")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("footer.blog")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("footer.faq")}</a></li>
              <li><a href="#" className="hover:text-white transition">{t("footer.support")}</a></li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-2 text-sm text-green-100">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:sasyaaihelp@gmail.com" className="hover:text-white transition">
                  sasyaaihelp@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:1234567890" className="hover:text-white transition">
                  1234567890
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <a href="https://share.google/qn53yJiZzkKPqCRuR" target="_blank">Vadodara, Gujarat, India</a>
              </li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-green-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-green-100 text-xs sm:text-sm text-center md:text-left">
              {t("footer.copyright").replace("© Sasya AI", `© ${currentYear} Sasya AI`)}
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="/policy#privacy" className="text-green-100 hover:text-white transition">
                {t("footer.privacy")}
              </a>
              <a href="/policy#terms" className="text-green-100 hover:text-white transition">
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
