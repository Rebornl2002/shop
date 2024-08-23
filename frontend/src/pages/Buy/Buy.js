import classNames from 'classnames/bind';
import styles from './Buy.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailUser } from '@/actions/userActions';
import { formattedPrice, handleCalculatePrice } from '@/calculate/calculate';

const cx = classNames.bind(styles);

function Buy() {
    const dispatch = useDispatch();
    const detailUser = useSelector((state) => state.user.detail);
    const buyProduct = useSelector((state) => state.product.productToPurchase);

    const [paymentMethod, setPaymentMethod] = useState('COD');

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
    });

    const handleSelectPaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    useEffect(() => {
        dispatch(fetchDetailUser());
        window.scrollTo(0, 0);
    }, [dispatch]);

    useEffect(() => {
        if (detailUser && detailUser.length > 0) {
            setFormData({
                fullName: detailUser[0].fullName || '',
                phone: detailUser[0].phone !== null ? '0' + detailUser[0].phone : '',
                address: detailUser[0].address || '',
            });
        }
    }, [detailUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('row')}>
                    <div className={cx('address-title')}>
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>Địa chỉ nhận hàng</span>
                    </div>
                    <div className={cx('contact-info')}>
                        <input
                            type="text"
                            name="fullName"
                            className={cx('name-info')}
                            placeholder="Họ và tên"
                            onChange={handleInputChange}
                            value={formData.fullName}
                        />
                        <input
                            type="text"
                            name="phone"
                            className={cx('phone-info')}
                            placeholder="Số điện thoại"
                            onChange={handleInputChange}
                            value={formData.phone}
                        />
                        <input
                            type="text"
                            name="address"
                            className={cx('address-info')}
                            placeholder="Địa chỉ"
                            onChange={handleInputChange}
                            value={formData.address}
                        />
                    </div>
                </div>
                <div className={cx('row')}>
                    <div className={cx('product-detail', 'mb-16')}>
                        <div className={cx('product-summary')}>Sản phẩm</div>
                        <div className={cx('unit-price')}>Đơn giá</div>
                        <div className={cx('quantity')}>Số lượng</div>
                        <div className={cx('price')}>Thành tiền</div>
                    </div>

                    {buyProduct.map((product, index) => {
                        return (
                            <div key={index} className={cx('product-detail')}>
                                <div className={cx('product-summary')}>
                                    <div
                                        className={cx('product-img')}
                                        style={{
                                            backgroundImage: `url(${product.imgSrc})`,
                                        }}
                                    ></div>
                                    <div className={cx('product-name')}>{product.name}</div>
                                </div>

                                <div className={cx('unit-price')}>
                                    <span className={cx('promotional-price')}>
                                        {formattedPrice(
                                            handleCalculatePrice(product.price, product.percentDiscount, 1),
                                        )}
                                    </span>
                                </div>
                                <div className={cx('quantity')}>
                                    <span>{product.quantity}</span>
                                </div>
                                <div className={cx('price')}>
                                    <span>
                                        {formattedPrice(
                                            handleCalculatePrice(
                                                product.price,
                                                product.percentDiscount,
                                                product.quantity,
                                            ),
                                        )}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={cx('row')}>
                    <div className={cx('payment-method')}>
                        <div className={cx('payment-title')}>Phương thức thanh toán</div>
                        <div className={cx('payment-options')}>
                            <div
                                className={cx('payment-option-btn', {
                                    'payment-options-active': paymentMethod === 'CC',
                                })}
                                onClick={() => handleSelectPaymentMethod('CC')}
                            >
                                Thẻ ngân hàng
                            </div>
                            <div
                                className={cx('payment-option-btn', {
                                    'payment-options-active': paymentMethod === 'COD',
                                })}
                                onClick={() => handleSelectPaymentMethod('COD')}
                            >
                                Thanh toán khi nhận hàng
                            </div>
                        </div>
                    </div>
                    <div className={cx('dividing-line')}></div>
                    <div className={cx('invoice-container')}>
                        <div className={cx('invoice-item')}>
                            <span className={cx('item-label')}>Tổng tiền hàng</span>
                            <span className={cx('item-value')}>₫148.000</span>
                        </div>
                        <div className={cx('invoice-item')}>
                            <span className={cx('item-label')}>Phí vận chuyển</span>
                            <span className={cx('item-value')}>₫15.000</span>
                        </div>
                        <div className={cx('invoice-total')}>
                            <span className={cx('total-label')}>Tổng thanh toán</span>
                            <span className={cx('total-value')}>₫160.000</span>
                        </div>
                    </div>
                    <div className={cx('dividing-line')}></div>
                    <div className={cx('payment-btn')}>
                        <div className={cx('terms-notice')}>
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Harvest
                        </div>
                        <div className={cx('btn-buy')}>Đặt hàng</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Buy;
