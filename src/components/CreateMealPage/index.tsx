// src/pages/CreateMealPage.tsx
import React, { useState, ChangeEvent } from 'react';
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
import { useCreateMeal } from 'hooks/useMeal';
import { useUploadImage } from 'hooks/useUploadImage';
import mealsvg from 'assets/meal/meal.svg';
import './CreateMealPage.css';

const CreateMealPage: React.FC = () => {
  const location = useLocation();
  const { shopId } = (location.state as { shopId: string }) || {};
  const navigate = useNavigate();

  // 表單欄位
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [isRecommended, setIsRecommended] = useState(false);

  // 取得 uploadImage hook
  const {
    upload: uploadImageToS3,
    loading: uploading,    // <- 正在上傳到 S3
    error: uploadError,
  } = useUploadImage();

  // 取得 createMeal hook，並順便解構 isLoading
  const {
    mutate: createMeal,
    status: createStatus,   // 可能是 'idle' | 'pending' | 'error' | 'success'
    isError: isCreateError,
  } = useCreateMeal();
  // 只要狀態是 'pending'，就代表正在執行中
  const isCreating = createStatus === 'pending';

  // 圖片選擇：把 File 存到 state
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 判斷表單是否可送
  const isFormValid = !!name && !!price && category !== null;

  // 送出時：先把檔案上傳到 S3 → 拿到 URL → 再呼叫 createMeal
  const handleSubmit = async () => {
    if (!isFormValid) {
      return;
    }

    let pictureUrl = '';

    if (imageFile) {
      try {
        pictureUrl = await uploadImageToS3(imageFile);
      } catch {
        alert('圖片上傳失敗，請重新再試一次');
        return;
      }
    }

    createMeal(
      {
        name,
        price: Number(price),
        type: category!,
        recommand: isRecommended,
        shop: shopId!,
        picture: pictureUrl,
      },
      {
        onSuccess: () => {
          alert('新增成功！');
          navigate(-1);
        },
        onError: () => {
          alert('新增失敗，請稍後再試。');
        },
      }
    );
  };

  return (
    <div>
      <BackHeader description="新增餐點" />

      <div id="create-meal-page">
        <div className="create-meal-content">
          <div className="upload-section">
            <div className="image-preview-create-meal">
              {imageFile ? (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                />
              ) : (
                <div className="image-placeholder"></div>
              )}
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
                    <CircularProgress size={18} color="inherit" style={{ marginRight: 8 }} />
                    上傳中…
                  </>
                ) : (
                  '上傳圖片'
                )}
              </Button>
            </label>
            {uploadError && (
              <p style={{ color: 'red', marginTop: 4 }}>上傳錯誤：{uploadError}</p>
            )}
          </div>

          {/* 文字欄位：商品名稱 & 售價 */}
          <div className="text-fields">
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

          {/* 分類 & 推薦 Toggle */}
          <div className="section">
            <div className="toggle-buttons">
              <ToggleButton
                value="recommend"
                selected={isRecommended}
                onChange={() => setIsRecommended((prev) => !prev)}
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

          {/* 最後的送出按鈕 */}
          <div className="create-button-wrapper">
            <button
              disabled={
                !isFormValid || uploading || isCreating
              }
              onClick={handleSubmit}
              className="submit-create-button"
            >
              {isCreating ? '新增中…' : '新增餐點'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMealPage;
