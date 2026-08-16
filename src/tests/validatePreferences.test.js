import { describe, it, expect } from 'vitest'
import {
  DEFAULT_PREFERENCES,
  validatePreferences,
  countSelectedOutputs,
} from '../utils/validatePreferences'

describe('validatePreferences', () => {
  it('accepts valid default preferences', () => {
    const result = validatePreferences(DEFAULT_PREFERENCES)

    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('rejects an invalid difficulty', () => {
    const result = validatePreferences({
      ...DEFAULT_PREFERENCES,
      difficulty: 'expert',
    })

    expect(result.isValid).toBe(false)
    expect(result.errors.difficulty).toBe('Please select a difficulty level.')
  })

  it('rejects question counts outside 1 to 20', () => {
    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 0 }).isValid
    ).toBe(false)
    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 21 }).isValid
    ).toBe(false)
    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 2.5 }).isValid
    ).toBe(false)
    expect(
      validatePreferences({ ...DEFAULT_PREFERENCES, questionCount: 'five' })
        .errors.questionCount
    ).toBe('Enter a whole number from 1 to 20.')
  })

  it('requires at least one output option', () => {
    const result = validatePreferences({
      ...DEFAULT_PREFERENCES,
      outputOptions: {
        summary: false,
        keyConcepts: false,
        practiceQuestions: false,
      },
    })

    expect(result.isValid).toBe(false)
    expect(result.errors.outputOptions).toBe(
      'Select at least one output option.'
    )
  })
})

describe('countSelectedOutputs', () => {
  it('counts selected output options', () => {
    expect(
      countSelectedOutputs({
        summary: true,
        keyConcepts: false,
        practiceQuestions: true,
      })
    ).toBe(2)
  })
})
