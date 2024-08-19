import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAddProduct,
    fetchAllDetailProducts,
    fetchDeleteProduct,
    fetchUpdateProduct,
} from '@/actions/productActions';
import { StyledDataGrid } from './ProductTableStyles';
import EditDialog from './EditDialog';
import { productColumns } from './columns';
import { Button, Box } from '@mui/material';

const ProductTable = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.product.allDetails);

    useEffect(() => {
        dispatch(fetchAllDetailProducts());
    }, [dispatch]);

    useEffect(() => {
        if (data && data.length > 0) {
            setRows(data);
        }
    }, [data]);

    const handleEdit = useCallback((product) => {
        setCurrentProduct(product);
        setOpen(true);
    }, []);

    const handleDelete = useCallback(
        async (id) => {
            try {
                await dispatch(fetchDeleteProduct(id));

                await dispatch(fetchAllDetailProducts(id));
            } catch (error) {
                console.error('Xóa không thành công', error);
            }
        },
        [dispatch],
    );

    function handleClose() {
        setOpen(false);
    }

    const handleSave = async (data) => {
        const newData = { id: currentProduct.id, ...data };
        try {
            // Gửi yêu cầu cập nhật sản phẩm
            await dispatch(fetchUpdateProduct(newData));

            // Nếu cập nhật thành công, gửi yêu cầu lấy tất cả sản phẩm
            await dispatch(fetchAllDetailProducts());

            // Đóng hộp thoại sau khi hoàn tất
            setOpen(false);
        } catch (error) {
            // Xử lý lỗi (nếu có)
            console.error('Error updating product:', error);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct({
            id: '',
            name: '',
            price: '',
            percentDiscount: '',
            origin: '',
            trademark: '',
            quantityInStock: '',
            expiry: '',
        });
        setOpen(true);
    };

    const handleSaveNew = async (currentProduct) => {
        try {
            await dispatch(fetchAddProduct(currentProduct));

            await dispatch(fetchAllDetailProducts());

            setOpen(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const productFields = [
        { label: 'Tên sản phẩm', name: 'name', required: true },
        { label: 'Giá', name: 'price', type: 'number', required: true, validate: (value) => value > 0 },
        {
            label: 'Phần trăm giảm giá',
            name: 'percentDiscount',
            type: 'number',
            validate: (value) => value >= 0 && value <= 100,
        },
        { label: 'Xuất xứ', name: 'origin' },
        { label: 'Thương hiệu', name: 'trademark' },
        { label: 'Số lượng', name: 'quantityInStock', type: 'number', required: true, validate: (value) => value >= 0 },
        { label: 'Hạn sử dụng', name: 'expiry' },
    ];

    return (
        <Box sx={{ height: 400, width: '100%', marginBottom: '60px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '10px' }}>
                <Button onClick={handleAddNew} variant="contained" color="primary">
                    Thêm Sản Phẩm
                </Button>
            </Box>
            <StyledDataGrid
                rows={rows}
                columns={productColumns(handleEdit, handleDelete)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
            />
            <EditDialog
                open={open}
                onClose={handleClose}
                product={currentProduct}
                onSave={currentProduct?.id ? handleSave : handleSaveNew}
                fields={productFields}
                title={currentProduct?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                onImg={true}
            />
        </Box>
    );
};

export default ProductTable;
