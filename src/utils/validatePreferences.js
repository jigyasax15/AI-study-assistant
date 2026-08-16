export const DEFAULT_PREFERENCES = {
  difficulty: 'medium',
  questionCount: 5,
  outputOptions: {
    summary: true,
    keyConcepts: true,
    practiceQuestions: true,
  },
}

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard']

export function validatePreferences(preferences) {
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

export function countSelectedOutputs(outputOptions) {
  return ['summary', 'keyConcepts', 'practiceQuestions'].filter(
    (key) => outputOptions[key]
  ).length
}
