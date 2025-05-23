import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import './BackHeader.css';

type HeaderProps = {
    description: string;
};

const BackHeader: React.FC<HeaderProps> = ({ description }) => {
    const navigate = useNavigate();

    // const handleBack = () => {
    //     //if (backTo) {
    //     //    navigate(backTo);
    //     //} else {
    //         navigate(-1); // 返回上一頁
    //     //}
    // };

    return (
        <div id="back-header">
        <button className="back-button" onClick={() => navigate(-1)}>
            <ArrowBackIosNewIcon fontSize="medium" />
        </button>
        <h2 className="title">{description}</h2>
        </div>
    );

};

export default BackHeader;