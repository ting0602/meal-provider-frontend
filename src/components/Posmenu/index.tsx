import { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import Meal from "components/CommonComponents/Meal";
import BackHeader from 'components/CommonComponents/BackHeader';
import mealsvg from 'assets/meal/meal.svg';
import car from 'assets/car 1.svg'

import './Posmenu.css';

import { MenuItem } from 'types/meal';
// TODO: Replace with real API call
// import { useRestaurantMenu } from 'hooks/useRestaurant';
type CartItem = {
    item: MenuItem;
    quantity: number;
  };

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Menu = () => {
  const query = useQuery();
  const userId = query.get('userId');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [restaurantName, setRestaurantName] = useState('好吃漢堡');
    const [selectedCategory, setSelectedCategory] = useState<'推薦' | '主食' | '副餐' | '其他'>('推薦');
    // TODO: Use real backend API
    // const { data, isLoading, error } = useRestaurantMenu(restaurantId);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();
    const cartKey = userId ? `cart_user_${userId}` : 'cartItems';

    useEffect(() => {
        // 模擬從 API 取得資料
    const mockMenu: MenuItem[] = [
    {
        id: '1',
        name: 'Cheeseburger',
        price: 159,
        imageUrl: mealsvg,
        category: ['推薦', '主食'],
        likeCount: 120,
        dislikeCount: 8
    },
    {
        id: '2',
        name: 'Chicken Nuggets',
        price: 99,
        imageUrl: mealsvg,
        category: ['推薦', '副餐'],
        likeCount: 85,
        dislikeCount: 10
    },
    {
        id: '3',
        name: 'French Fries',
        price: 69,
        imageUrl: mealsvg,
        category: ['副餐'],
        likeCount: 140,
        dislikeCount: 12
    },
    {
        id: '4',
        name: 'Spicy Chicken Burger',
        price: 179,
        imageUrl: mealsvg,
        category: ['主食'],
        likeCount: 102,
        dislikeCount: 6
    },
    {
        id: '5',
        name: 'Chocolate Shake',
        price: 89,
        imageUrl: mealsvg,
        category: ['其他'],
        likeCount: 76,
        dislikeCount: 4
    },
    {
        id: '6',
        name: 'Beef Noodles',
        price: 119,
        imageUrl: mealsvg,
        category: ['主食'],
        likeCount: 98,
        dislikeCount: 9
    },
        {
        id: '10',
        name: 'Beef Noodles',
        price: 119,
        imageUrl: mealsvg,
        category: ['主食'],
        likeCount: 98,
        dislikeCount: 9
    },
        {
        id: '11',
        name: 'Beef Noodles',
        price: 119,
        imageUrl: mealsvg,
        category: ['主食'],
        likeCount: 98,
        dislikeCount: 9
    },
    {
        id: '7',
        name: 'Grilled Sandwich',
        price: 109,
        imageUrl: mealsvg,
        category: ['推薦', '主食'],
        likeCount: 67,
        dislikeCount: 5
    },
    {
        id: '8',
        name: 'Miso Soup',
        price: 49,
        imageUrl: mealsvg,
        category: ['副餐'],
        likeCount: 50,
        dislikeCount: 3
    },
    {
        id: '9',
        name: 'Fruit Cup',
        price: 59,
        imageUrl: mealsvg,
        category: ['其他'],
        likeCount: 72,
        dislikeCount: 2
    }
    ];

        
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }

        setMenuItems(mockMenu);
    }, []);
    const goToCheckout = () => {
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
      if (userId) {
        // 店家模式：跳轉到 checkorder
        navigate(`/checkorder?userId=${userId}`);
      } else {
        // 使用者模式：跳轉到 cart 頁面
        navigate('/cart', { state: { cartItems } });
      }
    };

    const handleQuantityChange = (meal: MenuItem, quantity: number) => {
        setCartItems((prev) => {
            const existing = prev.find(ci => ci.item.id === meal.id);
            if (existing) {
              if (quantity === 0) {
                return prev.filter(ci => ci.item.id !== meal.id);
              } else {
                return prev.map(ci => ci.item.id === meal.id ? {...ci, quantity} : ci);
              }
            } else if (quantity > 0) {
              return [...prev, {item: meal, quantity}];
            }
            return prev;
          });
      };
    
      const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
      const goToCart = () => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        navigate('/cart', { state: { cartItems } });
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
                              const existing = cartItems.find(ci => ci.item.id === item.id);
                              return (
                                  <Meal
                                      key={item.id}
                                      meal={item}
                                      initialQuantity={existing?.quantity ?? 0}
                                      onQuantityChange={(meal, q) => handleQuantityChange(meal, q)}
                                  />
                              );
                          })}
                  </div>
              </List>

              <div
                className="cart-button"
                onClick={goToCheckout}
                style={{
                  opacity: totalPrice > 0 ? 1 : 0.6,
                  pointerEvents: 'auto',
                }}
              >
                  <img src={car} alt="Cart" className="cart-icon" />
                  <span className="cart-price">${totalPrice}</span>
              </div>
          </div>
        </div>
    );
};

export default Menu;