import Footer from 'components/CommonComponents/Footer';
import OrderInfoCard from 'components/CommonComponents/OrderInfoCard';

import DrinkShop from 'assets/shop/drink_shop.svg';
import MealShop from 'assets/shop/meal_shop.svg';
import './OrderPage.css';

const orderList = [
  {
    id: 1,
    type: 1,
    name: 'magic juice',
    image: DrinkShop,
    date: '2025/05/28',
    price: 65,
    quantity: 1,
  },
  {
    id: 2,
    type: 0,
    name: 'noodle paradise',
    image: MealShop,
    date: '2025/05/28',
    price: 480,
    quantity: 3,
  },
  {
    id: 3,
    type: 0,
    name: '胖胖豬韓式拌飯',
    image: MealShop,
    date: '2025/05/27',
    price: 320,
    quantity: 2,
  },
  {
    id: 4,
    type: 1,
    name: '蜂蜜檸檬茶',
    image: DrinkShop,
    date: '2025/05/27',
    price: 70,
    quantity: 1,
  },
    {
    id: 4,
    type: 1,
    name: '蜂蜜檸檬茶',
    image: DrinkShop,
    date: '2025/05/27',
    price: 70,
    quantity: 1,
  },
    {
    id: 4,
    type: 1,
    name: '蜂蜜檸檬茶',
    image: DrinkShop,
    date: '2025/05/27',
    price: 70,
    quantity: 1,
  },
    {
    id: 4,
    type: 1,
    name: '蜂蜜檸檬茶',
    image: DrinkShop,
    date: '2025/05/27',
    price: 70,
    quantity: 1,
  },
];

const OrderPage = () => {
  return (
    <div>
      <div id="order-page">
        <div className="content">
          {orderList.map((order) => (
            <OrderInfoCard
              key={order.id}
              type={order.type as 0 | 1}
              name={order.name}
              image={order.image}
              date={order.date}
              price={order.price}
              quantity={order.quantity}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderPage;
