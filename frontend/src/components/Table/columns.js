import React from 'react';
import ImageCell from './ImageCell';
import { Button } from '@mui/material';
import { formattedPrice, formatDateString } from '@/calculate/calculate';

export const productColumns = (handleEdit, handleDelete) => [
    {
        field: 'imgSrc',
        headerName: 'Hình ảnh',
        flex: 2,
        renderCell: (params) => <ImageCell {...params} />,
    },
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'name', headerName: 'Tên sản phẩm', flex: 4 },
    {
        field: 'price',
        headerName: 'Giá',
        flex: 2,
        renderCell: (params) => {
            return <div>{formattedPrice(params.value)}</div>;
        },
    },
    { field: 'percentDiscount', headerName: '% giảm', flex: 2 },
    { field: 'origin', headerName: 'Xuất xứ', flex: 2 },
    { field: 'trademark', headerName: 'Thương hiệu', flex: 2 },
    { field: 'quantityInStock', headerName: 'Số lượng', flex: 2 },
    { field: 'expiry', headerName: 'HSD', flex: 2 },
    {
        field: 'edit',
        headerName: 'Sửa',
        flex: 2,
        renderCell: (params) => (
            <div>
                <Button onClick={() => handleEdit(params.row)} color="primary" variant="contained" size="small">
                    Sửa
                </Button>
            </div>
        ),
    },
    {
        field: 'delete',
        headerName: 'Xóa',
        flex: 2,
        renderCell: (params) => (
            <Button onClick={() => handleDelete(params.row.id)} color="secondary" variant="outlined" size="small">
                Xóa
            </Button>
        ),
    },
];

export const userColumns = (toggleStatus) => [
    { field: 'username', headerName: 'Tên ĐN', flex: 1 },
    { field: 'fullName', headerName: 'Họ và tên', flex: 1 },
    { field: 'address', headerName: 'Địa chỉ', flex: 2 },
    { field: 'email', headerName: 'Email', flex: 2 },
    {
        field: 'phone',
        headerName: 'SĐT',
        flex: 1,
        renderCell: (params) => {
            return <div>{params.value !== null ? '0' + params.value : ''}</div>;
        },
    },
    {
        field: 'sex',
        headerName: 'Giới tính',
        flex: 1,
        renderCell: (params) => {
            return <div>{params.value === true ? 'nam' : params.value === false ? 'nữ' : 'khác'}</div>;
        },
    },
    {
        field: 'date',
        headerName: 'Ngày sinh',
        flex: 1,
        renderCell: (params) => {
            return <div>{formatDateString(params.value)}</div>;
        },
    },
    {
        field: 'status',
        headerName: 'Thao tác',
        flex: 1,
        renderCell: (params) => {
            const isActive = params.value === 'active';
            return (
                <Button
                    onClick={() => toggleStatus(params.id)}
                    color={isActive ? 'secondary' : 'primary'}
                    variant="outlined"
                    size="small"
                >
                    {isActive ? 'Vô hiệu' : 'Kích hoạt'}
                </Button>
            );
        },
    },
];

export const orderColumns = (handleShowDetails) => [
    { field: 'orderCode', headerName: 'Mã đơn', flex: 1 },
    { field: 'username', headerName: 'TK', flex: 1 },
    { field: 'name', headerName: 'Họ và tên', flex: 1 },
    {
        field: 'phone',
        headerName: 'SĐT',
        flex: 1,
        renderCell: (params) => {
            return <div>{params.value !== null ? '0' + params.value : ''}</div>;
        },
    },
    {
        field: 'paymentMethod',
        headerName: 'Phương thức thanh toán',
        flex: 1,
        renderCell: (params) => {
            const paymentMethods = {
                CC: 'Thẻ',
                COD: 'Khi nhận hàng',
            };

            return <div>{paymentMethods[params.value] || 'Không xác định'}</div>;
        },
    },
    {
        field: 'purchaseDate',
        headerName: 'Ngày đặt hàng',
        flex: 1,
        renderCell: (params) => {
            return <div>{formatDateString(params.value)}</div>;
        },
    },
    {
        field: 'actions',
        headerName: 'Chi tiết',
        width: 150,
        renderCell: (params) => (
            <Button variant="contained" onClick={() => handleShowDetails(params.row)}>
                Chi tiết
            </Button>
        ),
    },
];