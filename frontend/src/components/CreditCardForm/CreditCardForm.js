import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CreditCardForm = ({ onSubmit }) => {
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        address: '',
        postalCode: '',
    });
    const [formErrors, setFormErrors] = useState({});

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormValues({
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardHolder: '',
            address: '',
            postalCode: '',
        });
        setFormErrors({});
    };

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        let errors = {};

        if (!formValues.cardNumber) {
            errors.cardNumber = 'Số thẻ là bắt buộc';
        } else if (
            !/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/.test(
                formValues.cardNumber,
            )
        ) {
            errors.cardNumber = 'Số thẻ không hợp lệ !';
        }

        if (!formValues.expiryDate) {
            errors.expiryDate = 'Ngày hết hạn là bắt buộc';
        } else if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(formValues.expiryDate)) {
            errors.expiryDate = 'Ngày hết hạn phải đúng định dạng MM/YY';
        }

        if (!formValues.cvv) {
            errors.cvv = 'Mã CVV là bắt buộc';
        } else if (!/^(?:\d{3}|\d{4})$/.test(formValues.cvv)) {
            errors.cvv = 'Mã CVV phải là 3 hoặc 4 chữ số';
        }

        if (!formValues.cardHolder) {
            errors.cardHolder = 'Họ và tên chủ thẻ là bắt buộc';
        } else if (!/^[A-Z0-9\s.,!?]*$/.test(formValues.cardHolder)) {
            errors.cardHolder = 'Tên phải viết in hoa, không dấu';
        }

        if (!formValues.address) {
            errors.address = 'Địa chỉ là bắt buộc';
        }

        if (!formValues.postalCode) {
            errors.postalCode = 'Mã bưu chính là bắt buộc';
        }

        return errors;
    };

    const handleSubmit = () => {
        const errors = validate();
        if (Object.keys(errors).length === 0) {
            onSubmit(formValues);
            handleClose();
        } else {
            setFormErrors(errors);
        }
    };

    return (
        <Box sx={{ textAlign: 'center', marginTop: 0 }}>
            <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                sx={{
                    borderRadius: '8px',
                    padding: '8px 16px',
                    textTransform: 'none',
                    color: '#333',
                    borderColor: '#ccc',
                }}
            >
                Thẻ Khác
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Chi tiết thẻ</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} marginTop={0}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Số thẻ"
                                variant="outlined"
                                required
                                name="cardNumber"
                                value={formValues.cardNumber}
                                onChange={handleChange}
                                error={!!formErrors.cardNumber}
                                helperText={formErrors.cardNumber}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Ngày hết hạn (MM/YY)"
                                variant="outlined"
                                required
                                name="expiryDate"
                                value={formValues.expiryDate}
                                onChange={handleChange}
                                error={!!formErrors.expiryDate}
                                helperText={formErrors.expiryDate}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Mã CVV"
                                variant="outlined"
                                required
                                name="cvv"
                                value={formValues.cvv}
                                onChange={handleChange}
                                error={!!formErrors.cvv}
                                helperText={formErrors.cvv}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Họ và tên chủ thẻ"
                                variant="outlined"
                                required
                                name="cardHolder"
                                value={formValues.cardHolder}
                                onChange={handleChange}
                                error={!!formErrors.cardHolder}
                                helperText={formErrors.cardHolder}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Địa chỉ đăng ký thẻ Tín dụng/Ghi nợ
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Địa chỉ"
                                variant="outlined"
                                required
                                name="address"
                                value={formValues.address}
                                onChange={handleChange}
                                error={!!formErrors.address}
                                helperText={formErrors.address}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mã bưu chính"
                                variant="outlined"
                                required
                                name="postalCode"
                                value={formValues.postalCode}
                                onChange={handleChange}
                                error={!!formErrors.postalCode}
                                helperText={formErrors.postalCode}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="caption" display="block" gutterBottom>
                                1.000 VND sẽ bị trừ trong thẻ của bạn trong quá trình xác minh. Số tiền này sẽ được hoàn
                                trả trong vòng 14 ngày.
                            </Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">
                        Trở Lại
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CreditCardForm;
