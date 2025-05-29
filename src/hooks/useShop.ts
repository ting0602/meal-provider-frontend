import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllShops,
  getShopById,
  getShopsByLocation,
  createShop,
  updateShop,
  deleteShop,
  rateShop,
  Shop,
  ShopBody,
} from 'api/Shop';

export const useGetAllShops = () => {
  return useQuery<Shop[], Error>({
    queryKey: ['shops'],
    queryFn: getAllShops,
  });
};

export const useGetShopsByLocation = (location: number) => {
  return useQuery<Shop[], Error>({
    queryKey: ['shops', location],
    queryFn: () => getShopsByLocation(location),
    enabled: location !== undefined,
  });
};

export const useGetShopById = (shopId: string) => {
  return useQuery<Shop, Error>({
    queryKey: ['shop', shopId],
    queryFn: () => getShopById(shopId),
    enabled: !!shopId,
  });
};

export const useCreateShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};

export const useUpdateShop = (shopId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ShopBody>) => updateShop(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
    },
  });
};

export const useDeleteShop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops'] });
    },
  });
};

export const useRateShop = (shopId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rating: number) => rateShop(shopId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
    },
  });
};
