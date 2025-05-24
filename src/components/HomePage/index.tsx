import { useState } from 'react';
import Header from 'components/CommonComponents/Header';
import Footer from 'components/CommonComponents/Footer';
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import ShopScoreCard from 'components/CommonComponents/ShopScoreCard';
import MealScoreCard from 'components/CommonComponents/MealScoreCard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DrinkShop from 'assets/shop/drink_shop.svg';
import MealShop from 'assets/shop/meal_shop.svg';
import './HomePage.css';

const shopList = [
  { id: 1, type: 1, name: '天天果汁', image: DrinkShop, rating: 4.7, location: 0 },
  { id: 2, type: 0, name: '飯飯之交', image: MealShop, rating: 4.5, location: 1 },
  { id: 3, type: 0, name: '胖胖豬韓式拌飯', image: MealShop, rating: 4.3, location: 0 },
  { id: 4, type: 0, name: '漢堡先生', image: MealShop, rating: 4.1, location: 2 },
  { id: 5, type: 1, name: '汁想和你再一起', image: DrinkShop, rating: 3.9, location: 2 },
  { id: 6, type: 0, name: '台雞店', image: MealShop, rating: 4.9, location: 2 },
  { id: 7, type: 0, name: '香香滷肉飯', image: MealShop, rating: 4.1, location: 2 },
  { id: 8, type: 0, name: '天天海南雞', image: MealShop, rating: 4.3, location: 2 },
];


const HomePage = () => {
  const [selectedFactoryIndex, setSelectedFactoryIndex] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(true);


  const filteredShops = shopList.filter(shop => shop.location === selectedFactoryIndex);

  return (
    <div>
      <Header onSelectFactory={(_, index) => setSelectedFactoryIndex(index)} />
      <div id='home-page'>
        {showScoreModal && (
        <ShopScoreCard
            shop={{ type: 0, name: 'cool bibimbap', image: MealShop, rating: 4.7 }}
            time="2025/06/02 13:00"
            onClose={() => setShowScoreModal(false)}
            onSubmit={(score) => {
            console.log('score is', score);
            setShowScoreModal(false);
            }}
        />
        )}

        <div className="home-content">
          {filteredShops.map((shop) => (
            <ShopInfoCard
              key={shop.id}
              type={shop.type}
              name={shop.name}
              image={shop.image}
              rating={shop.rating}
            />
          ))}
        </div>
        <button className="pay-button">
          <QrCodeScannerIcon className="pay-icon" />
          結帳條碼
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
