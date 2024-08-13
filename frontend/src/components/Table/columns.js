import React from 'react';
import ImageCell from './ImageCell';
import { Button } from '@mui/material';
import { formattedPrice } from '@/calculate/calculate';

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
