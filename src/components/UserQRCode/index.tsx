// components/UserQRCode.tsx
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import { useAuth } from 'provider/AuthProvider';
import { useGetUserById, useUpdateUser } from 'hooks/useUser';
import { fetchUserLastOrderId } from 'api/User';
import { getOrderById, deleteOrder } from 'api/Order';
import { useDeleteOrder } from 'hooks/useOrder';
import BackHeader from 'components/CommonComponents/BackHeader';
import PaymentResult from 'components/CommonComponents/PaymentResult';
import car from 'assets/car1.svg'
import av1 from 'assets/checkoutbottom/Avatar1.svg'
import av2 from 'assets/checkoutbottom/Avatar2.svg'
import av3 from 'assets/checkoutbottom/Avatar3.svg'
import av4 from 'assets/checkoutbottom/Avatar4.svg'
import { formatTime } from 'utils';
import './UserQRCode.css';

const UserQRCode = () => {
  const { userId } = useAuth();
  const location = useLocation();
  const { data: user, refetch } = useGetUserById(userId!);
  const updateUser = useUpdateUser(userId!);
  const { totalPrice, cartItems, orderId } = location.state || {};
  const [showResult, setShowResult] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    success: boolean;
    amount?: number;
    timestamp?: string;
    shopName?: string;
    errorType?: string;
    homePath?: string;
    ordersPath?: string; 
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      await refetch();
      const payState = user?.pay_state;

      if (payState === 1) {
        const lastOrderId = await fetchUserLastOrderId(userId!);
        const lastOrder = await getOrderById(lastOrderId);
        setPaymentData({
          success: true,
          amount: lastOrder.totalPrice,
          timestamp: formatTime(lastOrder.createdAt),
          shopName: lastOrder.shopName,
          homePath: '/account',
          ordersPath: '/order',
        });
        setShowResult(true);

        await updateUser.mutateAsync({ id: userId!, pay_state: 0 });
      } else if (payState === 2) {
        // add 取消訂單
        const lastOrderId = await fetchUserLastOrderId(userId!);
        //const lastOrder = await getOrderById(lastOrderId);
        //await useDeleteOrder(lastOrderId);
        console.log("delete orderid：", lastOrderId);
        await deleteOrder(lastOrderId);
        
        setPaymentData({
          success: false,
          errorType: '支付失敗',
          homePath: "/account",
        });
        setShowResult(true);

        await updateUser.mutateAsync({ id: userId!, pay_state: 0 });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userId, user, refetch, updateUser]);
  // ➕ 根據有沒有 orderId 決定 QRCode 的內容
  const qrData = orderId
    ? JSON.stringify({ userId, orderId }) // ✔ 用戶已點餐
    : JSON.stringify({ userId});          // ✔ 用戶尚未點餐
  console.log('QRCode data:', qrData);
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
          <div className="userid">{user?.employeeId}</div>
          {/*orderId && <div className="orderid">訂單編號：{orderId}</div>*/}
        </div>

        <div className="footer-images">
          <img src={av1} alt="step 1" />
          <img src={av2} alt="step 2" />
          <img src={av3} alt="step 3" />
          <img src={av4} alt="step 4" />
        </div>
      </div>

      {showResult && paymentData && (
        <PaymentResult
          success={paymentData.success}
          amount={paymentData.amount}
          timestamp={paymentData.timestamp}
          shopName={paymentData.shopName}
          errorType={paymentData.errorType as '支付失敗'}
          homePath={paymentData.homePath}
          ordersPath={paymentData.ordersPath}
          onClose={() => setShowResult(false)}
        />
      )}
    </div>
  );
};


export default UserQRCode;
