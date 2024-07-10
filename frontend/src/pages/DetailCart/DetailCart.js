import classNames from 'classnames/bind';
import styles from './Detailcart.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { totalMoney, formattedPrice, handleCalulatePrice } from '@/calculate/caculate';

const cx = classNames.bind(styles);

function DetailCart() {
    const data = useSelector((state) => state.cart.carts);

    console.log(data);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('row')}>
                <div className={cx('product-card')}>
                    <input type="checkbox" className={cx('tick-product')} readOnly />
                    <div className={cx('product-summary')}>Sản phẩm</div>
                </div>
                <div className={cx('product-detail')}>
                    <div className={cx('unit-price')}>Đơn giá</div>
                    <div className={cx('quantity')}>Số lượng</div>
                    <div className={cx('price')}>Số tiền</div>
                    <div className={cx('operation')}>Thao tác</div>
                </div>
            </div>
            {data.length > 0 &&
                data.map((data, index) => {
                    return (
                        <div key={index} className={cx('row')}>
                            <div className={cx('product-card')}>
                                <input id={index} type="checkbox" className={cx('tick-product')} readOnly />
                                <label htmlFor={index}></label>
                                <div className={cx('product-summary')}>
                                    <div
                                        className={cx('product-img')}
                                        style={{
                                            backgroundImage: `url(${data.imgSrc})`,
                                        }}
                                    ></div>
                                    <div className={cx('product-name')}>{data.name}</div>
                                </div>
                            </div>
                            <div className={cx('product-detail')}>
                                <div className={cx('unit-price')}>
                                    <span className={cx('cost')}>{formattedPrice(data.price)}</span>
                                    <span className={cx('promotional-price')}>
                                        {formattedPrice(handleCalulatePrice(data.price, data.percentDiscount, 1))}
                                    </span>
                                </div>
                                <div className={cx('quantity')}>
                                    <FontAwesomeIcon icon={faMinus} className={cx('icon')} />
                                    <span>{data.quantity}</span>
                                    <FontAwesomeIcon icon={faPlus} className={cx('icon')} />
                                </div>
                                <div className={cx('price')}>
                                    <span>
                                        {formattedPrice(
                                            handleCalulatePrice(data.price, data.percentDiscount, data.quantity),
                                        )}
                                    </span>
                                </div>
                                <div className={cx('operation')}>
                                    <span>Xóa</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}

export default DetailCart;
