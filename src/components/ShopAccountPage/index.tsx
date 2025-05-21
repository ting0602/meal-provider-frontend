import FooterShop from 'components/CommonComponents/FooterShop';
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import DrinkShop from 'assets/shop/drink_shop.svg';
import Mascot1 from 'assets/mascots/mascot1.svg';

import './ShopAccountPage.css';

const factories = ['台積電1廠', '台積電2廠', '台積電3廠', '台積電4廠', '台積電5廠', '台積電2廠', '台積電3廠', '台積電4廠', '台積電5廠'];

const shopInfo = 
    {
        id: 1,
        type: 1,
        name: '天天果汁',
        image: DrinkShop,
        rating: 4.7,
        locationIndex: 0
    };
  
const ShopAccountPage = () => {
    return (
        <div>
            <div id='shop-account'>
                <div className="shop-content">
                    <div className="page-title">{factories[shopInfo.locationIndex]}</div>
                    <ShopInfoCard
                    key={shopInfo.id}
                    type={shopInfo.type}
                    name={shopInfo.name}
                    image={shopInfo.image}
                    rating={shopInfo.rating}
                    />
                    <button className="logout-button">登出</button>
                    <img className="mascot" src={Mascot1} alt="" />

                </div>
            </div>
            <FooterShop />
            
        </div>
    );
};

export default ShopAccountPage;