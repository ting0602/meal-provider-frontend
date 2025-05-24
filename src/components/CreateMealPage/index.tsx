import { useState } from 'react';
import {
  Button, TextField, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import BackHeader from 'components/CommonComponents/BackHeader';
import './CreateMealPage.css';

const CreateMealPage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const isFormValid = !!image && !!name && !!price && category !== null;


  const handleSubmit = () => {
    if (!isFormValid) return;
    // # TODO: Using API to add meal
    console.log({ image, name, price, category, isRecommended });
  };

  return (
    <div>
      <BackHeader description='新增餐點' />
      <div id="create-meal-page">
        <div className='create-meal-content'>
          <div className="upload-section">
            <div className="image-preview">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="preview" />
              ) : (
                <div className="image-placeholder" />
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
              <Button variant="contained" component="span" className="upload-button" startIcon={<UploadIcon style={{ fontSize: '1.2rem' }} />}>
                上傳圖片
              </Button>
            </label>
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
            {/* <Typography>商品標籤：</Typography> */}

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
          <div className="create-button-wrapper">
            <button
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="submit-create-button"
            >
              新增餐點
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMealPage;
