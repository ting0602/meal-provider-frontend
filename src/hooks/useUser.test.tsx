// src/hooks/useUser.test.ts
import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as api from 'api/User'
import { useGetUsers, useGetUserById, useSignup, useLogin } from './useUser'
import { MemoryRouter } from 'react-router-dom'

function createWrapper() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('useGetUsers', () => {
  it('fetches list of users', async () => {
    const fakeUsers = [{ id: '1', account: 'a', password: 'p', employeeId: 'e', location: 0, head_sticker: 0 }]
    vi.spyOn(api, 'getAllUsers').mockResolvedValue(fakeUsers)

    const { result } = renderHook(() => useGetUsers(), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fakeUsers))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useGetUserById', () => {
  it('fetches single user when id provided', async () => {
    const fakeUser = { id: '2', account: 'b', password: 'q', employeeId: 'f', location: 1, head_sticker: 1 }
    vi.spyOn(api, 'getUserById').mockResolvedValue(fakeUser)

    const { result } = renderHook(() => useGetUserById('2'), { wrapper: createWrapper() })
    await waitFor(() => expect(result.current.data).toEqual(fakeUser))
    expect(result.current.isLoading).toBe(false)
  })
})

describe('useSignup', () => {
  it('calls registerUser on mutate', async () => {
    const fakeUser = { id: '3', account: 'c', password: 'r', employeeId: 'g', location: 2, head_sticker: 2 }
    vi.spyOn(api, 'registerUser').mockResolvedValue(fakeUser)

    const { result } = renderHook(() => useSignup(), { wrapper: createWrapper() })
    result.current.mutate({ account: 'c', password: 'r', employeeId: 'g', location: 2, head_sticker: 2 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})

describe('useLogin', () => {
  it('calls loginUser and succeeds', async () => {
    const fakeResponse = {
      token: 'tok',
      user: { id: '4', account: 'd', password: 's', employeeId: 'h', location: 3, head_sticker: 3 }
    }
    vi.spyOn(api, 'loginUser').mockResolvedValue(fakeResponse)

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
    result.current.mutate({ account: 'd', password: 's' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })
})
