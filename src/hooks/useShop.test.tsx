// src/hooks/useShop.test.tsx
import React, { ReactNode } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from 'api/Shop'
import {
  useGetAllShops,
  useGetShopsByLocation,
  useGetShopById,
  useCreateShop,
  useUpdateShop,
  useDeleteShop,
  useRateShop
} from './useShop'
import { MemoryRouter } from 'react-router-dom'

function createWrapper(): React.ComponentType<{ children?: ReactNode }> {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return function Wrapper({ children }: { children?: ReactNode }) {
    return (
      <QueryClientProvider client={client}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    )
  }
}

beforeEach(() => {
  vi.resetAllMocks()
})

describe('useGetAllShops', () => {
  it('should fetch all shops and expose data', async () => {
    const fake = [{ id: 's1', name: 'A', location: 0, menu: [], order: [], ratingCount: 1, ratingAvg: 4, type: 0 }]
    vi.spyOn(api, 'getAllShops').mockResolvedValue(fake)

    const { result } = renderHook(() => useGetAllShops(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useGetShopsByLocation', () => {
  it('should fetch shops filtered by location', async () => {
    const fake = [{ id: 's2', name: 'B', location: 2, menu: [], order: [], ratingCount: 2, ratingAvg: 3, type: 1 }]
    vi.spyOn(api, 'getShopsByLocation').mockResolvedValue(fake)

    const { result } = renderHook(() => useGetShopsByLocation(2), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useGetShopById', () => {
  it('should fetch one shop by id', async () => {
    const fake = { id: 's3', name: 'C', location: 3, menu: [], order: [], ratingCount: 3, ratingAvg: 5, type: 2 }
    vi.spyOn(api, 'getShopById').mockResolvedValue(fake)

    const { result } = renderHook(() => useGetShopById('s3'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fake))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useCreateShop', () => {
  it('should call createShop and succeed', async () => {
    const body = { name: 'D', location: 1, menu: [], order: [], type: 0, image: undefined }
    const fake = { id: 's4', name: 'D', location: 1, menu: [], order: [], ratingCount: 0, ratingAvg: 0, type: 0 }
    vi.spyOn(api, 'createShop').mockResolvedValue(fake)

    const { result } = renderHook(() => useCreateShop(), { wrapper: createWrapper() })
    result.current.mutate(body)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useUpdateShop', () => {
  it('should call updateShop and succeed', async () => {
    const patch = { name: 'E' }
    const fake = { id: 's5', name: 'E', location: 4, menu: [], order: [], ratingCount: 0, ratingAvg: 0, type: 1 }
    vi.spyOn(api, 'updateShop').mockResolvedValue(fake)

    const { result } = renderHook(() => useUpdateShop('s5'), { wrapper: createWrapper() })
    result.current.mutate(patch)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useDeleteShop', () => {
  it('should call deleteShop and succeed', async () => {
    vi.spyOn(api, 'deleteShop').mockResolvedValue()

    const { result } = renderHook(() => useDeleteShop(), { wrapper: createWrapper() })
    result.current.mutate('s6')
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useRateShop', () => {
  it('should call rateShop and succeed', async () => {
    const fake = { id: 's7', name: 'G', location: 0, menu: [], order: [], ratingCount: 1, ratingAvg: 5, type: 2 }
    vi.spyOn(api, 'rateShop').mockResolvedValue(fake)

    const { result } = renderHook(() => useRateShop('s7'), { wrapper: createWrapper() })
    result.current.mutate(5)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
