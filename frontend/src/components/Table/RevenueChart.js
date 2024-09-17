import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    BarChart,
    Bar,
    PieChart,
    Pie,
    ResponsiveContainer,
} from 'recharts';
import moment from 'moment';

// Component SalesLineChart xử lý dữ liệu từ props
const SalesLineChart = ({ data, selectedMonth }) => {
    // Lọc dữ liệu cho tháng được chọn
    const filteredData = data.filter((order) => moment(order.purchaseDate).isSame(selectedMonth, 'month'));
    // Tổng hợp dữ liệu theo ngày trong tháng
    const aggregatedData = filteredData.reduce((acc, order) => {
        const day = moment(order.purchaseDate).format('DD'); // Chỉ lấy số ngày
        const existingEntry = acc.find((entry) => entry.date === day);

        if (existingEntry) {
            existingEntry.sales += order.totalPrice; // Cộng tổng nếu đã có ngày này
        } else {
            acc.push({ date: day, sales: order.totalPrice }); // Thêm mục mới nếu chưa có
        }

        return acc;
    }, []);

    // Sắp xếp dữ liệu theo ngày
    const sortedData = aggregatedData.sort((a, b) => parseInt(a.date, 10) - parseInt(b.date, 10));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart margin={{ top: 30, right: 30, left: 50, bottom: 30 }} data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(tick) => tick.padStart(2, '0')} // Đảm bảo số ngày luôn có 2 chữ số
                />
                <YAxis tickFormatter={(value) => `${value.toLocaleString()} ₫`} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Doanh thu" />
            </LineChart>
        </ResponsiveContainer>
    );
};

const COLORS = ['#9D5CC9', '#FFBB28'];

const PaymentMethodChart = ({ data, selectedMonth }) => {
    // Tổng hợp dữ liệu theo phương thức thanh toán
    const filteredData = data.filter((order) => moment(order.purchaseDate).isSame(selectedMonth, 'month'));

    const aggregatedData = filteredData.reduce((acc, order) => {
        const method = order.paymentMethod;
        if (!acc[method]) {
            acc[method] = 0;
        }
        acc[method] += order.totalPrice;
        return acc;
    }, {});

    // Chuyển đổi dữ liệu thành định dạng cho biểu đồ
    const pieData = Object.keys(aggregatedData).map((method, index) => {
        let displayName;
        switch (method) {
            case 'CC':
                displayName = 'Thanh toán bằng thẻ';
                break;
            case 'COD':
                displayName = 'Thanh toán khi nhận hàng';
                break;
            default:
                displayName = method;
        }

        return {
            name: displayName,
            value: aggregatedData[method],
            fill: COLORS[index % COLORS.length],
        };
    });

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
                <Legend />
                <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill={(data) => data.fill}
                    label={(entry) => `${entry.value.toLocaleString()} ₫`} // Thêm đơn vị vào nhãn
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

const MonthlyRevenueBarChart = ({ data, selectedYear }) => {
    const filteredData = data.filter((order) => moment(order.purchaseDate).isSame(selectedYear, 'year'));

    const monthlyData = filteredData.reduce((acc, order) => {
        const month = moment(order.purchaseDate).format('MM/YYYY');
        const existingEntry = acc.find((entry) => entry.month === month);

        if (existingEntry) {
            existingEntry.revenue += order.totalPrice;
        } else {
            acc.push({ month, revenue: order.totalPrice });
        }

        return acc;
    }, []);

    const sortedMonthlyData = monthlyData.sort(
        (a, b) => moment(a.month, 'MM/YYYY').toDate() - moment(b.month, 'MM/YYYY').toDate(),
    );

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sortedMonthlyData} margin={{ top: 30, right: 30, left: 50, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => value.toLocaleString() + ' đ'} />
                <Tooltip formatter={(value) => `${value.toLocaleString()} đ`} />
                <Legend />
                <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export { SalesLineChart, PaymentMethodChart, MonthlyRevenueBarChart };
