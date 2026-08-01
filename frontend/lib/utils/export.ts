/**
 * Export chat history to JSON file
 */
export function exportChatHistory(messages: any[], filename?: string) {
  const data = JSON.stringify(messages, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `chat-history-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Export chat history to text file
 */
export function exportChatHistoryAsText(messages: any[], filename?: string) {
  const text = messages
    .map((msg) => {
      const time = new Date(msg.timestamp).toLocaleString()
      const sender = msg.type === 'user' ? 'You' : 'AI'
      return `[${time}] ${sender}: ${msg.content}`
    })
    .join('\n\n')

  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `chat-history-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Import chat history from JSON file
 */
export function importChatHistory(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

/**
 * Download diagnosis report as PDF (requires html2pdf.js or similar)
 */
export function downloadDiagnosisReport(diagnosis: any) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Plant Diagnosis Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #16a34a; }
        .section { margin: 20px 0; }
        .label { font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>Plant Diagnosis Report</h1>
      <div class="section">
        <p class="label">Disease:</p>
        <p>${diagnosis.disease}</p>
      </div>
      <div class="section">
        <p class="label">Confidence:</p>
        <p>${diagnosis.confidence}%</p>
      </div>
      <div class="section">
        <p class="label">Cause:</p>
        <p>${diagnosis.cause}</p>
      </div>
      <div class="section">
        <p class="label">Treatment:</p>
        <ul>
          ${diagnosis.treatment.map((t: string) => `<li>${t}</li>`).join('')}
        </ul>
      </div>
      <div class="section">
        <p class="label">Date:</p>
        <p>${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `diagnosis-report-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
