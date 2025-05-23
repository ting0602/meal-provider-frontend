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
import Shopkeep from "components/Shopkeepermeal";
import Checkorder from "components/Checkorder";
import ShopOrderPage from "components/ShopOrderPage";
import QrCodeScanner from "components/QrCodeScanner";
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/create-meal" element={<CreateMealPage />} />
        {/* <Route path="/modify-meal/:mealId" element={<ModifyMealPage />} /> */}
        {/*update to database*/}
        <Route path="/modify-meal" element={<ModifyMealPage />} />
        {/*update to database*/}
        <Route path="/shop-account" element={<ShopAccountPage />} />
        {/*shop-account to shopkeep */}
        <Route path="/shopkeep" element={<Shopkeep />} />
        {/*Every time call shopkeep call api to get data*/}
        <Route path="/checkorder" element={<Checkorder />} />
        {/*pos to shopkeep, pos is almost the same as menu */}
        <Route path="/shop-order" element={<ShopOrderPage />} />
        <Route path="/qrcode" element={<UserQRCode />} />
        <Route path="/scanner" element={<QrCodeScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
