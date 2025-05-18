// import AvatarFrame from 'assets/avatar-frame.svg';
// import AvatarPickerBackground from 'assets/avatar-picker-background.svg';
import './SignUp.css';

interface AvatarPickerProps {
    setShowPopup: (value: boolean) => void;
    avatarIcon: string;
}

const AvatarPicker = (props: AvatarPickerProps) => {
    const { setShowPopup, avatarIcon } = props;

    return (
        <div className="avatar-picker">
            <div className="avatar-wrapper">
                {/* <img className="avatar-frame" src={AvatarFrame} alt="" /> */}
                {/* <img className="avatar-picker-background" src={AvatarPickerBackground} alt="" /> */}
                <img className="avatar-frame" src={avatarIcon} alt="" onClick={() => { setShowPopup(true) }} style={{ cursor: 'pointer' }} />
            </div>
            {/* <div className="avatar-label">Avatar</div> */}
        </div>
    )
}

export default AvatarPicker