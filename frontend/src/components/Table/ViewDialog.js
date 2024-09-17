import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button } from '@mui/material';
import { formatDateString } from '@/calculate/calculate';
const ViewDialog = ({ open, onClose, product, fields, title }) => {
    const [currentData, setCurrentData] = useState(product);

    useEffect(() => {
        setCurrentData(product);
    }, [product]);

    const customRender = (name, value) => {
        // Tùy chỉnh hiển thị cho từng trường cụ thể
        switch (name) {
            case 'purchaseDate':
                return value ? formatDateString(currentData[name]) : 'N/A';
            case 'paymentMethod':
                const paymentMethods = {
                    CC: 'Thẻ',
                    COD: 'Khi nhận hàng',
                };

                return paymentMethods[value];
            default:
                return value || 'N/A';
        }
    };

    const parsePurchasedProducts = (purchasedProducts) => {
        if (!purchasedProducts) return [];

        return purchasedProducts.split(',').map((item) => {
            const [idNamePart, quantityPart] = item.split('(');

            const [id, name] = idNamePart.split(' - ');

            const quantity = quantityPart.replace(')', '').trim();

            return {
                id: id.trim(),
                name: name.trim(),
                quantity: quantity.trim(),
            };
        });
    };

    const purchasedProductsList = parsePurchasedProducts(currentData?.purchasedProducts);

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true}>
            <DialogTitle sx={{ fontSize: '1.6rem' }}>{title}</DialogTitle>
            <DialogContent>
                {fields.map(({ label, name }) => (
                    <div key={name} style={{ marginBottom: '16px' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {label}:
                        </Typography>
                        <Typography variant="body1" sx={{ fontSize: '1.2rem', marginTop: '4px' }}>
                            {customRender(name, currentData?.[name])}
                        </Typography>
                    </div>
                ))}

                {purchasedProductsList.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            Sản phẩm đã mua:
                        </Typography>
                        {purchasedProductsList.map(({ id, name, quantity }) => (
                            <Typography key={id} variant="body1" sx={{ fontSize: '1.2rem', marginTop: '4px' }}>
                                Mã sản phẩm:{id}, Tên sản phẩm : {name}, Số lượng: {quantity}
                            </Typography>
                        ))}
                    </div>
                )}

                <Button
                    onClick={onClose}
                    color="primary"
                    sx={{ fontSize: '1.2rem', padding: '10px 20px', marginTop: '10px' }}
                >
                    Đóng
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDialog;
