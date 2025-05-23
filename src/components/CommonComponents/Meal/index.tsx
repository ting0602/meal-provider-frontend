import React, { useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import './Meal.css';
import PlusIcon from 'assets/meal/plus.svg';
import MinusIcon from 'assets/meal/minus.svg';
import mealsvg from 'assets/meal/meal.svg';


import { MenuItem } from 'types/meal';

type MealProps = {
  meal: MenuItem;
  onQuantityChange?: (meal: MenuItem, quantity: number) => void;
  initialQuantity?: number;
  readOnly?: boolean;
};

const Meal: React.FC<MealProps> = ({
  meal,
  onQuantityChange,
  initialQuantity = 0,
  readOnly = false,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);


  const handleAdd = () => {
    if (readOnly) return;
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange?.(meal, newQuantity);
  };

  const handleRemove = () => {
    if (readOnly || quantity === 0) return;
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    onQuantityChange?.(meal, newQuantity);
  };

  return (
    <div id="meal-card">
      <div className="meal-content">
        <div className="meal-image-wrapper">
          <div className="meal-image-background">
            <img src={mealsvg} alt={meal.name} className="meal-image" />
            {/* <img src={meal.imageUrl} alt={meal.name} className="meal-image" /> */}
          </div>
        </div>

        <div className="meal-info">
          <div className="meal-name">{meal.name}</div>
          <div className="meal-group">
            <div className="meal-text">
              <div className="meal-price">${meal.price}</div>
              <div className="score-wrapper">
                <ThumbUpIcon className="score-icon" />
                <span className="score-count">{meal.likeCount}</span>
                <ThumbDownIcon className="score-icon" />
                <span className="score-count">{meal.dislikeCount}</span>
              </div>
            </div>
            <div id="meal-quantity-control">
              <div className="quantity-control-wrapper">
                <div className="quantity-button" onClick={handleRemove}>
                  <img src={MinusIcon} alt="減少" className="quantity-icon" />
                </div>
                <div className="quantity-display-box">{quantity}</div>
                <div className="quantity-button" onClick={handleAdd}>
                  <img src={PlusIcon} alt="增加" className="quantity-icon" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meal;