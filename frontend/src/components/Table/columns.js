import React from 'react';
import ImageCell from './ImageCell';
import { Button, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { formattedPrice, formatDateString } from '@/calculate/calculate';

export const productColumns = (handleEdit, handleDelete, handleShowDetails, handleOpenModelDialog) => [
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
    {
        field: 'actions',
        headerName: 'Chi tiết',
        flex: 2,
        renderCell: (params) => (
            <Button onClick={() => handleShowDetails(params.row)} color="success" variant="outlined" size="small">
                Chi tiết
            </Button>
        ),
    },
    {
        field: 'model',
        headerName: 'Mẫu mã',
        flex: 2,
        renderCell: (params) => (
            <Button onClick={() => handleOpenModelDialog(params.row)} color="success" variant="outlined" size="small">
                Mẫu
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

export const variationTable = (handleOpenEditDialog, handleDeleteModel) => [
    {
        field: 'imgSrc',
        headerName: 'Hình ảnh',
        flex: 1,
        renderCell: (params) => <ImageCell {...params} />,
    },
    { field: 'description', headerName: 'Mô tả', flex: 1 },
    { field: 'price', headerName: 'Giá', width: 100, type: 'number', flex: 1 },
    { field: 'stock', headerName: 'Số lượng', flex: 1, type: 'number' },
    {
        field: 'actions',
        headerName: 'Hành động',
        flex: 1,
        renderCell: (params) => (
            <>
                <IconButton onClick={() => handleOpenEditDialog(params.row)} size="small">
                    <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteModel(params.row.id)} size="small" color="secondary">
                    <Delete />
                </IconButton>
            </>
        ),
    },
];
