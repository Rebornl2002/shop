import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchDetailUser, fetchUpdateDetailUser } from '@/actions/userActions';
import { formatDateString, isValidDate, isValidEmail, isValidPhoneNumber } from '@/calculate/calculate';
import { Toast } from '@/components/Toast/Toast';

const cx = classNames.bind(styles);

function Profile() {
    const dispatch = useDispatch();
    const detailUser = useSelector((state) => state.user.detail);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        sex: null,
        date: '',
        address: '',
    });

    useEffect(() => {
        dispatch(fetchDetailUser());
    }, [dispatch]);

    useEffect(() => {
        if (detailUser && detailUser.length > 0) {
            setFormData({
                fullName: detailUser[0].fullName || '',
                email: detailUser[0].email || '',
                phone: detailUser[0].phone !== null ? '0' + detailUser[0].phone : '',
                sex: detailUser[0].sex !== null ? detailUser[0].sex : null,
                date: formatDateString(detailUser[0].date) || '',
                address: detailUser[0].address || '',
            });
        }
    }, [detailUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (
            (formData.date !== '' && !isValidDate(formData.date)) ||
            (formData.email !== '' && !isValidEmail(formData.email)) ||
            (formData.phone !== '' && !isValidPhoneNumber(formData.phone))
        ) {
            Toast.error('Vui lòng kiểm tra lại thông tin !');
        } else {
            dispatch(fetchUpdateDetailUser(formData));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('title')}>Hồ sơ của tôi</div>
                <div className={cx('safety-warning')}>Quản lý thông tin hồ sơ để bảo mật an toàn</div>
                {detailUser && detailUser.length > 0 && (
                    <>
                        <div className={cx('info')}>
                            <label htmlFor="name-profile" className={cx('properties')}>
                                Họ và tên
                            </label>
                            <input
                                type="text"
                                id="name-profile"
                                name="fullName"
                                className={cx('input-info')}
                                placeholder="Họ và Tên"
                                value={formData.fullName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className={cx('info')}>
                            <label htmlFor="email-profile" className={cx('properties')}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email-profile"
                                name="email"
                                className={cx('input-info')}
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                            <span
                                className={cx('err-mess', {
                                    'err-mess-active': formData.email !== '' && !isValidEmail(formData.email),
                                })}
                            >
                                Email không hợp lệ
                            </span>
                        </div>
                        <div className={cx('info')}>
                            <label htmlFor="phone-profile" className={cx('properties')}>
                                Số điện thoại
                            </label>
                            <input
                                type="text"
                                id="phone-profile"
                                name="phone"
                                className={cx('input-info')}
                                placeholder="Số điện thoại"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                            <span
                                className={cx('err-mess', {
                                    'err-mess-active': formData.phone !== '' && !isValidPhoneNumber(formData.phone),
                                })}
                            >
                                Số điện thoại không hợp lệ
                            </span>
                        </div>
                        <div className={cx('info')}>
                            <div className={cx('properties')}>Giới tính</div>
                            <div style={{ display: 'flex' }}>
                                <input
                                    type="radio"
                                    id="male"
                                    name="sex"
                                    className={cx('input-sex')}
                                    value={true}
                                    checked={formData.sex === true}
                                    onChange={() => setFormData({ ...formData, sex: true })}
                                />
                                <label className={cx('sex-value')} htmlFor="male">
                                    Nam
                                </label>
                                <input
                                    type="radio"
                                    id="female"
                                    name="sex"
                                    className={cx('input-sex')}
                                    value={false}
                                    checked={formData.sex === false}
                                    onChange={() => setFormData({ ...formData, sex: false })}
                                />
                                <label className={cx('sex-value')} htmlFor="female">
                                    Nữ
                                </label>
                                <input
                                    type="radio"
                                    id="other"
                                    name="sex"
                                    className={cx('input-sex')}
                                    value="Khác"
                                    checked={formData.sex === null}
                                    onChange={() => setFormData({ ...formData, sex: null })}
                                />
                                <label className={cx('sex-value')} htmlFor="other">
                                    Khác
                                </label>
                            </div>
                        </div>
                        <div className={cx('info')}>
                            <label htmlFor="date-profile" className={cx('properties')}>
                                Ngày sinh
                            </label>
                            <input
                                type="text"
                                id="date-profile"
                                name="date"
                                className={cx('input-info')}
                                placeholder="Ngày sinh"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                            <span
                                className={cx('err-mess', {
                                    'err-mess-active': formData.date !== '' && !isValidDate(formData.date),
                                })}
                            >
                                Ngày sinh không hợp lệ
                            </span>
                        </div>
                        <div className={cx('info')}>
                            <label htmlFor="address-profile" className={cx('properties')}>
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                id="address-profile"
                                name="address"
                                className={cx('input-info')}
                                placeholder="Địa chỉ"
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>
                    </>
                )}
                <div className={cx('save-btn')} onClick={handleSave}>
                    Lưu
                </div>
            </div>
        </div>
    );
}

export default Profile;
