import React from 'react';
import { useNavigate } from 'react-router-dom';

import './keepermeal.css';
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
};

const Meal: React.FC<MealProps> = ({ meal }) => {
    const navigate = useNavigate();

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
                            <button
                                className="edit-button"
                                onClick={() => navigate('/modify-meal', { state: { meal } })}
                            >
                                修改
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Meal;