export class WavRecorder {
  private audioCtx: AudioContext | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private processor: ScriptProcessorNode | null = null
  private chunks: Float32Array[] = []
  private _stream: MediaStream | null = null
  private targetSampleRate: number
  private isRecording: boolean = false

  constructor(sampleRate: number = 16000) {
    this.targetSampleRate = sampleRate
  }

  get stream(): MediaStream | null {
    return this._stream
  }

  async start() {
    this._stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true
      }
    })
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: this.targetSampleRate })
    this.source = this.audioCtx.createMediaStreamSource(this._stream)
    this.processor = this.audioCtx.createScriptProcessor(4096, 1, 1)
    this.source.connect(this.processor)
    this.processor.connect(this.audioCtx.destination)
    this.chunks = []
    this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
      const input = e.inputBuffer.getChannelData(0)
      this.chunks.push(new Float32Array(input))
    }
    this.isRecording = true
  }

  async stop(): Promise<Blob> {
    if (!this.isRecording || !this.audioCtx || !this.processor || !this.source) {
      console.warn('stop() called but not recording, returning empty blob')
      this.isRecording = false
      return new Blob([], { type: 'audio/wav' })
    }
    
    this.isRecording = false
    this.processor.disconnect()
    this.source.disconnect()
    this.processor.onaudioprocess = null
    if (this._stream) this._stream.getTracks().forEach(t => t.stop())
    await this.audioCtx.close()

    const data = this.concatFloat32(this.chunks)
    const pcm16 = this.floatTo16BitPCM(data)
    const wavBuffer = this.encodeWAV(pcm16, this.targetSampleRate, 1)
    return new Blob([wavBuffer], { type: 'audio/wav' })
  }

  private concatFloat32(arrays: Float32Array[]): Float32Array {
    let length = 0
    for (const a of arrays) length += a.length
    const result = new Float32Array(length)
    let offset = 0
    for (const a of arrays) { result.set(a, offset); offset += a.length }
    return result
  }

  private floatTo16BitPCM(float32: Float32Array): Int16Array {
    const out = new Int16Array(float32.length)
    for (let i = 0; i < float32.length; i++) {
      let s = Math.max(-1, Math.min(1, float32[i]))
      out[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return out
  }

  private encodeWAV(samples: Int16Array, sampleRate: number, numChannels: number): ArrayBuffer {
    const buffer = new ArrayBuffer(44 + samples.length * 2)
    const view = new DataView(buffer)

    this.writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + samples.length * 2, true)
    this.writeString(view, 8, 'WAVE')
    this.writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * 2, true)
    view.setUint16(32, numChannels * 2, true)
    view.setUint16(34, 16, true)
    this.writeString(view, 36, 'data')
    view.setUint32(40, samples.length * 2, true)

    let offset = 44
    for (let i = 0; i < samples.length; i++, offset += 2) {
      view.setInt16(offset, samples[i], true)
    }
    return buffer
  }

  private writeString(view: DataView, offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i))
  }
}
