// import ChefCatWithSpoon from 'assets/chef-cat-with-spoon.svg';
// import OrangeStar from 'assets/orange-star.svg';
import SeperateLine from 'assets/line.svg';
import Mascot1 from 'assets/mascots/mascot1.svg';

import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    let navigate = useNavigate();

    const onClickLogin = () => {
        navigate('/login');
    }

    const onClickSignUp = () => {
        navigate('/signup');
    }

    return (
        <div id="welcome">
            <div className="content">
                <div className="page-title">Meal<br></br>Provider</div>
                <img className="seperate-line" src={SeperateLine} alt="" />
                {/* <button onClick={handleLogin} id="login-button">LOGIN</button> */}
                <div className="decoration">
                    {/* <img id="chef-cat-with-spoon" src={ChefCatWithSpoon} alt="" /> */}
                    <img id="mascot" src={Mascot1} alt="" />
                    {/* <img id="orange-star1" src={OrangeStar} alt="" />
                    <img id="orange-star2" src={OrangeStar} alt="" /> */}
                </div>
                <button className="button" onClick={onClickLogin}>LOGIN</button>
                <button className="button" onClick={onClickSignUp}>SIGN UP</button>
            </div>
        </div>
    )
}

export default Welcome