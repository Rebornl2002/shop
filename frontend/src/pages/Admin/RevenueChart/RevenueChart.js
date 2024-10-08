import { SalesLineChart, PaymentMethodChart, MonthlyRevenueBarChart } from '@/components/Table/RevenueChart';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetAllOrder } from '@/actions/orderActions';
import moment from 'moment';
import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import styles from './RevenueChart.module.scss';

const cx = classNames.bind(styles);

function RevenueChart() {
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.order.orders);
    const [monthPickerLineChart, setMonthPickerLineChart] = useState(moment().toDate());
    const [monthPickerPieChart, setMonthPickerPieChart] = useState(moment().toDate());
    const [selectedYear, setSelectedYear] = useState(moment().year());

    useEffect(() => {
        dispatch(fetchGetAllOrder());
    }, [dispatch]);

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
}

export default RevenueChart;
