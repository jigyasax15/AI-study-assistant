import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import StudyPreferencesForm from './components/StudyPreferencesForm'
import {
  DEFAULT_PREFERENCES,
  validatePreferences,
  hasValidationErrors,
} from './utils/validatePreferences'
import './App.css'

function App() {
  const [notes, setNotes] = useState('')
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [preferenceErrors, setPreferenceErrors] = useState({})
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setError('')
    setResult('')
    setPreferenceErrors({})

    const validationErrors = validatePreferences(preferences)

    if (hasValidationErrors(validationErrors)) {
      setPreferenceErrors(validationErrors)
      return
    }

    if (!notes.trim()) {
      setError('Please enter some study notes first.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'https://ai-study-assistant-ge1o.onrender.com/api/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notes,
            preferences: {
              ...preferences,
              questionCount: Number(preferences.questionCount),
            },
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data.result)
    } catch (error) {
      console.error(error)
      setError('Something went wrong while generating material.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <p className="eyebrow">AI-POWERED STUDY TOOL</p>

        <h1>Study smarter with your notes.</h1>

        <p className="intro">
          Turn your study notes into summaries, key concepts, and practice
          questions with the help of AI.
        </p>

        <StudyPreferencesForm
          preferences={preferences}
          errors={preferenceErrors}
          onChange={setPreferences}
        />

        <div className="notes-section">
          <label htmlFor="notes">Your study notes</label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Paste your notes here..."
            rows="10"
          />

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate study material'}
          </button>
          {loading && (
            <p className="sr-only" role="status" aria-live="polite">
              Your study material is being generated. Please wait.
            </p>
          )}
        </div>

        {result && (
          <section className="result" aria-live="polite">
            <h2>Study material</h2>

            <div className="study-content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default App
