import React, { useState } from 'react';
import './Meal.css';

import PlusIcon from 'assets/meal/plus.svg';
import MinusIcon from 'assets/meal/minus.svg';
import mealsvg from 'assets/meal/meal.svg';
type MealData = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: Array<'推薦' | '主食' | '副餐' | '其他'>;
};

type MealProps = {
    meal: MealData;
    onQuantityChange: (meal: MealData, quantity: number) => void;
};

const Meal: React.FC<MealProps> = ({ meal, onQuantityChange }) => {
    const [quantity, setQuantity] = useState(0);

    const handleAdd = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange(meal, newQuantity);
    };

    const handleRemove = () => {
        if (quantity === 0) return;
        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        onQuantityChange(meal, newQuantity);
    };

    return (
        <div id="meal-card">
            <div className="meal-content">
                <div className="meal-image-wrapper">
                    <div className="meal-image-background">
                        <img src={mealsvg} alt={meal.name} className="meal-image" />
                        {/*<img src={meal.imageUrl} alt={meal.name} className="meal-image" />*/}
                    </div>
                </div>
                
                <div className="meal-info">
                    <div className="meal-name">{meal.name}</div>
                    <div className='meal-group'>
                        <div className="meal-price">${meal.price}</div>  
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