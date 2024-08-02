import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faGooglePlusG, faInstagram } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('row')}>
                    <div className={cx('columns')}>
                        <div className={cx('title')}>Về Harvest</div>
                        <div className={cx('slogan')}>
                            Mang Đến Sản Phẩm Chăm Sóc Da Chất Lượng. Tôn Vinh Vẻ Đẹp Và Sự Tự Tin Của Bạn.
                        </div>
                        <div className={cx('phone')}>
                            <FontAwesomeIcon icon={faPhone} />
                            <span>0942529223</span>
                        </div>
                        <div className={cx('time')}>
                            <FontAwesomeIcon icon={faClock} />
                            <span>Mon-Sat {''}8.00-18.00</span>
                        </div>
                    </div>
                    <div className={cx('columns')}>
                        <div className={cx('title')}>Địa chỉ</div>
                        <div className={cx('text')}> 833/11 Trường Chinh, Phường Tây Thạnh, Quận Tân Phú, Tp. HCM</div>
                        <div className={cx('text')}> Số 54, Đường Thới An 20, Phường Thới An, Quận 12, TP. HCM</div>
                        <div className={cx('text')}>
                            Tầng 5, Tòa nhà Techno, Số 123 Đường Hoàng Quốc Việt, Quận Cầu Giấy, Hà Nội
                        </div>
                        <div className={cx('text')}>
                            Tầng 10, Tòa nhà Vincom, Số 191 Bà Triệu, Quận Hai Bà Trưng, Hà Nội
                        </div>
                    </div>
                    <div className={cx('columns')}>
                        <div className={cx('title')}>Theo dõi chúng tôi trên </div>
                        <div className={cx('follow')}>
                            <div className={cx('follow-icon')}>
                                <FontAwesomeIcon icon={faFacebookF} />
                            </div>
                            <span>Facebook</span>
                        </div>
                        <div className={cx('follow')}>
                            <div className={cx('follow-icon')}>
                                <FontAwesomeIcon icon={faInstagram} />
                            </div>
                            <span>Instagram</span>
                        </div>
                        <div className={cx('follow')}>
                            <div className={cx('follow-icon')}>
                                <FontAwesomeIcon icon={faGooglePlusG} />
                            </div>
                            <span>Google Plus</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
