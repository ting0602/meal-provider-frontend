import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QrCodeScanner.css';

const QrCodeScanner = () => {
  const qrRegionId = 'qr-reader';
  const qrRef = useRef<Html5Qrcode | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // 確認是否允許權限
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach(track => track.stop()); // 先關閉臨時相機串流
        setPermissionGranted(true);
      })
      .catch((err) => {
        setError('請允許相機使用權限才能開始掃描');
      });
  }, []);

  useEffect(() => {
    if (!permissionGranted) return;

    const qrScanner = new Html5Qrcode(qrRegionId);
    qrRef.current = qrScanner;

    qrScanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 400, aspectRatio: 1.0 },
        (decodedText) => {
          try {
            const parsed = JSON.parse(decodedText);
            if (parsed.userId) {
              setUserId(parsed.userId);
              qrScanner.stop();
            } else {
              setError('找不到 userId');
            }
          } catch {
            setError('QRCode 資料格式錯誤');
          }
        },
        (scanErr) => {
          console.log('掃描進行中', scanErr);
        }
      )
      .catch((err) => {
        setError('掃描器啟動失敗：' + err.message);
      });

    return () => {
      qrScanner.stop().catch(() => {});
    };
  }, [permissionGranted]);

  return (
    <div className="qr-container">
      <h2>請掃描使用者 QRCode</h2>

      {!permissionGranted && !error && <p>請允許相機使用權限...</p>}

      <div id={qrRegionId} />

      {userId && (
        <div>
          <h3>掃到的使用者 ID：</h3>
          <p>{userId}</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button className="cancel-button" onClick={() => window.history.back()}>
        取消
      </button>
    </div>
  );

};

export default QrCodeScanner;
