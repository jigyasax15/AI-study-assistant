import {
  DIFFICULTY_OPTIONS,
  DEFAULT_PREFERENCES,
} from '../utils/validatePreferences'

function StudyPreferencesForm({ preferences, errors, onChange }) {
  function handleFieldChange(field, value) {
    onChange({
      ...preferences,
      [field]: value,
    })
  }

  return (
    <fieldset className="preferences-section">
      <legend>Study preferences</legend>

      <p className="preferences-intro">
        Customize how your study material is generated.
      </p>

      <div className="preferences-grid">
        <div className="field">
          <label htmlFor="difficulty">Difficulty level</label>
          <select
            id="difficulty"
            value={preferences.difficulty}
            onChange={(event) =>
              handleFieldChange('difficulty', event.target.value)
            }
            aria-invalid={Boolean(errors.difficulty)}
            aria-describedby={
              errors.difficulty ? 'difficulty-error' : undefined
            }
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
          {errors.difficulty && (
            <p className="field-error" id="difficulty-error" role="alert">
              {errors.difficulty}
            </p>
          )}
        </div>

        <div className="field">
          <label htmlFor="questionCount">Number of practice questions</label>
          <input
            id="questionCount"
            type="number"
            min="1"
            max="20"
            value={preferences.questionCount}
            onChange={(event) =>
              handleFieldChange('questionCount', event.target.value)
            }
            aria-invalid={Boolean(errors.questionCount)}
            aria-describedby={
              errors.questionCount ? 'question-count-error' : undefined
            }
          />
          {errors.questionCount && (
            <p
              className="field-error"
              id="question-count-error"
              role="alert"
            >
              {errors.questionCount}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <span className="field-label">Include in output</span>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.includeSummary}
              onChange={(event) =>
                handleFieldChange('includeSummary', event.target.checked)
              }
            />
            Summary
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.includeKeyConcepts}
              onChange={(event) =>
                handleFieldChange('includeKeyConcepts', event.target.checked)
              }
            />
            Key concepts
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={preferences.includePracticeQuestions}
              onChange={(event) =>
                handleFieldChange(
                  'includePracticeQuestions',
                  event.target.checked
                )
              }
            />
            Practice questions
          </label>
        </div>
        {errors.outputSections && (
          <p className="field-error" role="alert">
            {errors.outputSections}
          </p>
        )}
      </div>
    </fieldset>
  )
}

StudyPreferencesForm.defaultProps = {
  preferences: DEFAULT_PREFERENCES,
  errors: {},
}

export default StudyPreferencesForm
