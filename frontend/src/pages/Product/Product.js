import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCartPlus, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { formattedPrice, handleCalculatePrice } from '@/calculate/calculate';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailProducts } from '@/actions/productActions';
import { fetchDetailUser } from '@/actions/userActions';
import { useParams } from 'react-router-dom';
import { Toast } from '@/components/Toast/Toast';
import { addCart, getCartData } from '@/actions/cartActions';

const cx = classNames.bind(styles);

function Product() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const detailProduct = useSelector((state) => state.product.details);
    const [quantity, setQuantity] = useState(1);

    const isLogin = useSelector((state) => state.user.isLoggedIn);
    const detailUser = useSelector((state) => state.user.detail);
    const [address, setAddress] = useState('');

    useEffect(() => {
        if (isLogin) {
            dispatch(fetchDetailUser());
        }
    }, [dispatch, isLogin]);

    useEffect(() => {
        if (detailUser.length > 0) {
            setAddress(detailUser[0].address);
        }
    }, [detailUser]);

    useEffect(() => {
        dispatch(fetchDetailProducts(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    console.log(detailUser);
    console.log(address);
    const handleAddQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleRemoveQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddCart = () => {
        if (quantity !== 0) {
            if (!isLogin) {
                Toast.error('Vui lòng đăng nhập để thêm sản phẩm ');
            } else {
                dispatch(addCart(id, quantity))
                    .then(() => {
                        return dispatch(getCartData());
                    })
                    .catch((error) => {
                        console.error('Eror', error);
                    });
            }
        }
    };

    return (
        <div className={cx('wrapper')}>
            {detailProduct.length > 0 && (
                <>
                    <div className={cx('container')}>
                        <div
                            className={cx('img')}
                            style={{
                                backgroundImage: `url(${detailProduct[0].imgSrc})`,
                            }}
                        ></div>
                        <div className={cx('product-info')}>
                            <div className={cx('product-name')}>{detailProduct[0].name} </div>
                            <div className={cx('product-value')}>
                                {detailProduct[0].percentDiscount !== 0 && (
                                    <div className={cx('product-cost')}>{formattedPrice(detailProduct[0].price)}</div>
                                )}
                                <div className={cx('product-price')}>
                                    {handleCalculatePrice(detailProduct[0].price, detailProduct[0].percentDiscount, 1)}
                                </div>
                                {detailProduct[0].percentDiscount !== 0 && (
                                    <div className={cx('product-discount')}>
                                        {detailProduct[0].percentDiscount}% giảm
                                    </div>
                                )}
                            </div>
                            <div className={cx('transport')}>
                                <span className={cx('attribute-name')}>Vận chuyển</span>
                                <FontAwesomeIcon icon={faTruckFast} className={cx('icon')} />
                                <span>Vận chuyển tới</span>
                                <input
                                    type="text"
                                    placeholder="Vui lòng nhập địa chỉ"
                                    className={cx('address')}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                            <div className={cx('quantity')}>
                                <span className={cx('attribute-name')}>Số lượng</span>
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className={cx('arrow-icon', { 'arrow-ban': quantity === 1 })}
                                    onClick={handleRemoveQuantity}
                                />
                                <span style={{ width: 20 + 'px', textAlign: 'center' }}>{quantity}</span>
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className={cx('arrow-icon')}
                                    onClick={handleAddQuantity}
                                />
                            </div>
                            <div className={cx('btn')}>
                                <div className={cx('add-to-cart-btn')} onClick={handleAddCart}>
                                    <FontAwesomeIcon icon={faCartPlus} className={cx('cart-icon')} />
                                    Thêm vào giỏ hàng
                                </div>
                                <div className={cx('buy-btn')}>Mua ngay</div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('product-detail')}>
                        <div className={cx('detail-title')}>Chi tiết sản phẩm</div>
                        <div className={cx('properties')}>
                            <span className={cx('attribute-name')}>Thương hiệu</span>
                            <span className={cx('attribute-value')}>{detailProduct[0].trademark}</span>
                        </div>
                        <div className={cx('properties')}>
                            <span className={cx('attribute-name')}>Hạn sử dụng</span>
                            {detailProduct[0].expiry}
                        </div>
                        <div className={cx('properties')}>
                            <span className={cx('attribute-name')}>Kho hàng</span>
                            {detailProduct[0].quantityInStock}
                        </div>
                        <div className={cx('properties')}>
                            <span className={cx('attribute-name')}>Nơi sản xuất</span>
                            {detailProduct[0].origin}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Product;
