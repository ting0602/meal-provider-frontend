import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Button } from '@mui/material';

import { useAuth } from 'provider/AuthProvider';
import { useGetUserById, useUpdateUser } from 'hooks/useUser';
import { useGetShopById } from 'hooks/useShop';
import { useGetOrderById } from 'hooks/useOrder';

import BackHeader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
import PaymentResult from 'components/CommonComponents/PaymentResult';
import car from 'assets/car1.svg';
import './Checkorder.css';

import { MenuItem } from 'types/meal';

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const Checkorder = () => {
  const { userId } = useAuth();
  const { data: user } = useGetUserById(userId!);
  const shopId = user?.shopkeeper;
  const { data: shop } = useGetShopById(shopId!);
  const shopName = shop?.name || '';
  const location = useLocation();
  const navigate = useNavigate();
  
  //const navigate = useNavigate();
  const { buyerId, orderId } = location.state || {};
  const { mutateAsync: updateUser } = useUpdateUser(buyerId!);
  //const fakeStaffId = userId || 'user_123456';
  const { data: order, isLoading, isError } = useGetOrderById(orderId!);
  const cartItems: CartItem[] = useMemo(() => {
    if (!order || !Array.isArray(order.meals)) return [];
    return order.meals.map((meal: any) => ({
      item: {
        id: meal.id,
        name: meal.name,
        price: meal.price,
        imageUrl: meal.picture ?? '',
        category: [], // 若需要分類可再補資料來源
        likeCount: meal.likes ?? 0,
        dislikeCount: meal.dislikes ?? 0,
      },
      quantity: meal.quantity ?? 1,
    }));
  }, [order]);

  const [showResult, setShowResult] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    success: boolean;
    amount?: number;
    timestamp?: string;
    shopName?: string;
    errorType?: string;
    homePath?: string;
    ordersPath?: string; 
  } | null>(null);
  /*
  const testCartItems: CartItem[] = [
    {
      item: {
        id: 'meal-001',
        name: '招牌牛肉麵',
        price: 120,
        imageUrl: 'https://via.placeholder.com/150',
        category: ['推薦', '主食'],
        likeCount: 100,
        dislikeCount: 5,
      },
      quantity: 1,
    },
    {
      item: {
        id: 'meal-002',
        name: '滷味拼盤',
        price: 60,
        imageUrl: 'https://via.placeholder.com/150',
        category: ['副餐'],
        likeCount: 90,
        dislikeCount: 19,
      },
      quantity: 2,
    },
    {
      item: {
        id: 'meal-003',
        name: '可樂',
        price: 35,
        imageUrl: 'https://via.placeholder.com/150',
        category: ['其他'],
        likeCount: 90,
        dislikeCount: 5,
      },
      quantity: 1,
    },
  ];*/

  const totalPrice = cartItems
    .map((ci) => {
      const price = Number(ci?.item?.price ?? 0);
      const quantity = Number(ci?.quantity ?? 0);
      return isNaN(price) || isNaN(quantity) ? 0 : price * quantity;
    })
    .reduce((sum, val) => sum + val, 0);

  const goToCheckout = () => {
    console.log('確認訂單:', { buyerId, cartItems });
    /*
    const meals = cartItems.map(ci => ({
      name: ci.item.name,
      price: ci.item.price,
      quantity: ci.quantity,
    }));
    const timestamp = new Date().toISOString();
    const mealsId = cartItems.map(ci => ci.item.id);
    createOrder({
      buyerId,
      shopId: shopId!,
      meals,
      mealsId,
      totalPrice,
      scored: false,
      shopName,
      createdAt: timestamp,
      updatedAt: timestamp,
    });*/
    updateUser({ id: buyerId, pay_state: 1 });
    setPaymentData({
      success: true,
      amount: totalPrice,
      timestamp: new Date().toLocaleString(),
      shopName,
      homePath: "/shop-account",
      ordersPath: "/shop-order",
    });
    setShowResult(true);
  };

  const goToOrder = async () => {
    console.log('取消訂單:', { buyerId, cartItems });
    await updateUser({ id: buyerId, pay_state: 2 });
    setPaymentData({
      success: false,
      errorType: '支付失敗',
      homePath: "/shop-account",
    });
    setShowResult(true);
  };

  if (isLoading) return <div>載入中...</div>;
  if (isError || !order) return <div>無法取得訂單資料</div>;

  return (
    <div id="checkorder-outline">
      <BackHeader description="訂單資訊" />
      <div id="checkorder-page">
        <div id="staffid">
          <div className="staff">員工代號:</div>
          <div className="id">{userId}</div>
        </div>

        <List className="cart-scroll-area">
          <div className="cart-list">
            {cartItems.length > 0 ? (
              cartItems.map((ci) => (
                <Meal key={ci.item.id} meal={ci.item} initialQuantity={ci.quantity} readOnly />
              ))
            ) : (
              <div className="cart-empty">購物車是空的</div>
            )}
          </div>
        </List>

        <div id="fix-bottom">
          <div className="dollars-bar">
            <img src={car} alt="Cart" className="cart-icon" />
            ${totalPrice}
          </div>

          <div className="button-wrapper two-buttons">
            <Button variant="contained" className="chorder-button" onClick={goToCheckout}>
              確認訂單
            </Button>
            <Button variant="contained" className="delorder-button" onClick={goToOrder}>
              取消訂單
            </Button>
          </div>
        </div>
      </div>

      {showResult && paymentData && (
        <PaymentResult
          success={paymentData.success}
          amount={paymentData.amount}
          timestamp={paymentData.timestamp}
          shopName={paymentData.shopName}
          errorType={paymentData.errorType as '支付失敗'}
          homePath={paymentData.homePath}
          ordersPath={paymentData.ordersPath}
          onClose={() => {
            setShowResult(false);
          }}
        />
      )}
    </div>
  );
};

export default Checkorder;
