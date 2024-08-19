/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRightToBracket,
    faUserPlus,
    faEllipsisVertical,
    faUser,
    faSignOut,
    faKey,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import config from '@/config';
import Login from './Login';
import Register from './Register';
import Search from '@/layouts/components/Search';
import ListMenu from './ListMenu';
import images from '@/assets/images';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkStatus, fetchLogout } from '@/actions/userActions';
import Menu from '@/components/Popper/Menu';
import Cart from '../Cart';
import { getCartData } from '@/actions/cartActions';

import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

function Header() {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [isLoginForm, setIsLoginForm] = useState(true);
    const [authentication, setAuthentication] = useState(false);
    const data = useSelector((state) => state.cart.carts);
    const userRole = Cookies.get('role');

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkStatus());
    }, [dispatch]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getCartData());
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        dispatch(fetchLogout());
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
            title: 'Hồ sơ',
            to: '/profile',
        },
        ...(userRole === 'admin' || userRole === 'superAdmin'
            ? [
                  {
                      icon: <FontAwesomeIcon icon={faKey} />,
                      title: 'Admin',
                      to: '/admin',
                  },
              ]
            : []), // Chỉ thêm mục Admin nếu role là admin
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
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
                        <Cart data={data} />

                        <Menu items={userMenu}>
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        </Menu>
                    </div>
                )}
                {!isLoggedIn && (
                    <div className={cx('actions')}>
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
                {authentication &&
                    (isLoginForm ? (
                        <Login onChange={handleChangeRegisterForm} onClose={handleCloseAuthenticationForm} />
                    ) : (
                        <Register onChange={handleChangeLoginForm} onClose={handleCloseAuthenticationForm} />
                    ))}
            </div>
        </header>
    );
}

export default Header;
