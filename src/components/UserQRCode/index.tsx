// components/UserQRCode.tsx
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';

import BackHeader from 'components/CommonComponents/BackHeader';
import car from 'assets/car1.svg'
import av1 from 'assets/checkoutbottom/Avatar1.svg'
import av2 from 'assets/checkoutbottom/Avatar2.svg'
import av3 from 'assets/checkoutbottom/Avatar3.svg'
import av4 from 'assets/checkoutbottom/Avatar4.svg'
import './UserQRCode.css';

const UserQRCode = () => {
  const location = useLocation();
  const { totalPrice, cartItems, orderId } = location.state || {};
  const fakeUserId = 'user_123456';

  // ➕ 根據有沒有 orderId 決定 QRCode 的內容
  const qrData = orderId
    ? JSON.stringify({ userId: fakeUserId, orderId }) // ✔ 用戶已點餐
    : JSON.stringify({ userId: fakeUserId });          // ✔ 用戶尚未點餐

  return (
    <div>
      <BackHeader description="結帳" />
      <div id="pay-page">
        <div className="dollars-bar">
          <img src={car} alt="Cart" className="cart-icon" />
          ${totalPrice}
        </div>

        <div id="user-qrcode">
          <QRCodeSVG value={qrData} size={210} />
          <div className="userid">{fakeUserId}</div>
          {orderId && <div className="orderid">訂單編號：{orderId}</div>}
        </div>

        <div className="footer-images">
          <img src={av1} alt="step 1" />
          <img src={av2} alt="step 2" />
          <img src={av3} alt="step 3" />
          <img src={av4} alt="step 4" />
        </div>
      </div>
    </div>
  );
};


export default UserQRCode;
