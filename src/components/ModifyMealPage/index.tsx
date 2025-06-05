// src/pages/ModifyMealPage.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHeader from 'components/CommonComponents/BackHeader';
import { useUpdateMeal, useDeleteMeal } from 'hooks/useMeal';
import { useUploadImage } from 'hooks/useUploadImage';
import { useAuth } from 'provider/AuthProvider';
import { useGetUserById } from 'hooks/useUser';
import './ModifyMealPage.css';

import NoImgPlaceholder from 'assets/default-image.png';

const ModifyMealPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data: user } = useGetUserById(userId!);

  const meal = location.state?.meal;
  const shopId = user?.shopkeeper || '';

  useEffect(() => {
    if (!meal) {
      alert('錯誤：找不到餐點資料，將返回前頁。');
      navigate(-1);
    }
  }, [meal, navigate]);


  const initialImageSrc = meal?.imageUrl || NoImgPlaceholder;
  const [currentSrc, setCurrentSrc] = useState<string>(initialImageSrc);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    upload: uploadImageToS3,
    loading: uploading,
    error: uploadError,
  } = useUploadImage();

  const [name] = useState(meal?.name || '');
  const [price, setPrice] = useState(String(meal?.price || ''));
  const getCategoryValue = (cats: string[]) => {
    if (cats.includes('主食')) return 0;
    if (cats.includes('副餐')) return 1;
    return 2;
  };
  const [category, setCategory] = useState<number>(
    meal ? getCategoryValue(meal.category) : 2
  );
  const [isRecommended, setIsRecommended] = useState(
    meal?.category?.includes('推薦') || false
  );

  const isFormValid = price.trim() !== '' && category !== null;

  const updateMealMutation = useUpdateMeal(meal!.id, shopId);
  const deleteMealMutation = useDeleteMeal();

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      const previewUrl = URL.createObjectURL(file);
      setCurrentSrc(previewUrl);
    }
  };

  const handleUpdate = async () => {
    if (!isFormValid || !meal) return;

    let finalPictureUrl = meal.imageUrl || ''; // 初始仍是旧的 imageUrl 或空串

    if (imageFile) {
      try {
        finalPictureUrl = await uploadImageToS3(imageFile);
      } catch {
        alert('圖片上傳失敗，請重新再試一次');
        return;
      }
    }

    updateMealMutation.mutate(
      {
        name: meal.name,
        price: Number(price),
        type: category,
        recommand: isRecommended,
        picture: finalPictureUrl,
        shop: meal.shop,
      },
      {
        onSuccess: () => {
          alert('更新成功！');
          navigate(-1);
        },
        onError: () => {
          alert('更新失敗，請稍後再試。');
        },
      }
    );
  };


  const handleDelete = () => {
    if (!meal) return;
    if (window.confirm('確定要刪除這個餐點嗎？')) {
      deleteMealMutation.mutate(meal.id, {
        onSuccess: () => {
          alert('刪除成功');
          navigate(-1);
        },
        onError: () => {
          alert('刪除失敗，請稍後再試。');
        },
      });
    }
  };

  const hasChanges =
    price !== String(meal?.price) ||
    category !== getCategoryValue(meal?.category || []) ||
    isRecommended !== meal?.category?.includes('推薦') ||
    imageFile !== null;

  return (
    <div>
      <BackHeader description="修改資訊" />
      <div className="modify-meal-page">
        <div className="content">
          <div className="upload-section horizontal">
            <div className="image-preview-wrapper">
              <div className="image-preview">
                <img src={currentSrc} alt="Meal Preview" />
              </div>
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
                <Button
                  variant="contained"
                  component="span"
                  className="upload-button"
                  startIcon={<UploadIcon style={{ fontSize: '1.2rem' }} />}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <CircularProgress
                        size={18}
                        color="inherit"
                        style={{ marginRight: 8 }}
                      />
                      上傳中…
                    </>
                  ) : (
                    '上傳圖片'
                  )}
                </Button>
              </label>
              {uploadError && (
                <p style={{ color: 'red', marginTop: 4 }}>
                  圖片上傳錯誤：{uploadError}
                </p>
              )}
            </div>

            <div className="meal-info">
              <div className="meal-name">{meal?.name}</div>
              <br />
              <div className="meal-price">${meal?.price}</div>
            </div>
          </div>

          <div className="text-fields">
            <TextField
              fullWidth
              label="商品名稱"
              variant="outlined"
              value={name}
              className="text-field"
              disabled
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
                onChange={() => setIsRecommended((prev: boolean) => !prev)}
                className="tag-button"
              >
                推薦
              </ToggleButton>

              <div className="category-buttons">
                <ToggleButtonGroup
                  value={category}
                  exclusive
                  onChange={(_, newValue) => {
                    if (newValue !== null) setCategory(newValue);
                  }}
                >
                  <ToggleButton value={0} className="tag-button">
                    主食
                  </ToggleButton>
                  <ToggleButton value={1} className="tag-button">
                    副餐
                  </ToggleButton>
                  <ToggleButton value={2} className="tag-button">
                    其他
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>
            </div>
          </div>

          <div className="modify-button-wrapper two-buttons">
            <button className="delete-button" onClick={handleDelete}>
              刪除餐點
            </button>
            <button
              className="submit-button"
              disabled={!isFormValid || !hasChanges}
              onClick={handleUpdate}
            >
              保存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyMealPage;
