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
import { User, getUserById } from 'api/User'                      // Import base fetch function
import { fetchUserMonthlyOrders } from 'api/User'                 // Import base fetch function
import { useQueries } from '@tanstack/react-query'
import emailjs from '@emailjs/browser'
import './AdminPage.css'

const AdminPage: React.FC = () => {
  const today = new Date()
  const year = today.getFullYear()
  const MIN_MONTH = 1
  const MAX_MONTH = today.getMonth() + 1

  const [month, setMonth] = useState(today.getMonth() + 1)
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [search, setSearch] = useState('')

  // 1. Fetch all users' totals for the current month
  const { data: totals = [], isLoading, isError } =
    useAllUsersMonthlyTotals(year, month)

  // 2. Decorate with a paid flag
  const enriched = useMemo(
    () =>
      totals.map((u) => ({
        userId: u.userId,
        employeeId: u.employeeId,
        total: u.total,
        paid: u.total <= 0, // Adjust condition if total <= 0 means paid
      })),
    [totals]
  )

  // 3. Apply search and paid/unpaid filters
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

  // 4. Build array of all unpaid users
  const unpaidUsers = useMemo(
    () => enriched.filter((u) => !u.paid),
    [enriched]
  )

  // 5. Fetch full user info for each unpaid user
  const userInfoQueries = useQueries({
    queries: unpaidUsers.map((u) => ({
      queryKey: ['user', u.userId],
      queryFn: () => getUserById(u.userId),
      enabled: !!u.userId,
      retry: false,                // Do not retry on any error
      refetchOnWindowFocus: false, // Do not refetch on window focus
    })),
  })

  // 6. Fetch each unpaid user's monthly orders
  const ordersQueries = useQueries({
    queries: unpaidUsers.map((u) => ({
      queryKey: ['userMonthlyOrders', u.userId, year, month],
      queryFn: () => fetchUserMonthlyOrders(u.userId, year, month),
      enabled: !!u.userId && u.total !== 0, // Only fetch if total != 0
      retry: false,
      refetchOnWindowFocus: false,
    })),
  })

  // 7. Combine loading/error states
  const isLoadingExtra =
    userInfoQueries.some((q) => q.isLoading) ||
    ordersQueries.some((q) => q.isLoading)
  const isErrorExtra =
    userInfoQueries.some((q) => q.isError) ||
    ordersQueries.some((q) => q.isError)

  // 8. Initialize EmailJS
  useEffect(() => {
    const userID = process.env.REACT_APP_EMAILJS_USER_ID || ''
    if (!userID) {
      console.warn('[EmailJS] REACT_APP_EMAILJS_USER_ID not found, please check .env')
    } else {
      emailjs.init(userID)
      console.log('[EmailJS] Initialized successfully, User ID:', userID)
    }
  }, [])

  // 9. Handle "Notify All" button click
  const sendNotifications = async () => {
    if (unpaidUsers.length === 0) {
      alert('目前沒有未付款的使用者。')
      return
    }
    // If user info or orders are still loading, do not proceed
    if (isLoadingExtra) {
      alert('資料尚在載入中，請稍候再按「一鍵通知」。')
      return
    }
    // If any fetch resulted in error, stop
    if (isErrorExtra) {
      alert('載入使用者或訂單資料時發生錯誤，請先確保所有資料正常。')
      return
    }

    const promises: Promise<any>[] = []
    unpaidUsers.forEach((u, idx) => {
      // Retrieve userInfo and ordersArray from queries
      const userInfo = userInfoQueries[idx].data as User
      const ordersArray = ordersQueries[idx]
        .data as Array<{
        shopName: string
        meals: Array<{ name: string; price: number; quantity: number }>
      }>

      if (!userInfo || !ordersArray) {
        console.warn(`Skip User: ${idx}`)
        return
      }


      const toEmail = userInfo.account
      const orders = ordersArray

      // Convert orders to plain text (could be formatted as HTML instead)
      let detailText = ''
      if (orders.length === 0) {
        detailText = '當月無任何訂單紀錄。'
      } else {
        orders.forEach((o) => {
          detailText += `● [${o.shopName}]\n`
          o.meals.forEach((m) => {
            detailText += `   – ${m.name} x ${m.quantity} (單價 ${m.price} 元)\n`
          })
          detailText += '\n'
        })
      }

      // Prepare template parameters for EmailJS
      const templateParams = {
        to_email: toEmail,                    // Recipient field in the template
        employee_id: u.employeeId,            // {{employee_id}} in template
        year: year.toString(),                // {{year}} in template
        month: month.toString(),              // {{month}} in template
        amount: Math.abs(u.total).toString(), // {{amount}} in template
        order_details: detailText,            // {{order_details}} in template
      }

      console.log('[EmailJS] templateParams for userId=', u.userId, templateParams)

      const serviceID = process.env.REACT_APP_EMAILJS_SERVICE_ID || ''
      const templateID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || ''
      if (!serviceID || !templateID) {
        alert('請先確認 REACT_APP_EMAILJS_SERVICE_ID 及 REACT_APP_EMAILJS_TEMPLATE_ID 已設置於 .env')
        console.log(process.env)
        return
      }
      // FIXME: uncomment it to call EmailJS
      // Call EmailJS to send email
      // const p = emailjs
      //   .send(serviceID, templateID, templateParams)
      //   .then((res) => {
      //     console.log(`Email sent to ${u.employeeId} (${toEmail}):`, res.text)
      //   })
      //   .catch((err) => {
      //     console.error(`Failed to send to ${u.employeeId} (${toEmail}):`, err.text ?? err)
      //   })
      // promises.push(p)
    })

    try {
      await Promise.all(promises)
      alert(`已嘗試向 ${unpaidUsers.length} 位未付款使用者寄送通知信！`)
    } catch {
      alert('部分通知信寄送失敗，請檢查 Console。')
    }
  }

  if (isLoading) return <div>Loading…</div>
  if (isError) return <div>載入資料失敗</div>
  if (isErrorExtra) return <div>載入使用者詳細資料失敗，請稍後再試。</div>

  return (
    <div className="admin-container">
      <div className="month-header">
        <IconButton
          onClick={() => setMonth((m) => Math.max(MIN_MONTH, m - 1))}
          style={{ visibility: month > MIN_MONTH ? 'visible' : 'hidden' }}
        >
          <ArrowBack />
        </IconButton>
        <h2 className="month-title">{month} 月</h2>
        <IconButton
          onClick={() => setMonth((m) => Math.min(MAX_MONTH, m + 1))}
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
        <Button
          variant="contained"
          startIcon={<NotifyIcon />}
          onClick={sendNotifications}
          disabled={isLoadingExtra} // Disable button if data isn't ready
        >
          一鍵通知
        </Button>
        {isLoadingExtra && (
          <div style={{ marginTop: '8px', color: '#666' }}>
            正在準備 Email 及訂單資料，請稍候……
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
