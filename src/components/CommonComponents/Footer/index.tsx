import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useState, useEffect } from 'react';

import avatar1 from 'assets/avatar/Avatar1.svg';
import avatar2 from 'assets/avatar/Avatar2.svg';
import avatar3 from 'assets/avatar/Avatar3.svg';
import avatar4 from 'assets/avatar/Avatar4.svg';

import './Footer.css';

// Local avatar image array, indexed by avatar ID
const avatarImages = [avatar1, avatar2, avatar3, avatar4];

const Footer = () => {
  const [value, setValue] = useState(0);

  // Hardcoded avatar index for now
  const [avatarIndex, setAvatarIndex] = useState(0);

  useEffect(() => {
    // # TODO: {Fetch avatar index from backend API}
    // Example:
    // fetch('/api/user/profile')
    //   .then(res => res.json())
    //   .then(data => setAvatarIndex(data.avatarIndex));

    // Use hardcoded index for now
    setAvatarIndex(1);
  }, []);

  return (
    <div id="footer">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        className="footer-nav"
      >
        <BottomNavigationAction
          label="首頁"
          icon={<HomeIcon className='footer-icon'/>}
          className="footer-action"
        />
        <BottomNavigationAction
          label="訂單"
          icon={<ReceiptLongIcon className='footer-icon' />}
          className="footer-action"
        />
        <BottomNavigationAction
          label="帳號"
          icon={
            <img
              src={avatarImages[avatarIndex]}
              alt="帳號"
              className="avatar-icon"
            />
          }
          className="footer-action"
        />
      </BottomNavigation>
    </div>
  );
};

export default Footer;
