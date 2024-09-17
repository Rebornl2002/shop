import classNames from 'classnames/bind';
import styles from './Buy.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailUser } from '@/actions/userActions';
import { formattedPrice, handleCalculatePrice, totalMoney, isValidPhoneNumber } from '@/calculate/calculate';
import { Toast } from '@/components/Toast/Toast';
import { fetchAddOrder } from '@/actions/orderActions';
import CreditCardForm from '@/components/CreditCardForm/CreditCardForm';
import { fetchAddCredit, fetchGetCredit } from '@/actions/creditActions';

const cx = classNames.bind(styles);

function Buy() {
    const dispatch = useDispatch();
    const detailUser = useSelector((state) => state.user.detail);
    const buyProduct = useSelector((state) => state.product.productToPurchase);
    const credit = useSelector((state) => state.credit.credits);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [card, setCard] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const shipping = 15000;

    const handleSelectPaymentMethod = (method) => {
        setPaymentMethod(method);
        if (method !== 'CC') {
            setCard(null);
        }
    };

    useEffect(() => {
        dispatch(fetchDetailUser());
        dispatch(fetchGetCredit());
    }, [dispatch]);

    useEffect(() => {
        if (detailUser && detailUser.length > 0) {
            setFormData({
                name: detailUser[0].fullName || '',
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

    const totalMoneySelected = () => {
        const total = buyProduct.reduce((acc, product) => {
            const money = totalMoney(product.price, product.percentDiscount, product.quantity);
            return acc + money;
        }, 0);
        return total;
    };

    const totalPayment = (cost, ship) => {
        return cost + ship;
    };

    const validateDeliveryInfor = () => {
        for (const [key, value] of Object.entries(formData)) {
            if (value === null || value === undefined || !value.trim()) {
                Toast.error('Vui lòng nhập đủ thông tin người nhận !');
                return false;
            }

            if (key === 'phone' && !isValidPhoneNumber(value)) {
                Toast.error('Số điện thoại không hợp lệ !');
                return false;
            }
        }

        if (paymentMethod === 'CC' && card === null) {
            Toast.error('Vui lòng chọn thẻ để thanh toán !');
            return false;
        }
        return true;
    };

    const handleOrder = async () => {
        try {
            if (validateDeliveryInfor()) {
                const orderData = {
                    ...formData,
                    totalPrice: totalPayment(totalMoneySelected(), shipping),
                    paymentMethod: paymentMethod,
                    cardNumber: card,
                };

                const filteredProduct = buyProduct.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                }));
                console.log(filteredProduct);

                await dispatch(fetchAddOrder(orderData, filteredProduct));
                localStorage.removeItem('productToPurchase');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleAddCard = async (data) => {
        try {
            await dispatch(fetchAddCredit(data));
            await dispatch(fetchGetCredit());
            setCard(Number(data.cardNumber));
        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectCard = (data) => {
        setCard(data);
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
                            name="name"
                            className={cx('name-info')}
                            placeholder="Họ và tên"
                            onChange={handleInputChange}
                            value={formData.name}
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
                    {paymentMethod === 'CC' && (
                        <>
                            <div className={cx('add-cart')}>
                                <div className={cx('add-cart-title')}>Chọn thẻ</div>
                                <div className={cx('card-infor')}>
                                    {credit.length > 0 &&
                                        credit.map((credit) => (
                                            <div
                                                key={credit.cardNumber}
                                                className={cx('credit', {
                                                    'credit-action': card === credit.cardNumber,
                                                })}
                                                onClick={() => handleSelectCard(credit.cardNumber)}
                                            >
                                                <div className={cx('card-number')}>{credit.cardNumber}</div>
                                                <div className={cx('card-holder')}>{credit.cardHolder}</div>
                                            </div>
                                        ))}
                                </div>
                                <CreditCardForm onSubmit={handleAddCard} />
                            </div>
                            <div className={cx('dividing-line')}></div>
                        </>
                    )}
                    <div className={cx('invoice-container')}>
                        <div className={cx('invoice-item')}>
                            <span className={cx('item-label')}>Tổng tiền hàng</span>
                            <span className={cx('item-value')}>{formattedPrice(totalMoneySelected())}</span>
                        </div>
                        <div className={cx('invoice-item')}>
                            <span className={cx('item-label')}>Phí vận chuyển</span>
                            <span className={cx('item-value')}>{formattedPrice(shipping)}</span>
                        </div>
                        <div className={cx('invoice-total')}>
                            <span className={cx('total-label')}>Tổng thanh toán</span>
                            <span className={cx('total-value')}>
                                {formattedPrice(totalPayment(totalMoneySelected(), shipping))}
                            </span>
                        </div>
                    </div>
                    <div className={cx('dividing-line')}></div>
                    <div className={cx('payment-btn')}>
                        <div className={cx('terms-notice')}>
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Harvest
                        </div>
                        <div className={cx('btn-buy')} onClick={() => handleOrder()}>
                            Đặt hàng
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Buy;
