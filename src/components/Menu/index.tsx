import React, { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Meal from "components/CommonComponents/Meal";
import Backheader from 'components/CommonComponents/BackHeader';
import mealsvg from 'assets/meal/meal.svg';
import car from 'assets/car 1.svg'

import './Menu.css';

// TODO: Replace with real API call
// import { useRestaurantMenu } from 'hooks/useRestaurant';

type MenuItem = {
    id: string;
    name: string;
    //description: string;
    price: number;
    imageUrl: string;
    category: Array<'推薦' | '主食' | '副餐' | '其他'>;
};

type CartItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };

const RestaurantMenu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [restaurantName, setRestaurantName] = useState('Awesome Burger');
    const [selectedCategory, setSelectedCategory] = useState<'推薦' | '主食' | '副餐' | '其他'>('推薦');
    // TODO: Use real backend API
    // const { data, isLoading, error } = useRestaurantMenu(restaurantId);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // 模擬從 API 取得資料
        const mockMenu: MenuItem[] = [
            {
                id: '1',
                name: 'Cheeseburger',
                price: 159,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
            },
            {
                id: '2',
                name: 'Chicken Nuggets',
                price: 99,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
            },
            {
                id: '3',
                name: 'French Fries',
                price: 69,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
            },
            {
                id: '4',
                name: 'two Chicken ',
                price: 139,
                imageUrl: mealsvg,
                category: ['推薦' , '副餐'],
            },
            {
                id: '5',
                name: 'chocolate Nuggets',
                price: 49,
                imageUrl: mealsvg,
                category: ['推薦' , '其他'],
            },
            {
                id: '6',
                name: 'beef noodles',
                price: 119,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
            },
        ];

        setMenuItems(mockMenu);
    }, []);

    const handleQuantityChange = (meal: MenuItem, quantity: number) => {
        setCartItems((prev) => {
          const existing = prev.find((item) => item.id === meal.id);
          if (existing) {
            if (quantity <= 0) {
              return prev.filter((item) => item.id !== meal.id);
            } else {
              return prev.map((item) =>
                item.id === meal.id ? { ...item, quantity } : item
              );
            }
          } else if (quantity > 0) {
            return [...prev, { id: meal.id, name: meal.name, price: meal.price, quantity }];
          }
          return prev;
        });
      };
    
      const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div id="restaurant-menu">
            <Backheader description={restaurantName} backTo="/home" />

            <div id="menu-category-tabs">
                {['推薦', '主食', '副餐', '其他'].map((cat) => (
                    <div
                        key={cat}
                        className={`menu-tab ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat as any)}
                    >
                        {cat}
                    </div>
                ))}
            </div>

            <List className="menu-scroll-area">
                <div className="menu-list">
                    {menuItems
                        .filter((item) => item.category.includes(selectedCategory))
                        .map((item) => (
                            <Meal key={item.id} meal={item} onQuantityChange={(meal, q) => handleQuantityChange(meal, q)} />
                        ))}
                </div>
            </List>

            <div
                className="cart-button"
                onClick={() => {
                    if (totalPrice > 0) {
                    navigate('/cart');
                    }
                }}
                style={{
                    opacity: totalPrice > 0 ? 1 : 0.6,
                    pointerEvents: 'auto'
                }}
                >
                <img src={car} alt="Cart" className="cart-icon" />
                <span className="cart-price">${totalPrice}</span>
            </div>
        </div>
    );
};

export default RestaurantMenu;