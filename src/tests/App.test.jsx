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
})