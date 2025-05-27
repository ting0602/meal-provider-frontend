// src/api/user.ts
import axios from "axios";
import { API, User, SignupData, LoginData } from './index';

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get(API.users);
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(API.userById(id));
  return res.data;
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
