// components/UserQRCode.tsx
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';

import BackHeader from 'components/CommonComponents/BackHeader';
import car from 'assets/car 1.svg'
import av1 from 'assets/checkoutbottom/Avatar1.svg'
import av2 from 'assets/checkoutbottom/Avatar2.svg'
import av3 from 'assets/checkoutbottom/Avatar3.svg'
import av4 from 'assets/checkoutbottom/Avatar4.svg'
import './UserQRCode.css';

const UserQRCode = () => {
  // # TODO: Replace with real userId from backend
  // It will return like:
  // {"userId":"user_123456"}
  const location = useLocation();
  const { totalPrice, cartItems } = location.state || {};
  const fakeUserId = 'user_123456';

  // Optional: can add more info to the QR code data
  const qrData = JSON.stringify({
    userId: fakeUserId,
    // iat: Date.now() / 1000, // validation time
  });

  return (
      <div>
        <BackHeader description="結帳" />
        <div id="pay-page">
            <div className="dollars-bar">
                <img src={car} alt="Cart" className="cart-icon" />
                ${totalPrice}
            </div>

          <div id='user-qrcode'>
            {/* <p>請出示此 QRCode 給店家</p> */}
            <QRCodeSVG value={qrData} size={210} />
            <div className='userid'>{fakeUserId}</div>
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
