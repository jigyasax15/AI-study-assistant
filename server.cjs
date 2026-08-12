const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const { GoogleGenAI } = require('@google/genai')

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

app.post('/api/generate', async (req, res) => {
  try {
    const { notes } = req.body

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: 'Please provide some study notes.',
      })
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are a helpful study assistant.

Analyze the following study notes and create useful study material.

Provide:

1. A short summary
2. The key concepts
3. Five practice questions

Use clear headings and keep the explanation student-friendly.

Study notes:
${notes}`,
    })

    const result = response.text

    res.json({ result })
  } catch (error) {
    console.error('AI request failed:', error)

    res.status(500).json({
      error: 'Something went wrong while generating study material.',
    })
  }
})

app.listen(PORT, () => {
  console.log(`AI server running at http://localhost:${PORT}`)
})