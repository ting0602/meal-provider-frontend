import { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import KMeal from "components/CommonComponents/Keepermeal";
import Backheader from 'components/CommonComponents/BackHeader';
import mealsvg from 'assets/meal/meal.svg';

import './Skeepermeal.css';

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
        <div id="restaurant-menu">
            <Backheader description={restaurantName} backTo="/home" /> {/*back to where? need adjust*/}

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
                                <KMeal
                                    key={item.id}
                                    meal={item}
                                />
                            );
                        })}
                </div>
            </List>

            <div className="add-button" onClick={goToCreate}>
                新增餐點
            </div>
        </div>
    );
};

export default RestaurantMenu;