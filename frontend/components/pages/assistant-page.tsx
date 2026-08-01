"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Upload, Loader, Volume2 } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { WavRecorder } from "@/lib/wav-recorder"
import { useLanguage } from "@/lib/i18n/language-context"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  language?: string
}

export default function AssistantPage() {
  const { t, language, languages } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages((prev) => {
      const existingWelcome = prev.find((m) => m.id === "welcome")
      const welcome: Message = {
        id: "welcome",
        type: "ai",
        content: t("assistant.welcomeMessage"),
        timestamp: existingWelcome?.timestamp ?? new Date(),
      }
      const rest = prev.filter((m) => m.id !== "welcome")
      return [welcome, ...rest]
    })
  }, [language, t])

  const langOptions = [
    { code: "", label: t("common.auto") },
    ...languages.map((lang) => ({ code: lang.code, label: lang.nativeName })),
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Call real API
      const response = await apiClient.chat(input, (selectedLang || lastDetectedLang), lastActualScript)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
        language: response.language || response.speech_language,
      }

      setMessages((prev) => [...prev, aiMessage])

      // Auto-play voice response if enabled
      if (response.auto_speak) {
        setTimeout(() => {
          const speechLang = response.speech_language || response.language || 'hi'
          handleTextToSpeech(response.response, speechLang)
        }, 500) // Small delay to ensure message is rendered
      }
    } catch (error) {
      console.error('Chat error:', error)
      toast.error(t("assistant.toastSendFailed"))
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: t("assistant.errorTechnical"),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const wavRecorderRef = useRef<WavRecorder | null>(null)
  const [lastDetectedLang, setLastDetectedLang] = useState<string | undefined>(undefined)
  const [lastActualScript, setLastActualScript] = useState<string | undefined>(undefined)
  const [selectedLang, setSelectedLang] = useState<string>('')

  const handleVoiceInput = async () => {
    if (!isListening) {
      setIsListening(true)
      try {
        // Use custom WAV recorder (16kHz mono PCM -> WAV)
        const rec = new WavRecorder(16000)
        wavRecorderRef.current = rec
        await rec.start()
        setStream(rec.stream)
        console.log('WAV recording started...')

      } catch (error) {
        console.error('Microphone access error:', error)
        setIsListening(false)
        setInput(t("assistant.micDenied"))
      }
    } else {
      // Stop WAV recording and upload
      if (wavRecorderRef.current) {
        console.log('Stopping WAV recorder...')
        const blob = await wavRecorderRef.current.stop()
        const audioFile = new File([blob], 'recording.wav', { type: 'audio/wav' })
        try {
          const response = await apiClient.speechToText(audioFile, selectedLang || undefined)
          setInput(response.transcription)
          console.log('Transcription received:', response.transcription)
          console.log('Detected language:', response.detected_language)
          console.log('Actual script:', response.actual_script)
          setLastDetectedLang(response.detected_language)
          setLastActualScript(response.actual_script)

          // Auto-send the transcribed message for immediate response
          if (response.transcription && response.transcription.trim()) {
            setTimeout(() => {
              handleSendMessage()
            }, 300)
          }
        } catch (err) {
          console.error('Speech-to-text error:', err)
          setInput(t("assistant.voiceFailed"))
        }
      }
      if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null) }
      setMediaRecorder(null)
      setIsListening(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: `📸 ${t("assistant.imageUploaded")}: ${file.name}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        // Call real image diagnosis API
        const response = await apiClient.imageDiagnosis(file)

        const treatmentText = response.treatment.join(' 2) ')
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `मैंने आपकी छवि का विश्लेषण किया है। यह ${response.disease} है (${response.confidence}% confidence)। कारण: ${response.cause}। उपचार: 1) ${treatmentText}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])

        // Auto-play voice response
        setTimeout(() => {
          handleTextToSpeech(aiMessage.content, 'hi')
        }, 500)

      } catch (error) {
        console.error('Image diagnosis error:', error)
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: t("assistant.errorImage"),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleTextToSpeech = async (text: string, language: string = 'hi') => {
    try {
      const audioBlob = await apiClient.textToSpeech(text, language)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (error) {
      console.error('Text-to-speech error:', error)
    }
  }

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 flex flex-col bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 z-40">
      {/* Header - Fixed Top of the component */}
      <div className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4 shadow-sm z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t("assistant.title")}</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("assistant.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Messages Container - Scrollable Middle */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        <div className="max-w-4xl mx-auto pb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${message.type === "user"
                    ? "bg-green-600 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none shadow-md"
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {message.type === "ai" && (
                      <button
                        onClick={() => handleTextToSpeech(message.content, message.language || 'hi')}
                        className="ml-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title={t("assistant.playAudio")}
                      >
                        <Volume2 className="w-3 h-3 opacity-70 hover:opacity-100" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-3 rounded-lg rounded-bl-none shadow-md">
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">{t("assistant.thinking")}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area - Fixed Bottom */}
      <div className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
              <span className="text-sm text-blue-600 dark:text-blue-400">{t("assistant.listening")}</span>
            </motion.div>
          )}

          {/* Single-line input controls */}
          <div className="flex gap-1.5 sm:gap-2 items-stretch">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-16 sm:w-20 md:w-auto px-1.5 sm:px-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm min-h-[48px] cursor-pointer transition-colors"
              title={t("assistant.languageOptional")}
            >
              {langOptions.map((lang) => (
                <option key={lang.code || "auto"} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={t("assistant.placeholder")}
              className="flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base min-h-[48px] transition-all"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVoiceInput}
              className={`p-2.5 sm:p-3 rounded-lg transition-all flex-none min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 ${isListening
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              title={t("assistant.voiceInput")}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <label className="p-2.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all flex-none min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95">
              <Upload className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="p-2.5 sm:p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-none min-h-[48px] min-w-[48px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95"
              title={t("assistant.sendMessage")}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center hidden sm:block">
            🌐 {t("assistant.supports")}
          </p>
        </div>
      </div>
    </div>
  )
}
