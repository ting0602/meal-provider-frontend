// HomePage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/CommonComponents/Header';
import Footer from 'components/CommonComponents/Footer';
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import ShopScoreCard from 'components/CommonComponents/ShopScoreCard';
import MealScoreCard from 'components/CommonComponents/MealScoreCard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import './HomePage.css';

import { useAuth } from 'provider/AuthProvider';
import { useGetUserById } from 'hooks/useUser';
import { useUserLastOrder } from 'hooks/useUser';
import { useGetOrderById, useUpdateOrder } from 'hooks/useOrder';
import { useGetShopsByLocation, useGetShopById, useRateShop } from 'hooks/useShop';
import { useGetMealById, useLikeMeal, useDislikeMeal } from 'hooks/useMeal';

import NoImg from 'assets/default-image.png';


const HomePage = () => {

  const { userId } = useAuth();
  const { data: user, isLoading, isError } = useGetUserById(userId!);
  const [selectedFactoryIndex, setSelectedFactoryIndex] = useState(0);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showMealScoreModal, setShowMealScoreModal] = useState(false);
  const [randomMealId, setRandomMealId] = useState<string | null>(null);
  const { data: mealInfo } = useGetMealById(randomMealId ?? '', {
    enabled: !!randomMealId, // 只有當 randomMealId 存在時才會觸發 query
  });

  const navigate = useNavigate();

  const { data: lastOrderId } = useUserLastOrder(userId!);
  const { data: lastOrder } = useGetOrderById(lastOrderId ?? '');
  const { data: shop } = useGetShopById(lastOrder?.shopId ?? '');
  const { mutate: rateShop } = useRateShop(shop?.id ?? '');
  const { mutate: updateOrder } = useUpdateOrder(lastOrder?.id ?? '');
  const [hasRated, setHasRated] = useState(false);

  const { mutate: likeMeal } = useLikeMeal(mealInfo?.id ?? '');
  const { mutate: dislikeMeal } = useDislikeMeal(mealInfo?.id ?? '');

  const { data: shops = [] } = useGetShopsByLocation(selectedFactoryIndex);

  useEffect(() => {
    if (user) setSelectedFactoryIndex(user.location);
  }, [user]);

  useEffect(() => {
    if (lastOrder && !lastOrder.scored) {
      setShowScoreModal(true);

      // 隨機挑一個 mealId
      const meals = lastOrder.mealsId;
      if (meals.length > 0) {
        const randomIndex = Math.floor(Math.random() * meals.length);
        const selectedMealId = meals[randomIndex];
        setRandomMealId(selectedMealId);
      }
    }
  }, [lastOrder]);

  useEffect(() => {
    if (lastOrder && !lastOrder.scored) {
      setShowScoreModal(true);

      const meals = lastOrder.mealsId;
      if (meals.length > 0) {
        const randomIndex = Math.floor(Math.random() * meals.length);
        const selectedMealId = meals[randomIndex];
        setRandomMealId(selectedMealId);
      }
    }
  }, [lastOrder]);

  useEffect(() => {
    // remove any localStorage key that begins with "cart_"
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('cart_')) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  const handleShopScoreSubmit = (score: number) => {
    rateShop(score);
    setHasRated(true);
    setShowScoreModal(false);
    setShowMealScoreModal(true);
  };

  const handleMealScoreSubmit = (scoreType: 1 | -1) => {
    if (scoreType === 1) likeMeal();
    else dislikeMeal();
    setHasRated(true);
    setShowMealScoreModal(false);
  };

  useEffect(() => {
    if (!showScoreModal && !showMealScoreModal && hasRated && lastOrder) {
      updateOrder({ scored: true });
    }
  }, [showScoreModal, showMealScoreModal, hasRated, lastOrder, updateOrder]);

  if (isLoading) return <div>載入中...</div>;
  if (isError || !user) return <div>載入使用者資料失敗</div>;

  return (
    <div>
      <Header
        defaultFactoryIndex={selectedFactoryIndex}
        onSelectFactory={(_, index) => setSelectedFactoryIndex(index)}
      />

      <div id='home-page'>
        {showScoreModal && shop && (
          <ShopScoreCard
            shop={{
              type: shop.type,
              name: shop.name,
              image: shop.image ?? NoImg,
              rating: shop.ratingAvg,
            }}
            time={lastOrder?.createdAt ?? ''}
            onClose={() => {
              setShowScoreModal(false);
              setShowMealScoreModal(true);
            }}
            onSubmit={handleShopScoreSubmit}
          />
        )}

        {showMealScoreModal && mealInfo && (
          <MealScoreCard
            meal={{
              id: mealInfo.id,
              name: mealInfo.name,
              price: mealInfo.price,
              imageUrl: mealInfo.picture ?? NoImg,
              category: [
                mealInfo.recommand
                  ? '推薦'
                  : (mealInfo.type ?? 0) === 0
                  ? '主食'
                  : (mealInfo.type ?? 0) === 1
                  ? '副餐'
                  : '其他',
              ],
              likeCount: mealInfo.likes,
              dislikeCount: mealInfo.dislikes,
            }}
            time={lastOrder?.createdAt ?? ''}
            onClose={() => setShowMealScoreModal(false)}
            onSubmit={handleMealScoreSubmit}
          />
        )}

        <div className="home-content">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="shop-button-wrapper"
              onClick={() => navigate(`/menu?shopId=${shop.id}${userId ? `&userId=${userId}` : ''}`)}
            >
              <ShopInfoCard
                key={shop.id}
                type={shop.type}
                name={shop.name}
                image={shop.image && shop.image.startsWith('http') ? shop.image : undefined}
                rating={shop.ratingAvg}
              />
            </div>
          ))}
        </div>

        <button className="pay-button" onClick={() => navigate('/qrCode')}>
          <QrCodeScannerIcon className="pay-icon" />
          結帳條碼
        </button>
      </div>
      <Footer avatarIndex={user.head_sticker} />
    </div>
  );
};

export default HomePage;
