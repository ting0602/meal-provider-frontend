// src/hooks/useMeal.test.tsx
import React, { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from 'api/Meal'
import {
  useGetAllMeals,
  useGetMealById,
  useCreateMeal,
  useUpdateMeal,
  useDeleteMeal,
  useLikeMeal,
  useDislikeMeal
} from './useMeal'

function createWrapper(): React.ComponentType<{ children?: ReactNode }> {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children?: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useGetAllMeals', () => {
  it('fetches all meals', async () => {
    const fake = [{ id: 'm1', name: 'A', price: 10, type: 0, recommand: false, shop: 's1', likes:0, dislikes:0 }]
    vi.spyOn(api, 'getAllMeals').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetAllMeals(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useGetMealById', () => {
  it('fetches one meal by id', async () => {
    const fake = { id: 'm2', name: 'B', price: 20, type: 1, recommand: true, shop: 's2', likes:1, dislikes:1 }
    vi.spyOn(api, 'getMealById').mockResolvedValue(fake)
    const { result } = renderHook(() => useGetMealById('m2'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
  })
})

describe('useCreateMeal', () => {
  it('calls createMeal mutation', async () => {
    const body = { name: 'C', price: 30, type: 2, recommand: false, shop: 's3' }
    vi.spyOn(api, 'createMeal').mockResolvedValue({ id:'m3', ...body, likes:0, dislikes:0 })
    const { result } = renderHook(() => useCreateMeal(), { wrapper: createWrapper() })
    result.current.mutate(body)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateMeal', () => {
  it('calls updateMeal mutation', async () => {
    const patch = { price: 40 }
    vi.spyOn(api, 'updateMeal').mockResolvedValue({ id:'m4', name:'D', price:40, type:0, recommand:true, shop:'s4', likes:0, dislikes:0 })
    const { result } = renderHook(() => useUpdateMeal('m4'), { wrapper: createWrapper() })
    result.current.mutate(patch)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteMeal', () => {
  it('calls deleteMeal mutation', async () => {
    vi.spyOn(api, 'deleteMeal').mockResolvedValue()
    const { result } = renderHook(() => useDeleteMeal(), { wrapper: createWrapper() })
    result.current.mutate('m5')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useLikeMeal', () => {
  it('calls likeMeal mutation', async () => {
    const fake = { id:'m6', name:'F', price:50, type:1, recommand:false, shop:'s6', likes:1, dislikes:0 }
    vi.spyOn(api, 'likeMeal').mockResolvedValue(fake)
    const { result } = renderHook(() => useLikeMeal('m6'), { wrapper: createWrapper() })
    result.current.mutate()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDislikeMeal', () => {
  it('calls dislikeMeal mutation', async () => {
    const fake = { id:'m7', name:'G', price:60, type:2, recommand:true, shop:'s7', likes:0, dislikes:1 }
    vi.spyOn(api, 'dislikeMeal').mockResolvedValue(fake)
    const { result } = renderHook(() => useDislikeMeal('m7'), { wrapper: createWrapper() })
    result.current.mutate()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
