// src/api/Meal.ts
import axios from 'axios';
import { API } from './index';

export interface MealShop {
  id: string;
  name: string;
  price: number;
  picture?: string;
  type: number;
  recommand: boolean;
  shop: string;
  likes: number;
  dislikes: number;
}

export type MealShopBody = Omit<MealShop, 'id' | 'likes' | 'dislikes'>;

export const getAllMeals = async (): Promise<MealShop[]> => {
  const res = await axios.get(API.meals);
  return res.data.meals;
};

export const getMealById = async (id: string): Promise<MealShop> => {
  const res = await axios.get(API.mealById(id));
  return res.data.meal;
};

export const createMeal = async (data: MealShopBody): Promise<MealShop> => {
  const res = await axios.post(API.meals, data);
  return res.data.meal;
};

export const updateMeal = async (
  id: string,
  data: Partial<MealShopBody>,
): Promise<MealShop> => {
  const res = await axios.put(API.mealById(id), data);
  return res.data.meal;
};

export const deleteMeal = async (id: string): Promise<void> => {
  await axios.delete(API.mealById(id));
};

export const likeMeal = async (id: string): Promise<MealShop> => {
  const res = await axios.post(API.likeMeal(id));
  return res.data.meal;
};

export const dislikeMeal = async (id: string): Promise<MealShop> => {
  const res = await axios.post(API.dislikeMeal(id));
  return res.data.meal;
};
