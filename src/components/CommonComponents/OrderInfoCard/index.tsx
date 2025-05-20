import './OrderInfoCard.css';

interface OrderInfoCardProps {
  type: 0 | 1; // 0: meal, 1: dessert/drink
  name: string;
  image?: string;
  date: string;
  price: number;
  quantity: number;
}

const OrderInfoCard = ({
  type,
  name,
  image,
  date,
  price,
  quantity,
}: OrderInfoCardProps) => {
  return (
    <div className="order-item">
      <div className={`order-card ${type === 0 ? 'type-meal' : 'type-dessert'}`}>
        <div className="image-circle">
          {image ? (
            <img src={image} alt={name} className="order-image" />
          ) : (
            <div className="image-placeholder" />
          )}
        </div>
        <div className="order-info">
          <div className="order-title">{name}</div>
          <div className="order-date">{date}</div>
          <div className="order-detail">
            ${price} {quantity}份餐點
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoCard;
