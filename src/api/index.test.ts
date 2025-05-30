// src/api/index.test.ts
import { describe, it, expect } from 'vitest'
import { API } from './index'

const base = 'http://localhost:8888/api'

describe('API URL builder', () => {
  const userId = 'user-123'
  const shopId = 'shop-456'
  const orderId = 'order-789'
  const mealId = 'meal-321'
  const year = 2025
  const month = 7
  const date = '2025-07-15'

  it('builds User endpoints', () => {
    expect(API.users).toBe(`${base}/users`)
    expect(API.userById(userId)).toBe(`${base}/users/${userId}`)
    expect(API.register).toBe(`${base}/users/register`)
    expect(API.login).toBe(`${base}/users/login`)
    expect(API.userMonthlyTotal(userId, year, month))
      .toBe(`${base}/users/${userId}/monthly_total?year=${year}&month=${month}`)
    expect(API.userMonthlyOrders(userId, year, month))
      .toBe(`${base}/users/${userId}/monthly_orders?year=${year}&month=${month}`)
    expect(API.userWeeklyPrice(userId, date))
      .toBe(`${base}/users/${userId}/weekly_price?date=${date}`)
    expect(API.userLastOrder(userId))
      .toBe(`${base}/users/${userId}/last_order`)
  })

  it('builds Shop endpoints', () => {
    expect(API.shops).toBe(`${base}/shops`)
    expect(API.shopById(shopId)).toBe(`${base}/shops/${shopId}`)
    expect(API.rateShop(shopId)).toBe(`${base}/shops/${shopId}/rate`)
  })

  it('builds Order endpoints', () => {
    expect(API.orders).toBe(`${base}/orders`)
    expect(API.orderById(orderId)).toBe(`${base}/orders/${orderId}`)
    expect(API.ordersByBuyer(userId))
      .toBe(`${base}/orders?buyerId=${userId}`)
    expect(API.ordersByShop(shopId))
      .toBe(`${base}/orders?shopId=${shopId}`)
  })

  it('builds Meal endpoints', () => {
    expect(API.meals).toBe(`${base}/meals`)
    expect(API.mealById(mealId)).toBe(`${base}/meals/${mealId}`)
    expect(API.likeMeal(mealId)).toBe(`${base}/meals/${mealId}/like`)
    expect(API.dislikeMeal(mealId)).toBe(`${base}/meals/${mealId}/dislike`)
  })
})
