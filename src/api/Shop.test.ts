// src/api/Shop.test.ts
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mocked } from 'vitest'
import {
  getAllShops,
  getShopsByLocation,
  getShopById,
  createShop,
  rateShop,
  updateShop,
  deleteShop,
  Shop,
  ShopBody
} from './Shop'
import { API } from './index'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

beforeEach(() => vi.resetAllMocks())

describe('Shop API client', () => {
  const fakeShop: Shop = {
    id: 's1',
    name: 'Coffee Shop',
    location: 1,
    menu: ['espresso'],
    order: ['o1'],
    ratingCount: 10,
    ratingAvg: 4.5,
    type: 0,
    image: 'img.png'
  }

  it('getAllShops should fetch and return shops array', async () => {
    mockedAxios.get.mockResolvedValue({ data: { shops: [fakeShop] } })

    const result = await getAllShops()
    expect(mockedAxios.get).toHaveBeenCalledWith(API.shops)
    expect(result).toEqual([fakeShop])
  })

  it('getShopsByLocation should fetch with params', async () => {
    mockedAxios.get.mockResolvedValue({ data: { shops: [fakeShop] } })

    const result = await getShopsByLocation(2)
    expect(mockedAxios.get).toHaveBeenCalledWith(API.shops, { params: { location: 2 } })
    expect(result).toEqual([fakeShop])
  })

  it('getShopById should fetch single shop', async () => {
    mockedAxios.get.mockResolvedValue({ data: { shop: fakeShop } })

    const result = await getShopById('s1')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.shopById('s1'))
    expect(result).toEqual(fakeShop)
  })

  it('createShop should post and return new shop', async () => {
    const body: ShopBody = {
      name: 'Bakery',
      location: 3,
      menu: ['bread'],
      order: [],
      type: 1,
      image: undefined
    }
    mockedAxios.post.mockResolvedValue({ data: { shop: fakeShop } })

    const result = await createShop(body)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.shops, body)
    expect(result).toEqual(fakeShop)
  })

  it('rateShop should post rating and return updated shop', async () => {
    mockedAxios.post.mockResolvedValue({ data: { shop: fakeShop } })

    const result = await rateShop('s1', 5)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.rateShop('s1'), { rating: 5 })
    expect(result).toEqual(fakeShop)
  })

  it('updateShop should put partial data and return shop', async () => {
    const patch: Partial<ShopBody> = { name: 'New Name' }
    mockedAxios.put.mockResolvedValue({ data: { shop: fakeShop } })

    const result = await updateShop('s1', patch)
    expect(mockedAxios.put).toHaveBeenCalledWith(API.shopById('s1'), patch)
    expect(result).toEqual(fakeShop)
  })

  it('deleteShop should call delete endpoint', async () => {
    mockedAxios.delete.mockResolvedValue({})

    await deleteShop('s1')
    expect(mockedAxios.delete).toHaveBeenCalledWith(API.shopById('s1'))
  })
})