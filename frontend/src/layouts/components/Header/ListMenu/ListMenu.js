import classNames from 'classnames/bind';
import styles from './ListMenu.module.scss';

const cx = classNames.bind(styles);

function ListMenu() {
    return (
        <div className={cx('wrapper')}>
            <ul className={cx('list')}>
                <li className={cx('item')}>Trang chủ</li>
                <li className={cx('item')}>Sản phẩm</li>
                <li className={cx('item')}>Blog</li>
                <li className={cx('item')}>Giới thiệu</li>
                <li className={cx('item')}>Liên hệ</li>
            </ul>
        </div>
    );
}

export default ListMenu;
