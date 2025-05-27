// src/api/index.ts

// ✔ 本地 or 遠端後端網址
const backendBaseUrl = 'http://localhost:8888/api';
// 若之後部署改用正式主機，只要改這一行即可
// const backendBaseUrl = 'https://your-production-domain.com/api';

export const API = {
  users: `${backendBaseUrl}/users`, // GET all, POST new user
  userById: (id: string) => `${backendBaseUrl}/users/${id}`, // GET / PUT
  register: `${backendBaseUrl}/users/register`, // POST 註冊
  login: `${backendBaseUrl}/users/login`,       // POST 登入
};

// 統一回傳格式型別
export interface APIResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string | null;
}

// User 型別
export interface User {
  _id?: string;
  account: string;
  password: string;
  employeeId: string;
  location: number;
  head_sticker: number;
  order_history?: any[];
  shopkeeper?: string | null;
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
