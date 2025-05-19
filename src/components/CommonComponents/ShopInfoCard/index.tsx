import './ShopInfoCard.css';
import StarIcon from '@mui/icons-material/Star';

interface ShopInfoCardProps {
  type: number; // 0 = meal, 1 = drink/dessert/else
  name: string;
  image?: string;
  rating: number;
}

const ShopInfoCard = ({ type, name, image, rating }: ShopInfoCardProps) => {
  // # TODO: {Replace hardcoded props with data from API once available}

  return (
    <div className={`shop-card ${type === 0 ? 'type-meal' : 'type-dessert'}`}>
      {/* <div className="image-container"> */}
      <div className={`image-container ${type === 0 ? 'type-meal' : 'type-dessert'}`}>
        {image ? (
          <img src={image} alt={name} className="shop-image" />
        ) : (
          <div className="placeholder" />
        )}
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
