import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('AI Study Assistant', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows an error when the user tries to generate without notes', async () => {
    const user = userEvent.setup()

    render(<App />)

    const button = screen.getByRole('button', {
      name: /generate study material/i,
    })

    await user.click(button)

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent('Please enter some study notes first.')
  })

  it('shows preference validation errors for invalid question count', async () => {
    const user = userEvent.setup()

    render(<App />)

    const textarea = screen.getByLabelText(/your study notes/i)
    await user.type(textarea, 'Mitochondria are the powerhouse of the cell.')

    const questionInput = screen.getByLabelText(
      /number of practice questions/i
    )
    await user.clear(questionInput)
    await user.type(questionInput, '25')

    await user.click(
      screen.getByRole('button', {
        name: /generate study material/i,
      })
    )

    expect(
      screen.getByRole('alert')
    ).toHaveTextContent('Enter a whole number from 1 to 20.')
    expect(questionInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows the loading state when notes are submitted', async () => {
    const user = userEvent.setup()

    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise(() => {})
    )

    render(<App />)

    const textarea = screen.getByLabelText(/your study notes/i)

    await user.type(textarea, 'Photosynthesis is the process used by plants to make food.')

    await user.click(
      screen.getByRole('button', {
        name: /generate study material/i,
      })
    )

    expect(
      screen.getByRole('button', {
        name: /generating/i,
      })
    ).toBeDisabled()
  })

  it('sends validated preferences with the study notes', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ result: 'Generated study guide' }),
    })

    render(<App />)

    await user.type(
      screen.getByLabelText(/your study notes/i),
      'Cell division includes mitosis and meiosis.'
    )
    await user.click(screen.getByLabelText(/hard/i))

    const questionInput = screen.getByLabelText(
      /number of practice questions/i
    )
    await user.clear(questionInput)
    await user.type(questionInput, '8')

    await user.click(screen.getByLabelText(/^summary$/i))

    await user.click(
      screen.getByRole('button', {
        name: /generate study material/i,
      })
    )

    expect(fetchMock).toHaveBeenCalledWith(
      'https://ai-study-assistant-ge1o.onrender.com/api/generate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          notes: 'Cell division includes mitosis and meiosis.',
          preferences: {
            difficulty: 'hard',
            questionCount: 8,
            outputOptions: {
              summary: false,
              keyConcepts: true,
              practiceQuestions: true,
            },
          },
        }),
      })
    )
  })
})
