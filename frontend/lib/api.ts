// API client for Agricultural AI System Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://neel2601-sasya-ai-backend.hf.space'

// Error logging helper
function logError(endpoint: string, error: any) {
  console.error(`API Error [${endpoint}]:`, {
    message: error?.message || String(error || "Unknown error"),
    timestamp: new Date().toISOString(),
    endpoint,
  })
}

export interface ChatResponse {
  response: string
  auto_speak?: boolean
  language?: string
  speech_language?: string
}

export interface SpeechToTextResponse {
  transcription: string
  detected_language?: string
  actual_script?: string
  confidence?: number
  note?: string
}

export interface PredictionItem {
  label: string
  display_name: string
  confidence: number
}

export interface DiagnosisResponse {
  disease: string
  display_name: string
  confidence: number
  confidence_band: string
  crop: string
  need_voice: boolean
  cause?: string | null
  treatment: string[]
  prevention?: string | null
  top3?: PredictionItem[]
  top_3_predictions?: PredictionItem[]
  advisory?: string | null
  advisory_source?: string | null
}

export interface CropClassificationResponse {
  crop: string
  confidence: number
}

export interface MarketPredictionResponse {
  crop: string
  predicted_price: number
  currency: string
  recommendation: string
}

export interface TranslationResponse {
  original_text: string
  translated_text: string
  source_language: string
  target_language: string
}

export interface TextToSpeechResponse {
  audio_url: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`)
    return response.json()
  }

  async chat(message: string, lang?: string, actualScript?: string): Promise<ChatResponse> {
    try {
      const formData = new FormData()
      formData.append('message', message)
      if (lang) formData.append('lang', lang)
      if (actualScript) formData.append('actual_script', actualScript)

      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      logError('/chat', error)
      throw error
    }
  }

  async speechToText(audioFile: File, lang?: string): Promise<SpeechToTextResponse> {
    try {
      const formData = new FormData()
      formData.append('audio_file', audioFile)
      if (lang) formData.append('lang', lang)

      const response = await fetch(`${this.baseUrl}/speech-to-text`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Speech-to-text API error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      logError('/speech-to-text', error)
      throw error
    }
  }

  async imageDiagnosis(imageFile: File, language: string = 'en'): Promise<DiagnosisResponse> {
    try {
      const formData = new FormData()
      formData.append('image_file', imageFile)
      formData.append('language', language)

      const response = await fetch(`${this.baseUrl}/image-diagnosis`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Image diagnosis API error: ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      logError('/image-diagnosis', error)
      throw error
    }
  }

  async cropClassification(imageFile: File): Promise<CropClassificationResponse> {
    const formData = new FormData()
    formData.append('image_file', imageFile)

    const response = await fetch(`${this.baseUrl}/crop-classification`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Crop classification API error: ${response.statusText}`)
    }

    return response.json()
  }

  async marketPrediction(
    crop: string,
    state: string,
    district: string,
    market: string
  ): Promise<MarketPredictionResponse> {
    const formData = new FormData()
    formData.append('crop', crop)
    formData.append('state', state)
    formData.append('district', district)
    formData.append('market', market)

    const response = await fetch(`${this.baseUrl}/market-prediction`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Market prediction API error: ${response.statusText}`)
    }

    return response.json()
  }

  async translate(
    text: string,
    sourceLang: string = 'hin_Deva',
    targetLang: string = 'eng_Latn'
  ): Promise<TranslationResponse> {
    const formData = new FormData()
    formData.append('text', text)
    formData.append('source_lang', sourceLang)
    formData.append('target_lang', targetLang)

    const response = await fetch(`${this.baseUrl}/translate`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`)
    }

    return response.json()
  }

  async textToSpeech(
    text: string,
    language: string = 'hi'
  ): Promise<Blob> {
    const formData = new FormData()
    formData.append('text', text)
    formData.append('language', language)

    const response = await fetch(`${this.baseUrl}/text-to-speech`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Text-to-speech API error: ${response.statusText}`)
    }

    return response.blob()
  }

  async startVoiceSession(data: {
    language: string
    crop: string
    disease: string
    confidence: number
    severity: string
  }) {
    try {
      const response = await fetch("/api/voice/start-voice-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        const detail = payload?.error || response.statusText || `HTTP ${response.status}`
        throw new Error(`Voice session API error: ${detail}`)
      }

      return payload
    } catch (error) {
      logError("/voice/start-voice-session", error)
      throw error
    }
  }
}

export const apiClient = new ApiClient()
