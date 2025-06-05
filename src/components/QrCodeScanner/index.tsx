import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import PaymentResult from 'components/CommonComponents/PaymentResult';
import './QrCodeScanner.css';

import { useGetOrderById } from 'hooks/useOrder';
import { MenuItem } from 'types/meal';

const QrCodeScanner = () => {
  const qrRegionId = 'qr-reader';
  const qrRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        setPermissionGranted(true);
      })
      .catch(() => {
        setError('請允許相機使用權限才能開始掃描');
      });
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const scanner = new Html5Qrcode(qrRegionId);
    qrRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 20, qrbox: 250, aspectRatio: 1.0 },
          async (decodedText) => {
            if (scanCompleted) return;
            setScanCompleted(true);

            try {
              //console.log("掃描到的文字：", decodedText);
              const parsed = JSON.parse(decodedText);
              //console.log("掃描到的user：", parsed.userId);
              //console.log("掃描到的order：", parsed.orderId);
              //const res = await fetch(`/api/orders/${parsed.orderId}`);
              //console.log('fetch 回傳狀態：', res.status);
              if (parsed.userId && parsed.orderId) {
                await safeStopScanner();
                //const order = useGetOrderById(parsed.orderId)
                //const order = await fetch(`/api/orders/${parsed.orderId}`).then((res) => res.json());
                //console.log('fetch 回傳狀態：', order.status);
                /*
                const cartItems = order.items.map((item: any) => ({
                  item: {
                    id: item.meal.id,
                    name: item.meal.name,
                    price: item.meal.price,
                    imageUrl: item.meal.picture ?? '',
                    category: [], // optional: 可根據需要補上分類資訊
                    likeCount: item.meal.likes,
                    dislikeCount: item.meal.dislikes,
                  } as MenuItem,
                  quantity: item.quantity,
                }));
                */
                navigate('/checkorder', {
                  state: { buyerId: parsed.userId, orderId: parsed.orderId },
                });
              } else if (parsed.userId && !parsed.orderId) {
                await safeStopScanner();
                navigate(`/posmenu`, {
                  state: { buyerId: parsed.userId },
                });
              } else {
                setError('QRCode 缺少 userId 或 orderId');
                setScanCompleted(false);
              }
            } catch {
              setError('QRCode 格式錯誤，請確認為 JSON 格式');
              setScanCompleted(false);
            }
          },
          (scanErr) => {
            const silentErrors = ['NotFoundException', 'IndexSizeError', 'InvalidStateError'];
            const errMsg = String(scanErr);
            if (!silentErrors.some(e => errMsg.includes(e))) {
              console.log('掃描進行中錯誤：', scanErr);
            }
          }
        );
      } catch (err: any) {
        const msg = err?.message || String(err);
        setError('掃描器啟動失敗：' + msg);
      }
    };

    const safeStopScanner = async () => {
      const state = scanner.getState?.();
      if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
        try {
          await scanner.stop();
          await scanner.clear();
        } catch (err) {
          console.warn('scanner 停止或清除失敗：', err);
        }
      }
    };

    startScanner();

    return () => {
      safeStopScanner().catch(() => {});
    };
  }, [permissionGranted, scanCompleted, navigate]);

  return (
    <div className="qr-container">
      <h2>請掃描使用者 QR Code</h2>

      {!permissionGranted && !error && <p>請允許相機使用權限...</p>}
      <div id="qr-reader" />

      {error && (
        <div className="error-message">
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => window.location.reload()}>重新掃描</button>
        </div>
      )}

      <button className="cancel-button" onClick={() => window.history.back()}>
        取消
      </button>

      {showResult && (
        <PaymentResult
          success={true}
          amount={250}
          timestamp={'2025/06/05 14:30'}
          shopName={'胖胖豬韓式拌飯'}
          onClose={() => {
            setShowResult(false);
            navigate('/home');
          }}
        />
      )}
    </div>
  );
};

export default QrCodeScanner;
