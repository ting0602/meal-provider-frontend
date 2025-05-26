import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import PaymentResult from 'components/CommonComponents/PaymentResult';
import './QrCodeScanner.css';

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
          { fps: 10, qrbox: 250, aspectRatio: 1.0 },
          async (decodedText) => {
            if (scanCompleted) return;
            setScanCompleted(true);

            try {
              const parsed = JSON.parse(decodedText);
              if (parsed.userId && !parsed.orderId) {
                await safeStopScanner();
                navigate(`/menu?userId=${parsed.userId}`);
              } else if (parsed.userId && parsed.orderId) {
                await safeStopScanner();
                navigate('/checkorder', {
                  state: { userId: parsed.userId, orderId: parsed.orderId },
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
