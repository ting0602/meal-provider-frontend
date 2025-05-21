// App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import AuthProvider from "provider/AuthProvider";
import Login from "components/Login";
import Welcome from "components/Weclome";
import SignUp from "components/SignUP";
import HomePage from "components/HomePage";
import OrderPage from "components/OrderPage";
import OrderDetailPage from "components/OrderDetailPage";
import AccountPage from "components/AccountPage";
import CreateMealPage from "components/CreateMealPage";
import ModifyMealPage from "components/ModifyMealPage";
// import ShopAccountPage from "components/ShopAccountPage";
import UserQRCode from "components/CommonComponents/UserQRCode";
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
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/:orderId" element={<OrderDetailPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/create-meal" element={<CreateMealPage />} />
        {/* <Route path="/modify-meal/:mealId" element={<ModifyMealPage />} /> */}
        <Route path="/modify-meal" element={<ModifyMealPage />} />
        {/* <Route path="/shop-account" element={<ShopAccountPage />} /> */}
        {/* <Route path="/qrcode" element={<UserQRCode />} /> */}
        {/* <Route path="/scanner" element={<QrCodeScanner />} /> */}
        <Route path="/qrcode" element={<UserQRCode />} />
        <Route path="/scanner" element={<QrCodeScanner />} />
      </Routes>
    </Router>
  );
};

export default App;
