// src/components/CommonComponents/Meal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Meal from 'components/CommonComponents/Meal'
import type { MenuItem } from 'types/meal'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

describe('<Meal /> component', () => {
  const fakeMeal: MenuItem = {
    id: 'm1',
    name: '滷肉飯',
    price: 60,
    imageUrl: 'no-img.png',
    category: ['主食'],
    likeCount: 7,
    dislikeCount: 2
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders name, price, score icons and counts', () => {
    render(<Meal meal={fakeMeal} initialQuantity={0} />)
    expect(screen.getByText('滷肉飯')).toBeInTheDocument()
    expect(screen.getByText('$60')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()  // likeCount
    expect(screen.getByText('2')).toBeInTheDocument()  // dislikeCount
    expect(screen.getByAltText('滷肉飯')).toBeInTheDocument()
  })

  it('increments and decrements quantity via callbacks', () => {
    const onQty = vi.fn()
    render(<Meal meal={fakeMeal} initialQuantity={1} onQuantityChange={onQty} />)

    // click the "+" icon
    fireEvent.click(screen.getByAltText('增加'))
    expect(onQty).toHaveBeenCalledWith(fakeMeal, 2)
    expect(screen.getByText('2', { selector: '.quantity-display-box' })).toBeInTheDocument()

    // click the "-" icon
    fireEvent.click(screen.getByAltText('減少'))
    expect(onQty).toHaveBeenCalledWith(fakeMeal, 1)
    expect(screen.getByText('1', { selector: '.quantity-display-box' })).toBeInTheDocument()
  })

  it('does not change quantity when readOnly=true', () => {
    const onQty = vi.fn()
    render(<Meal meal={fakeMeal} initialQuantity={1} onQuantityChange={onQty} readOnly />)

    fireEvent.click(screen.getByAltText('增加'))
    fireEvent.click(screen.getByAltText('減少'))
    expect(onQty).not.toHaveBeenCalled()
    expect(screen.getByText('1', { selector: '.quantity-display-box' })).toBeInTheDocument()
  })

  it('hides quantity controls when showQuantityControl=false', () => {
    render(<Meal meal={fakeMeal} initialQuantity={0} showQuantityControl={false} />)
    expect(screen.queryByAltText('增加')).toBeNull()
    expect(screen.queryByAltText('減少')).toBeNull()
  })

  it('shows edit button and navigates when editable=true', () => {
    render(<Meal meal={fakeMeal} initialQuantity={0} editable />)
    fireEvent.click(screen.getByText('修改'))
    expect(mockNavigate).toHaveBeenCalledWith('/modify-meal', { state: { meal: fakeMeal } })
  })
})
