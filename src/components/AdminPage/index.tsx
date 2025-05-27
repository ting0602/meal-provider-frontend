// src/pages/AdminPage.tsx
import React, { useState } from 'react';
import './AdminPage.css';

import { TextField, IconButton, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const data = [
  { employeeId: 'EMP001', amount: 3200, paid: false },
  { employeeId: 'EMP002', amount: 3600, paid: true },
  { employeeId: 'EMP003', amount: 6500, paid: false },
  { employeeId: 'EMP004', amount: 4300, paid: true },
  { employeeId: 'EMP005', amount: 3200, paid: false },
  { employeeId: 'EMP006', amount: 4400, paid: false },
  { employeeId: 'EMP007', amount: 5400, paid: false },
  { employeeId: 'EMP008', amount: 6400, paid: false },
];

const MIN_MONTH = 1;
const MAX_MONTH = 5;

const AdminPage = () => {
  const [month, setMonth] = useState(5);
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [search, setSearch] = useState('');

  const toggleFilter = (type: 'paid' | 'unpaid') => {
    setFilter((prev) => (prev === type ? 'all' : type));
  };

  const filtered = data.filter((item) => {
    const matchSearch = item.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' || (filter === 'paid' && item.paid) || (filter === 'unpaid' && !item.paid);
    return matchSearch && matchFilter;
  });

  const changeMonth = (delta: number) => {
    setMonth((prev) => {
      const next = prev + delta;
      return Math.min(MAX_MONTH, Math.max(MIN_MONTH, next));
    });
  };

  return (
    <div className="admin-container">
        <div className="month-header">
        <IconButton
            onClick={() => changeMonth(-1)}
            style={{ visibility: month > MIN_MONTH ? 'visible' : 'hidden' }}
        >
            <ArrowBackIosNewIcon />
        </IconButton>

        <h2 className="month-title">{month}月</h2>

        <IconButton
            onClick={() => changeMonth(1)}
            style={{ visibility: month < MAX_MONTH ? 'visible' : 'hidden' }}
        >
            <ArrowForwardIosIcon />
        </IconButton>
        </div>

      <div className="search-bar">
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜尋員工 ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            endAdornment: <SearchIcon />
          }}
          fullWidth
        />
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'unpaid' ? 'active' : ''}
          onClick={() => toggleFilter('unpaid')}
        >
          未支付
        </button>
        <button
          className={filter === 'paid' ? 'active' : ''}
          onClick={() => toggleFilter('paid')}
        >
          已支付
        </button>
      </div>

      <div className="card-list">
        {filtered.map((item) => (
          <div key={item.employeeId} className={`card ${item.paid ? 'paid' : 'unpaid'}`}>
            <div className="label">{item.employeeId}</div>
            <div className="amount">${item.amount}</div>
            <div className="status">{item.paid ? '已支付' : '未支付'}</div>
          </div>
        ))}
      </div>

      <div className="notify-button">
        <Button variant="contained" startIcon={<NotificationsActiveIcon />}>
          一鍵通知
        </Button>
      </div>
    </div>
  );
};

export default AdminPage;
