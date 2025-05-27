import SeperateLine from 'assets/line.svg';
import Mascot1 from 'assets/mascots/mascot1.svg';
import MascotCat from 'assets/mascots/mascot_cat.svg';
import MascotDog from 'assets/mascots/mascot_dog.svg';
import MascotRabbit from 'assets/mascots/mascot_rabbit.svg';

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
            <div className="welcome-content">
                <div className='welcome-title-wrapper'>
                    <div className="page-title">Meal<br></br>Provider</div>
                    <img className="seperate-line" src={SeperateLine} alt="" />
                </div>
                <div className="decoration">
                    <img id="big-mascot" src={Mascot1} alt="" />
                </div>
                <div className='button-wrapper-weclcome'>
                    <button className="button" onClick={onClickLogin}>LOGIN</button>
                    <button className="button" onClick={onClickSignUp}>SIGN UP</button>
                </div>
                <div className='mascot-group'>
                    <img className="mascot-bottom" src={MascotCat} alt="" />
                    <img className="mascot-bottom" src={MascotDog} alt="" />
                    <img className="mascot-bottom" src={MascotRabbit} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Welcome