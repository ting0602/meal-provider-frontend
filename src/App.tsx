// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthProvider from "provider/AuthProvider";
import Login from "components/Login";
import Welcome from "components/Weclome";
import SignUp from "components/SignUP";
import HomePage from "components/HomePage";
import Menu from "components/Menu";
import Cart from "components/Cart";
import OrderPage from "components/OrderPage";
import OrderDetailPage from "components/OrderDetailPage";
import AccountPage from "components/AccountPage";
import CreateMealPage from "components/CreateMealPage";
import ModifyMealPage from "components/ModifyMealPage";
import ShopAccountPage from "components/ShopAccountPage";
import UserQRCode from "components/UserQRCode";
import RestaurantMenu from "components/RestaurantMenu";
import Pos from "components/Posmenu";
import Checkorder from "components/Checkorder";
import ShopOrderPage from "components/ShopOrderPage";
import QrCodeScanner from "components/QrCodeScanner";
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />v
        <Route path="/login" element={<Login />} />v
        <Route path="/signup" element={<SignUp />} />v
        <Route path="/home" element={<HomePage />} />v
        <Route path="/menu" element={<Menu />} />v
        <Route path="/cart" element={<Cart />} />v
        <Route path="/order" element={<OrderPage />} />v
        <Route path="/shop-order" element={<ShopOrderPage />} />v
        <Route path="/order/:orderId" element={<OrderDetailPage />} />v
        <Route path="/account" element={<AccountPage />} />v
        {/*shop-account to shopkeep */}
        <Route path="/shop-account" element={<ShopAccountPage />} />
        <Route path="/shopkeep" element={<RestaurantMenu />} />
        <Route path="/create-meal" element={<CreateMealPage />} />
        {/* <Route path="/modify-meal/:mealId" element={<ModifyMealPage />} /> */}
        {/*update to database*/}
        <Route path="/modify-meal" element={<ModifyMealPage />} />
        {/*update to database*/}
        <Route path="/Posmenu" element={<Pos />} />
        {/*Every time call shopkeep call api to get data*/}
        <Route path="/checkorder" element={<Checkorder />} />
        {/*pos to shopkeep, pos is almost the same as menu */}
        
        <Route path="/qrcode" element={<UserQRCode />} />v
        <Route path="/scanner" element={<QrCodeScanner />} />v
      </Routes>
    </Router>
  );
};

export default App;
