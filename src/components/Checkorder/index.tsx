import {useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Button } from '@mui/material';

import BackHeader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
import PaymentResult from 'components/CommonComponents/PaymentResult';
import car from 'assets/car 1.svg';
import './Checkorder.css';

import { MenuItem } from 'types/meal';

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const Checkorder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, orderId } = location.state || {};
  const fakeStaffId = userId || 'user_123456';

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
  ];

  const cartItems: CartItem[] = location.state?.cartItems || testCartItems;
  const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const goToCheckout = () => {
    console.log('確認訂單:', { userId, orderId });// adjust
    
    setPaymentData({
      success: true,
      amount: totalPrice,
      timestamp: new Date().toLocaleString(),
      shopName: '胖胖豬韓式拌飯',
      homePath: "/shop-account",
      ordersPath: "/shop-order",
    });
    setShowResult(true);
  };

  const goToOrder = () => {
    console.log('取消訂單:', { userId, orderId });
    
    setPaymentData({
      success: false,
      errorType: '支付失敗',
      homePath: "/shop-account",
    });
    setShowResult(true);
  };

  return (
    <div id="checkorder-outline">
      <BackHeader description="訂單資訊" />
      <div id="checkorder-page">
        <div id="staffid">
          <div className="staff">員工代號:</div>
          <div className="id">{fakeStaffId}</div>
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
