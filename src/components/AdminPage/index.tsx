// src/pages/AdminPage.tsx
import React, { useState, useMemo, useEffect } from 'react'
import { IconButton, TextField, Button } from '@mui/material'
import {
  ArrowBackIosNew as ArrowBack,
  ArrowForwardIos as ArrowForward,
  Search as SearchIcon,
  NotificationsActive as NotifyIcon,
} from '@mui/icons-material'
import { useAllUsersMonthlyTotals } from 'hooks/useUser'
import './AdminPage.css'


const AdminPage: React.FC = () => {
  const today = new Date()
  const year = today.getFullYear()
  const MIN_MONTH = 1
  const MAX_MONTH = today.getMonth() + 1
  // default to current month:
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [search, setSearch] = useState('')

  // pull back totals for every user in this month
  const { data: totals, isLoading, isError } =
    useAllUsersMonthlyTotals(year, month)

  // 只依赖 year、month、totals，就不会因为 today 是新对象而误触发
  useEffect(() => {
    console.log(year, month)
    console.log(`Fetched totals for ${year}-${month}:`, totals)
  }, [year, month, totals])
  // decorate with `paid` boolean
  const enriched = useMemo(
    () =>
      totals.map((u) => ({
        ...u,
        paid: u.total >= 0,
      })),
    [totals]
  )

  // apply search + paid/unpaid filters
  const filtered = useMemo(
    () =>
      enriched.filter((item) => {
        const matchSearch = item.employeeId
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchFilter =
          filter === 'all' ||
          (filter === 'paid' && item.paid) ||
          (filter === 'unpaid' && !item.paid)
        return matchSearch && matchFilter
      }),
    [enriched, search, filter]
  )

  // clamp month between 1 and 12
  const changeMonth = (delta: number) =>
    setMonth((m) => Math.max(MIN_MONTH, Math.min(MAX_MONTH, m + delta)))

  if (isLoading) return <div>Loading…</div>
  if (isError) return <div>Failed to load data</div>

  return (
    <div className="admin-container">
      <div className="month-header">
        <IconButton
          onClick={() => changeMonth(-1)}
          style={{ visibility: month > MIN_MONTH ? 'visible' : 'hidden' }}
        >
          <ArrowBack />
        </IconButton>
        <h2 className="month-title">{month} 月</h2>
        <IconButton
          onClick={() => changeMonth(1)}
          style={{ visibility: month < MAX_MONTH ? 'visible' : 'hidden' }}
        >
          <ArrowForward />
        </IconButton>
      </div>

      <div className="search-bar">
        <TextField
          variant="outlined"
          size="small"
          placeholder="搜尋員工 ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <SearchIcon /> }}
          fullWidth
        />
      </div>

      <div className="filter-buttons">
        <button
          className={filter === 'unpaid' ? 'active' : ''}
          onClick={() =>
            setFilter((f) => (f === 'unpaid' ? 'all' : 'unpaid'))
          }
        >
          未支付
        </button>
        <button
          className={filter === 'paid' ? 'active' : ''}
          onClick={() => setFilter((f) => (f === 'paid' ? 'all' : 'paid'))}
        >
          已支付
        </button>
      </div>

      <div className="card-list">
        {filtered.map((item) => (
          <div
            key={item.userId}
            className={`card ${item.paid ? 'paid' : 'unpaid'}`}
          >
            <div className="label">{item.employeeId}</div>
            <div className="amount">${item.total}</div>
            <div className="status">{item.paid ? '已支付' : '未支付'}</div>
          </div>
        ))}
      </div>

      <div className="notify-button">
        <Button variant="contained" startIcon={<NotifyIcon />}>
          一鍵通知
        </Button>
      </div>
    </div>
  )
}

export default AdminPage
