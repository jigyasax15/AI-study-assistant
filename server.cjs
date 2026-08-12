const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const OpenAI = require('openai')

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

app.post('/api/generate', async (req, res) => {
  try {
    const { notes } = req.body

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: 'Please provide some study notes.',
      })
    }

    const completion = await client.chat.completions.create({
      model: 'openrouter/free',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful study assistant. Create clear, student-friendly study material from the notes provided.',
        },
        {
          role: 'user',
          content: `Analyze these study notes and provide:

# Study Guide

## 1. Short Summary
Give a concise summary.

## 2. Key Concepts
List the most important concepts using bullet points.

## 3. Practice Questions
Create five questions based only on the notes.

Use clear Markdown headings, bullet points, numbered lists, and paragraphs.

Study notes:
${notes}`,
        },
      ],
    })

    const result = completion.choices[0].message.content

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