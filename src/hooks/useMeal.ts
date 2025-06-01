// src/hooks/useMeal.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
  likeMeal,
  dislikeMeal,
  MealShop,
  MealShopBody,
} from 'api/Meal';

export const useGetAllMeals = () => {
  return useQuery<MealShop[]>({
    queryKey: ['meals'],
    queryFn: getAllMeals,
  });
};

export const useGetMealById = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<MealShop>({
    queryKey: ['meal', id],
    queryFn: () => getMealById(id),
    enabled: !!id && (options?.enabled ?? true),
  });
};

export const useCreateMeal = () => {
  const queryClient = useQueryClient();
  return useMutation<MealShop, Error, MealShopBody, unknown>({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

export const useUpdateMeal = (mealId: string, shopId: string) => {
  const queryClient = useQueryClient();

  return useMutation<MealShop, Error, MealShopBody, unknown>({
    mutationFn: (newData: MealShopBody) => updateMeal(mealId, newData),

    onSuccess: (updatedMeal: MealShop) => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
      queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
    },
  });
};


export const useDeleteMeal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });
};

export const useLikeMeal = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => likeMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal', id] });
    },
  });
};

export const useDislikeMeal = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => dislikeMeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal', id] });
    },
  });
};
