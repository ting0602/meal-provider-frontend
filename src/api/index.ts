// src/api/index.ts

// Backend URL
// FIXME: Update this URL to match your backend server
// If you using k8s, you should use '/api'
const backendBaseUrl = 'http://localhost:8888/api';
// const backendBaseUrl = 'https://your-production-domain.com/api';

export const API = {
  // === User APIs ===
  users: `${backendBaseUrl}/users`, // GET all, POST new user
  userById: (id: string) => `${backendBaseUrl}/users/${id}`, // GET / PUT
  register: `${backendBaseUrl}/users/register`, // POST
  login: `${backendBaseUrl}/users/login`,       // POST

  userMonthlyTotal: (id: string, year: number, month: number) =>
    `${backendBaseUrl}/users/${id}/monthly_total?year=${year}&month=${month}`,
  userMonthlyOrders: (id: string, year: number, month: number) =>
    `${backendBaseUrl}/users/${id}/monthly_orders?year=${year}&month=${month}`,
  userWeeklyPrice: (id: string, date: string) =>
    `${backendBaseUrl}/users/${id}/weekly_price?date=${date}`,
  userLastOrder: (id: string) =>
    `${backendBaseUrl}/users/${id}/last_order`,


  // === Shop APIs ===
  shops: `${backendBaseUrl}/shops`,
  shopById: (id: string) => `${backendBaseUrl}/shops/${id}`,
  rateShop: (id: string) => `${backendBaseUrl}/shops/${id}/rate`,

  // === Order APIs ===
  orders: `${backendBaseUrl}/orders`,
  orderById: (id: string) => `${backendBaseUrl}/orders/${id}`,
  ordersByBuyer: (buyerId: string) => `${backendBaseUrl}/orders?buyerId=${buyerId}`,
  ordersByShop: (shopId: string) => `${backendBaseUrl}/orders?shopId=${shopId}`,

  // === Meal APIs ===
  meals: `${backendBaseUrl}/meals`,
  mealById: (id: string) => `${backendBaseUrl}/meals/${id}`,
  likeMeal: (id: string) => `${backendBaseUrl}/meals/${id}/like`,
  dislikeMeal: (id: string) => `${backendBaseUrl}/meals/${id}/dislike`,

  // === Upload Image API ===
  uploadImage: `${backendBaseUrl}/uploadImage`,
};

