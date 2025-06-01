// src/pages/OrderDetailPage.tsx
import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderById } from 'hooks/useOrder'
import './OrderDetailPage.css'
import BackHeader from 'components/CommonComponents/BackHeader'

interface OrderItem {
  name: string
  quantity: number
  price: number
}

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>()
  const {
    data: order,
    isLoading,
    isError,
  } = useGetOrderById(orderId || '')

  if (isLoading) {
    return <div className="order-detail-loading">Loading order…</div>
  }
  if (isError || !order) {
    return <div className="order-detail-error">Failed to load order.</div>
  }

  const meals: OrderItem[] = order.meals.map((m) => ({
    name: m.name,
    quantity: m.quantity,
    price: m.price,
  }))
  const totalPrice = order.totalPrice

  return (
    <div id="order-detail-layout">
      <BackHeader description="訂單紀錄" />
      <div id="order-detail-page">
        <div className="order-list">
          {meals.map((item, index) => (
            <div key={index} className="order-row">
              <div className="item-name">
                {item.name} x{item.quantity}
              </div>
              <div className="item-price">${item.price}</div>
            </div>
          ))}
        </div>

        <div className="total-bar">
          <div className="total-label">總計金額：</div>
          <div className="total-value">${totalPrice}</div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailPage
