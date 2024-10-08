import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { totalMoney, formattedPrice, handleCalculatePrice } from '@/calculate/calculate';
import Empty from '@/assets/images/cartEmpty.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getProductToPurchase } from '@/actions/productActions';

const cx = classNames.bind(styles);

function Cart({ data }) {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const hideMenuTimeoutRef = useRef(null);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const showMenu = () => {
        if (hideMenuTimeoutRef.current) {
            clearTimeout(hideMenuTimeoutRef.current);
        }
        setIsMenuVisible(true);
    };

    const hideMenuWithDelay = () => {
        hideMenuTimeoutRef.current = setTimeout(() => {
            setIsMenuVisible(false);
        }, 500);
    };

    const cancelHideMenu = () => {
        if (hideMenuTimeoutRef.current) {
            clearTimeout(hideMenuTimeoutRef.current);
        }
    };

    const handleTickProduct = (item) => {
        setSelectedProduct((prevSelected) => {
            if (
                prevSelected.some(
                    (product) => product.productId === item.productId && product.variationId === item.variationId,
                )
            ) {
                // Xóa sản phẩm nếu nó đã tồn tại trong danh sách (dựa trên productId và variationId)
                return prevSelected.filter(
                    (product) => !(product.productId === item.productId && product.variationId === item.variationId),
                );
            } else {
                // Thêm sản phẩm nếu nó chưa tồn tại trong danh sách
                return [...prevSelected, item];
            }
        });
    };

    const handleBuy = () => {
        if (selectedProduct.length > 0) {
            dispatch(getProductToPurchase(selectedProduct));
            navigate('/buy');
        }
    };

    const totalMoneySelected = () => {
        const total = selectedProduct.reduce((acc, product) => {
            const money = totalMoney(product.price, product.percentDiscount, product.quantity);
            return acc + money;
        }, 0);
        return total;
    };

    return (
        <>
            <div className={cx('wrapper')} onMouseEnter={showMenu} onMouseLeave={hideMenuWithDelay}>
                <FontAwesomeIcon icon={faShoppingCart} className={cx('shopping-cart-icon')} />
                {isMenuVisible && (
                    <div
                        className={cx('menu', { visible: isMenuVisible, hidden: !isMenuVisible })}
                        onMouseEnter={cancelHideMenu}
                        onMouseLeave={hideMenuWithDelay}
                    >
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
                                                    onChange={() => {
                                                        handleTickProduct(item);
                                                    }}
                                                />
                                            </label>

                                            <div
                                                className={cx('product-img')}
                                                style={{
                                                    backgroundImage: `url(${item.imgSrc})`,
                                                }}
                                            ></div>

                                            <div className={cx('product-info')}>
                                                <div className={cx('product-title')}>
                                                    {item.name} x {item.quantity}
                                                </div>
                                                <div className={cx('product-variation')}>{item.description}</div>
                                                <div className={cx('product-price')}>
                                                    {handleCalculatePrice(
                                                        item.price,
                                                        item.percentDiscount,
                                                        item.quantity,
                                                    )}
                                                </div>
                                                <div className={cx('delete-cart')}>Xóa</div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className={cx('cart-empty')} style={{ backgroundImage: `url(${Empty})` }}></div>
                            )}
                        </div>
                        <div className={cx('cart-buy')}>
                            <div className={cx('total-money')}>Tổng: {formattedPrice(totalMoneySelected())}</div>
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
        </>
    );
}

export default Cart;
