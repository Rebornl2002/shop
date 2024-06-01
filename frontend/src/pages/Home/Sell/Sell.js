import classNames from 'classnames/bind';
import styles from './Sell.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import Title from '../Title';
import sale1 from '@/assets/images/sale1.jpg';
import sale2 from '@/assets/images/sale2.jpg';

const cx = classNames.bind(styles);

function Discount({ props, title, sale, type }) {
    const formattedPrice = (price) => {
        return price.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    };

    const handGetReducePrice = (price, percentDiscount) => {
        return price - (price * percentDiscount) / 100;
    };
    return (
        <div className={cx('wrapper')}>
            <Title title={title} type={type} />
            <div className={cx('wrapper-item')}>
                {props.map((prop, index) => (
                    <div key={index} className={cx('item')}>
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
                        <div className={cx('shopping')}>
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
            {sale === true && (
                <div className={cx('wrapper-advertisement')}>
                    <img className={cx('advertisement-img')} src={sale1} alt="sale" />
                    <img className={cx('advertisement-img')} src={sale2} alt="sale" />
                </div>
            )}
        </div>
    );
}

export default Discount;
