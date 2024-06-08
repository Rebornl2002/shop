import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import logo from '@/assets/images/logo1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkUser } from '@/actions/userActions';

const cx = classNames.bind(styles);

function Login({ onChange, onClose }) {
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const handleLogin = () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        dispatch(checkUser(username, password));
    };

    useEffect(() => {
        if (isLoggedIn) {
            onClose();
        }
    }, [isLoggedIn, onClose]);

    return (
        <div className={cx('overlay')}>
            <div className={cx('wrapper')}>
                <div className={cx('logo')} style={{ backgroundImage: `url(${logo})` }}></div>
                <div className={cx('container')}>
                    <div className={cx('header')}>Đăng nhập</div>
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
                    <div className={cx('register')}>
                        Bạn chưa có tài khoản?{' '}
                        <span className={cx('register-link')} onClick={onChange}>
                            Đăng ký
                        </span>
                    </div>
                    <div className={cx('login-btn')} onClick={handleLogin}>
                        Đăng nhập
                    </div>
                </div>
                <div className={cx('exit')} onClick={onClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </div>
            </div>
        </div>
    );
}

export default Login;
