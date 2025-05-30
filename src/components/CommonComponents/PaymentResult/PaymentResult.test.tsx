// src/components/CommonComponents/PaymentResult/PaymentResult.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import PaymentResult from 'components/CommonComponents/PaymentResult'

const mockNavigate = vi.fn()

// Partially mock react-router-dom to override useNavigate only
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  )
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('<PaymentResult />', () => {
  let onClose: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockNavigate.mockReset()
    onClose = vi.fn()
  })

  it('renders success state and handles navigation', () => {
    render(
      <MemoryRouter>
        <PaymentResult
          success
          amount={123}
          timestamp="2025-06-01 14:00"
          shopName="Test Shop"
          onClose={onClose}
          homePath="/custom-home"
          ordersPath="/custom-orders"
        />
      </MemoryRouter>
    )

    // Title, amount, timestamp, shop name
    expect(screen.getByText('支付成功')).toBeInTheDocument()
    expect(screen.getByText('$123')).toBeInTheDocument()
    expect(screen.getByText('2025-06-01 14:00')).toBeInTheDocument()
    expect(screen.getByText('消費店家：')).toBeInTheDocument()
    expect(screen.getByText('Test Shop')).toBeInTheDocument()

    // Two buttons: Home and Orders
    const homeBtn = screen.getByRole('button', { name: '首頁' })
    const ordersBtn = screen.getByRole('button', { name: '訂單紀錄' })
    expect(homeBtn).toBeInTheDocument()
    expect(ordersBtn).toBeInTheDocument()

    // Click home
    fireEvent.click(homeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/custom-home')

    // Click orders
    fireEvent.click(ordersBtn)
    expect(onClose).toHaveBeenCalledTimes(2)
    expect(mockNavigate).toHaveBeenCalledWith('/custom-orders')
  })

  it('renders failure state and handles navigation', () => {
    render(
      <MemoryRouter>
        <PaymentResult
          success={false}
          errorType="支付失敗"
          onClose={onClose}
          homePath="/fail-home"
        />
      </MemoryRouter>
    )

    // Title and error
    expect(screen.getByText('支付失敗')).toBeInTheDocument()
    expect(screen.getByText(/Error: 支付失敗/)).toBeInTheDocument()

    // Cancel icon should render
    expect(screen.getByTestId('CancelIcon')).toBeInTheDocument()

    // Only one button: Home
    const homeBtn = screen.getByRole('button', { name: '首頁' })
    expect(homeBtn).toBeInTheDocument()
    // No orders button
    expect(screen.queryByRole('button', { name: '訂單紀錄' })).toBeNull()

    // Click home
    fireEvent.click(homeBtn)
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/fail-home')
  })
})
