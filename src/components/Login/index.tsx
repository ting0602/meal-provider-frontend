import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import SeperateLine from 'assets/line.svg';
import Mascot1 from 'assets/mascots/mascot1.svg';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InputField from 'components/CommonComponents/InputField';

import './Login.css';

// TODO: Uncomment and implement when backend login API is ready
// import { useLogin } from 'hooks/useUser';
import { useLogin } from 'hooks/useUser';

const Login = () => {
  const [mailValue, setMailValue] = useState('');
  const [passwdValue, setPasswdValue] = useState('');

  const loginMutation = useLogin();

  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMailValue(event.target.value);
  };

  const handlePasswdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswdValue(event.target.value);
  };

  const handleLogin = () => {
    if (!mailValue || !passwdValue) {
      alert('請輸入帳號和密碼');
      return;
    }

    loginMutation.mutate({
      account: mailValue,
      password: passwdValue,
    });
  };


  return (
    <div id="login">
      <div className="content">
        <div className="logo-wrapper">
            <div className="page-title">登入</div>
            <img id="seperate-line" src={SeperateLine} alt="" />
        </div>
        <div className="input-wrapper">
          <InputField
            Icon={MailOutlineIcon}
            placeholder="MAIL"
            value={mailValue}
            onChange={handleMailChange}
          />
          <InputField
            Icon={LockOutlinedIcon}
            type="password"
            placeholder="PASSWORD"
            value={passwdValue}
            onChange={handlePasswdChange}
          />
        </div>

        <button onClick={handleLogin} id="login-button">
          LOGIN
        </button>

        <div className="signup-wrapper">
          <div className="signup-hint">Don't have an account?</div>
          <Link className="signup-link" to="/signup">
            Create an account
          </Link>
        </div>

        <img id="mascot" src={Mascot1} alt="" />
      </div>
    </div>
  );
};

export default Login;