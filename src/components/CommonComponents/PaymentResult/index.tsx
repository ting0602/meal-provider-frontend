import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './PaymentResult.css';

type PaymentResultProps = {
  success: boolean;
  amount?: number;
  timestamp?: string;
  shopName?: string;
  errorType?: '支付失敗';
  onClose: () => void;
  homePath?: string;
  ordersPath?: string; 
};

const PaymentResult: React.FC<PaymentResultProps> = ({
  success,
  amount,
  timestamp,
  shopName,
  errorType,
  onClose,
  homePath,
  ordersPath,
}) => {
  const navigate = useNavigate();

  const handleHome = () => {
    onClose();
    navigate(homePath || '/home');
  };

  const handleOrders = () => {
    onClose();
    navigate(ordersPath || '/order');
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        {success ? (
          <>
            <div className="modal-title success">支付成功</div>
            <div className="modal-icon success">
              <div className="circle-border">
                <div className="amount-text">${amount}</div>
              </div>
            </div>
            <div className="modal-time-box">{timestamp}</div>
            <div className="modal-shop">
              消費店家：<span className="payment-shop-name">{shopName}</span>
            </div>
            <div className="modal-buttons two-buttons">
              <Button onClick={handleHome} className="modal-btn home">首頁</Button>
              <Button onClick={handleOrders} className="modal-btn order">訂單紀錄</Button>
            </div>
          </>
        ) : (
          <>
            <div className="modal-title fail">支付失敗</div>
            <div className="modal-icon fail">
              <CancelIcon style={{ fontSize: '9rem', color: '#F2613F' }} />
            </div>
            <div className="modal-error-box">Error: {errorType}</div>
            <div className="modal-buttons">
              <Button onClick={handleHome} className="modal-btn fail">首頁</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
