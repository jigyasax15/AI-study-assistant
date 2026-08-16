export const DIFFICULTY_OPTIONS = ['easy', 'medium', 'hard']

export const DEFAULT_PREFERENCES = {
  difficulty: 'medium',
  questionCount: 5,
  includeSummary: true,
  includeKeyConcepts: true,
  includePracticeQuestions: true,
}

export function validatePreferences(preferences) {
  const errors = {}

  if (!DIFFICULTY_OPTIONS.includes(preferences.difficulty)) {
    errors.difficulty = 'Choose a difficulty level.'
  }

  const questionCount = Number(preferences.questionCount)

  if (
    preferences.questionCount === '' ||
    preferences.questionCount === null ||
    preferences.questionCount === undefined
  ) {
    errors.questionCount = 'Enter how many practice questions you want.'
  } else if (!Number.isInteger(questionCount)) {
    errors.questionCount = 'Question count must be a whole number.'
  } else if (questionCount < 1 || questionCount > 20) {
    errors.questionCount = 'Question count must be between 1 and 20.'
  }

  if (
    !preferences.includeSummary &&
    !preferences.includeKeyConcepts &&
    !preferences.includePracticeQuestions
  ) {
    errors.outputSections =
      'Select at least one output section to generate.'
  }

  return errors
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0
}
