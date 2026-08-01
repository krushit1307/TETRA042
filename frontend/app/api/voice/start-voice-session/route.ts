import { NextResponse } from "next/server"

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const ELEVENLABS_AGENT_ID =
  process.env.ELEVENLABS_AGENT_ID ||
  process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID ||
  "agent_0001kyy4ph20e06tqysytfz3fkc8"

async function getSignedUrl(agentId: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(agentId)}`
    const response = await fetch(url, {
      headers: { "xi-api-key": apiKey },
      cache: "no-store",
    })

    if (!response.ok) {
      const body = await response.text().catch(() => "")
      console.error("ElevenLabs signed URL error:", response.status, body)
      return null
    }

    const data = await response.json()
    return data.signed_url ?? null
  } catch (error) {
    console.error("Failed to get ElevenLabs signed URL:", error)
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { language, crop, disease, confidence, severity } = body

    // Prefer local ElevenLabs credentials; fall back to Python backend if configured there.
    if (!ELEVENLABS_API_KEY) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://neel2601-sasya-ai-backend.hf.space"
      const backendResponse = await fetch(`${backendUrl}/voice/start-voice-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, crop, disease, confidence, severity }),
        cache: "no-store",
      })

      const backendPayload = await backendResponse.json().catch(() => null)
      if (backendResponse.ok && backendPayload?.signed_url) {
        return NextResponse.json(backendPayload)
      }

      return NextResponse.json(
        {
          error:
            backendPayload?.detail ||
            "ELEVENLABS_API_KEY is not configured. Add it to frontend/.env (see .env.example).",
        },
        { status: 503 },
      )
    }

    const signedUrl = await getSignedUrl(ELEVENLABS_AGENT_ID, ELEVENLABS_API_KEY)

    if (!signedUrl) {
      return NextResponse.json(
        { error: "Could not obtain a signed URL from ElevenLabs. Check API key and agent ID." },
        { status: 502 },
      )
    }

    return NextResponse.json({
      agent_id: ELEVENLABS_AGENT_ID,
      signed_url: signedUrl,
      dynamic_variables: {
        language,
        crop,
        disease,
        confidence,
        severity,
      },
    })
  } catch (error) {
    console.error("Voice session route error:", error)
    return NextResponse.json({ error: "Failed to start voice session." }, { status: 500 })
  }
}
