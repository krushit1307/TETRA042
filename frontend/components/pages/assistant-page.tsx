"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, Upload, Loader, Volume2, Pause, Play } from "lucide-react"
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

type VoicePhase = "idle" | "recording" | "ready"
type AudioPlaybackState = "idle" | "playing" | "paused"

export default function AssistantPage() {
  const { t, language, languages } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [voicePhase, setVoicePhase] = useState<VoicePhase>("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const wavRecorderRef = useRef<WavRecorder | null>(null)
  const [lastDetectedLang, setLastDetectedLang] = useState<string | undefined>(undefined)
  const [lastActualScript, setLastActualScript] = useState<string | undefined>(undefined)
  const [selectedLang, setSelectedLang] = useState<string>("")

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUrlRef = useRef<string | null>(null)
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)
  const [audioPlaybackState, setAudioPlaybackState] = useState<AudioPlaybackState>("idle")

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

  const cleanupAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
      audioUrlRef.current = null
    }
    setPlayingMessageId(null)
    setAudioPlaybackState("idle")
  }, [])

  useEffect(() => () => cleanupAudio(), [cleanupAudio])

  const cleanupVoiceStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    wavRecorderRef.current = null
  }, [stream])

  const handleSendMessage = async (messageText?: string) => {
    const text = (messageText ?? input).trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await apiClient.chat(text, selectedLang || lastDetectedLang, lastActualScript)

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: new Date(),
        language: response.language || response.speech_language,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (response.auto_speak) {
        setTimeout(() => {
          const speechLang = response.speech_language || response.language || "hi"
          void toggleAudioPlayback(aiMessage.id, response.response, speechLang)
        }, 500)
      }
    } catch (error) {
      console.error("Chat error:", error)
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

  const startVoiceRecording = async () => {
    if (voicePhase !== "idle") return

    try {
      const rec = new WavRecorder(16000)
      wavRecorderRef.current = rec
      await rec.start()
      setStream(rec.stream)
      setVoicePhase("recording")
      setInput("")
    } catch (error) {
      console.error("Microphone access error:", error)
      setInput(t("assistant.micDenied"))
      cleanupVoiceStream()
      setVoicePhase("idle")
    }
  }

  const endVoiceRecording = async () => {
    if (voicePhase !== "recording" || !wavRecorderRef.current) return

    const blob = await wavRecorderRef.current.stop()
    cleanupVoiceStream()

    if (!blob || blob.size === 0) {
      toast.error(t("assistant.voiceFailed"))
      setVoicePhase("idle")
      setInput("")
      return
    }

    setIsTranscribing(true)
    setInput(t("assistant.transcribing"))

    try {
      const audioFile = new File([blob], "recording.wav", { type: "audio/wav" })
      const response = await apiClient.speechToText(audioFile, selectedLang || undefined)
      setLastDetectedLang(response.detected_language)
      setLastActualScript(response.actual_script)

      if (response.transcription?.trim()) {
        setInput(response.transcription)
        setVoicePhase("ready")
      } else {
        setInput(t("assistant.voiceFailed"))
        setVoicePhase("idle")
      }
    } catch (err) {
      console.error("Speech-to-text error:", err)
      setInput(t("assistant.voiceFailed"))
      setVoicePhase("idle")
    } finally {
      setIsTranscribing(false)
    }
  }

  const proceedVoiceRecording = async () => {
    const text = input.trim()
    if (!text || voicePhase !== "ready" || isTranscribing) return

    setVoicePhase("idle")
    await handleSendMessage(text)
  }

  const toggleAudioPlayback = async (messageId: string, text: string, language: string = "hi") => {
    if (playingMessageId === messageId && audioPlaybackState === "playing") {
      audioRef.current?.pause()
      setAudioPlaybackState("paused")
      return
    }

    if (playingMessageId === messageId && audioPlaybackState === "paused" && audioRef.current) {
      await audioRef.current.play()
      setAudioPlaybackState("playing")
      return
    }

    cleanupAudio()

    try {
      const audioBlob = await apiClient.textToSpeech(text, language)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioRef.current = audio
      audioUrlRef.current = audioUrl
      setPlayingMessageId(messageId)
      setAudioPlaybackState("playing")

      audio.onended = () => cleanupAudio()
      audio.onerror = () => cleanupAudio()
      await audio.play()
    } catch (error) {
      console.error("Text-to-speech error:", error)
      cleanupAudio()
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
        const response = await apiClient.imageDiagnosis(file)

        const treatmentText = response.treatment.join(" 2) ")
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: `मैंने आपकी छवि का विश्लेषण किया है। यह ${response.disease} है (${response.confidence}% confidence)। कारण: ${response.cause}। उपचार: 1) ${treatmentText}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])

        setTimeout(() => {
          void toggleAudioPlayback(aiMessage.id, aiMessage.content, "hi")
        }, 500)
      } catch (error) {
        console.error("Image diagnosis error:", error)
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

  const getAudioButtonTitle = (messageId: string) => {
    if (playingMessageId !== messageId) return t("assistant.playAudio")
    if (audioPlaybackState === "playing") return t("assistant.stopAudio")
    return t("assistant.continueAudio")
  }

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 flex flex-col bg-gradient-to-br from-green-50 to-amber-50 dark:from-gray-950 dark:to-gray-900 z-40">
      <div className="flex-none bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-3 sm:p-4 shadow-sm z-50">
        <div className="max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t("assistant.title")}</h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t("assistant.subtitle")}</p>
          </div>
        </div>
      </div>

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
                        onClick={() =>
                          void toggleAudioPlayback(message.id, message.content, message.language || "hi")
                        }
                        className={`ml-2 p-1 rounded-full transition-colors ${playingMessageId === message.id && audioPlaybackState === "playing"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        title={getAudioButtonTitle(message.id)}
                      >
                        {playingMessageId === message.id && audioPlaybackState === "playing" ? (
                          <Pause className="w-3 h-3 opacity-90" />
                        ) : playingMessageId === message.id && audioPlaybackState === "paused" ? (
                          <Play className="w-3 h-3 opacity-90" />
                        ) : (
                          <Volume2 className="w-3 h-3 opacity-70 hover:opacity-100" />
                        )}
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

      <div className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          {voicePhase === "recording" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                  className="w-2 h-2 bg-blue-600 rounded-full shrink-0"
                />
                <span className="text-sm text-blue-600 dark:text-blue-400">{t("assistant.listening")}</span>
              </div>
              <button
                type="button"
                onClick={() => void endVoiceRecording()}
                className="shrink-0 px-3 py-1.5 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                {t("assistant.endVoice")}
              </button>
            </motion.div>
          )}

          <div className="flex gap-1.5 sm:gap-2 items-stretch">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              disabled={voicePhase !== "idle"}
              className="w-16 sm:w-20 md:w-auto px-1.5 sm:px-2 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-xs sm:text-sm min-h-[48px] cursor-pointer transition-colors disabled:opacity-50"
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
              value={
                voicePhase === "recording"
                  ? t("assistant.listening")
                  : isTranscribing
                    ? t("assistant.transcribing")
                    : input
              }
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (voicePhase === "ready") void proceedVoiceRecording()
                  else void handleSendMessage()
                }
              }}
              placeholder={t("assistant.placeholder")}
              readOnly={voicePhase === "recording" || isTranscribing}
              className={`flex-1 min-w-0 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base min-h-[48px] transition-all ${voicePhase === "recording"
                ? "text-blue-600 dark:text-blue-400 italic bg-blue-50/50 dark:bg-blue-900/10"
                : isTranscribing
                  ? "text-gray-500 dark:text-gray-400 italic"
                  : ""
                }`}
            />

            <motion.button
              whileHover={{ scale: voicePhase === "idle" ? 1.05 : 1 }}
              whileTap={{ scale: voicePhase === "idle" ? 0.95 : 1 }}
              onClick={() => void startVoiceRecording()}
              disabled={voicePhase !== "idle"}
              className={`p-2.5 sm:p-3 rounded-lg transition-all flex-none min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${voicePhase === "recording"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              title={t("assistant.startVoice")}
            >
              <Mic className="w-5 h-5" />
            </motion.button>

            <label className={`p-2.5 sm:p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all flex-none min-h-[48px] min-w-[48px] flex items-center justify-center active:scale-95 ${voicePhase !== "idle" ? "opacity-50 pointer-events-none" : ""}`}>
              <Upload className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={voicePhase !== "idle"} />
            </label>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (voicePhase === "ready") void proceedVoiceRecording()
                else void handleSendMessage()
              }}
              disabled={
                isTranscribing ||
                isLoading ||
                (voicePhase === "idle" && !input.trim()) ||
                (voicePhase === "ready" && !input.trim()) ||
                voicePhase === "recording"
              }
              className={`p-2.5 sm:p-3 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-none min-h-[48px] flex items-center justify-center shadow-md hover:shadow-lg active:scale-95 ${voicePhase === "ready"
                ? "bg-green-600 hover:bg-green-700 min-w-[88px] px-3"
                : "bg-green-600 hover:bg-green-700 min-w-[48px]"
                }`}
              title={voicePhase === "ready" ? t("assistant.proceedVoice") : t("assistant.sendMessage")}
            >
              {voicePhase === "ready" ? (
                isTranscribing ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-sm font-medium">{t("assistant.proceedVoice")}</span>
                )
              ) : (
                <Send className="w-5 h-5" />
              )}
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
