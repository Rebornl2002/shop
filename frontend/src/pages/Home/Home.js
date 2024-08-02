import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Slide from './Slide';
import Sell from './Sell';
import Blog from './Blog';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '@/actions/blogActions';
import { fetchDiscountProducts, fetchProducts, selectProduct } from '@/actions/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { addCart, getCartData } from '@/actions/cartActions';
import { Toast } from '@/components/Toast/Toast';
import { handleCalculatePrice } from '@/calculate/calculate';
import Cookies from 'js-cookie';

const cx = classNames.bind(styles);

function Home() {
    const dispatch = useDispatch();
    const blogs = useSelector((state) => state.blog.blogs);
    const loadingBlog = useSelector((state) => state.blog.loading);
    const errorBlog = useSelector((state) => state.blog.error);

    const products = useSelector((state) => state.product.products);
    const loadingProduct = useSelector((state) => state.product.loading);
    const errorProduct = useSelector((state) => state.product.error);
    const discountProducts = useSelector((state) => state.product.discountProducts);

    const selectedProduct = useSelector((state) => state.product.selectedProduct);
    const [quantity, setQuantity] = useState(0);
    const [showProduct, setShowProduct] = useState(false);

    const userCurrent = useSelector((state) => state.user.currentUser);
    const isLogin = useSelector((state) => state.user.isLoggedIn);

    useEffect(() => {
        dispatch(fetchBlogs());
        dispatch(fetchProducts());
        dispatch(fetchDiscountProducts());
    }, [dispatch]);

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
                dispatch(addCart(userCurrent, selectedProduct.id, quantity))
                    .then(() => {
                        return dispatch(getCartData(userCurrent));
                    })
                    .catch((error) => {
                        console.error('Eror', error);
                    });
            }
        }
    };

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

    return (
        <div className={cx('wrapper')}>
            <Slide />
            {!loadingProduct && !errorProduct && discountProducts.length > 0 && (
                <Sell props={discountProducts} title="Đang khuyến mãi" sale={true} type={false} />
            )}
            {!loadingProduct && !errorProduct && products.length > 0 && (
                <Sell props={products} title="Hàng mới về " type={true} sale={false} />
            )}
            {!loadingBlog && !errorBlog && blogs.length > 0 && <Blog props={blogs} />}
            {selectedProduct !== undefined && (
                <div className={cx('choose-wrapper', { 'choose-wrapper-active': showProduct })}>
                    <div className={cx('choose-container')}>
                        <div
                            className={cx('img-product')}
                            style={{
                                backgroundImage: `url(${selectedProduct.imgSrc})`,
                            }}
                        ></div>
                        <div className={cx('info-product')}>
                            <div className={cx('name-product')}>{selectedProduct.name}</div>
                            <div className={cx('price-product')}>
                                Giá:{' '}
                                <span style={{ fontWeight: 700 }}>
                                    {handleCalculatePrice(
                                        selectedProduct.price,
                                        selectedProduct.percentDiscount,
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
                            <div className={cx('btn')}>
                                <div
                                    className={cx('product-btn', { 'product-btn-ban': quantity === 0 })}
                                    onClick={handleAddCart}
                                >
                                    Thêm vào giỏ hàng
                                </div>
                                <div className={cx('product-btn', { 'product-btn-ban': quantity === 0 })}>Mua ngay</div>
                            </div>
                            <div className={cx('exit-btn')} onClick={handleExit}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
