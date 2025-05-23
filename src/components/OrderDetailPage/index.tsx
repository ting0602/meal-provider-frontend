import { useParams } from 'react-router-dom';
import './OrderDetailPage.css';
import BackHeader from 'components/CommonComponents/BackHeader';
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

const mockOrders: Record<string, OrderItem[]> = {
  '1': [
    { name: '好韓好韓韓式拌飯', quantity: 1, price: 180 },
    { name: '好好韓韓式拌飯', quantity: 2, price: 360 },
  ],
  '2': [
    { name: '水果派對', quantity: 1, price: 70 },
    { name: '木果奶奶', quantity: 2, price: 85 },
  ],
  // # TODO: Replace mock data with API call using orderId
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const orderItems = mockOrders[orderId || '1'] || [];
  const totalPrice = orderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <BackHeader description='訂單紀錄' />
      <div id="order-detail-page">
        {/* <div className="header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="medium" />
          </button>
          <h2 className="title">訂單紀錄</h2>
        </div> */}

        <div className="order-list">
          {orderItems.map((item, index) => (
            <div key={index} className="order-row">
              <div className="item-name">{item.name} x{item.quantity}</div>
              <div className="item-price">${item.price}</div>
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
