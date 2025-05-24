import { useState } from 'react';
import { Rating, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import MascotDog from 'assets/mascots/mascot_dog.svg';
import MascotRat from 'assets/mascots/mascot_rat.svg';

import './ShopScoreCard.css';

interface ShopScoreCardProps {
  shop: {
    type: number;
    name: string;
    image?: string;
    rating: number;
  };
  time: string;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

const ShopScoreCard = ({ shop, time, onClose, onSubmit }: ShopScoreCardProps) => {
  const [score, setScore] = useState<number | null>(5);

  return (
    <div className="score-overlay">
        <div className="score-modal">
        <IconButton className="close-button" onClick={onClose}>
            <CloseIcon className="close-icon" />
        </IconButton>

        <div className="modal-title">為店家評分</div>

        <ShopInfoCard {...shop} />
        <div className="score-time">{time}</div>

        <Rating
            value={score}
            onChange={(_, newValue) => setScore(newValue)}
            size="large"
            style={{ margin: '0.5rem' }}
        />

        <button
            className="submit-score-button"
              onClick={() => {
                if (score) {
                onSubmit(score);
                onClose();
                }
            }}
        >
            送出
        </button>

        <div className="mascots">
            <img src={MascotDog} alt="mascot dog" />
            <img src={MascotRat} alt="mascot rat" />
        </div>
        </div>

    </div>
  );
};

export default ShopScoreCard;
