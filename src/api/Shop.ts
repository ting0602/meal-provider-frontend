import axios from 'axios';
import { API } from './index';

export interface Shop {
  id: string;
  name: string;
  location: number;
  menu: string[]; // or ObjectId[]
  order: string[];
  ratingCount: number;
  ratingAvg: number;
}

export interface ShopBody {
  name: string;
  location: number;
  menu: string[];
  order: string[];
}

// 取得全部商店
export const getAllShops = async (): Promise<Shop[]> => {
  const res = await axios.get(API.shops);
  return res.data.shops;
};

// 根據地點取得商店
export const getShopsByLocation = async (location: number): Promise<Shop[]> => {
  const res = await axios.get(API.shops, {
    params: { location },
  });
  return res.data.shops;
};

// 取得單一商店
export const getShopById = async (id: string): Promise<Shop> => {
  const res = await axios.get(API.shopById(id));
  return res.data.shop;
};

// 新增商店
export const createShop = async (shop: ShopBody): Promise<Shop> => {
  const res = await axios.post(API.shops, shop);
  return res.data.shop;
};

// 評分商店
export const rateShop = async (id: string, rating: number): Promise<Shop> => {
  const res = await axios.post(API.rateShop(id), { rating });
  return res.data.shop;
};

// 更新商店資訊
export const updateShop = async (
  id: string,
  update: Partial<ShopBody>
): Promise<Shop> => {
  const res = await axios.put(API.shopById(id), update);
  return res.data.shop;
};

// 刪除商店
export const deleteShop = async (id: string): Promise<void> => {
  await axios.delete(API.shopById(id));
};
