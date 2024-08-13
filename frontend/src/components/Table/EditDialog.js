import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';

const EditDialog = ({ open, onClose, product, onSave, onChange }) => {
    const [currentProduct, setCurrentProduct] = useState(product);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Cập nhật trạng thái ban đầu khi `product` thay đổi
        setCurrentProduct(product);
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });

        if (value.trim() !== '') {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSave = () => {
        let newErrors = {};
        let changedFields = {};

        // Kiểm tra các trường bắt buộc và lưu các trường đã thay đổi
        if (!currentProduct?.name) newErrors.name = 'Tên sản phẩm không được để trống';
        if (!currentProduct?.price) newErrors.price = 'Giá không được để trống';
        if (currentProduct?.price <= 0) newErrors.price = 'Giá phải lớn hơn 0';
        if (!currentProduct?.quantityInStock) newErrors.quantityInStock = 'Số lượng không được để trống';
        if (currentProduct?.quantityInStock < 0) newErrors.quantityInStock = 'Số lượng không thể nhỏ hơn 0';
        if (!currentProduct?.imgSrc) newErrors.imgSrc = 'Ảnh sản phẩm không được để trống';

        // So sánh với giá trị ban đầu và lưu các trường đã thay đổi
        Object.keys(currentProduct).forEach((key) => {
            if (currentProduct[key] !== product[key]) {
                changedFields[key] = currentProduct[key];
            }
        });

        if (Object.keys(newErrors).length === 0) {
            if (Object.keys(changedFields).length > 0) {
                onSave(changedFields);
            } else {
                console.log('Không có thay đổi nào.');
                onClose();
            }
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle sx={{ fontSize: '1.6rem' }}>{product?.id ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <Button variant="contained" component="label" sx={{ fontSize: '1.2rem', padding: '10px 20px' }}>
                            Tải ảnh lên
                            <input
                                type="file"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setCurrentProduct({ ...currentProduct, imgSrc: reader.result });
                                            setErrors({ ...errors, imgSrc: null }); // Xóa lỗi khi tải ảnh lên
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </Button>
                        <div style={{ flexGrow: 1 }} />
                        {currentProduct?.imgSrc && (
                            <img
                                src={currentProduct.imgSrc}
                                alt="Ảnh sản phẩm"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        )}
                    </div>
                    {errors.imgSrc && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.imgSrc}</div>}
                    <TextField
                        label="Tên sản phẩm"
                        name="name"
                        value={currentProduct?.name || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                    <TextField
                        label="Giá"
                        name="price"
                        type="number"
                        value={currentProduct?.price || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                        required
                        error={!!errors.price}
                        helperText={errors.price}
                    />
                    <TextField
                        label="% Giảm"
                        name="percentDiscount"
                        type="number"
                        value={currentProduct?.percentDiscount || ''}
                        onChange={handleChange}
                        fullWidth
                        required
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                    />
                    <TextField
                        label="Xuất xứ"
                        name="origin"
                        value={currentProduct?.origin || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                    />
                    <TextField
                        label="Thương hiệu"
                        name="trademark"
                        value={currentProduct?.trademark || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                    />
                    <TextField
                        label="Số lượng"
                        name="quantityInStock"
                        type="number"
                        value={currentProduct?.quantityInStock || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                        required
                        error={!!errors.quantityInStock}
                        helperText={errors.quantityInStock}
                    />
                    <TextField
                        label="HSD"
                        name="expiry"
                        value={currentProduct?.expiry || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                        error={!!errors.expiry}
                        helperText={errors.expiry}
                    />

                    <Button
                        onClick={handleSave}
                        color="primary"
                        sx={{ fontSize: '1.2rem', padding: '10px 20px', marginTop: '10px' }}
                    >
                        Lưu
                    </Button>
                    <Button
                        onClick={onClose}
                        color="secondary"
                        sx={{ fontSize: '1.2rem', padding: '10px 20px', marginTop: '10px' }}
                    >
                        Hủy
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditDialog;
