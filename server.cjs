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

const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard']

function buildStudyPrompt(notes, preferences = {}) {
  const {
    difficulty = 'medium',
    questionCount = 5,
    includeSummary = true,
    includeKeyConcepts = true,
    includePracticeQuestions = true,
  } = preferences

  const sections = []

  if (includeSummary) {
    sections.push(`## 1. Short Summary
Give a concise summary.`)
  }

  if (includeKeyConcepts) {
    sections.push(`## 2. Key Concepts
List the most important concepts using bullet points.`)
  }

  if (includePracticeQuestions) {
    sections.push(`## 3. Practice Questions
Create ${questionCount} questions based only on the notes.`)
  }

  return `Analyze these study notes and provide:

# Study Guide

${sections.join('\n\n')}

Use a ${difficulty} difficulty level throughout.
Use clear Markdown headings, bullet points, numbered lists, and paragraphs.

Study notes:
${notes}`
}

function validatePreferences(preferences = {}) {
  const errors = {}

  if (!DIFFICULTY_OPTIONS.includes(preferences.difficulty)) {
    errors.difficulty = 'Choose a valid difficulty level.'
  }

  const questionCount = Number(preferences.questionCount)

  if (!Number.isInteger(questionCount) || questionCount < 1 || questionCount > 20) {
    errors.questionCount = 'Question count must be a whole number between 1 and 20.'
  }

  if (
    !preferences.includeSummary &&
    !preferences.includeKeyConcepts &&
    !preferences.includePracticeQuestions
  ) {
    errors.outputSections = 'Select at least one output section to generate.'
  }

  return errors
}

app.post('/api/generate', async (req, res) => {
  try {
    const { notes, preferences = {} } = req.body

    if (!notes || !notes.trim()) {
      return res.status(400).json({
        error: 'Please provide some study notes.',
      })
    }

    const preferenceErrors = validatePreferences(preferences)

    if (Object.keys(preferenceErrors).length > 0) {
      return res.status(400).json({
        error: 'Invalid study preferences.',
        errors: preferenceErrors,
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
          content: buildStudyPrompt(notes, preferences),
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