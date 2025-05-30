import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List } from '@mui/material';

import BackHeader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
import car from 'assets/car1.svg';
import './Cart.css';

import { MenuItem } from 'types/meal';

type CartItem = {
  item: MenuItem;
  quantity: number;
};

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get('userId');
  const shopId = query.get('shopId');
  const cartKey = `cart_${shopId}_${userId ?? 'guest'}`;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.warn('購物車資料格式錯誤，已忽略');
      }
    }
  }, [cartKey]);

  const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

  const goToCheckout = () => {
    navigate('/qrcode', {
      state: {
        totalPrice,
        cartItems,
      },
    });
  };

  return (
    <div>
      <BackHeader description="購物車" />
      <div id="cart-page">
        <div className="dollars-bar">
          <img src={car} alt="Cart" className="cart-icon" />
          ${totalPrice}
        </div>

        <List className="cart-scroll-area">
          <div className="cart-list">
            {cartItems.length > 0 ? (
              cartItems.map((ci) => (
                <Meal
                  key={ci.item.id}
                  meal={ci.item}
                  initialQuantity={ci.quantity}
                  readOnly
                />
              ))
            ) : (
              <div className="cart-empty">購物車是空的</div>
            )}
          </div>
        </List>

        <div
          className="checkout-button"
          role="button"
          tabIndex={0}
          onClick={goToCheckout}
          onKeyDown={e => { if (e.key === 'Enter') goToCheckout(); }}
          style={{
            opacity: totalPrice > 0 ? 1 : 0.5,
            pointerEvents: totalPrice > 0 ? 'auto' : 'none',
          }}
        >
          <img src={car} alt="Cart" className="cart-icon" /> 結帳
        </div>
      </div>
    </div>
  );
};

export default Cart;
