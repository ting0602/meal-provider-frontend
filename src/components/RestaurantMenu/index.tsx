import { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import Meal from 'components/CommonComponents/Meal';
import BackHeader from 'components/CommonComponents/BackHeader';
import mealsvg from 'assets/meal/meal.svg';

import { useGetShopById } from 'hooks/useShop';
import { MenuItem } from 'types/meal';
import NoImg from 'assets/default-image.png';
import './RestaurantMenu.css';

// TODO: Replace with real API call
// import { useRestaurantMenu } from 'hooks/useRestaurant';
// TODO: Use shop id to get menu data

type CartItem = {
    item: MenuItem;
    quantity: number;
  };

const RestaurantMenu = () => {
    const location = useLocation();
    const { shopId } = location.state || {};
    const { data: shop, isLoading, isError } = useGetShopById(shopId);
    const navigate = useNavigate();
    //const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    //const [restaurantName, setRestaurantName] = useState('Awesome Burger');
    const [selectedCategory, setSelectedCategory] = useState<'推薦' | '主食' | '副餐' | '其他'>('推薦');
    // TODO: Use real backend API
    // const { data, isLoading, error } = useRestaurantMenu(restaurantId);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    

    useEffect(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
    }, []);

    const goToCreate = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/create-meal', { state: { shopId, cartItems } });
    };
    /*
    const goToCreate = () => { // need adjust
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/create-meal', { state: { cartItems } });
    };*/
    const filteredMenu = (shop?.menu ?? []).filter((item: any) => {
        if (selectedCategory === '推薦') return item.recommand;
        const typeMap = { 主食: 0, 副餐: 1, 其他: 2 };
        return item.type === typeMap[selectedCategory];
    });

    if (isLoading) return <div>載入中...</div>;
    if (isError || !shop) return <div>餐廳資料載入失敗</div>;

    return (
        <div>
            <BackHeader description={shop?.name || '載入中...'} /> 
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
                        {filteredMenu.map((meal: any) => {
                            const convertedMeal: MenuItem = {
                                id: meal.id,
                                name: meal.name,
                                price: meal.price,
                                imageUrl: meal.picture ?? NoImg,
                                category: (() => {
                                const c: ("推薦" | "主食" | "副餐" | "其他")[] = [];
                                if (meal.recommand) c.push("推薦");
                                if (meal.type === 0) c.push("主食");
                                else if (meal.type === 1) c.push("副餐");
                                else c.push("其他");
                                return c;
                                })(),
                                likeCount: meal.likes,
                                dislikeCount: meal.dislikes,
                            };

                            //const existing = cartItems.find(ci => ci.item.id === meal.id);
                            return (
                                <Meal
                                    key={meal.id}
                                    meal={convertedMeal}
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