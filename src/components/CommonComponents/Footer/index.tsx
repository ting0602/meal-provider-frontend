// src/components/Footer/Footer.tsx
import React, { useState, useEffect } from 'react'
import { BottomNavigation, BottomNavigationAction } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import { useLocation, useNavigate } from 'react-router-dom'

import avatar1 from 'assets/avatar/Avatar1.svg'
import avatar2 from 'assets/avatar/Avatar2.svg'
import avatar3 from 'assets/avatar/Avatar3.svg'
import avatar4 from 'assets/avatar/Avatar4.svg'

import './Footer.css'

const avatarImages = [avatar1, avatar2, avatar3, avatar4]

interface FooterProps {
  /** Index of avatar image (0–3) */
  avatarIndex: number
}

const Footer: React.FC<FooterProps> = ({ avatarIndex }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { label: '首頁', icon: <HomeIcon className="footer-icon" />, path: '/home' },
    { label: '訂單', icon: <ReceiptLongIcon className="footer-icon" />, path: '/order' },
    {
      label: '帳號',
      icon: (
        <img
          src={avatarImages[avatarIndex]}
          alt="帳號"
          className="avatar-icon"
        />
      ),
      path: '/account',
    },
  ]

  // Determine which tab is active based on current path
  const currentIndex = navItems.findIndex(item =>
    location.pathname.startsWith(item.path)
  )
  const [value, setValue] = useState(currentIndex >= 0 ? currentIndex : 0)

  // Sync value with location changes
  useEffect(() => {
    if (currentIndex !== value) {
      setValue(currentIndex >= 0 ? currentIndex : 0)
    }
  }, [location.pathname, currentIndex, value])

  return (
    <div id="footer">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          setValue(newValue)
          navigate(navItems[newValue].path)
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
  )
}

export default Footer
