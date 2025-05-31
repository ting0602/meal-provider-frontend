// hooks/useUser.ts
import { useMutation, useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  User,
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
  fetchUserMonthlyTotal,
  fetchUserLastOrderId,
  fetchUserMonthlyOrders,
  fetchUserWeeklyPrice
} from 'api/User';

import { useAuth } from 'provider/AuthProvider';


export const useSignup = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      console.log('註冊成功', data);
      navigate('/login');
    },
    onError: (error) => {
      console.error('註冊失敗', error);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUserId } = useAuth();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('登入成功', data);
      setUserId(data.user.id); 
      setToken(data.token)
      console.log('userid', data.user.id);

      if (data.user.shopkeeper) {
        navigate('/shop-account');
      } 
      else if (data.user.admin) {
        navigate('/admin');
      }
      else {
        navigate('/home');
      }
    },
    onError: (error) => {
      console.error('登入失敗', error);
    },
  });
};


export const useGetUsers = () => {
  const query = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  if (query.error) {
    console.error('取得所有使用者失敗:', query.error.message);
  }

  return query;
};

export const useGetUserById = (userId: string) => {
  const query = useQuery<User, Error>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  if (query.error) {
    console.error('取得使用者資料失敗:', query.error.message);
  }

  return query;
};


export const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationFn: (data: Partial<User>) => updateUser(userId, data),
    onSuccess: (data) => {
      console.log('使用者資料更新成功', data);
    },
    onError: (error) => {
      console.error('使用者資料更新失敗', error);
    },
  });
};

export const useUserMonthlyTotal = (userId: string, year: number, month: number) => {
  return useQuery({
    queryKey: ['userMonthlyTotal', userId, year, month],
    queryFn: () => fetchUserMonthlyTotal(userId, year, month),
    enabled: !!userId,
  });
};

export const useUserMonthlyOrders = (userId: string, year: number, month: number) => {
  return useQuery({
    queryKey: ['userMonthlyOrders', userId, year, month],
    queryFn: () => fetchUserMonthlyOrders(userId, year, month),
    enabled: !!userId,
  });
};

export const useUserWeeklyPrice = (userId: string, date: string) => {
  return useQuery({
    queryKey: ['userWeeklyPrice', userId, date],
    queryFn: () => fetchUserWeeklyPrice(userId, date),
    enabled: !!userId && !!date,
  });
};

export const useUserLastOrder = (userId: string) => {
  return useQuery({
    queryKey: ['userLastOrder', userId],
    queryFn: () => fetchUserLastOrderId(userId),
    enabled: !!userId,
  });
};

export interface UserMonthlyTotal {
  userId: string
  employeeId: string
  total: number
}

export const useAllUsersMonthlyTotals = (
  year: number,
  month: number
): {
  data: UserMonthlyTotal[]
  isLoading: boolean
  isError: boolean
} => {
  // Get raw users from hook and explicitly type
  const { data: rawUsers = [], isLoading: loadingUsers, isError: errorUsers } = useGetUsers()
  const users: User[] = Array.isArray(rawUsers) ? rawUsers : []

  // Fetch monthly total for each user
  const totalsQueries = useQueries({
    queries: users.map((u: User) => ({
      queryKey: ['userMonthlyTotal', u.id, year, month],
      queryFn: () => fetchUserMonthlyTotal(u.id, year, month),
      enabled: !!u.id,
    })),
  })

  // Build typed result array
  const data: UserMonthlyTotal[] = users.map((u: User, idx: number) => ({
    userId: u.id,
    employeeId: u.employeeId,
    total: totalsQueries[idx].data ?? 0,
  }))

  const isLoading = loadingUsers || totalsQueries.some((q) => q.isLoading)
  const isError = errorUsers || totalsQueries.some((q) => q.isError)

  return { data, isLoading, isError }
}