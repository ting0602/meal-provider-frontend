// PosMenu.tsx
// TODO: you should get "userId (buyerID)", then move to this page
// TODO: you may need to change some logic to fit your needs! (this is totally same as Menu.tsx)
import { useEffect, useState } from 'react';
import { List } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

import Meal from 'components/CommonComponents/Meal';
import BackHeader from 'components/CommonComponents/BackHeader';
// import mealsvg from 'assets/meal/meal.svg';
import NoImg from 'assets/default-image.png';
import car from 'assets/car1.svg';

import { useAuth } from 'provider/AuthProvider';
import { useGetShopById } from 'hooks/useShop';
import { useGetUserById } from 'hooks/useUser'
import { MenuItem } from 'types/meal';
import { useCreateOrder } from 'hooks/useOrder';
import { fetchUserLastOrderId } from 'api/User';
import './Posmenu.css';

type CartItem = {
  item: MenuItem;
  quantity: number;
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PosMenu = () => {
  //const query = useQuery();
  //const buyerId = query.get('buyerId');
  const { userId } = useAuth();
  const { data: user } = useGetUserById(userId!);
  const shopId = user?.shopkeeper;
  const { data: shop, isLoading, isError } = useGetShopById(shopId!);
  const { mutate: createOrder } = useCreateOrder();
  //const shopName = shop?.name || '';
  const location = useLocation();
  const { buyerId } = location.state || {};

  const [selectedCategory, setSelectedCategory] = useState<'推薦' | '主食' | '副餐' | '其他'>('推薦');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();
  const cartKey = `cart_${shopId}_${userId}`;

  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [cartKey]);

  const handleQuantityChange = (meal: MenuItem, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find(ci => ci.item.id === meal.id);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(ci => ci.item.id !== meal.id);
        } else {
          return prev.map(ci => ci.item.id === meal.id ? { ...ci, quantity } : ci);
        }
      } else if (quantity > 0) {
        return [...prev, { item: meal, quantity }];
      }
      return prev;
    });
  };

  // FIXME: negative error
  const goToCheckout = async () => {
    // shopkeeper
    // add create order
    const meals = cartItems.map(ci => ({
      name: ci.item.name,
      price: ci.item.price,
      quantity: ci.quantity,
    }));
    const timestamp = new Date().toISOString();
    const mealsId = cartItems.map(ci => ci.item.id);

    const createorder = await createOrder({
      buyerId: buyerId!,
      shopId: shopId!,
      meals,
      mealsId,
      totalPrice,
      scored: false,
      shopName: shop?.name!,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    console.log('定單：', createorder);
    setTimeout(async () => {
      const lastOrderId = await fetchUserLastOrderId(buyerId!);
      navigate(`/checkorder?shopId=${shopId}&buyerId=${buyerId}`, {
        state: {
          buyerId,
          orderId: lastOrderId,
        },
      });
    }, 1500);
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  };

  const totalPrice = cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const restaurantName = shop?.name ?? '載入中...';

  const filteredMenu = (shop?.menu ?? []).filter((item: any) => {
    if (selectedCategory === '推薦') return item.recommand;
    const typeMap = { 主食: 0, 副餐: 1, 其他: 2 };
    return item.type === typeMap[selectedCategory];
  });

  if (isLoading) return <div>載入中...</div>;
  if (isError || !shop) return <div>餐廳資料載入失敗</div>;

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

              const existing = cartItems.find(ci => ci.item.id === meal.id);

              return (
                <Meal
                  key={meal.id}
                  meal={convertedMeal}
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
            pointerEvents: totalPrice > 0 ? 'auto' : 'none',
          }}
        >
          <img src={car} alt="Cart" className="cart-icon" />
          <span className="cart-price">${totalPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default PosMenu;