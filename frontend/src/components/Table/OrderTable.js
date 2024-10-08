import React, { useState, useEffect } from 'react';
import { StyledDataGrid } from './ProductTableStyles';
import { orderColumns } from './columns';
import { Box } from '@mui/material';
import ViewDialog from './ViewDialog';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGetAllOrder } from '@/actions/orderActions';

const OrderTable = () => {
    const [rows, setRows] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch();
    const orderData = useSelector((state) => state.order.orders);

    useEffect(() => {
        dispatch(fetchGetAllOrder());
    }, [dispatch]);

    useEffect(() => {
        if (orderData && orderData.length > 0) {
            setRows(orderData);
        }
    }, [orderData]);

    // Hàm mở hộp thoại và hiển thị chi tiết đơn hàng
    const handleShowDetails = (order) => {
        setSelectedOrder(order);
        setOpenDialog(true);
    };

    // Hàm đóng hộp thoại
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrder(null);
    };

    return (
        <Box sx={{ height: 400, width: '100%', marginBottom: '60px' }}>
            <StyledDataGrid
                rows={rows}
                getRowId={(row) => row.orderCode}
                columns={orderColumns(handleShowDetails)}
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
                        { label: 'Mã đơn hàng', name: 'orderCode' },
                        { label: 'Tên khách hàng', name: 'name' },
                        { label: 'Ngày đặt hàng', name: 'purchaseDate' },
                        { label: 'Phương thức thanh toán', name: 'paymentMethod' },
                        { label: 'Trạng thái đơn hàng', name: 'status' },
                        { label: 'Địa chỉ', name: 'address' },
                        { label: 'Số thẻ', name: 'cardNumber' },
                        { label: 'Tổng tiền', name: 'totalPrice' },
                    ]}
                    title="Chi tiết đơn hàng"
                />
            )}
        </Box>
    );
};

export default OrderTable;
