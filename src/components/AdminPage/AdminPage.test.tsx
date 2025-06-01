// src/components/AdminPage/AdminPage.test.tsx
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import AdminPage from 'components/AdminPage'

// 這裡改成用 import，才會經過 Vite/Vitest 的 alias 解析
import { useAllUsersMonthlyTotals } from 'hooks/useUser'
import { useQueries } from '@tanstack/react-query'
import { getUserById, fetchUserMonthlyOrders } from 'api/User'
import emailjs from '@emailjs/browser'

// 1. 先把要 mock 的東西在最上方做 vi.mock
vi.mock('hooks/useUser', () => ({
  useAllUsersMonthlyTotals: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueries: vi.fn(),
}))

vi.mock('api/User', () => ({
  getUserById: vi.fn(),
  fetchUserMonthlyOrders: vi.fn(),
}))

vi.mock('emailjs/browser', () => ({
  init: vi.fn(),
}))

describe('AdminPage', () => {
  const mockedUseAllUsersMonthlyTotals = useAllUsersMonthlyTotals as unknown as jest.Mock
  const mockedUseQueries = useQueries as unknown as jest.Mock
  const mockedGetUserById = getUserById as unknown as jest.Mock
  const mockedFetchUserMonthlyOrders = fetchUserMonthlyOrders as unknown as jest.Mock
  const mockedEmailJsInit = (emailjs as any).init as jest.Mock

  beforeEach(() => {
    vi.resetAllMocks()

    process.env.REACT_APP_EMAILJS_USER_ID = 'test-user-id'
    process.env.REACT_APP_EMAILJS_SERVICE_ID = 'test-service-id'
    process.env.REACT_APP_EMAILJS_TEMPLATE_ID = 'test-template-id'

    mockedUseQueries.mockReturnValue([])
  })

  afterEach(() => {
    delete process.env.REACT_APP_EMAILJS_USER_ID
    delete process.env.REACT_APP_EMAILJS_SERVICE_ID
    delete process.env.REACT_APP_EMAILJS_TEMPLATE_ID
  })

  it('displays loading state when useAllUsersMonthlyTotals.isLoading is true', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    })

    render(<AdminPage />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('displays error message when useAllUsersMonthlyTotals.isError is true', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    })

    render(<AdminPage />)
    expect(screen.getByText('載入資料失敗')).toBeInTheDocument()
  })

  it('renders a card marked as "Paid" when only paid users are present', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [
        {
          userId: 'u1',
          employeeId: 'EMP001',
          total: 0,
        },
      ],
      isLoading: false,
      isError: false,
    })

    render(<AdminPage />)

    // Verify label is present
    expect(screen.getByText('EMP001')).toBeInTheDocument()

    // Verify that a ".card .status" element contains "已支付"
    expect(
      screen.getByText('已支付', { selector: '.card .status' })
    ).toBeInTheDocument()
  })

  it('shows "No unpaid users" alert when there are no unpaid users and Notify is clicked', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [
        {
          userId: 'u3',
          employeeId: 'EMP003',
          total: 0,
        },
      ],
      isLoading: false,
      isError: false,
    })

    mockedUseQueries.mockReturnValue([])

    render(<AdminPage />)

    // Verify label and status
    expect(screen.getByText('EMP003')).toBeInTheDocument()
    expect(
      screen.getByText('已支付', { selector: '.card .status' })
    ).toBeInTheDocument()

    const notifyButton = screen.getByRole('button', { name: /一鍵通知/i })
    expect(notifyButton).toBeEnabled()

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    fireEvent.click(notifyButton)
    expect(alertSpy).toHaveBeenCalledWith('目前沒有未付款的使用者。')
    alertSpy.mockRestore()
  })

  it('disables Notify button and does nothing if useQueries are still loading', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [
        {
          userId: 'u4',
          employeeId: 'EMP004',
          total: 200,
        },
      ],
      isLoading: false,
      isError: false,
    })

    const loadingQuery = { isLoading: true, isError: false, data: null }
    mockedUseQueries.mockReturnValue([loadingQuery, loadingQuery])

    render(<AdminPage />)

    expect(screen.getByText('正在準備 Email 及訂單資料，請稍候……')).toBeInTheDocument()

    const notifyButton = screen.getByRole('button', { name: /一鍵通知/i })
    expect(notifyButton).toBeDisabled()

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    fireEvent.click(notifyButton)
    expect(alertSpy).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('search functionality: only cards matching employeeId are displayed after entering search term', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [
        { userId: 'u1', employeeId: 'ALICE01', total: 0 },
        { userId: 'u2', employeeId: 'BOB02', total: 50 },
        { userId: 'u3', employeeId: 'CHARLIE', total: 0 },
      ],
      isLoading: false,
      isError: false,
    })

    const fakeUserInfoQuery = { isLoading: false, isError: false, data: { account: 'bob@example.com' } }
    const fakeOrdersQuery = { isLoading: false, isError: false, data: [] }
    mockedUseQueries.mockReturnValue([fakeUserInfoQuery, fakeOrdersQuery])

    render(<AdminPage />)

    expect(screen.getByText('ALICE01')).toBeInTheDocument()
    expect(screen.getByText('BOB02')).toBeInTheDocument()
    expect(screen.getByText('CHARLIE')).toBeInTheDocument()

    const searchInput = screen.getByPlaceholderText('搜尋員工 ID')
    fireEvent.change(searchInput, { target: { value: 'ALICE' } })

    expect(screen.getByText('ALICE01')).toBeInTheDocument()
    expect(screen.queryByText('BOB02')).toBeNull()
    expect(screen.queryByText('CHARLIE')).toBeNull()
  })

  it('filter functionality: toggles between Paid and Unpaid filters', () => {
    mockedUseAllUsersMonthlyTotals.mockReturnValue({
      data: [
        { userId: 'u1', employeeId: 'X001', total: 0 },
        { userId: 'u2', employeeId: 'Y002', total: 80 },
      ],
      isLoading: false,
      isError: false,
    })

    const fakeUserInfoQuery = { isLoading: false, isError: false, data: { account: 'y@example.com' } }
    const fakeOrdersQuery = { isLoading: false, isError: false, data: [] }
    mockedUseQueries.mockReturnValue([fakeUserInfoQuery, fakeOrdersQuery])

    render(<AdminPage />)

    expect(screen.getByText('X001')).toBeInTheDocument()
    expect(screen.getByText('Y002')).toBeInTheDocument()

    const unpaidButton = screen.getByRole('button', { name: '未支付' })
    fireEvent.click(unpaidButton)
    expect(screen.queryByText('X001')).toBeNull()
    expect(screen.getByText('Y002')).toBeInTheDocument()

    fireEvent.click(unpaidButton)
    expect(screen.getByText('X001')).toBeInTheDocument()
    expect(screen.getByText('Y002')).toBeInTheDocument()

    const paidButton = screen.getByRole('button', { name: '已支付' })
    fireEvent.click(paidButton)
    expect(screen.getByText('X001')).toBeInTheDocument()
    expect(screen.queryByText('Y002')).toBeNull()
  })

  it('month navigation functionality: clicking arrows changes month display and calls useAllUsersMonthlyTotals', () => {
    // Fix system time to 2025-06-01 so initial month is June
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 1).getTime())

    const spyHook = mockedUseAllUsersMonthlyTotals
    spyHook.mockImplementation((_yearArg: number, monthArg: number) => {
      return {
        data: [
          {
            userId: 'u-test',
            employeeId: String(monthArg).padStart(2, '0') + '-USER',
            total: 0,
          },
        ],
        isLoading: false,
        isError: false,
      }
    })

    const fakeUserInfoQuery = { isLoading: false, isError: false, data: { account: 'test@example.com' } }
    const fakeOrdersQuery = { isLoading: false, isError: false, data: [] }
    mockedUseQueries.mockReturnValue([fakeUserInfoQuery, fakeOrdersQuery])

    // Current year and month
    const now = new Date(2025, 5, 1)
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // 6

    render(<AdminPage />)

    // On initial render, hook should be called with (2025, 6)
    expect(spyHook).toHaveBeenCalledTimes(1)
    expect(spyHook).toHaveBeenLastCalledWith(year, month)

    // Find the button containing the ArrowBackIosNewIcon
    const allButtons = screen.getAllByRole('button')
    const leftButton = allButtons.find(btn =>
      within(btn).queryByTestId('ArrowBackIosNewIcon')
    )!
    fireEvent.click(leftButton)

    // After clicking left arrow, hook should be called with (2025, 5)
    expect(spyHook).toHaveBeenCalledTimes(2)
    expect(spyHook).toHaveBeenLastCalledWith(year, month - 1)

    // Find the button containing the ArrowForwardIosIcon
    const rightButton = screen.getAllByRole('button').find(btn =>
      within(btn).queryByTestId('ArrowForwardIosIcon')
    )!
    fireEvent.click(rightButton)

    // After clicking right arrow, hook should be called with (2025, 6) again
    expect(spyHook).toHaveBeenCalledTimes(3)
    expect(spyHook).toHaveBeenLastCalledWith(year, month)

    vi.useRealTimers()
  })
})
