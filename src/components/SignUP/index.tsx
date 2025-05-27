import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import InputField from 'components/CommonComponents/InputField';

import AvatarPicker from './AvatarPicker';
import AvatarPickerPopup from './AvatarPickerPopup';

import avatar1 from 'assets/avatar/Avatar1.svg';
import avatar2 from 'assets/avatar/Avatar2.svg';
import avatar3 from 'assets/avatar/Avatar3.svg';
import avatar4 from 'assets/avatar/Avatar4.svg';
import SeperateLine from 'assets/line.svg';

import { useSignup } from 'hooks/useUser';

import './SignUp.css';

const SignUp = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [mailValue, setMailValue] = useState('');
  const [passwdValue, setPasswdValue] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [currentAvatar, setAvatar] = useState(0);

  const signupMutation = useSignup();

  const images = [avatar1, avatar2, avatar3, avatar4];

  const handleEmployeeIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(event.target.value);
  };

  const handleMailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMailValue(event.target.value);
  };

  const handlePasswdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswdValue(event.target.value);
  };

  const handleSignUp = () => {
    if (!employeeId || !mailValue || !passwdValue) {
      alert('請填寫所有欄位');
      return;
    }

    signupMutation.mutate({
      account: mailValue,
      password: passwdValue,
      employeeId,
      location: 0,
      head_sticker: currentAvatar,
    });
  };

  return (
    <div id="sign-up">
      <div className="content">
        <div className="signup-title-wrapper">
            <div className="page-title">註冊</div>
            <img id="seperate-line" src={SeperateLine} alt="" />
        </div>

        <AvatarPicker
          setShowPopup={setShowPopup}
          avatarIcon={images[currentAvatar]}
        />
        <div className='signup-input-wrapper'>
            <InputField
            Icon={PersonOutlinedIcon}
            placeholder="Employee ID"
            value={employeeId}
            onChange={handleEmployeeIdChange}
            />
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
        <button onClick={handleSignUp} id="create-button">
          Create Account
        </button>

        <div className="login-wrapper">
          <div className="login-hint">
            Already have an account?{' '}
            <Link className="login-link" to="/login">
              Login
            </Link>
          </div>
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <AvatarPickerPopup
              setShowPopup={setShowPopup}
              setAvatar={setAvatar}
              images={images}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
