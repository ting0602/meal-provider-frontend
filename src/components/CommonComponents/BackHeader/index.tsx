import React from 'react';
import { useNavigate } from 'react-router-dom';
import './backheader.css';
import backicon from 'assets/backicon.svg';
type HeaderProps = {
    description: string;
    backTo?: string; // 可以不給，預設返回上一頁
};

const Header: React.FC<HeaderProps> = ({ description, backTo }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        //if (backTo) {
        //    navigate(backTo);
        //} else {
            navigate(-1); // 返回上一頁
        //}
    };

    return (
        <div id="custom-header">
            <img
                src={backicon}
                alt="返回"
                className="back-icon"
                onClick={handleBack}
            />
            <div className="header-description">{description}</div>
        </div>
    );
};

export default Header;