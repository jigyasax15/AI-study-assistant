import { describe, it, expect } from 'vitest'
import {
  DEFAULT_PREFERENCES,
  validatePreferences,
  hasValidationErrors,
} from '../utils/validatePreferences'

describe('validatePreferences', () => {
  it('returns no errors for valid preferences', () => {
    const errors = validatePreferences(DEFAULT_PREFERENCES)

    expect(errors).toEqual({})
    expect(hasValidationErrors(errors)).toBe(false)
  })

  it('requires a supported difficulty level', () => {
    const errors = validatePreferences({
      ...DEFAULT_PREFERENCES,
      difficulty: 'expert',
    })

    expect(errors.difficulty).toBe('Choose a difficulty level.')
  })

  it('requires a question count between 1 and 20', () => {
    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 0 })
        .questionCount
    ).toBe('Question count must be between 1 and 20.')

    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 21 })
        .questionCount
    ).toBe('Question count must be between 1 and 20.')

    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: '' })
        .questionCount
    ).toBe('Enter how many practice questions you want.')

    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 2.5 })
        .questionCount
    ).toBe('Question count must be a whole number.')
  })

  it('requires at least one output section', () => {
    const errors = validatePreferences({
      ...DEFAULT_PREFERENCES,
      includeSummary: false,
      includeKeyConcepts: false,
      includePracticeQuestions: false,
    })

    expect(errors.outputSections).toBe(
      'Select at least one output section to generate.'
    )
  })
})
