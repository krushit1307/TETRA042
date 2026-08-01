"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export type VoiceCallMode = "connecting" | "speaking" | "listening"

export interface VoiceAudioLevels {
  inputVolume: number
  outputVolume: number
  inputFrequency: Uint8Array | null
  outputFrequency: Uint8Array | null
}

interface VoiceOrbVisualizerProps {
  mode: VoiceCallMode
  getAudioLevels: () => VoiceAudioLevels
}

function VoiceOrbVisualizer({ mode, getAudioLevels }: VoiceOrbVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 280

    const resize = () => {
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()

    const spikeCount = 72
    const baseRadius = 58
    const center = size / 2

    const draw = (time: number) => {
      const { inputVolume, outputVolume, inputFrequency, outputFrequency } = getAudioLevels()
      const isSpeaking = mode === "speaking"
      const isConnecting = mode === "connecting"

      const activeVolume = isSpeaking ? outputVolume : inputVolume
      const frequencyData = isSpeaking ? outputFrequency : inputFrequency

      ctx.clearRect(0, 0, size, size)

      const pulse = isConnecting
        ? 0.15 + Math.sin(time * 0.003) * 0.08
        : Math.min(1, activeVolume * 1.4 + 0.08)

      // Outer glow rings
      for (let ring = 3; ring >= 1; ring--) {
        const ringRadius = baseRadius + ring * 18 + pulse * 12
        const alpha = isConnecting ? 0.06 : 0.04 + pulse * 0.08
        const gradient = ctx.createRadialGradient(center, center, ringRadius * 0.6, center, center, ringRadius)
        if (isSpeaking) {
          gradient.addColorStop(0, `rgba(34, 197, 94, ${alpha})`)
          gradient.addColorStop(1, "rgba(34, 197, 94, 0)")
        } else if (isConnecting) {
          gradient.addColorStop(0, `rgba(16, 185, 129, ${alpha})`)
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)")
        } else {
          gradient.addColorStop(0, `rgba(59, 130, 246, ${alpha})`)
          gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        }
        ctx.beginPath()
        ctx.arc(center, center, ringRadius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Radial spikes
      for (let i = 0; i < spikeCount; i++) {
        const angle = (i / spikeCount) * Math.PI * 2 - Math.PI / 2
        let spikeStrength = 0.12 + pulse * 0.35

        if (frequencyData && frequencyData.length > 0) {
          const binIndex = Math.floor((i / spikeCount) * frequencyData.length)
          const binValue = frequencyData[binIndex] / 255
          spikeStrength = 0.1 + binValue * 0.65 + pulse * 0.2
        } else if (!isConnecting) {
          spikeStrength += Math.sin(time * 0.008 + i * 0.4) * 0.04 * (0.3 + pulse)
        }

        const innerR = baseRadius - 4
        const outerR = baseRadius + spikeStrength * 42

        const x1 = center + Math.cos(angle) * innerR
        const y1 = center + Math.sin(angle) * innerR
        const x2 = center + Math.cos(angle) * outerR
        const y2 = center + Math.sin(angle) * outerR

        const spikeGradient = ctx.createLinearGradient(x1, y1, x2, y2)
        if (isSpeaking) {
          spikeGradient.addColorStop(0, "rgba(74, 222, 128, 0.85)")
          spikeGradient.addColorStop(1, "rgba(16, 185, 129, 0.15)")
        } else if (isConnecting) {
          spikeGradient.addColorStop(0, "rgba(110, 231, 183, 0.7)")
          spikeGradient.addColorStop(1, "rgba(16, 185, 129, 0.1)")
        } else {
          spikeGradient.addColorStop(0, "rgba(96, 165, 250, 0.85)")
          spikeGradient.addColorStop(1, "rgba(59, 130, 246, 0.15)")
        }

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = spikeGradient
        ctx.lineWidth = 2.2
        ctx.lineCap = "round"
        ctx.stroke()
      }

      // Core orb
      const coreRadius = baseRadius - 8 + pulse * 6
      const coreGradient = ctx.createRadialGradient(
        center - coreRadius * 0.25,
        center - coreRadius * 0.25,
        coreRadius * 0.1,
        center,
        center,
        coreRadius,
      )

      if (isSpeaking) {
        coreGradient.addColorStop(0, "#bbf7d0")
        coreGradient.addColorStop(0.45, "#22c55e")
        coreGradient.addColorStop(1, "#047857")
      } else if (isConnecting) {
        coreGradient.addColorStop(0, "#d1fae5")
        coreGradient.addColorStop(0.5, "#10b981")
        coreGradient.addColorStop(1, "#065f46")
      } else {
        coreGradient.addColorStop(0, "#bfdbfe")
        coreGradient.addColorStop(0.45, "#3b82f6")
        coreGradient.addColorStop(1, "#1e40af")
      }

      ctx.beginPath()
      ctx.arc(center, center, coreRadius, 0, Math.PI * 2)
      ctx.fillStyle = coreGradient
      ctx.fill()

      // Inner highlight
      ctx.beginPath()
      ctx.arc(center - coreRadius * 0.22, center - coreRadius * 0.22, coreRadius * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
      ctx.fill()

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [mode, getAudioLevels])

  return (
    <div className="relative flex items-center justify-center py-4">
      <canvas ref={canvasRef} className="drop-shadow-2xl" aria-hidden="true" />
    </div>
  )
}

interface VoiceCallOverlayProps {
  open: boolean
  mode: VoiceCallMode
  getAudioLevels: () => VoiceAudioLevels
  onEndCall: () => void
}

export function VoiceCallOverlay({ open, mode, getAudioLevels, onEndCall }: VoiceCallOverlayProps) {
  const statusText =
    mode === "connecting"
      ? "Connecting to Sasya AI..."
      : mode === "speaking"
        ? "Sasya AI is speaking"
        : "Listening to you..."

  const statusHint =
    mode === "connecting"
      ? "Setting up your voice session"
      : mode === "speaking"
        ? "Ask follow-up questions when the assistant finishes"
        : "Speak clearly — say goodbye to end the call"

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onEndCall()}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-md border-green-200/60 bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950 text-white overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.18),transparent_55%)]" />

        <DialogHeader className="relative z-10 text-center">
          <DialogTitle className="text-xl font-bold text-white">Sasya AI Voice Assistant</DialogTitle>
          <DialogDescription className="text-emerald-100/80">{statusHint}</DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <VoiceOrbVisualizer mode={mode} getAudioLevels={getAudioLevels} />

          <motion.p
            key={mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-emerald-200"
          >
            {statusText}
          </motion.p>

          <div className="mt-6 flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                mode === "connecting"
                  ? "bg-amber-400 animate-pulse"
                  : mode === "speaking"
                    ? "bg-green-400 animate-pulse"
                    : "bg-blue-400 animate-pulse"
              }`}
            />
            <span className="text-xs uppercase tracking-wider text-slate-300">
              {mode === "connecting" ? "Connecting" : mode === "speaking" ? "Assistant Active" : "Your Turn"}
            </span>
          </div>
        </motion.div>

        <div className="relative z-10 mt-2 flex justify-center">
          <Button
            onClick={onEndCall}
            variant="destructive"
            className="rounded-full px-6 gap-2 shadow-lg"
          >
            <PhoneOff className="h-4 w-4" />
            End Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
