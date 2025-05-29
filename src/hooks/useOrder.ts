import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getAllOrders,
  getOrderById,
  getOrdersByBuyer,
  getOrdersByShop,
  createOrder,
  updateOrder,
  deleteOrder,
  Order,
  OrderBody
} from 'api/Order';

export const useGetOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: getAllOrders,
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useGetOrdersByUser = (userId: string) => {
  return useQuery<Order[]>({
    queryKey: ['orders', 'user', userId],
    queryFn: () => getOrdersByBuyer(userId),
    enabled: !!userId,
  });
};

export const useGetOrdersByShop = (shopId: string) => {
  return useQuery<Order[]>({
    queryKey: ['orders', 'shop', shopId],
    queryFn: () => getOrdersByShop(shopId),
    enabled: !!shopId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrder = (orderId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<OrderBody>) => updateOrder(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
