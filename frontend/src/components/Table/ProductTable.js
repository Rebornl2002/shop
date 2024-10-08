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
import ViewDialog from './ViewDialog';
import { productColumns } from './columns';
import { Button, Box } from '@mui/material';
import ModelDialog from './ModelDialog';

const ProductTable = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedProductForModels, setSelectedProductForModels] = useState(null); // Sản phẩm hiện tại cho quản lý mẫu mã
    const dispatch = useDispatch();
    const data = useSelector((state) => state.product.allDetails);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openModelDialog, setOpenModelDialog] = useState(false);

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
                await dispatch(fetchAllDetailProducts());
            } catch (error) {
                console.error('Xóa không thành công', error);
            }
        },
        [dispatch],
    );

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = async (data) => {
        const newData = { id: currentProduct.id, ...data };
        try {
            await dispatch(fetchUpdateProduct(newData));
            await dispatch(fetchAllDetailProducts());
            setOpen(false);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleSaveNew = async (currentProduct) => {
        try {
            await dispatch(fetchAddProduct(currentProduct));
            await dispatch(fetchAllDetailProducts());
            setOpen(false);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct({
            id: '',
            name: '',
            description: '',
            price: '',
            percentDiscount: '',
            origin: '',
            trademark: '',
            quantityInStock: '',
            expiry: '',
        });
        setOpen(true);
    };

    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    const handleOpenModelDialog = (product) => {
        setSelectedProductForModels(product);
        setOpenModelDialog(true);
    };

    const handleCloseModelDialog = () => {
        setOpenModelDialog(false);
        setSelectedProductForModels(null);
    };

    const productFields = [
        { label: 'Tên sản phẩm', name: 'name', required: true },
        { label: 'Mô tả', name: 'description', required: true },
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', marginTop: '10px' }}>
                <Button onClick={handleAddNew} variant="contained" color="primary">
                    Thêm Sản Phẩm
                </Button>
            </Box>
            <StyledDataGrid
                rows={rows}
                columns={productColumns(handleEdit, handleDelete, handleShowDetails, handleOpenModelDialog)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
            />
            {selectedOrder && (
                <ViewDialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    product={selectedOrder}
                    fields={[
                        { label: 'Xuất xứ', name: 'origin' },
                        { label: 'Thương hiệu', name: 'trademark' },
                        { label: 'Số lượng', name: 'quantityInStock' },
                        { label: 'HSD', name: 'expiry' },
                    ]}
                    title="Chi tiết sản phẩm"
                />
            )}
            <EditDialog
                open={open}
                onClose={handleClose}
                product={currentProduct}
                onSave={currentProduct?.id ? handleSave : handleSaveNew}
                fields={productFields}
                title={currentProduct?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                onImg={true}
            />

            {/* Dialog hiển thị mẫu mã của sản phẩm được chọn */}
            {selectedProductForModels && (
                <ModelDialog
                    open={openModelDialog}
                    onClose={handleCloseModelDialog}
                    product={selectedProductForModels} // Truyền sản phẩm hiện tại vào ModelDialog
                />
            )}
        </Box>
    );
};

export default ProductTable;
