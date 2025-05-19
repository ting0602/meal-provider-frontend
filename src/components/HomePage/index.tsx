import Header from 'components/CommonComponents/Header';
import Footer from 'components/CommonComponents/Footer';
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import DrinkShop from 'assets/shop/drink_shop.svg';
import MealShop from 'assets/shop/meal_shop.svg';
import './HomePage.css';

const shopList = [
    {
        id: 1,
        type: 1,
        name: '天天果汁',
        image: DrinkShop,
        rating: 4.7,
    },
    {
        id: 2,
        type: 0,
        name: '飯飯之交',
        image: MealShop,
        rating: 4.5,
    },
    {
        id: 3,
        type: 0,
        name: '胖胖豬韓式拌飯',
        image: MealShop,
        rating: 4.3,
    },
    {
        id: 4,
        type: 0,
        name: '胖胖豬韓式拌飯',
        image: MealShop,
        rating: 4.3,
    },
  ];
  
const HomePage = () => {
    return (
        <div>
            <Header />
            <div id='home-page'>
                <div className="content">
                    {shopList.map((shop) => (
                        <ShopInfoCard
                        key={shop.id}
                        type={shop.type}
                        name={shop.name}
                        image={shop.image}
                        rating={shop.rating}
                        />
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;