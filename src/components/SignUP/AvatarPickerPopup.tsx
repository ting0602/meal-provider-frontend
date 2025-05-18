import CloseIcon from '@mui/icons-material/Close';
import './SignUp.css';

interface AvatarPickerPopupProps {
    setShowPopup: (value: boolean) => void;
    setAvatar: (value: number) => void;
    images: string[];
}

const AvatarPickerPopup = (props: AvatarPickerPopupProps) => {
    const { setShowPopup, setAvatar, images } = props;

    const handleIconClicked = (index: number) => {
        setAvatar(index);
        setShowPopup(false);
    }
    return (
        <div className="avatar-picker-popup">
            <CloseIcon className="close-button" onClick={() => { setShowPopup(false) }} />
            <div className="popup-title-box">
                <div className="popup-title-text">選擇頭貼</div>
            </div>
            <div className="icon-container">
                {images.map((image, index) => (
                    <img key={index} src={image} onClick={() => handleIconClicked(index)} className="avatar-icon" alt="" />
                ))}
            </div>
        </div>
    )
}

export default AvatarPickerPopup;