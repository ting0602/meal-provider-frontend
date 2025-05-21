import { useNavigate } from 'react-router-dom';
import FooterShop from 'components/CommonComponents/FooterShop';
import OrderInfoCard from 'components/CommonComponents/OrderInfoCard';

// import DrinkShop from 'assets/shop/drink_shop.svg';
import MealShop from 'assets/shop/meal_shop.svg';
import './ShopOrderPage.css';

const orderList = [
  {
    id: 1,
    type: 1,
    name: '123456789',
    image: MealShop,
    date: '2025/05/28',
    price: 65,
    quantity: 1,
  },
  {
    id: 2,
    type: 0,
    name: '109550123',
    image: MealShop,
    date: '2025/05/28',
    price: 480,
    quantity: 3,
  },
  {
    id: 3,
    type: 0,
    name: '4567890rr1',
    image: MealShop,
    date: '2025/05/27',
    price: 320,
    quantity: 2,
  },
  {
    id: 4,
    type: 1,
    name: '1240ee333',
    image: MealShop,
    date: '2025/05/27',
    price: 70,
    quantity: 1,
  },
];

const ShopOrderPage = () => {
  const navigate = useNavigate();

  const handleClick = (orderId: number) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div>
      <div id="shop-order-page">
        <div className="content">
          {orderList.map((order) => (
            <div key={order.id} onClick={() => handleClick(order.id)} style={{ cursor: 'pointer' }}>
              <OrderInfoCard
                type={order.type as 0 | 1}
                name={order.name}
                image={order.image}
                date={order.date}
                price={order.price}
                quantity={order.quantity}
              />
            </div>
          ))}
        </div>
      </div>
      <FooterShop />
    </div>
  );
};

export default ShopOrderPage;
