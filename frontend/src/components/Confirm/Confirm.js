import classNames from 'classnames/bind';
import styles from './Confirm.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Confirm({ title, data, onClose, onAction }) {
    const notificationTitle = title || 'Bạn có chắc chắn muốn xóa sản phẩm này không ?';

    const handleChangeId = (data) => {
        if (Array.isArray(data)) {
            const idArray = data.map((product) => ({
                productId: product.productId,
                variationId: product.variationId,
            }));
            return idArray;
        } else {
            return {
                productId: data.productId,
                variationId: data.variationId,
            };
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('overlay')}>
                <div className={cx('container')}>
                    <div className={cx('notification')}>{notificationTitle}</div>
                    <div className={cx('confirm')}>
                        <div className={cx('cofirm-btn')} onClick={() => onAction(handleChangeId(data))}>
                            Có
                        </div>
                        <div className={cx('cofirm-btn')} onClick={onClose}>
                            Không
                        </div>
                    </div>
                    <FontAwesomeIcon icon={faXmark} className={cx('exit')} onClick={onClose} />
                </div>
            </div>
        </div>
    );
}

export default Confirm;
