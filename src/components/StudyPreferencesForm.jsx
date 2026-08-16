import { countSelectedOutputs } from '../utils/validatePreferences'

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const OUTPUT_OPTIONS = [
  { key: 'summary', label: 'Summary' },
  { key: 'keyConcepts', label: 'Key Concepts' },
  { key: 'practiceQuestions', label: 'Practice Questions' },
]

function StudyPreferencesForm({ preferences, onChange, errors = {} }) {
  function handleDifficultyChange(event) {
    onChange({
      ...preferences,
      difficulty: event.target.value,
    })
  }

  function handleQuestionCountChange(event) {
    const rawValue = event.target.value
    onChange({
      ...preferences,
      questionCount: rawValue === '' ? '' : Number(rawValue),
    })
  }

  function handleOutputChange(key) {
    return (event) => {
      const isChecked = event.target.checked

      if (!isChecked && countSelectedOutputs(preferences.outputOptions) <= 1) {
        return
      }

      onChange({
        ...preferences,
        outputOptions: {
          ...preferences.outputOptions,
          [key]: isChecked,
        },
      })
    }
  }

  return (
    <form
      className="preferences-form"
      onSubmit={(event) => event.preventDefault()}
      noValidate
    >
      <h2 className="preferences-heading">Study preferences</h2>

      <fieldset className="form-field">
        <legend>Difficulty</legend>
        <div className="radio-group">
          {DIFFICULTY_OPTIONS.map(({ value, label }) => (
            <label key={value} className="radio-label">
              <input
                type="radio"
                name="difficulty"
                value={value}
                checked={preferences.difficulty === value}
                onChange={handleDifficultyChange}
                aria-invalid={errors.difficulty ? 'true' : undefined}
              />
              {label}
            </label>
          ))}
        </div>
        {errors.difficulty && (
          <p className="form-error" id="difficulty-error" role="alert">
            {errors.difficulty}
          </p>
        )}
      </fieldset>

      <div className="form-field">
        <label htmlFor="question-count">Number of practice questions</label>
        <input
          id="question-count"
          type="number"
          min="1"
          max="20"
          step="1"
          value={preferences.questionCount}
          onChange={handleQuestionCountChange}
          aria-invalid={errors.questionCount ? 'true' : undefined}
          aria-describedby={
            errors.questionCount ? 'question-count-error' : undefined
          }
        />
        {errors.questionCount && (
          <p className="form-error" id="question-count-error" role="alert">
            {errors.questionCount}
          </p>
        )}
      </div>

      <fieldset className="form-field">
        <legend>Output options</legend>
        <div className="checkbox-group">
          {OUTPUT_OPTIONS.map(({ key, label }) => (
            <label key={key} className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.outputOptions[key]}
                onChange={handleOutputChange(key)}
                aria-invalid={errors.outputOptions ? 'true' : undefined}
              />
              {label}
            </label>
          ))}
        </div>
        {errors.outputOptions && (
          <p className="form-error" id="output-options-error" role="alert">
            {errors.outputOptions}
          </p>
        )}
      </fieldset>
    </form>
  )
}

export default StudyPreferencesForm
