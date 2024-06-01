import classNames from 'classnames/bind';
import styles from './Slide.module.scss';
import image1 from '@/assets/images/slide1.jpg';
import image2 from '@/assets/images/slide2.jpg';
import image3 from '@/assets/images/slide3.jpg';
import image4 from '@/assets/images/slide4.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const cx = classNames.bind(styles);

function Slide() {
    const [listSlide] = useState([image1, image2, image3, image4]);
    const [index, setIndex] = useState(0);

    const handleChangeSlideRight = () => {
        setIndex((index) => (index === listSlide.length - 1 ? 0 : index + 1));
    };

    const handleChangeSlideLeft = () => {
        setIndex((index) => (index === 0 ? listSlide.length - 1 : index - 1));
    };

    return (
        <div className={cx('wrapper')}>
            <FontAwesomeIcon icon={faArrowLeft} className={cx('slide-arrow-left')} onClick={handleChangeSlideLeft} />
            <div className={cx('slide')} id="animation-slide">
                <img src={listSlide[index]} alt="Slide" className={cx('slide-img')} />
            </div>
            <FontAwesomeIcon icon={faArrowRight} className={cx('slide-arrow-right')} onClick={handleChangeSlideRight} />
        </div>
    );
}

export default Slide;
