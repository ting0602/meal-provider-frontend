import { useState } from 'react';
import './ShopInfoCard.css';
import StarIcon from '@mui/icons-material/Star';
import NoImg from 'assets/default-image.png';

interface ShopInfoCardProps {
  type: number; // 0 = meal, 1 = drink/dessert/else
  name: string;
  image?: string;
  rating: number;
}

const ShopInfoCard = ({ type, name, image, rating }: ShopInfoCardProps) => {
  const [imgSrc, setImgSrc] = useState(image || NoImg);

  return (
    <div className={`shop-card ${type === 0 ? 'type-meal' : 'type-dessert'}`}>
      <div className={`image-container ${type === 0 ? 'type-meal' : 'type-dessert'}`}>
        <img
          src={imgSrc}
          alt={name}
          className="shop-image"
          onError={() => setImgSrc(NoImg)}
        />
      </div>
      <div className="info-row">
        <div className="shop-name">{name}</div>
        <div className="rating">
          <StarIcon className="star-icon" />
          <span className="rating-text">{rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopInfoCard;
