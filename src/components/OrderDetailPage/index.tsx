import { useLocation } from 'react-router-dom';
import './OrderDetailPage.css';
import BackHeader from 'components/CommonComponents/BackHeader';
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailState {
  order: {
    meals: OrderItem[];
    totalPrice: number;
  };
}

const OrderDetailPage = () => {
  const { state } = useLocation();

  const { meals, totalPrice } = state.order as OrderDetailState["order"];

  //const orderItems = mockOrders[orderId || '1'] || [];
  //const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div id='order-detail-layout'>
      <BackHeader description='訂單紀錄' />
      <div id="order-detail-page">
        {/* <div className="header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="medium" />
          </button>
          <h2 className="title">訂單紀錄</h2>
        </div> */}

        <div className="order-list">
          {meals.map((item, index) => (
            <div key={index} className="order-row">
              <div className="item-name">{item.name} x{item.quantity}</div>
              <div className="item-price">${item.price}</div>
              {/*<div className="item-price">${item.price * item.quantity}</div>*/}
            </div>
          ))}
        </div>

        <div className="total-bar">
          <div className="total-label">總計金額：</div>
          <div className="total-value">${totalPrice}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
