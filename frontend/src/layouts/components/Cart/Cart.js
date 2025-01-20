import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { totalMoney, formattedPrice, handleCalculatePrice } from '@/calculate/calculate';
import Empty from '@/assets/images/cartEmpty.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductToPurchase } from '@/actions/productActions';
import { deleteCart } from '@/actions/cartActions';

const cx = classNames.bind(styles);

function Cart({ data: initialData }) {
    const [data, setData] = useState(initialData);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleMenu = useCallback(() => {
        setIsMenuVisible((prev) => !prev);
    }, []);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTickProduct = useCallback((item) => {
        setSelectedProduct((prevSelected) =>
            prevSelected.some(
                (product) => product.productId === item.productId && product.variationId === item.variationId,
            )
                ? prevSelected.filter(
                      (product) => !(product.productId === item.productId && product.variationId === item.variationId),
                  )
                : [...prevSelected, item],
        );
    }, []);

    const handleBuy = useCallback(() => {
        if (selectedProduct.length > 0) {
            dispatch(getProductToPurchase(selectedProduct));
            navigate('/buy');
        }
    }, [selectedProduct, dispatch, navigate]);

    const totalMoneySelected = useMemo(
        () =>
            selectedProduct.reduce(
                (acc, product) => acc + totalMoney(product.price, product.percentDiscount, product.quantity),
                0,
            ),
        [selectedProduct],
    );

    const handleDeleteCart = useCallback(
        async (item) => {
            const id = { productId: item.productId, variationId: item.variationId };
            try {
                await dispatch(deleteCart(id));
                setData((prevData) =>
                    prevData.filter(
                        (product) =>
                            !(product.productId === item.productId && product.variationId === item.variationId),
                    ),
                );
            } catch (error) {
                console.error(error);
            }
        },
        [dispatch],
    );

    return (
        <div className={cx('wrapper')}>
            {/* Nhấn vào biểu tượng giỏ hàng để bật/tắt menu */}
            <FontAwesomeIcon icon={faShoppingCart} className={cx('shopping-cart-icon')} onClick={toggleMenu} />

            {isMenuVisible && (
                <div ref={menuRef} className={cx('menu')}>
                    <div className={cx('container')}>
                        {data.length > 0 ? (
                            data.map((item, index) => {
                                const isSelected = selectedProduct.some(
                                    (product) =>
                                        product.productId === item.productId &&
                                        product.variationId === item.variationId,
                                );
                                return (
                                    <div className={cx('content')} key={index}>
                                        <label className={cx('product', { selected: isSelected })}>
                                            <input
                                                type="checkbox"
                                                className={cx('tick-product')}
                                                checked={isSelected}
                                                readOnly
                                                onChange={() => handleTickProduct(item)}
                                            />
                                        </label>
                                        <div
                                            className={cx('product-img')}
                                            style={{ backgroundImage: `url(${item.imgSrc})` }}
                                        ></div>
                                        <div className={cx('product-info')}>
                                            <div className={cx('product-title')}>
                                                {item.name} x {item.quantity}
                                            </div>
                                            <div className={cx('product-variation')}>{item.description}</div>
                                            <div className={cx('product-price')}>
                                                {handleCalculatePrice(item.price, item.percentDiscount, item.quantity)}
                                            </div>
                                            <div className={cx('delete-cart')} onClick={() => handleDeleteCart(item)}>
                                                Xóa
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={cx('cart-empty')} style={{ backgroundImage: `url(${Empty})` }}></div>
                        )}
                    </div>
                    <div className={cx('cart-buy')}>
                        <div className={cx('total-money')}>Tổng: {formattedPrice(totalMoneySelected)}</div>
                        <Link to="/detailCart">
                            <div className={cx('cart-btn')}>Xem giỏ hàng</div>
                        </Link>
                        <div className={cx('buy-btn')} onClick={handleBuy}>
                            Mua ngay
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
