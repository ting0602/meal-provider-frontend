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
// import MealShop from 'assets/shop/meal_shop.svg';
import BackHeader from 'components/CommonComponents/BackHeader';
import { useUpdateMeal, useDeleteMeal } from 'hooks/useMeal';
import { useUploadImage } from 'hooks/useUploadImage';
import { useAuth } from 'provider/AuthProvider';
import { useGetUserById } from 'hooks/useUser';
import './ModifyMealPage.css';

const ModifyMealPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const user = useGetUserById(userId!);
  const meal = location.state?.meal;
  const updateMealMutation = useUpdateMeal(meal!.id, user.data?.shopkeeper || '');
  const deleteMealMutation = useDeleteMeal();

  // 如果找不到 meal 資料，跳回上一頁
  useEffect(() => {
    if (!meal) {
      alert('錯誤：找不到餐點資料，將返回前頁。');
      navigate(-1);
    }
  }, [meal, navigate]);

  // 1. 圖片編輯相關
  const [imageFile, setImageFile] = useState<File | null>(null);
  // 圖片上傳到 S3 的 hook
  const {
    upload: uploadImageToS3,
    loading: uploading,
    error: uploadError,
  } = useUploadImage();

  // 2. 其他欄位：名稱鎖死、可編輯的只有 price、category、isRecommended
  const [name] = useState(meal?.name || ''); // disabled，不會改變
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

  // 3. 判斷表單是否有效：名稱不用檢查（固定），只要 price 不空、category 不為 null
  const isFormValid = price.trim() !== '' && category !== null;

  // 4. 處理檔案選擇：先把 File 存起來，預覽用
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 5. 按下「保存變更」時的流程：先上傳圖片（若有新圖），拿到 pictureUrl 再送給 updateMeal
  const handleUpdate = async () => {
    if (!isFormValid || !meal) return;

    let pictureUrl = meal.imageUrl || ''; // 預設使用原本的 imageUrl

    // 如果有新選的圖片，就先上傳到 S3，並更新 pictureUrl
    if (imageFile) {
      try {
        pictureUrl = await uploadImageToS3(imageFile);
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
        picture: pictureUrl,
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

  // 6. 刪除餐點
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

  // 7. 判斷是否有變更：只看 price、category、isRecommended 或 user 選了新圖
  const hasChanges =
    price !== String(meal?.price) ||
    category !== (meal?.category?.[0] === '主食'
      ? 0
      : meal?.category?.[0] === '副餐'
      ? 1
      : 2) ||
    isRecommended !== meal?.category?.includes('推薦') ||
    imageFile !== null;

  return (
    <div>
      <BackHeader description="修改資訊" />
      <div className="modify-meal-page">
        <div className="content">
          {/* 圖片上傳區 */}
          <div className="upload-section horizontal">
            <div className="image-preview-wrapper">
              <div className="image-preview">
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
              {/* 名稱一律顯示為 meal.name，不可改 */}
              <div className="meal-name">{meal?.name}</div>
              <br />
              <div className="meal-price">${meal?.price}</div>
            </div>
          </div>

          {/* 文字欄位：商品名稱禁用、商品售價可編輯 */}
          <div className="text-fields">
            <TextField
              fullWidth
              label="商品名稱"
              variant="outlined"
              value={name}
              className="text-field"
              disabled // 無法編輯
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

          {/* 推薦 & 分類 Toggle */}
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

          {/* 底部按鈕：刪除 & 保存變更 */}
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
