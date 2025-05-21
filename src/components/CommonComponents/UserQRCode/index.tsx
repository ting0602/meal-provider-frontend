// components/UserQRCode.tsx
import { QRCodeSVG } from 'qrcode.react';

import './UserQRCode.css';

const UserQRCode = () => {
  // # TODO: Replace with real userId from backend
  // It will return like:
  // {"userId":"user_123456"}

  const fakeUserId = 'user_123456';

  // Optional: can add more info to the QR code data
  const qrData = JSON.stringify({
    userId: fakeUserId,
    // iat: Date.now() / 1000, // validation time
  });

  return (
    <div id='user-qrcode'>
      {/* <p>請出示此 QRCode 給店家</p> */}
      <QRCodeSVG value={qrData} size={160} />
    </div>
  );
};

export default UserQRCode;
