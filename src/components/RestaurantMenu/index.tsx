import { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import KMeal from "components/CommonComponents/Keepermeal";
import Meal from 'components/CommonComponents/Meal';
import BackHeader from 'components/CommonComponents/BackHeader';
import mealsvg from 'assets/meal/meal.svg';

import { MenuItem } from 'types/meal';
import './RestaurantMenu.css';

// TODO: Replace with real API call
// import { useRestaurantMenu } from 'hooks/useRestaurant';
// TODO: Use shop id to get menu data

type CartItem = {
    item: MenuItem;
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
                likeCount: 120,
                dislikeCount: 8
            },
            {
                id: '2',
                name: 'Chicken Nuggets',
                price: 99,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
                likeCount: 85,
                dislikeCount: 10
            },
            {
                id: '3',
                name: 'French Fries',
                price: 69,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
                likeCount: 140,
                dislikeCount: 12
            },
            {
                id: '4',
                name: 'two Chicken ',
                price: 139,
                imageUrl: mealsvg,
                category: ['推薦' , '副餐'],
                likeCount: 102,
                dislikeCount: 6
            },
            {
                id: '5',
                name: 'chocolate Nuggets',
                price: 49,
                imageUrl: mealsvg,
                category: ['推薦' , '其他'],
                likeCount: 140,
                dislikeCount: 12    
            },
            {
                id: '6',
                name: 'beef noodles',
                price: 119,
                imageUrl: mealsvg,
                category: ['推薦' , '主食'],
                likeCount: 98,  
                dislikeCount: 9
            },
        ];
        
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setMenuItems(mockMenu);
    }, []);

        const goToCreate = () => { // need adjust
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/create-meal', { state: { cartItems } });
        };

    return (
        <div>
            <BackHeader description={restaurantName} /> 
            <div id="restaurant-menu">
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
                            .map((item) => {
                                //const existing = cartItems.find(ci => ci.item.id === item.id);
                                return (
                                    <Meal
                                        key={item.id}
                                        meal={item}
                                        editable
                                    />
                                );
                            })}
                    </div>
                </List>

                <div className="add-button" onClick={goToCreate}>
                    新增餐點
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;