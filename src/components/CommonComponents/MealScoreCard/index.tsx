import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import Meal from 'components/CommonComponents/Meal';
import MascotDog from 'assets/mascots/mascot_dog.svg';
import MascotRat from 'assets/mascots/mascot_rat.svg';
import MascotRabbit from 'assets/mascots/mascot_rabbit.svg'
import MascotCat from 'assets/mascots/mascot_cat.svg'

import { MenuItem } from 'types/meal';
import { formatTime } from 'utils';

import './MealScoreCard.css';

interface MealScoreCardProps {
  meal: MenuItem;
  time: string;
  onClose: () => void;
  onSubmit: (score: 1 | -1) => void; // 1 = like, -1 = dislike
}

const MealScoreCard = ({ meal, time, onClose, onSubmit }: MealScoreCardProps) => {
  return (
    <div className="score-overlay">
      <div className="score-modal">
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon className="close-icon" />
        </IconButton>

        <div className="modal-title">為餐點評分</div>

        <Meal meal={meal} showQuantityControl={false} />

        <div className="score-time">{formatTime(time ?? '')}</div>

        <div className="like-buttons">
          <button className="like-button" onClick={() => onSubmit(1)}>
            <ThumbUpIcon fontSize="large" />
          </button>
          <button className="dislike-button" onClick={() => onSubmit(-1)}>
            <ThumbDownIcon fontSize="large" />
          </button>
        </div>

        <div className="mascots">
          <img src={MascotRabbit} alt="mascot rabbit" />
          <img src={MascotCat} alt="mascot cat" />
        </div>
      </div>
    </div>
  );
};

export default MealScoreCard;
