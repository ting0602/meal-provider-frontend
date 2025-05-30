// src/api/Order.test.ts
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mocked } from 'vitest'
import {
  getAllOrders,
  getOrderById,
  getOrdersByBuyer,
  getOrdersByShop,
  createOrder,
  updateOrder,
  deleteOrder,
  Order,
  OrderBody
} from './Order'
import { API } from './index'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

beforeEach(() => {
  vi.resetAllMocks()
})

describe('Order API client', () => {
  const fakeOrder: Order = {
    id: 'o1',
    buyerId: 'u1',
    shopId: 's1',
    meals: [{ name: 'Burger', price: 50, quantity: 2 }],
    mealsId: ['m1'],
    totalPrice: 100,
    scored: false,
    shopName: 'Test Shop',
    createdAt: '2025-05-30T12:00:00Z',
    updatedAt: '2025-05-30T12:00:00Z'
  }

  it('getAllOrders fetches and returns orders array', async () => {
    mockedAxios.get.mockResolvedValue({ data: { orders: [fakeOrder] } })
    const result = await getAllOrders()
    expect(mockedAxios.get).toHaveBeenCalledWith(API.orders)
    expect(result).toEqual([fakeOrder])
  })

  it('getOrderById fetches single order', async () => {
    mockedAxios.get.mockResolvedValue({ data: { order: fakeOrder } })
    const result = await getOrderById('o1')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.orderById('o1'))
    expect(result).toEqual(fakeOrder)
  })

  it('getOrdersByBuyer fetches orders for buyer', async () => {
    mockedAxios.get.mockResolvedValue({ data: { orders: [fakeOrder] } })
    const result = await getOrdersByBuyer('u1')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.ordersByBuyer('u1'))
    expect(result).toEqual([fakeOrder])
  })

  it('getOrdersByShop fetches orders for shop', async () => {
    mockedAxios.get.mockResolvedValue({ data: { orders: [fakeOrder] } })
    const result = await getOrdersByShop('s1')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.ordersByShop('s1'))
    expect(result).toEqual([fakeOrder])
  })

  it('createOrder posts new order and returns it', async () => {
    const body: OrderBody = { ...fakeOrder, id: undefined } as any
    mockedAxios.post.mockResolvedValue({ data: { order: fakeOrder } })
    const result = await createOrder(body)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.orders, body)
    expect(result).toEqual(fakeOrder)
  })

  it('updateOrder puts partial update and returns updated order', async () => {
    const patch: Partial<OrderBody> = { scored: true }
    mockedAxios.put.mockResolvedValue({ data: { order: fakeOrder } })
    const result = await updateOrder('o1', patch)
    expect(mockedAxios.put).toHaveBeenCalledWith(API.orderById('o1'), patch)
    expect(result).toEqual(fakeOrder)
  })

  it('deleteOrder calls delete endpoint', async () => {
    mockedAxios.delete.mockResolvedValue({})
    await deleteOrder('o1')
    expect(mockedAxios.delete).toHaveBeenCalledWith(API.orderById('o1'))
  })
})
