// src/pages/ShopOrderPage.tsx
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FooterShop from 'components/CommonComponents/FooterShop'
import OrderInfoCard from 'components/CommonComponents/OrderInfoCard'
import { useAuth } from 'provider/AuthProvider'
import { useGetUserById } from 'hooks/useUser'
import { useGetShopById } from 'hooks/useShop'
import { useGetOrdersByShop } from 'hooks/useOrder'
import { formatTime } from 'utils'
import './ShopOrderPage.css'

const ShopOrderPage: React.FC = () => {
  const navigate = useNavigate()
  const { userId } = useAuth()        // assume this is the shop's ID
  const { data: user } = useGetUserById(userId!)
  const { data: shop } = useGetShopById(user?.shopkeeper!)
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetOrdersByShop(user?.shopkeeper!)

  // Transform API orders into the shape OrderInfoCard expects
  const orderCards = useMemo(() => {
    return orders
      .slice() // create a shallow copy for sorting
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .map((order) => {
        // total number of items:
        const totalQuantity = order.meals.reduce(
          (acc: number, meal) => acc + meal.quantity,
          0
        )

        // buyer's identifier (e.g. account or ID)
        const buyerName = order.buyerId || 'Unknown Buyer'

        // format date string
        const dateStr = formatTime(order.createdAt)

        return {
          id: order.id,
          type: shop?.type as 0 | 1,             // ensure matches OrderInfoCard prop
          name: buyerName,
          image: shop?.image || '',           // if API returns shop image
          date: dateStr,
          price: order.totalPrice,
          quantity: totalQuantity,
        }
      })
  }, [orders, shop])

  if (ordersLoading) {
    return <div className="shop-order-loading">Loading orders…</div>
  }
  if (ordersError) {
    return <div className="shop-order-error">Failed to load your orders.</div>
  }

  const handleClick = (orderId: string | number) => {
    navigate(`/order/${orderId}`, {
      state: { orderId },
    })
  }

  return (
    <div id="shop-order-page">
      <div className="content">
        {orderCards.map((o) => (
          <div
            key={o.id}
            onClick={() => handleClick(o.id)}
            style={{ cursor: 'pointer' }}
          >
            <OrderInfoCard
              type={o.type}
              name={shop?.name || 'Unknown Shop'}
              image={shop?.image || ''}
              date={o.date}
              price={o.price}
              quantity={o.quantity}
            />
          </div>
        ))}
      </div>
      <FooterShop avatarIndex={user?.head_sticker ?? 0} />
    </div>
  )
}

export default ShopOrderPage
