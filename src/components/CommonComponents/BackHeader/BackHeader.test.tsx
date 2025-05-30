// src/components/CommonComponents/BackHeader.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BackHeader from 'components/CommonComponents/BackHeader'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

describe('<BackHeader />', () => {
  const description = 'Test Page'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a back button and the description', () => {
    render(<BackHeader description={description} />)
    // button with arrow icon
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
    // heading
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('calls navigate(-1) when back button is clicked', () => {
    render(<BackHeader description={description} />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })
})
