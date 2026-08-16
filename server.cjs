const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const OpenAI = require('openai')

dotenv.config({ path: '.env.local' })

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
})

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

const DEFAULT_PREFERENCES = {
  difficulty: 'medium',
  questionCount: 5,
  outputOptions: {
    summary: true,
    keyConcepts: true,
    practiceQuestions: true,
  },
}

function validatePreferences(preferences) {
  const errors = {}

  if (!VALID_DIFFICULTIES.includes(preferences?.difficulty)) {
    errors.difficulty = 'Please select a difficulty level.'
  }

  const count = Number(preferences?.questionCount)
  if (!Number.isInteger(count) || count < 1 || count > 20) {
    errors.questionCount = 'Enter a whole number from 1 to 20.'
  }

  const outputOptions = preferences?.outputOptions ?? {}
  const hasOutput =
    outputOptions.summary ||
    outputOptions.keyConcepts ||
    outputOptions.practiceQuestions

  if (!hasOutput) {
    errors.outputOptions = 'Select at least one output option.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

function buildPrompt(notes, preferences) {
  const { difficulty, questionCount, outputOptions } = preferences

  const difficultyInstructions = {
    easy:
      'Use simple language suitable for beginners. Explain concepts in an accessible way.',
    medium:
      'Use standard academic language with moderate depth and clarity.',
    hard:
      'Use advanced terminology and deeper analysis suitable for expert-level study.',
  }

  const sections = []
  let sectionNumber = 1

  if (outputOptions.summary) {
    sections.push(
      `## ${sectionNumber++}. Short Summary\nGive a concise summary.`
    )
  }

  if (outputOptions.keyConcepts) {
    sections.push(
      `## ${sectionNumber++}. Key Concepts\nList the most important concepts using bullet points.`
    )
  }

  if (outputOptions.practiceQuestions) {
    sections.push(
      `## ${sectionNumber++}. Practice Questions\nCreate exactly ${questionCount} ${difficulty}-level practice questions based only on the notes.`
    )
  }

  return `Analyze these study notes and provide:

# Study Guide

${sections.join('\n\n')}

${difficultyInstructions[difficulty]}

Use clear Markdown headings, bullet points, numbered lists, and paragraphs.

Study notes:
${notes}`
}

app.post('/api/generate', async (req, res) => {
  try {
    const { notes, preferences = DEFAULT_PREFERENCES } = req.body

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: 'Please provide some study notes.',
      })
    }

    const validation = validatePreferences(preferences)
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid study preferences.',
        errors: validation.errors,
      })
    }

    const prompt = buildPrompt(notes, preferences)

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
          content: prompt,
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
