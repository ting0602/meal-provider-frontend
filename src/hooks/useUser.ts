// hooks/useUser.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  updateUser,
} from 'api/User';
import { useAuth } from 'provider/AuthProvider';
import { User } from 'api';


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
  const { setToken, setUserId } = useAuth(); // 你可以定義 setToken 存入 localStorage 或 context

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('登入成功', data);
      setUserId(data.user.id); 
      setToken(data.token)
      console.log('userid', data.user.id);

      // 根據是否為店家帳號決定導向路徑
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