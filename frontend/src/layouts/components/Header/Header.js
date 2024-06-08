import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faRightToBracket,
    faUserPlus,
    faEllipsisVertical,
    faUser,
    faSignOut,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import config from '@/config';
import Login from './Login';
import Register from './Register';

import Search from '@/layouts/components/Search';
import ListMenu from './ListMenu';
import styles from './Header.module.scss';
import images from '@/assets/images';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/actions/userActions';
import Menu from '@/components/Popper/Menu';

const cx = classNames.bind(styles);

function Header() {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [authentication, setAuthentication] = useState(false);

    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleChangeLoginForm = () => {
        setIsLoginForm(true);
    };

    const handleChangeRegisterForm = () => {
        setIsLoginForm(false);
    };

    const handleOpenLoginForm = () => {
        setAuthentication(true);
        setIsLoginForm(true);
    };

    const handleOpenRegisterForm = () => {
        setAuthentication(true);
        setIsLoginForm(false);
    };

    const handleCloseAuthenticationForm = () => {
        setAuthentication(false);
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            onClick: handleLogout,
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={config.routes.home} className={cx('logo')}>
                    <img className={cx('logo-img')} src={images.logo2} alt="logo" />
                </Link>
                <ListMenu />
                <Search />
                {isLoggedIn && (
                    <div className={cx('logged-in-icon-container')}>
                        <FontAwesomeIcon icon={faShoppingCart} className={cx('shopping-cart-icon')} />
                        <Menu items={userMenu}>
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        </Menu>
                    </div>
                )}
                <div className={cx('actions')}>
                    {!isLoggedIn && (
                        <div className={cx('authentication-buttons-container')}>
                            <div className={cx('login-btn')} onClick={handleOpenLoginForm}>
                                <FontAwesomeIcon icon={faRightToBracket} className={cx('authentication-icon')} />
                                Đăng nhập
                            </div>
                            <div className={cx('register-btn')} onClick={handleOpenRegisterForm}>
                                <FontAwesomeIcon icon={faUserPlus} className={cx('authentication-icon')} />
                                Đăng kí
                            </div>
                        </div>
                    )}
                </div>
                {authentication && isLoginForm && (
                    <Login onChange={handleChangeRegisterForm} onClose={handleCloseAuthenticationForm} />
                )}
                {authentication && !isLoginForm && (
                    <Register onChange={handleChangeLoginForm} onClose={handleCloseAuthenticationForm} />
                )}
            </div>
        </header>
    );
}

export default Header;
