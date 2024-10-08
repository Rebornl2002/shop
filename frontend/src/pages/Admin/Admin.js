import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import ProductTable from '@/components/Table/ProductTable';
import UserTable from '@/components/Table/UserTable';
import OrderTable from '@/components/Table/OrderTable';
import RevenueChart from './RevenueChart';
import 'react-datepicker/dist/react-datepicker.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const cx = classNames.bind(styles);

function Admin() {
    const [activeKey, setActiveKey] = useState('ProductTable');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <Tabs activeKey={activeKey} onSelect={(k) => setActiveKey(k)} className={cx('custom-tab')}>
                    <Tab eventKey="ProductTable" title={<span className={cx('tab-title')}>Sản phẩm</span>}>
                        {activeKey === 'ProductTable' && <ProductTable />}
                    </Tab>
                    <Tab eventKey="UserTable" title={<span className={cx('tab-title')}>Người dùng</span>}>
                        {activeKey === 'UserTable' && <UserTable />}
                    </Tab>
                    <Tab eventKey="OrderTable" title={<span className={cx('tab-title')}>Đơn hàng</span>}>
                        {activeKey === 'OrderTable' && <OrderTable />}
                    </Tab>
                    <Tab eventKey="RevenueChart" title={<span className={cx('tab-title')}>Biểu đồ doanh thu</span>}>
                        {activeKey === 'RevenueChart' && <RevenueChart />}
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default Admin;
