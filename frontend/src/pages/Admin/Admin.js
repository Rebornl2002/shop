import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import ProductTable from '@/components/Table/ProducTable';
// import RevenueTable from '@/components/RevenueTable/RevenueTable';
// import UserTable from '@/components/UserTable/UserTable';
// import OrderTable from '@/components/OrderTable/OrderTable';

const cx = classNames.bind(styles);

function Admin() {
    const [activeItem, setActiveItem] = useState('ProductTable');

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const renderTable = () => {
        switch (activeItem) {
            // case 'RevenueTable':
            //     return <RevenueTable />;
            case 'ProductTable':
                return <ProductTable />;
            // case 'UserTable':
            //     return <UserTable />;
            // case 'OrderTable':
            //     return <OrderTable />;
            default:
                return null;
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('sidebar')}>
                    <ul className={cx('management-list')}>
                        <li
                            className={cx('management-item', { active: activeItem === 'RevenueTable' })}
                            onClick={() => handleItemClick('RevenueTable')}
                        >
                            <FontAwesomeIcon icon={faCaretRight} className={cx('management-icon')} />
                            <span>Doanh thu</span>
                        </li>
                        <li
                            className={cx('management-item', { active: activeItem === 'ProductTable' })}
                            onClick={() => handleItemClick('ProductTable')}
                        >
                            <FontAwesomeIcon icon={faCaretRight} className={cx('management-icon')} />
                            <span>Quản lý sản phẩm</span>
                        </li>
                        <li
                            className={cx('management-item', { active: activeItem === 'UserTable' })}
                            onClick={() => handleItemClick('UserTable')}
                        >
                            <FontAwesomeIcon icon={faCaretRight} className={cx('management-icon')} />
                            <span>Quản lý người dùng</span>
                        </li>
                        <li
                            className={cx('management-item', { active: activeItem === 'OrderTable' })}
                            onClick={() => handleItemClick('OrderTable')}
                        >
                            <FontAwesomeIcon icon={faCaretRight} className={cx('management-icon')} />
                            <span>Quản lý đơn hàng</span>
                        </li>
                    </ul>
                </div>
                <div className={cx('main')}>{renderTable()}</div>
            </div>
        </div>
    );
}

export default Admin;
