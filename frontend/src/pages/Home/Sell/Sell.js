import classNames from 'classnames/bind';
import styles from './Sell.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import Title from '../Title';
import sale1 from '@/assets/images/sale1.jpg';
import sale2 from '@/assets/images/sale2.jpg';
import { useDispatch } from 'react-redux';
import { selectProduct } from '@/actions/productActions';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Sell({ props, title, sale, type, more = false, onMore, hasMore = true }) {
    const formattedPrice = (price) => {
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handGetReducePrice = (price, percentDiscount) => {
        return price - (price * percentDiscount) / 100;
    };

    const dispatch = useDispatch();

    const handleMore = async (event) => {
        event.preventDefault(); // Ngăn hành động mặc định
        const moreBtnElement = event.target; // Lấy vị trí của nút "Xem thêm"

        try {
            await onMore(); // Gọi hàm tải thêm sản phẩm

            // Sau khi dữ liệu được render, cuộn trang đến phần tử cần hiển thị giữa màn hình
            moreBtnElement.scrollIntoView({
                behavior: 'smooth', // Cuộn trang mượt mà
                block: 'center', // Đặt phần tử nằm giữa màn hình
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <Title title={title} type={type} />
            <div className={cx('wrapper-item')}>
                {props.map((prop, index) => (
                    <div key={index} className={cx('item')}>
                        <Link to={`product/${prop.id}`}>
                            <div className={cx('container-item')}>
                                <img src={prop.imgSrc} alt={prop.name} className={cx('item-img')} />
                                <div className={cx('content-item')}>
                                    <div className={cx('item-name')}>{prop.name}</div>
                                    <div className={cx('item-price')}>
                                        <div className={cx('item-reduced-price')}>
                                            Giá:{' '}
                                            <span style={{ fontWeight: 700, fontSize: 1.4 + 'rem' }}>
                                                {formattedPrice(handGetReducePrice(prop.price, prop.percentDiscount))}
                                            </span>
                                        </div>
                                        {prop.percentDiscount !== 0 && (
                                            <div className={cx('item-cost')}>{formattedPrice(prop.price)}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className={cx('shopping')} onClick={() => dispatch(selectProduct(prop))}>
                            <FontAwesomeIcon icon={faBasketShopping} className={cx('shopping-icon')} />
                        </div>
                        {prop.percentDiscount !== 0 && (
                            <div className={cx('tick')}>
                                <span className={cx('tick-content')}> -{prop.percentDiscount}%</span>
                            </div>
                        )}
                        {prop.percentDiscount !== 0 && <div className={cx('tick-feet')}></div>}
                    </div>
                ))}
            </div>
            {more && hasMore && (
                <div className={cx('more-btn-wrapper')}>
                    <div className={cx('more-btn')} onClick={handleMore}>
                        Xem thêm
                    </div>
                </div>
            )}
            {sale === true && (
                <div className={cx('wrapper-advertisement')}>
                    <img className={cx('advertisement-img')} src={sale1} alt="sale" />
                    <img className={cx('advertisement-img')} src={sale2} alt="sale" />
                </div>
            )}
        </div>
    );
}

export default Sell;
