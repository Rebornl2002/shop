import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetAllOrder } from '@/actions/orderActions';
import classNames from 'classnames/bind';
import styles from './Admin.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import ProductTable from '@/components/Table/ProductTable'; // Đã điều chỉnh tên chính xác
import UserTable from '@/components/Table/UserTable';
import OrderTable from '@/components/Table/OrderTable';
import { SalesLineChart, PaymentMethodChart, MonthlyRevenueBarChart } from '@/components/Table/RevenueChart';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const cx = classNames.bind(styles);

function Admin() {
    const [activeItem, setActiveItem] = useState('ProductTable');
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.order.orders);
    const [monthPickerLineChart, setMonthPickerLineChart] = useState(moment().toDate());
    const [monthPickerPieChart, setMonthPickerPieChart] = useState(moment().toDate());
    const [selectedYear, setSelectedYear] = useState(moment().year());

    useEffect(() => {
        dispatch(fetchGetAllOrder());
    }, [dispatch]);

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    const handleMonthChange = (date) => {
        setMonthPickerLineChart(date);
    };

    const handleMonthPickerPieChartChange = (date) => {
        setMonthPickerPieChart(date);
    };

    const handleYearChange = (date) => {
        setSelectedYear(moment(date).year());
    };

    const formatMonth = (date) => moment(date).format('YYYY-MM');

    const renderTable = () => {
        switch (activeItem) {
            case 'RevenueChart':
                return (
                    <>
                        <div className={cx('chart-title')}>Biểu đồ doanh thu trong tháng</div>
                        <div className={cx('month-selector')}>
                            <label htmlFor="month">Chọn tháng: </label>
                            <DatePicker
                                id="month"
                                selected={monthPickerLineChart}
                                onChange={handleMonthChange}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className={cx('month-input')}
                            />
                        </div>
                        <SalesLineChart data={orderData} selectedMonth={formatMonth(monthPickerLineChart)} />
                        <div className={cx('chart-title')}>Biểu đồ so sánh các phương thức thanh toán</div>

                        <div className={cx('month-selector')}>
                            <label htmlFor="month">Chọn tháng: </label>
                            <DatePicker
                                id="month"
                                selected={monthPickerPieChart}
                                onChange={handleMonthPickerPieChartChange}
                                dateFormat="MM/yyyy"
                                showMonthYearPicker
                                className={cx('month-input')}
                            />
                        </div>
                        <PaymentMethodChart data={orderData} selectedMonth={formatMonth(monthPickerPieChart)} />
                        <div className={cx('chart-title')}>Biểu đồ doanh thu trong năm</div>
                        <div className={cx('year-selector')}>
                            <label htmlFor="year">Chọn năm: </label>
                            <DatePicker
                                id="year"
                                selected={moment(selectedYear, 'YYYY').toDate()}
                                onChange={handleYearChange}
                                dateFormat="yyyy"
                                showYearPicker
                                className={cx('year-input')}
                            />
                        </div>
                        <MonthlyRevenueBarChart data={orderData} selectedYear={String(selectedYear)} />
                    </>
                );
            case 'ProductTable':
                return <ProductTable />;
            case 'UserTable':
                return <UserTable />;
            case 'OrderTable':
                return <OrderTable />;
            default:
                return null;
        }
    };

    console.log(selectedYear);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('sidebar')}>
                    <ul className={cx('management-list')}>
                        <li
                            className={cx('management-item', { active: activeItem === 'RevenueChart' })}
                            onClick={() => handleItemClick('RevenueChart')}
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
