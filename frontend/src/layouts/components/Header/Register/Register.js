import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import logo from '@/assets/images/logo1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import { Toast } from '@/components/Toast/Toast';
import { useDispatch } from 'react-redux';
import { createUser } from '@/actions/userActions';

const cx = classNames.bind(styles);

function Register({ onChange, onClose }) {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const cofirmPasswordRef = useRef(null);
    const dispatch = useDispatch();

    const handleRegister = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const cofirmPassword = cofirmPasswordRef.current.value;

        if (password !== cofirmPassword) {
            Toast.error('Mật khẩu và mật khẩu nhập lại không giống nhau !');
        } else {
            dispatch(createUser({ username, password }));
        }
    };

    return (
        <div className={cx('overlay')}>
            <div className={cx('wrapper')}>
                <div className={cx('logo')} style={{ backgroundImage: `url(${logo})` }}></div>
                <div className={cx('container')}>
                    <div className={cx('header')}>Đăng ký</div>
                    <div className={cx('username')}>
                        <FontAwesomeIcon icon={faUser} className={cx('login-icon')} />
                        <input
                            ref={usernameRef}
                            type="text"
                            placeholder="Tên người dùng"
                            className={cx('login-input')}
                        />
                    </div>
                    <div className={cx('password')}>
                        <FontAwesomeIcon icon={faLock} className={cx('login-icon')} />
                        <input ref={passwordRef} type="password" placeholder="Mật khẩu" className={cx('login-input')} />
                    </div>
                    <div className={cx('password')}>
                        <FontAwesomeIcon icon={faLock} className={cx('login-icon')} />
                        <input
                            ref={cofirmPasswordRef}
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            className={cx('login-input')}
                        />
                    </div>
                    <div className={cx('register')}>
                        Bạn đã có tài khoản?{' '}
                        <span className={cx('register-link')} onClick={onChange}>
                            Đăng nhập
                        </span>
                    </div>
                    <div className={cx('login-btn')} onClick={handleRegister}>
                        Đăng ký
                    </div>
                </div>
                <div className={cx('exit')} onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
        </div>
    );
}

export default Register;
