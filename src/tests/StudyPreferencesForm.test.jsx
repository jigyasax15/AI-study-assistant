import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudyPreferencesForm from '../components/StudyPreferencesForm'
import { DEFAULT_PREFERENCES } from '../utils/validatePreferences'

function StatefulStudyPreferencesForm(props) {
  const [preferences, setPreferences] = useState(
    props.initialPreferences ?? DEFAULT_PREFERENCES
  )

  return (
    <StudyPreferencesForm
      preferences={preferences}
      onChange={setPreferences}
      errors={props.errors ?? {}}
    />
  )
}

function renderForm(overrides = {}) {
  const onChange = overrides.onChange ?? vi.fn()
  const props = {
    preferences: overrides.preferences ?? DEFAULT_PREFERENCES,
    onChange,
    errors: overrides.errors ?? {},
  }

  render(<StudyPreferencesForm {...props} />)

  return { onChange }
}

describe('StudyPreferencesForm', () => {
  it('renders difficulty, question count, and output options with labels', () => {
    renderForm()

    expect(screen.getByLabelText(/easy/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/medium/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/hard/i)).toBeInTheDocument()
    expect(
      screen.getByLabelText(/number of practice questions/i)
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/^summary$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/key concepts/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^practice questions$/i)).toBeInTheDocument()
  })

  it('shows inline validation errors with role="alert" and aria-invalid', () => {
    renderForm({
      errors: {
        difficulty: 'Please select a difficulty level.',
        questionCount: 'Enter a whole number from 1 to 20.',
        outputOptions: 'Select at least one output option.',
      },
    })

    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(3)

    expect(screen.getByLabelText(/easy/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    )
    expect(
      screen.getByLabelText(/number of practice questions/i)
    ).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^summary$/i)).toHaveAttribute(
      'aria-invalid',
      'true'
    )
  })

  it('updates difficulty through keyboard interaction', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderForm({ onChange })

    await user.click(screen.getByLabelText(/hard/i))
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_PREFERENCES,
      difficulty: 'hard',
    })
  })

  it('updates question count through keyboard interaction', async () => {
    const user = userEvent.setup()

    render(<StatefulStudyPreferencesForm />)

    const questionInput = screen.getByLabelText(
      /number of practice questions/i
    )
    await user.clear(questionInput)
    await user.type(questionInput, '8')

    expect(questionInput).toHaveValue(8)
  })

  it('prevents unchecking the last remaining output option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderForm({
      onChange,
      preferences: {
        ...DEFAULT_PREFERENCES,
        outputOptions: {
          summary: false,
          keyConcepts: true,
          practiceQuestions: false,
        },
      },
    })

    await user.click(screen.getByLabelText(/key concepts/i))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('allows toggling output options when more than one is selected', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    renderForm({ onChange })

    await user.click(screen.getByLabelText(/^summary$/i))

    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_PREFERENCES,
      outputOptions: {
        ...DEFAULT_PREFERENCES.outputOptions,
        summary: false,
      },
    })
  })
})
