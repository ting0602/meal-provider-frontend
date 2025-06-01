// src/components/Meal.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import './Meal.css'
import PlusIcon from 'assets/meal/plus.svg'
import MinusIcon from 'assets/meal/minus.svg'
import NoImg from 'assets/default-image.png'
import { MenuItem } from 'types/meal'

type MealProps = {
  meal: MenuItem
  onQuantityChange?: (meal: MenuItem, quantity: number) => void
  initialQuantity?: number
  readOnly?: boolean
  showQuantityControl?: boolean
  editable?: boolean
}

const Meal: React.FC<MealProps> = ({
  meal,
  onQuantityChange,
  initialQuantity = 0,
  readOnly = false,
  showQuantityControl = true,
  editable = false,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity)
  const navigate = useNavigate()
  const fallbackSrc = meal.imageUrl || NoImg
  const [currentSrc, setCurrentSrc] = useState(fallbackSrc)

  const handleAdd = () => {
    if (readOnly) return
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    onQuantityChange?.(meal, newQuantity)
  }

  const handleRemove = () => {
    if (readOnly || quantity === 0) return
    const newQuantity = quantity - 1
    setQuantity(newQuantity)
    onQuantityChange?.(meal, newQuantity)
  }

  const handleEdit = () => {
    navigate('/modify-meal', { state: { meal } })
  }

  return (
    <div id="meal-card">
      <div className="meal-content">
        <div className="meal-image-wrapper">
          <div className="meal-image-background">
            <img
              src={currentSrc}
              alt={meal.name}
              onError={() => {
                if (currentSrc !== NoImg) {
                  setCurrentSrc(NoImg)
                }
              }}
              className="meal-image"
            />
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

            <div className="meal-action-area">
              {editable ? (
                <button className="edit-button" onClick={handleEdit}>
                  修改
                </button>
              ) : showQuantityControl ? (
                <div className="quantity-control-wrapper">
                  <div className="quantity-button" onClick={handleRemove}>
                    <img
                      src={MinusIcon}
                      alt="減少"
                      className="quantity-icon"
                      loading="lazy"
                    />
                  </div>
                  <div className="quantity-display-box">{quantity}</div>
                  <div className="quantity-button" onClick={handleAdd}>
                    <img
                      src={PlusIcon}
                      alt="增加"
                      className="quantity-icon"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Meal
