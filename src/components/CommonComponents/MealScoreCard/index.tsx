import { useState } from 'react';
import { Rating, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import Meal from 'components/CommonComponents/Meal';
import MascotDog from 'assets/mascots/mascot_dog.svg';
import MascotRat from 'assets/mascots/mascot_rat.svg';
import mealsvg from 'assets/meal/meal.svg';

import { MenuItem } from 'types/meal';

import './MealScoreCard.css';

interface MealScoreCardProps {
  time: string;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

const MealScoreCard = ({ time, onClose, onSubmit }: MealScoreCardProps) => {
  const [score, setScore] = useState<number | null>(5);

  // TODO: get data from meal api
  const fakeMeal: MenuItem = {
    id: '123',
    name: '香辣雞腿堡',
    price: 159,
    imageUrl: mealsvg,
    category: ['主食'],
    likeCount: 128,
    dislikeCount: 6,
  };

  return (
    <div className="score-overlay">
      <div className="score-modal">
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </IconButton>

        <div className="modal-title">為餐點評分</div>

        {/* ✅ 使用 readOnly 取代錯誤的 showQuantityControl */}
        <Meal meal={fakeMeal} showQuantityControl={false} />

        <div className="score-time">{time}</div>

        <Rating
          value={score}
          onChange={(_, newValue) => setScore(newValue)}
          size="large"
          style={{ margin: '0.5rem' }}
        />

        <Button
          className="submit-button"
          onClick={() => score && onSubmit(score)}
        >
          送出
        </Button>

        <div className="mascots">
          <img src={MascotDog} alt="mascot dog" />
          <img src={MascotRat} alt="mascot rat" />
        </div>
      </div>
    </div>
  );
};

export default MealScoreCard;
