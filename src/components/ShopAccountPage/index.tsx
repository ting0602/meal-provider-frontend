import { useNavigate } from 'react-router-dom';
import FooterShop from 'components/CommonComponents/FooterShop';
import ShopInfoCard from 'components/CommonComponents/ShopInfoCard';
import DrinkShop from 'assets/shop/drink_shop.svg';
import Mascot1 from 'assets/mascots/mascot1.svg';

import { useAuth } from 'provider/AuthProvider';
import { useGetUserById } from 'hooks/useUser';
import { useGetShopById } from 'hooks/useShop';

import './ShopAccountPage.css';

const factories = ['台積電1廠', '台積電2廠', '台積電3廠', '台積電4廠', '台積電5廠'];

const ShopAccountPage = () => {
    const { userId, logout } = useAuth();

    const { data: user } = useGetUserById(userId!);
    const shopId = user?.shopkeeper;
    const { data: shop } = useGetShopById(shopId!);

    const navigate = useNavigate();
    // TODO: Update image
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div>
            <div id='shop-account'>
                <div className="shop-content">
                    <div className="page-title">{shop ? factories[shop.location] : '載入中...'}</div>
                    {shop && (
                        <div
                        key={shop.id}
                        className="shop-button-wrapper"
                        onClick={() => navigate('/shopkeep', { state: { shopId: shop.id } })}
                        >
                        <ShopInfoCard
                            key={shop.id}
                            type={shop.type}
                            name={shop.name}
                            image={shop.image}
                            rating={shop.ratingAvg}
                        />
                        </div>
                    )}
                    <button className="logout-button" onClick={handleLogout}>登出</button>
                    <img className="mascot" src={Mascot1} alt="" />

                </div>
            </div>
            <FooterShop />
            
        </div>
    );
};

export default ShopAccountPage;