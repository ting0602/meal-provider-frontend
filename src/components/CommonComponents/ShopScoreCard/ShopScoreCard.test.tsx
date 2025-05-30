// src/components/CommonComponents/ShopScoreCard/ShopScoreCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ShopScoreCard from 'components/CommonComponents/ShopScoreCard'
import * as utils from 'utils'

// Stub formatTime to a predictable string
vi.spyOn(utils, 'formatTime').mockImplementation(() => '2025/05/30 12:34')

describe('<ShopScoreCard />', () => {
  const fakeProps = {
    shop: {
      type: 1,
      name: 'Test Shop',
      image: 'no-img.png',
      rating: 4,
    },
    time: '2025-05-30T04:34:00.000Z',
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <ShopScoreCard {...fakeProps} />
      </MemoryRouter>
    )

  it('renders title, shop info, formatted time, rating control, mascots and buttons', () => {
    renderWithRouter()

    // Modal title
    expect(screen.getByText('為店家評分')).toBeInTheDocument()
    // ShopInfoCard should render shop name
    expect(screen.getByText('Test Shop')).toBeInTheDocument()
    // Formatted time
    expect(screen.getByText('2025/05/30 12:34')).toBeInTheDocument()

    // Rating control: should render 6 radio inputs (0–5 stars)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(6)

    // The "5 Stars" radio should be checked initially
    const fiveStar = screen.getByLabelText('5 Stars') as HTMLInputElement
    expect(fiveStar.checked).toBe(true)

    // There should be exactly two buttons: close and submit
    const allButtons = screen.getAllByRole('button')
    expect(allButtons).toHaveLength(2)

    // Submit button by its accessible name
    const submitBtn = screen.getByRole('button', { name: '送出' })
    expect(submitBtn).toBeInTheDocument()

    // The other button is the close button
    const closeBtn = allButtons.find((btn) => btn !== submitBtn)!
    expect(closeBtn).toHaveClass('close-button')

    // Mascot images
    expect(screen.getByAltText('mascot dog')).toBeInTheDocument()
    expect(screen.getByAltText('mascot rat')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', () => {
    renderWithRouter()
    const submitBtn = screen.getByRole('button', { name: '送出' })
    const closeBtn = screen.getAllByRole('button').find((b) => b !== submitBtn)!
    fireEvent.click(closeBtn)
    expect(fakeProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSubmit with selected score and then onClose when submit is clicked', () => {
    renderWithRouter()
    // Change to 3 stars
    fireEvent.click(screen.getByLabelText('3 Stars'))
    // Click submit
    const submitBtn = screen.getByRole('button', { name: '送出' })
    fireEvent.click(submitBtn)
    expect(fakeProps.onSubmit).toHaveBeenCalledWith(3)
    expect(fakeProps.onClose).toHaveBeenCalledTimes(1)
  })
})
