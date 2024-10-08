import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { formattedPrice, handleCalculatePrice } from '@/calculate/calculate';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailProducts, getProductToPurchase, fetchGetVariation } from '@/actions/productActions';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from '@/components/Toast/Toast';
import { addCart, getCartData } from '@/actions/cartActions';
import CustomSpinner from '@/components/Spinner/CustomSpinner';

const cx = classNames.bind(styles);

function Product() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const detailProduct = useSelector((state) => state.product.details);
    const variations = useSelector((state) => state.product.variations);
    const [selectedVariation, setSelectedVariation] = useState();
    const isLoadingProducts = useSelector((state) => state.product.loadingStates['fetchDetailProducts']);
    const isLoadingVariations = useSelector((state) => state.product.loadingStates['fetchGetVariation']);

    const [quantity, setQuantity] = useState(1);

    const isLogin = useSelector((state) => state.user.isLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchDetailProducts(id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(fetchGetVariation(id));
            } catch (error) {
                console.error('Error fetching variation:', error);
            }
        };

        fetchData();
    }, [dispatch, id]);

    useEffect(() => {
        if (variations.length > 0) {
            setSelectedVariation(variations[0]);
        }
    }, [variations]);

    const handleAddQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleRemoveQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleSelectVariation = (variation) => {
        setSelectedVariation(variation);
    };

    const handleAddCart = () => {
        if (quantity !== 0) {
            if (!isLogin) {
                Toast.error('Vui lòng đăng nhập để thêm sản phẩm ');
            } else {
                dispatch(addCart(id, quantity, selectedVariation.variationId))
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
        if (quantity > 0) {
            const data = {
                ...selectedVariation,
                name: detailProduct.name,
                percentDiscount: detailProduct.percentDiscount,
                quantity: quantity,
            };
            dispatch(getProductToPurchase([data]));
            navigate('/buy');
        }
    };

    console.log(detailProduct);

    return (
        <div className={cx('wrapper')}>
            {!isLoadingProducts ? (
                detailProduct &&
                selectedVariation && (
                    <>
                        <div className={cx('container')}>
                            <div
                                className={cx('img')}
                                style={{
                                    backgroundImage: `url(${selectedVariation.imgSrc})`,
                                }}
                            ></div>
                            <div className={cx('product-info')}>
                                <div className={cx('product-name')}>{detailProduct.name} </div>
                                <div className={cx('product-value')}>
                                    {detailProduct.percentDiscount !== 0 && (
                                        <div className={cx('product-cost')}>
                                            {formattedPrice(selectedVariation.price)}
                                        </div>
                                    )}
                                    <div className={cx('product-price')}>
                                        {handleCalculatePrice(
                                            selectedVariation.price,
                                            detailProduct.percentDiscount,
                                            1,
                                        )}
                                    </div>
                                    {detailProduct.percentDiscount !== 0 && (
                                        <div className={cx('product-discount')}>
                                            {detailProduct.percentDiscount}% giảm
                                        </div>
                                    )}
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
                                {!isLoadingVariations ? (
                                    <div className={cx('variation')}>
                                        <span>Phân loại</span>
                                        <div className={cx('variation-list')}>
                                            {variations.map((variation) => {
                                                return (
                                                    <div
                                                        key={variation.variationId}
                                                        className={cx('variation-item', {
                                                            'variation-active':
                                                                selectedVariation?.variationId ===
                                                                variation.variationId,
                                                        })}
                                                        onClick={() => handleSelectVariation(variation)}
                                                    >
                                                        <div
                                                            className={cx('variation-img')}
                                                            style={{
                                                                backgroundImage: `url(${variation.imgSrc})`,
                                                            }}
                                                        ></div>
                                                        <div className={cx('variation-des')}>
                                                            {variation.description}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <CustomSpinner />
                                )}
                                <div className={cx('btn')}>
                                    <div className={cx('add-to-cart-btn')} onClick={handleAddCart}>
                                        <FontAwesomeIcon icon={faCartPlus} className={cx('cart-icon')} />
                                        Thêm vào giỏ hàng
                                    </div>
                                    <div className={cx('buy-btn')} onClick={() => handleBuy()}>
                                        Mua ngay
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('product-detail')}>
                            <div className={cx('detail-title')}>Chi tiết sản phẩm</div>
                            <div className={cx('properties')}>
                                <span className={cx('attribute-name')}>Thương hiệu</span>
                                <span className={cx('attribute-value')}>{detailProduct.trademark}</span>
                            </div>
                            <div className={cx('properties')}>
                                <span className={cx('attribute-name')}>Hạn sử dụng</span>
                                {detailProduct.expiry}
                            </div>
                            <div className={cx('properties')}>
                                <span className={cx('attribute-name')}>Kho hàng</span>
                                {detailProduct.quantityInStock}
                            </div>
                            <div className={cx('properties')}>
                                <span className={cx('attribute-name')}>Nơi sản xuất</span>
                                {detailProduct.origin}
                            </div>
                        </div>
                    </>
                )
            ) : (
                <CustomSpinner />
            )}
        </div>
    );
}

export default Product;
