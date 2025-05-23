import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { List } from '@mui/material';

import Backheader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
import car from 'assets/car 1.svg'
import './Cart.css';

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

const Cart = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const cartItems: CartItem[] = location.state?.cartItems || [];

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
        <div id="cart-page">
            <Backheader description="購物車" backTo="/menu" />
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
                onKeyDown={e => { if (e.key === 'Enter') goToCheckout() }}
            >
                <img src={car} alt="Cart" className="cart-icon" /> 結帳
            </div>
        </div>
    );
};

export default Cart;