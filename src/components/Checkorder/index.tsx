import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List, Button } from '@mui/material';

import Backheader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
import car from 'assets/car 1.svg'
import './Checkorder.css';

type MenuItem = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: Array<'推薦' | '主食' | '副餐' | '其他'>;
};

type CartItem = {
    item: MenuItem;
    quantity: number;
};

const Checkorder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fakeStaffId = 'user_123456';

    const testCartItems: CartItem[] = [
        {
          item: {
            id: 'meal-001',
            name: '招牌牛肉麵',
            price: 120,
            imageUrl: 'https://via.placeholder.com/150',
            category: ['推薦', '主食']
          },
          quantity: 1
        },
        {
          item: {
            id: 'meal-002',
            name: '滷味拼盤',
            price: 60,
            imageUrl: 'https://via.placeholder.com/150',
            category: ['副餐']
          },
          quantity: 2
        },
        {
          item: {
            id: 'meal-003',
            name: '可樂',
            price: 35,
            imageUrl: 'https://via.placeholder.com/150',
            category: ['其他']
          },
          quantity: 1
        },
        {
            item: {
              id: 'meal-004',
              name: '芬達',
              price: 35,
              imageUrl: 'https://via.placeholder.com/150',
              category: ['其他']
            },
            quantity: 1
          },
          {
            item: {
              id: 'meal-005',
              name: '雪碧',
              price: 35,
              imageUrl: 'https://via.placeholder.com/150',
              category: ['其他']
            },
            quantity: 1
          },
          {
            item: {
              id: 'meal-006',
              name: '七喜',
              price: 35,
              imageUrl: 'https://via.placeholder.com/150',
              category: ['其他']
            },
            quantity: 1
          }
      ];
    
    const cartItems: CartItem[] = location.state?.cartItems || testCartItems;
    //const cartItems: CartItem[] = location.state?.cartItems || [];
    const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);

    const goToCheckout = () => {};
    const goToOrder = () => {}; // ./pos
    return (
        <div id="checkorder-page">
            <Backheader description="訂單資訊" backTo="/menu" /> {/*backto need adjust (-1)*/}
            
            <div id="staffid">
                <div className="staff">員工代號:</div> 
                <div className='id'>{fakeStaffId}</div>
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
            <div id="fix-bottom">
                <div className="dollars-bar">{/*adjust pos*/}
                    <img src={car} alt="Cart" className="cart-icon" />
                    ${totalPrice}
                </div>
                
                <div className="button-wrapper two-buttons">
                    <Button variant="contained" color="success" className="chorder-button" onClick={goToCheckout}>
                        確認訂單
                    </Button>
                    <Button variant="contained" color="error" className="delorder-button" onClick={goToOrder}>
                        取消訂單
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Checkorder;