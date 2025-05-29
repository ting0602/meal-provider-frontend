// src/api/Order.ts
import axios from 'axios';
import { API } from './index';

export interface MealItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  shopId: string;
  meals: MealItem[];
  mealsId: string[];
  totalPrice: number;
  scored: boolean;
  shopName: string;
}

export type OrderBody = Omit<Order, 'id'>;

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await axios.get(API.orders);
  return res.data.orders;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const res = await axios.get(API.orderById(id));
  return res.data.order;
};

export const getOrdersByBuyer = async (buyerId: string): Promise<Order[]> => {
  const res = await axios.get(API.ordersByBuyer(buyerId));
  return res.data.orders;
};

export const getOrdersByShop = async (shopId: string): Promise<Order[]> => {
  const res = await axios.get(API.ordersByShop(shopId));
  return res.data.orders;
};

export const createOrder = async (data: OrderBody): Promise<Order> => {
  const res = await axios.post(API.orders, data);
  return res.data.order;
};

export const updateOrder = async (id: string, data: Partial<OrderBody>): Promise<Order> => {
  const res = await axios.put(API.orderById(id), data);
  return res.data.order;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(API.orderById(id));
};
