// src/api/User.test.ts
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mocked } from 'vitest'
import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  fetchUserMonthlyTotal,
  fetchUserMonthlyOrders,
  fetchUserWeeklyPrice,
  fetchUserLastOrderId,
  User,
  SignupData,
  LoginData,
  LoginResponse
} from './User'
import { API } from './index'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

beforeEach(() => {
  vi.resetAllMocks()
})

describe('User API client', () => {
  it('getAllUsers returns full user list with optional fields', async () => {
    const fakeUsers: User[] = [
      {
        id: 'u1',
        account: 'alice',
        password: '••••••',
        employeeId: 'E100',
        location: 1,
        head_sticker: 3,
        order_history: [{ orderId: 'o1', total: 120 }],
        shopkeeper: null,
        admin: false
      },
      {
        id: 'u2',
        account: 'bob',
        password: '••••••',
        employeeId: 'E200',
        location: 2,
        head_sticker: 5,
        order_history: [],
        shopkeeper: 'shop123',
        admin: null
      }
    ]
    mockedAxios.get.mockResolvedValue({ data: fakeUsers })

    const result = await getAllUsers()
    expect(mockedAxios.get).toHaveBeenCalledWith(API.users)
    expect(result).toEqual(fakeUsers)
  })

  it('getUserById returns user with nested data', async () => {
    const fakeUser: User = {
      id: 'u3',
      account: 'charlie',
      password: '••••••',
      employeeId: 'E300',
      location: 3,
      head_sticker: 2,
      order_history: [{ orderId: 'o2', total: 75 }],
      shopkeeper: null,
      admin: true
    }
    mockedAxios.get.mockResolvedValue({ data: { user: fakeUser } })

    const result = await getUserById('u3')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.userById('u3'))
    expect(result).toEqual(fakeUser)
  })

  it('registerUser returns newly created user object', async () => {
    const signup: SignupData = {
      account: 'dora',
      password: '123456',
      employeeId: 'E400',
      location: 4,
      head_sticker: 0
    }
    const fakeUser: User = {
      id: 'u4',
      ...signup,
      order_history: [],
      shopkeeper: null,
      admin: false
    }
    mockedAxios.post.mockResolvedValue({ data: fakeUser })

    const result = await registerUser(signup)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.register, signup)
    expect(result).toEqual(fakeUser)
  })

  it('loginUser returns token and user', async () => {
    const credentials: LoginData = { account: 'eve', password: 'password' }
    const fakeResp: LoginResponse = {
      token: 'jwt.token.here',
      user: {
        id: 'u5',
        account: 'eve',
        password: '••••••',
        employeeId: 'E500',
        location: 0,
        head_sticker: 1,
        order_history: [],
        shopkeeper: null,
        admin: false
      }
    }
    mockedAxios.post.mockResolvedValue({ data: fakeResp })

    const result = await loginUser(credentials)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.login, credentials)
    expect(result).toEqual(fakeResp)
  })

  it('updateUser applies partial updates and returns updated object', async () => {
    const patch = { location: 4, admin: true }
    const updatedUser: User = {
      id: 'u6',
      account: 'frank',
      password: '••••••',
      employeeId: 'E600',
      location: 4,
      head_sticker: 2,
      order_history: [],
      shopkeeper: null,
      admin: true
    }
    mockedAxios.put.mockResolvedValue({ data: updatedUser })

    const result = await updateUser('u6', patch)
    expect(mockedAxios.put).toHaveBeenCalledWith(API.userById('u6'), patch)
    expect(result).toEqual(updatedUser)
  })

  it('fetchUserMonthlyTotal returns numeric total', async () => {
    mockedAxios.get.mockResolvedValue({ data: { total: 2048 } })
    const total = await fetchUserMonthlyTotal('u7', 2025, 5)
    expect(mockedAxios.get).toHaveBeenCalledWith(API.userMonthlyTotal('u7', 2025, 5))
    expect(total).toBe(2048)
  })

  it('fetchUserMonthlyOrders returns detailed order summaries', async () => {
    const fakeOrders = [
      {
        shopName: 'Noodle House',
        meals: [
          { name: '牛肉麵', price: 120, quantity: 1 },
          { name: '小菜', price: 30, quantity: 2 }
        ]
      }
    ]
    mockedAxios.get.mockResolvedValue({ data: { orders: fakeOrders } })
    const orders = await fetchUserMonthlyOrders('u8', 2025, 5)
    expect(mockedAxios.get).toHaveBeenCalledWith(API.userMonthlyOrders('u8', 2025, 5))
    expect(orders).toEqual(fakeOrders)
  })

  it('fetchUserWeeklyPrice returns an array of 7 daily values', async () => {
    const prices = [100, 200, 150, 0, 120, 80, 60]
    mockedAxios.get.mockResolvedValue({ data: { dailyPrices: prices } })
    const result = await fetchUserWeeklyPrice('u9', '2025-05-30')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.userWeeklyPrice('u9', '2025-05-30'))
    expect(result).toEqual(prices)
  })

  it('fetchUserLastOrderId returns the last order ID string', async () => {
    mockedAxios.get.mockResolvedValue({ data: { lastOrderId: 'order_xyz' } })
    const id = await fetchUserLastOrderId('u10')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.userLastOrder('u10'))
    expect(id).toBe('order_xyz')
  })
})
