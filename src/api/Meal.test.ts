// src/api/Meal.test.ts
import axios from 'axios'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mocked } from 'vitest'
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  likeMeal,
  dislikeMeal,
  MealShop,
  MealShopBody
} from './Meal'
import { API } from './index'

vi.mock('axios')
const mockedAxios = axios as Mocked<typeof axios>

beforeEach(() => {
  vi.resetAllMocks()
})

describe('Meal API client', () => {
  const fakeMeal: MealShop = {
    id: 'm1',
    name: 'Burger',
    price: 50,
    picture: 'pic.png',
    type: 0,
    recommand: true,
    shop: 's1',
    likes: 5,
    dislikes: 1
  }

  it('getAllMeals fetches list of meals', async () => {
    mockedAxios.get.mockResolvedValue({ data: { meals: [fakeMeal] } })
    const result = await getAllMeals()
    expect(mockedAxios.get).toHaveBeenCalledWith(API.meals)
    expect(result).toEqual([fakeMeal])
  })

  it('getMealById fetches one meal', async () => {
    mockedAxios.get.mockResolvedValue({ data: { meal: fakeMeal } })
    const result = await getMealById('m1')
    expect(mockedAxios.get).toHaveBeenCalledWith(API.mealById('m1'))
    expect(result).toEqual(fakeMeal)
  })

  it('createMeal posts new meal and returns it', async () => {
    const body: MealShopBody = {
      name: 'Pizza',
      price: 100,
      picture: undefined,
      type: 1,
      recommand: false,
      shop: 's2'
    }
    mockedAxios.post.mockResolvedValue({ data: { meal: fakeMeal } })
    const result = await createMeal(body)
    expect(mockedAxios.post).toHaveBeenCalledWith(API.meals, body)
    expect(result).toEqual(fakeMeal)
  })

  it('updateMeal sends partial update and returns updated meal', async () => {
    const patch: Partial<MealShopBody> = { price: 60 }
    mockedAxios.put.mockResolvedValue({ data: { meal: fakeMeal } })
    const result = await updateMeal('m1', patch)
    expect(mockedAxios.put).toHaveBeenCalledWith(API.mealById('m1'), patch)
    expect(result).toEqual(fakeMeal)
  })

  it('deleteMeal calls delete endpoint', async () => {
    mockedAxios.delete.mockResolvedValue({})
    await deleteMeal('m1')
    expect(mockedAxios.delete).toHaveBeenCalledWith(API.mealById('m1'))
  })

  it('likeMeal posts like and returns updated meal', async () => {
    mockedAxios.post.mockResolvedValue({ data: { meal: fakeMeal } })
    const result = await likeMeal('m1')
    expect(mockedAxios.post).toHaveBeenCalledWith(API.likeMeal('m1'))
    expect(result).toEqual(fakeMeal)
  })

  it('dislikeMeal posts dislike and returns updated meal', async () => {
    mockedAxios.post.mockResolvedValue({ data: { meal: fakeMeal } })
    const result = await dislikeMeal('m1')
    expect(mockedAxios.post).toHaveBeenCalledWith(API.dislikeMeal('m1'))
    expect(result).toEqual(fakeMeal)
  })
})
