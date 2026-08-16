import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StudyPreferencesForm from '../components/StudyPreferencesForm'
import { DEFAULT_PREFERENCES } from '../utils/validatePreferences'

describe('StudyPreferencesForm', () => {
  it('renders preference fields with default values', () => {
    render(
      <StudyPreferencesForm
        preferences={DEFAULT_PREFERENCES}
        errors={{}}
        onChange={() => {}}
      />
    )

    expect(screen.getByLabelText(/difficulty level/i)).toHaveValue('medium')
    expect(
      screen.getByLabelText(/number of practice questions/i)
    ).toHaveValue(5)
    expect(screen.getByLabelText(/^summary$/i)).toBeChecked()
    expect(screen.getByLabelText(/key concepts/i)).toBeChecked()
    expect(screen.getByLabelText(/^practice questions$/i)).toBeChecked()
  })

  it('shows validation errors', () => {
    render(
      <StudyPreferencesForm
        preferences={DEFAULT_PREFERENCES}
        errors={{
          difficulty: 'Choose a difficulty level.',
          questionCount: 'Question count must be between 1 and 20.',
          outputSections: 'Select at least one output section to generate.',
        }}
        onChange={() => {}}
      />
    )

    expect(screen.getByText('Choose a difficulty level.')).toBeInTheDocument()
    expect(
      screen.getByText('Question count must be between 1 and 20.')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Select at least one output section to generate.')
    ).toBeInTheDocument()
  })

  it('calls onChange when a field is updated', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(
      <StudyPreferencesForm
        preferences={DEFAULT_PREFERENCES}
        errors={{}}
        onChange={onChange}
      />
    )

    await user.selectOptions(
      screen.getByLabelText(/difficulty level/i),
      'hard'
    )

    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_PREFERENCES,
      difficulty: 'hard',
    })
  })
})
