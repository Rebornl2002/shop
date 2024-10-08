import classNames from 'classnames/bind';
import styles from './ProductPopup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { handleCalculatePrice } from '@/calculate/calculate';
import { addCart, getCartData } from '@/actions/cartActions';
import { Toast } from '@/components/Toast/Toast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchGetVariation, getProductToPurchase, selectProduct } from '@/actions/productActions';
import { useSelector, useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function ProductPopup() {
    const selectedProduct = useSelector((state) => state.product.selectedProduct);
    const [quantity, setQuantity] = useState(0);
    const [showProduct, setShowProduct] = useState(false);
    const [selectedVariation, setSelectedVariation] = useState();

    const isLogin = useSelector((state) => state.user.isLoggedIn);
    const variations = useSelector((state) => state.product.variations);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        let timer;
        if (selectedProduct !== undefined) {
            timer = setTimeout(() => {
                setShowProduct(true); // Hiển thị sản phẩm sau 2 giây
            }, 100);
        } else {
            setShowProduct(false); // Ẩn sản phẩm ngay lập tức
        }
        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount hoặc selectedProduct thay đổi
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedProduct) {
            const fetchData = async () => {
                try {
                    await dispatch(fetchGetVariation(selectedProduct.id));
                } catch (error) {
                    console.error('Error fetching variation:', error);
                }
            };

            fetchData();
        }
    }, [dispatch, selectedProduct]);

    useEffect(() => {
        if (variations.length > 0) {
            setSelectedVariation(variations[0]);
        }
    }, [variations]);

    const handleAddQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleReducedQuantity = () => {
        if (quantity !== 0) {
            setQuantity(quantity - 1);
        }
    };

    const handleExit = () => {
        dispatch(selectProduct(undefined));
    };

    const handleAddCart = () => {
        if (quantity !== 0) {
            if (!isLogin) {
                Toast.error('Vui lòng đăng nhập để thêm sản phẩm ');
            } else {
                dispatch(addCart(selectedProduct.id, quantity, selectedVariation.variationId))
                    .then(() => {
                        return dispatch(getCartData());
                    })
                    .catch((error) => {
                        console.error('Eror', error);
                    });
            }
        }
    };

    const handleBuy = () => {
        if (!isLogin) {
            Toast.error('Vui lòng đăng nhập để mua sản phẩm');
            return;
        }
        if (quantity !== 0) {
            const data = {
                ...selectedVariation,
                name: selectedProduct.name,
                percentDiscount: selectedProduct.percentDiscount,
                quantity: quantity,
            };
            dispatch(getProductToPurchase([data]));
            navigate('/buy');
        }
    };

    const handleSelectVariation = (variation) => {
        setSelectedVariation(variation);
    };

    if (!selectedProduct) {
        return null;
    }

    return (
        <div className={cx('choose-wrapper', { 'choose-wrapper-active': showProduct })}>
            <div className={cx('choose-container')}>
                <div
                    className={cx('img-product')}
                    style={{
                        backgroundImage: `url(${selectedVariation?.imgSrc || selectedProduct.imgSrc})`,
                    }}
                ></div>
                <div className={cx('info-product')}>
                    <div className={cx('name-product')}>{selectedProduct.name}</div>
                    <div className={cx('price-product')}>
                        Giá:{' '}
                        <span style={{ fontWeight: 700 }}>
                            {handleCalculatePrice(
                                selectedVariation?.price || selectedProduct.price,
                                selectedVariation?.percentDiscount || selectedProduct.percentDiscount,
                                quantity,
                            )}
                        </span>
                    </div>
                    <div className={cx('quantity')}>
                        <span>Số lượng</span>
                        <div className={cx('quantity-btn')}>
                            <FontAwesomeIcon
                                icon={faMinus}
                                className={cx('quantity-icon', { 'quantity-icon-ban': quantity === 0 })}
                                onClick={handleReducedQuantity}
                            />
                            <span className={cx('quantity-value')}>{quantity}</span>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className={cx('quantity-icon')}
                                onClick={handleAddQuantity}
                            />
                        </div>
                    </div>
                    {variations.length > 0 && (
                        <div className={cx('variation')}>
                            <span>Phân loại</span>
                            <div className={cx('variation-list')}>
                                {variations.map((variation) => {
                                    return (
                                        <div
                                            key={variation.variationId}
                                            className={cx('variation-item', {
                                                'variation-active':
                                                    selectedVariation?.variationId === variation.variationId,
                                            })}
                                            onClick={() => handleSelectVariation(variation)}
                                        >
                                            <div
                                                className={cx('variation-img')}
                                                style={{
                                                    backgroundImage: `url(${variation.imgSrc})`,
                                                }}
                                            ></div>
                                            <div className={cx('variation-des')}>{variation.description}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className={cx('btn')}>
                        <div
                            className={cx('product-btn', { 'product-btn-ban': quantity === 0 })}
                            onClick={handleAddCart}
                        >
                            Thêm vào giỏ hàng
                        </div>

                        <div
                            className={cx('product-btn', { 'product-btn-ban': quantity === 0 })}
                            onClick={() => handleBuy()}
                        >
                            Mua ngay
                        </div>
                    </div>
                    <div className={cx('exit-btn')} onClick={handleExit}>
                        <FontAwesomeIcon icon={faXmark} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductPopup;
