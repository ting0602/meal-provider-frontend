// src/api/user.ts
import axios from "axios";
import { API } from './index';

// 統一回傳格式型別
export interface APIResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string | null;
}

// User 型別
export interface User {
  id: string;
  account: string;
  password: string;
  employeeId: string;
  location: number;
  head_sticker: number;
  order_history?: any[];
  shopkeeper?: string | null;
  admin?: boolean | null;
  pay_state?: number;
}

// 註冊用型別
export interface SignupData {
  account: string;
  password: string;
  employeeId: string;
  location: number;
  head_sticker: number;
}

// 登入用型別
export interface LoginData {
  account: string;
  password: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(API.users);
  return res.data.users as User[];
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(API.userById(id));
  return res.data.user; 
};

export const registerUser = async (data: SignupData): Promise<User> => {
  const res = await axios.post(API.register, data);
  return res.data;
};

export interface LoginResponse {
  token: string;
  user: User;
}

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  const res = await axios.post(API.login, data);
  return res.data;
};


export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const res = await axios.put(API.userById(id), data);
  return res.data;
};

export const fetchUserMonthlyTotal = async (
  id: string,
  year: number,
  month: number
): Promise<number> => {
  const res = await axios.get(API.userMonthlyTotal(id, year, month));
  return res.data.total;
};

export interface MealItem {
  name: string
  price: number
  quantity: number
}

export interface MonthlyOrder {
  shopName: string
  meals: MealItem[]
  order_time: string
}
export const fetchUserMonthlyOrders = async (
  id: string,
  year: number,
  month: number
): Promise<MonthlyOrder[]> => {
  try {
    const res = await axios.get(API.userMonthlyOrders(id, year, month))
    return res.data.orders as MonthlyOrder[]
  } catch (err: any) {
    if (err.response?.status === 404) {
      return []
    }
    throw err
  }
}

export const fetchUserWeeklyPrice = async (
  id: string,
  date: string
): Promise<number[]> => {
  const res = await axios.get(API.userWeeklyPrice(id, date));
  return res.data.dailyPrices;
};

export const fetchUserLastOrderId = async (id: string): Promise<string> => {
  const res = await axios.get(API.userLastOrder(id));
  return res.data.lastOrderId;
};
