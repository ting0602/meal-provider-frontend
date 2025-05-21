import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Backheader from 'components/CommonComponents/BackHeader';
import Meal from 'components/CommonComponents/Meal';
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

    return (
        <div className="cart-page">
            <Backheader description="購物車" backTo="/menu" />

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

            <div
                className="checkout-button"
                role="button"
                tabIndex={0}
                onClick={() => alert('前往結帳流程')}
                onKeyDown={e => { if (e.key === 'Enter') alert('前往結帳流程'); }}
            >
                結帳 - 總金額 ${totalPrice}
            </div>
        </div>
    );
};

export default Cart;