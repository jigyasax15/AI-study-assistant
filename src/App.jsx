import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import StudyPreferencesForm from './components/StudyPreferencesForm'
import {
  DEFAULT_PREFERENCES,
  validatePreferences,
} from './utils/validatePreferences'
import './App.css'

function App() {
  const [notes, setNotes] = useState('')
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES)
  const [preferenceErrors, setPreferenceErrors] = useState({})
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Used to move keyboard focus to generated material
  const resultRef = useRef(null)

  // Used to cancel an active AI request
  const abortControllerRef = useRef(null)

  // Move focus to the generated study material when it appears
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.focus()
    }
  }, [result])

  async function handleGenerate() {
    setError('')
    setPreferenceErrors({})
    setResult('')

    // Validate study notes
    if (!notes.trim()) {
      setError('Please enter some study notes first.')
      return
    }

    // Validate study preferences
    const validation = validatePreferences(preferences)

    if (!validation.isValid) {
      setPreferenceErrors(validation.errors)
      return
    }

    // Create a controller so generation can be stopped
    const controller = new AbortController()
    abortControllerRef.current = controller

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
            preferences,
          }),

          signal: controller.signal,
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setResult(data.result)
    } catch (error) {
      // Aborting is intentional, so don't treat it as a server failure
      if (error.name === 'AbortError') {
        setError('Generation stopped.')
      } else {
        console.error(error)
        setError('Something went wrong while generating material.')
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  function handleStop() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    setLoading(false)
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
          onChange={setPreferences}
          errors={preferenceErrors}
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

          {/* Generate button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate study material'}
          </button>

          {/* Keyboard-accessible stop button */}
          {loading && (
            <button
              type="button"
              onClick={handleStop}
              className="stop-button"
            >
              Stop generating
            </button>
          )}

          {/* Screen-reader loading announcement */}
          {loading && (
            <p
              className="sr-only"
              role="status"
              aria-live="polite"
            >
              Your study material is being generated. Please wait.
            </p>
          )}
        </div>

        {/* AI-generated study material */}
        {result && (
          <section
            ref={resultRef}
            className="result"
            aria-live="polite"
            aria-labelledby="study-material-heading"
            tabIndex={0}
          >
            <h2 id="study-material-heading">
              Study material
            </h2>

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