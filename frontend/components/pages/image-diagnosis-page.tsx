"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, CheckCircle, AlertCircle, Loader, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n/language-context"
import type { SupportedLanguage } from "@/lib/i18n/languages"

interface DiagnosisResult {
  disease: string
  confidence: number
  crop: string
  confidenceBand: string
  cause: string
  treatment: string[]
  prevention: string[]
  need_voice?: boolean
  needVoice?: boolean
}

const langFlag = (code: string) => (code === "en" ? "🇬🇧" : "🇮🇳")

export default function ImageDiagnosisPage() {
  const { t, language, languages } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>(language)

  useEffect(() => {
    setSelectedLanguage(language)
  }, [language])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        setSelectedImage(event.target?.result as string)
        setImageFile(file)
        setDiagnosis(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDiagnosis = async () => {
    if (!imageFile) {
      toast.error(t("diagnosis.uploadFirst"))
      return
    }

    setLoading(true)
    setError(null)
    setDiagnosis(null)
    toast.loading(t("diagnosis.analyzingImage"), { id: 'image-analysis' })

    try {
      const response = await apiClient.imageDiagnosis(imageFile, selectedLanguage)

      const rawConf = response.confidence ?? 0
      const confPct = rawConf <= 1 ? rawConf * 100 : rawConf

      const needVoice = response.need_voice ?? (response as any).needVoice ?? (
        confPct < 70 ||
        (response.confidence_band && response.confidence_band.toLowerCase() !== 'high') ||
        (response.disease && response.disease.toLowerCase() === 'unknown')
      )

      setDiagnosis({
        disease: response.disease,
        confidence: response.confidence,
        crop: response.crop || '',
        confidenceBand: response.confidence_band || '',
        cause: response.cause || '',
        treatment: response.treatment,
        prevention: response.prevention ? [response.prevention] : [],
        need_voice: needVoice,
        needVoice: needVoice,
      })
      toast.success(t("diagnosis.analysisComplete"), { id: 'image-analysis' })
    } catch (err: any) {
      console.error('Image diagnosis error:', err)
      toast.error(t("diagnosis.analysisFailed"), { id: 'image-analysis' })
      setError(t("diagnosis.analysisFailed"))
      setDiagnosis({
        disease: "Analysis Failed",
        confidence: 0,
        crop: "Unknown",
        confidenceBand: "Low",
        cause: "Unable to analyze image. Please try again.",
        treatment: ["Please upload a clear image of the plant"],
        prevention: []
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 px-4">{t("diagnosis.title")}</h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 px-4">
            {t("diagnosis.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t("diagnosis.uploadTitle")}</h2>

            <label className="block">
              <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors">
                {selectedImage ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t("diagnosis.clickChange")}</p>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-12 h-12 mx-auto text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{t("diagnosis.clickUpload")}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("diagnosis.dragDrop")}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">{t("diagnosis.fileTypes")}</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {selectedImage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-4"
              >
                <Button
                  onClick={handleDiagnosis}
                  disabled={loading || !imageFile}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("diagnosis.analyzing")}
                    </>
                  ) : (
                    t("diagnosis.diagnoseButton")
                  )}
                </Button>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("diagnosis.selectLanguage")}</label>
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      style={{ border: '1px solid #e5e7eb' }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {langFlag(lang.code)} {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedImage(null)
                    setImageFile(null)
                    setDiagnosis(null)
                    setError(null)
                  }}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("diagnosis.clearImage")}
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900 dark:text-white">{t("diagnosis.resultTitle")}</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400">{t("diagnosis.analyzingPlant")}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-red-500 dark:text-red-400">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="text-lg font-semibold">{error}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{t("diagnosis.tryDifferent")}</p>
              </div>
            ) : diagnosis ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Disease Info */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{diagnosis.disease}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${diagnosis.confidence}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {diagnosis.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cause */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("diagnosis.cause")}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{diagnosis.cause}</p>
                </div>

                {/* Treatment */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t("diagnosis.treatment")}</h4>
                  <ul className="space-y-2">
                    {diagnosis.treatment.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Prevention */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{t("diagnosis.prevention")}</h4>
                  <ul className="space-y-2">
                    {diagnosis.prevention.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-5 h-5 rounded-full bg-green-600 dark:bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white dark:text-gray-900 text-xs font-bold">✓</span>
                        </div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Voice Assistant Call Section */}
                {Boolean(diagnosis.need_voice ?? diagnosis.needVoice) && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 rounded-2xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-lg dark:border-green-800 dark:from-green-950/40 dark:to-emerald-950/40"
                  >
                    <h3 className="text-2xl font-bold text-green-800 dark:text-green-300">
                      🌾 Need Expert Help?
                    </h3>

                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      Our AI recommends talking to the Sasya AI Voice Assistant for more accurate guidance.
                    </p>

                    <Button
                      className="mt-5 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5"
                      onClick={async () => {
                        try {
                          // Step 1: Get voice session details from backend with resilient fallback
                          let agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "agent_0001kyy4ph20e06tqysytfz3fkc8"
                          let dynamicVariables: Record<string, any> = {
                            language: selectedLanguage,
                            crop: diagnosis.crop,
                            disease: diagnosis.disease,
                            confidence: diagnosis.confidence,
                            severity: diagnosis.confidenceBand,
                          }

                          try {
                            const session = await apiClient.startVoiceSession({
                              language: selectedLanguage,
                              crop: diagnosis.crop,
                              disease: diagnosis.disease,
                              confidence: diagnosis.confidence,
                              severity: diagnosis.confidenceBand,
                            })
                            if (session?.agent_id) {
                              agentId = session.agent_id
                            }
                            if (session?.dynamic_variables) {
                              dynamicVariables = session.dynamic_variables
                            }
                            console.log("Voice session started:", session)
                          } catch (backendErr) {
                            console.warn("Backend startVoiceSession warning, using direct fallback:", backendErr)
                          }

                          // Step 2: Start ElevenLabs conversation with auto-termination & event logging
                          const goodbyePhrases = [
                            "bye",
                            "goodbye",
                            "thank you",
                            "thanks",
                            "no more questions",
                            "that's all",
                            "end call",
                            "disconnect",
                            "stop",
                          ]

                          let shouldEndCall = false
                          let conversationRef: any = null

                          const conversation = await Conversation.startSession({
                            agentId: agentId,
                            dynamicVariables: dynamicVariables,

                            onConnect: (props) => {
                              console.log("✅ Connected to ElevenLabs. Conversation ID:", props?.conversationId, "Variables:", dynamicVariables)
                              toast.success("Connected to Sasya AI Voice Assistant")
                            },

                            onDisconnect: (details) => {
                              console.log("❌ Disconnected from ElevenLabs. Details:", JSON.stringify(details, null, 2))
                              toast.info("Voice session ended")
                            },

                            onStatusChange: ({ status }) => {
                              console.log("ℹ️ Connection status changed:", status)
                            },

                            onModeChange: async ({ mode }) => {
                              console.log("🔄 Conversation mode changed:", mode)

                              if (shouldEndCall && mode === "listening") {
                                shouldEndCall = false
                                if (conversationRef) {
                                  console.log("🛑 Ending ElevenLabs session after AI finished speaking...")
                                  await conversationRef.endSession()
                                }
                              }
                            },

                            onMessage: (messagePayload) => {
                              console.log("📩 Message received:", messagePayload)

                              const isUser = messagePayload.role === "user" || (messagePayload as any).source === "user"
                              if (isUser && messagePayload.message) {
                                const text = messagePayload.message.toLowerCase()
                                const isGoodbye = goodbyePhrases.some((phrase) => text.includes(phrase))

                                if (isGoodbye) {
                                  console.log("👋 Goodbye phrase detected from user:", text)
                                  shouldEndCall = true
                                }
                              }
                            },

                            onError: (message, context) => {
                              console.error("❌ ElevenLabs Detailed Error:")
                              console.error("  - Message:", message)
                              console.error("  - Context:", JSON.stringify(context, null, 2))
                              if (context && typeof context === "object") {
                                console.error("  - Code:", (context as any).code || (context as any).status)
                                console.error("  - Details:", (context as any).details || (context as any).reason)
                                if ((context as any).stack) {
                                  console.error("  - Stack:", (context as any).stack)
                                }
                              }
                              toast.error(`Voice Error: ${message || "Connection failed"}`)
                            },

                            onDebug: (info) => {
                              console.log("🐛 ElevenLabs Debug Info:", info)
                            },
                          })

                          conversationRef = conversation
                          console.log("Conversation instance:", conversation)

                        } catch (err) {
                          console.error("Failed to start voice session:", err)
                          toast.error("Failed to connect to voice assistant.")
                        }
                      }}
                    >
                      📞 Call Now
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">{t("diagnosis.uploadPrompt")}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
