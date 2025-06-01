// src/pages/OrderPage.tsx
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";

import Footer from "components/CommonComponents/Footer";
import OrderInfoCard from "components/CommonComponents/OrderInfoCard";

// import DrinkShop from "assets/shop/drink_shop.svg";
// import MealShop from "assets/shop/meal_shop.svg";

import { useAuth } from "provider/AuthProvider";
import { useGetOrdersByUser } from "hooks/useOrder";
import { useGetUserById } from "hooks/useUser";
import { getShopById, Shop } from "api/Shop";
import { formatTime } from "utils";

import "./OrderPage.css";

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: user } = useGetUserById(userId!)
  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useGetOrdersByUser(userId!)
  

  const uniqueShopIds = useMemo(() => {
    const idSet = new Set<string>();
    for (const o of orders) {
      if (o.shopId) {
        idSet.add(o.shopId);
      }
    }
    return Array.from(idSet);
  }, [orders]);

  const shopQueries = useQueries({
    queries: uniqueShopIds.map((shopId) => ({
      queryKey: ["shop", shopId],
      queryFn: () => getShopById(shopId),
      enabled: !!shopId,
    })),
  });

  const shopDataMap = useMemo(() => {
    const map: Record<string, Shop> = {};
    shopQueries.forEach((q, idx) => {
      if (q.data) {
        map[uniqueShopIds[idx]] = q.data;
      }
    });
    return map;
  }, [shopQueries, uniqueShopIds]);

  const shopsLoading = shopQueries.some((q) => q.isLoading);
  const shopsError = shopQueries.some((q) => q.isError);

  const orderCards = useMemo(() => {
    const sortedOrders = [...orders].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return sortedOrders.map((order) => {
      const shopData = shopDataMap[order.shopId] || ({} as Shop);

      const totalQuantity = order.meals.reduce(
        (acc: number, meal) => acc + meal.quantity,
        0
      );

      const shopType = shopData.type;

      const imageSrc = (shopData.image as string) || "";
      // const imageSrc = rawImage || (shopType === 1 ? DrinkShop : MealShop);

      const dateStr = formatTime(order.createdAt);

      return {
        id: order.id,
        type: shopType as 0 | 1,
        name: shopData.name || "未知店家",
        image: imageSrc,
        date: dateStr,
        price: order.totalPrice,
        quantity: totalQuantity,
      };
    });
  }, [orders, shopDataMap]);

  if (ordersLoading || shopsLoading) {
    return <div className="order-page-loading">Loading orders…</div>;
  }
  if (ordersError || shopsError) {
    return <div className="order-page-error">Failed to load your orders.</div>;
  }

  const handleClick = (orderId: string) => {
    const selectedOrder = orders.find((o) => o.id === orderId);
    if (!selectedOrder) return;

    const shop = shopDataMap[selectedOrder.shopId] || {};

    navigate(`/order/${orderId}`, {
      state: {
        order: selectedOrder,
        shop,
      },
    });
  };

  return (
    <div id="order-page">
      <div className="content">
        {orderCards.map((o) => (
          <div
            key={o.id}
            onClick={() => handleClick(o.id)}
            style={{ cursor: "pointer" }}
          >
            <OrderInfoCard
              type={o.type}
              name={o.name}
              image={o.image}
              date={o.date}
              price={o.price}
              quantity={o.quantity}
            />
          </div>
        ))}
      </div>
      <Footer avatarIndex={user?.head_sticker ?? 0} />
    </div>
  );
};

export default OrderPage;
