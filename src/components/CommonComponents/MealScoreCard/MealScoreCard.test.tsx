// src/components/CommonComponents/MealScoreCard/MealScoreCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import MealScoreCard from 'components/CommonComponents/MealScoreCard'
import type { MenuItem } from 'types/meal'
import * as utils from 'utils'

// stub formatTime
vi.spyOn(utils, 'formatTime').mockReturnValue('2025/05/30 12:34')

describe('<MealScoreCard />', () => {
  const fakeMeal: MenuItem = {
    id: 'm1',
    name: '滷肉飯',
    price: 60,
    imageUrl: 'no-img.png',
    category: ['主食'] as Array<'推薦' | '主食' | '副餐' | '其他'>,
    likeCount: 5,
    dislikeCount: 1,
  }
  const fakeTime = '2025-05-30T04:34:00.000Z'

  let onClose: ReturnType<typeof vi.fn>
  let onSubmit: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onClose = vi.fn()
    onSubmit = vi.fn()
    vi.clearAllMocks()
  })

  const renderWithRouter = () =>
    render(
      <MemoryRouter>
        <MealScoreCard
          meal={fakeMeal}
          time={fakeTime}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </MemoryRouter>
    )

  it('renders title, meal info, formatted time, mascots and three buttons', () => {
    renderWithRouter()

    // 文本与图片
    expect(screen.getByText('為餐點評分')).toBeInTheDocument()
    expect(screen.getByText('滷肉飯')).toBeInTheDocument()
    expect(screen.getByText('$60')).toBeInTheDocument()
    expect(screen.getByText('2025/05/30 12:34')).toBeInTheDocument()
    expect(screen.getByAltText('mascot rabbit')).toBeInTheDocument()
    expect(screen.getByAltText('mascot cat')).toBeInTheDocument()

    // 三个按钮
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons.some(btn => btn.classList.contains('close-button'))).toBe(true)
    expect(buttons.some(btn => btn.classList.contains('like-button'))).toBe(true)
    expect(buttons.some(btn => btn.classList.contains('dislike-button'))).toBe(true)
  })

  it('calls onClose when the close-button is clicked', () => {
    renderWithRouter()
    const closeBtn = screen
      .getAllByRole('button')
      .find(btn => btn.classList.contains('close-button'))
    expect(closeBtn).toBeDefined()
    fireEvent.click(closeBtn!)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onSubmit(1) when the like-button is clicked', () => {
    renderWithRouter()
    const likeBtn = screen
      .getAllByRole('button')
      .find(btn => btn.classList.contains('like-button'))
    expect(likeBtn).toBeDefined()
    fireEvent.click(likeBtn!)
    expect(onSubmit).toHaveBeenCalledWith(1)
  })

  it('calls onSubmit(-1) when the dislike-button is clicked', () => {
    renderWithRouter()
    const dislikeBtn = screen
      .getAllByRole('button')
      .find(btn => btn.classList.contains('dislike-button'))
    expect(dislikeBtn).toBeDefined()
    fireEvent.click(dislikeBtn!)
    expect(onSubmit).toHaveBeenCalledWith(-1)
  })
})