// src/components/CommonComponents/OrderInfoCard.tsx
import React, { useState } from "react";
import NoImg from "assets/default-image.png";
import "./OrderInfoCard.css";

interface OrderInfoCardProps {
  type: 0 | 1; // 0: meal, 1: dessert/drink
  name: string;
  image?: string;
  date: string;
  price: number;
  quantity: number;
}

const OrderInfoCard: React.FC<OrderInfoCardProps> = ({
  type,
  name,
  image,
  date,
  price,
  quantity,
}) => {

  const [imgSrc, setImgSrc] = useState<string | undefined>(image);

  return (
    <div className="order-item">
      <div className={`order-card ${type === 0 ? "type-meal" : "type-dessert"}`}>
        <div className="image-circle">
          <img
            src={imgSrc || NoImg}
            alt={name}
            className="order-image"
            onError={() => {
              if (imgSrc !== NoImg) {
                setImgSrc(NoImg);
              }
            }}
          />
        </div>
        <div className="order-info">
          <div className="order-title">{name}</div>
          <div className="order-date">{date}</div>
          <div className="order-detail">
            ${price} {quantity} 份餐點
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoCard;
