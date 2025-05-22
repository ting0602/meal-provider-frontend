import { useState, useEffect } from 'react';
import {
  Button, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import UploadIcon from '@mui/icons-material/Upload';
import { useLocation, useNavigate } from 'react-router-dom';
import MealShop from 'assets/shop/meal_shop.svg';

import './ModifyMealPage.css';

const ModifyMealPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // TODO: connect to API to fetch meal data
  /*
  const initialMeal = {
    imageUrl: '/path/to/image.jpg',
    name: '好韓好韓韓式拌飯',
    price: 180,
    category: 0,
    isRecommended: true,
  };
  
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState(initialMeal.name);
  const [price, setPrice] = useState(String(initialMeal.price));
  const [category, setCategory] = useState<number>(initialMeal.category);

  const [isRecommended, setIsRecommended] = useState(initialMeal.isRecommended);

  const navigate = useNavigate();
  */
  
  const meal = location.state?.meal;

  useEffect(() => {
    if (!meal) {
      alert('錯誤：找不到餐點資料，將返回前頁。');
      navigate(-1);
    }
  }, [meal, navigate]);

  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState(meal?.name || '');
  const [price, setPrice] = useState(String(meal?.price || ''));
  const getCategoryValue = (cats: string[]) => {
    if (cats.includes('主食')) return 0;
    if (cats.includes('副餐')) return 1;
    return 2; // 預設為其他
  };
  
  const [category, setCategory] = useState<number>(
    meal ? getCategoryValue(meal.category) : 2
  );
  const [isRecommended, setIsRecommended] = useState(
    meal?.category?.includes('推薦') || false
  );
  const isFormValid = name.trim() !== '' && price.trim() !== '' && category !== null;


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpdate = () => {
    if (!isFormValid) return;
    console.log({ image, name, price, category, isRecommended });
    // TODO: 呼叫 API 更新資料
  };

  const handleDelete = () => {
    if (window.confirm('確定要刪除這個餐點嗎？')) {
      console.log('刪除餐點');
      // TODO: 呼叫 API 刪除資料
    }
  };
  const hasChanges =
    name !== meal?.name ||
    price !== String(meal?.price) ||
    category !== (meal?.category?.[0] === '主食' ? 0 : meal?.category?.[0] === '副餐' ? 1 : 2) ||
    isRecommended !== meal?.category?.includes('推薦') ||
    image !== null;

  return (
    <div className="modify-meal-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIosNewIcon fontSize="medium" />
        </button>
        <h2 className="title">修改資訊</h2>
      </div>

      <div className='content'>
        <div className="upload-section horizontal">
          <div className='image-preview-wrapper'>
            <div className="image-preview">
              <img src={image ? URL.createObjectURL(image) : meal?.imageUrl || MealShop} alt="preview" />
            </div>
            <label htmlFor="image-upload">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageUpload}
              />
              <Button variant="contained" component="span" className="upload-button" startIcon={<UploadIcon style={{ fontSize: '1.2rem' }} />}>
                上傳圖片
              </Button>
          </label>
          </div>

          <div className="meal-info">
            <div className="meal-name">{meal?.name}</div>
            <br />
            <div className="meal-price">${meal?.price}</div>
          </div>
        </div>

        <div className='text-fields'>
          <TextField
            fullWidth
            label="商品名稱"
            variant="outlined"
            value={name}
            className="text-field"
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            label="商品售價"
            type="number"
            variant="outlined"
            value={price}
            className="text-field"
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="section">
          <div className="toggle-buttons">
            <ToggleButton
              value="recommend"
              selected={isRecommended}
              onChange={() => setIsRecommended(!isRecommended)}
              className="tag-button"
            >
              推薦
            </ToggleButton>

            <div className='category-buttons'>
                <ToggleButtonGroup
                value={category}
                exclusive
                onChange={(_, newValue) => {
                    if (newValue !== null) setCategory(newValue);
                }}
                >
                <ToggleButton value={0} className="tag-button">主食</ToggleButton>
                <ToggleButton value={1} className="tag-button">副餐</ToggleButton>
                <ToggleButton value={2} className="tag-button">其他</ToggleButton>
                </ToggleButtonGroup>

            </div>
          </div>
        </div>

        <div className="modify-button-wrapper two-buttons">
          <Button variant="contained" color="error" className="delete-button" onClick={handleDelete}>
            刪除餐點
          </Button>
          <Button
            variant="contained"
            color="success"
            className="submit-button"
            disabled={!isFormValid || !hasChanges}
            onClick={handleUpdate}
          >
            保存變更
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModifyMealPage;
