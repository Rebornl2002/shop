import classNames from 'classnames/bind';
import styles from './Profile.module.scss';

const cx = classNames.bind(styles);

function Profile() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>Hồ sơ của tôi</div>
                <div className={cx('safety-warning')}>Quản lý thông tin hồ sơ để bảo mật an toàn</div>
                <div className={cx('info')}>
                    <label htmlFor="name-profile" className={cx('properties')}>
                        Họ và tên
                    </label>
                    <input type="text" id="name-profile" className={cx('input-info')} placeholder="Họ và Tên" />
                </div>
                <div className={cx('info')}>
                    <label htmlFor="email-profile" className={cx('properties')}>
                        Email
                    </label>
                    <input id="email-profile" type="email" className={cx('input-info')} placeholder="Email" />
                </div>
                <div className={cx('info')}>
                    <label htmlFor="phone-profile" className={cx('properties')}>
                        Số điện thoại
                    </label>
                    <input id="phone-profile" type="text" className={cx('input-info')} placeholder="Số điện thoại" />
                </div>
                <div className={cx('info')}>
                    <div className={cx('properties')}>Giới tính</div>
                    <div style={{ display: 'flex' }}>
                        <input type="radio" id="male" className={cx('input-sex')} name="sex" value="Nam" />
                        <label className={cx('sex-value')} htmlFor="male">
                            Nam
                        </label>
                        <input type="radio" id="female" className={cx('input-sex')} name="sex" value="Nữ" />
                        <label className={cx('sex-value')} htmlFor="female">
                            Nữ
                        </label>
                        <input type="radio" id="other" className={cx('input-sex')} name="sex" value="Khác" />
                        <label className={cx('sex-value')} htmlFor="other">
                            Khác
                        </label>
                    </div>
                </div>
                <div className={cx('info')}>
                    <label htmlFor="date-profile" className={cx('properties')}>
                        Ngày sinh
                    </label>
                    <input id="date-profile" type="text" className={cx('input-info')} placeholder="Ngày sinh" />
                </div>
                <div className={cx('info')}>
                    <label htmlFor="address-profile" className={cx('properties')}>
                        Địa chỉ
                    </label>
                    <input id="address-profile" type="text" className={cx('input-info')} placeholder="Địa chỉ" />
                </div>
                <div className={cx('save-btn')}>Lưu</div>
            </div>
        </div>
    );
}

export default Profile;
