// src/hooks/useOrder.test.tsx
import React, { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from 'api/Order'
import {
  useGetOrders,
  useGetOrderById,
  useGetOrdersByUser,
  useGetOrdersByShop,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder
} from './useOrder'

function createWrapper(): React.ComponentType<{ children?: ReactNode }> {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children?: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useGetOrders', () => {
  it('fetches all orders', async () => {
    const fake = [{ id: 'o1', buyerId:'u1', shopId:'s1', meals:[], mealsId:[], totalPrice:0, scored:false, shopName:'X', createdAt:'', updatedAt:'' }]
    vi.spyOn(api, 'getAllOrders').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetOrders(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
  })
})

describe('useGetOrderById', () => {
  it('fetches order by id', async () => {
    const fake = { id: 'o2', buyerId:'u2', shopId:'s2', meals:[], mealsId:[], totalPrice:0, scored:true, shopName:'Y', createdAt:'', updatedAt:'' }
    vi.spyOn(api, 'getOrderById').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetOrderById('o2'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
  })
})

describe('useGetOrdersByUser', () => {
  it('fetches orders for user', async () => {
    const fake = [{ id: 'o3', buyerId:'u3', shopId:'s3', meals:[], mealsId:[], totalPrice:0, scored:false, shopName:'Z', createdAt:'', updatedAt:'' }]
    vi.spyOn(api, 'getOrdersByBuyer').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetOrdersByUser('u3'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
  })
})

describe('useGetOrdersByShop', () => {
  it('fetches orders for shop', async () => {
    const fake = [{ id: 'o4', buyerId:'u4', shopId:'s4', meals:[], mealsId:[], totalPrice:0, scored:false, shopName:'W', createdAt:'', updatedAt:'' }]
    vi.spyOn(api, 'getOrdersByShop').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetOrdersByShop('s4'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
  })
})

describe('mutation hooks', () => {
  it('useCreateOrder calls createOrder', async () => {
    const body = { id:'o5', buyerId:'u5', shopId:'s5', meals:[], mealsId:[], totalPrice:0, scored:false, shopName:'', createdAt:'', updatedAt:'' }
    vi.spyOn(api, 'createOrder').mockResolvedValue(body)
    const { result } = renderHook(() => useCreateOrder(), { wrapper: createWrapper() })
    result.current.mutate(body)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useUpdateOrder calls updateOrder', async () => {
    const fake = { id:'o6', buyerId:'u6', shopId:'s6', meals:[], mealsId:[], totalPrice:0, scored:true, shopName:'', createdAt:'', updatedAt:'' }
    vi.spyOn(api, 'updateOrder').mockResolvedValue(fake)
    const { result } = renderHook(() => useUpdateOrder('o6'), { wrapper: createWrapper() })
    result.current.mutate({ scored: true })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('useDeleteOrder calls deleteOrder', async () => {
    vi.spyOn(api, 'deleteOrder').mockResolvedValue()
    const { result } = renderHook(() => useDeleteOrder(), { wrapper: createWrapper() })
    result.current.mutate('o7')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
