import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import avatar1 from 'assets/avatar/Avatar1.svg';
import avatar2 from 'assets/avatar/Avatar2.svg';
import avatar3 from 'assets/avatar/Avatar3.svg';
import avatar4 from 'assets/avatar/Avatar4.svg';

import './FooterShop.css';

const avatarImages = [avatar1, avatar2, avatar3, avatar4];

const FooterShop = () => {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // # TODO: {Fetch avatar index from backend}
    setAvatarIndex(1);
  }, []);

  const navItems = [
    { label: '訂單', icon: <ReceiptLongIcon className="footer-icon" />, path: '/shop-order' },
    { label: '掃描', icon: <QrCodeScannerIcon className="footer-icon" />, path: '/scanner' },
    { label: '帳號', icon: <img src={avatarImages[avatarIndex]} alt="帳號" className="avatar-icon" />, path: '/shop-account' }
  ];

  const currentIndex = navItems.findIndex(item => location.pathname.startsWith(item.path));
  const [value, setValue] = useState(currentIndex >= 0 ? currentIndex : 0);

useEffect(() => {
  if (currentIndex !== value) {
    setValue(currentIndex);
  }
}, [location.pathname, currentIndex, value]);

  return (
    <div id="footer">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(navItems[newValue].path);
        }}
        className="footer-nav"
      >
        {navItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
            className="footer-action"
          />
        ))}
      </BottomNavigation>
    </div>
  );
};

export default FooterShop;
