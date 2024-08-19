import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';

const EditDialog = ({ open, onClose, product, onSave, onImg, fields, title }) => {
    const [currentData, setCurrentData] = useState(product);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setCurrentData(product);
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentData({ ...currentData, [name]: value });

        if (value.trim() !== '') {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleSave = () => {
        let newErrors = {};
        let changedFields = {};

        fields.forEach(({ name, required, validate }) => {
            if (required && !currentData?.[name]) {
                newErrors[name] = `${name} không được để trống`;
            }
            if (validate && !validate(currentData?.[name])) {
                newErrors[name] = `${name} không hợp lệ`;
            }
        });

        Object.keys(currentData).forEach((key) => {
            if (currentData[key] !== product[key]) {
                changedFields[key] = currentData[key];
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
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: '1.6rem' }}>{title}</DialogTitle>
            <DialogContent>
                {onImg && (
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
                                            setCurrentData({ ...currentData, imgSrc: reader.result });
                                            setErrors({ ...errors, imgSrc: null }); // Xóa lỗi khi tải ảnh lên
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </Button>
                        <div style={{ flexGrow: 1 }} />
                        {currentData?.imgSrc && (
                            <img
                                src={currentData.imgSrc}
                                alt="Ảnh sản phẩm"
                                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                        )}
                    </div>
                )}
                {errors.imgSrc && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.imgSrc}</div>}
                {fields.map(({ label, name, type = 'text', required }) => (
                    <TextField
                        key={name}
                        label={label}
                        name={name}
                        type={type}
                        value={currentData?.[name] || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.2rem' } }}
                        required={required}
                        error={!!errors[name]}
                        helperText={errors[name]}
                    />
                ))}

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
    );
};

export default EditDialog;
