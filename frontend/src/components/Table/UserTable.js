import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyledDataGrid } from './ProductTableStyles';
import EditDialog from './EditDialog';
import { userColumns } from './columns';
import { Button, Box } from '@mui/material';
import { createUser, fetchAllDetailUsers, fetchToggerStatus } from '@/actions/userActions';
import Cookies from 'js-cookie';

const UserTable = () => {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const dispatch = useDispatch();
    const data = useSelector((state) => state.user.allDetails);
    const role = Cookies.get('role');

    useEffect(() => {
        dispatch(fetchAllDetailUsers());
    }, [dispatch]);

    useEffect(() => {
        if (data && data.length > 0) {
            setRows(data);
        }
    }, [data]);

    const handleToggleStatus = useCallback(
        async (data) => {
            try {
                await dispatch(fetchToggerStatus(data));

                await dispatch(fetchAllDetailUsers());
            } catch (error) {
                console.error(error);
            }
        },
        [dispatch],
    );

    function handleClose() {
        setOpen(false);
    }

    const handleSave = async (data) => {
        const newData = { ...data, role: 'admin' };
        try {
            await dispatch(createUser(newData));

            const result = await dispatch(fetchAllDetailUsers());

            if (result && !result.error) {
                handleClose();
            } else {
                console.error('Lỗi khi lấy danh sách chi tiết người dùng:', result.error);
            }
        } catch (error) {
            console.error('Lỗi khi tạo người dùng:', error);
        }
    };

    const handleAddNew = () => {
        setCurrentProduct({
            username: '',
            password: '',
        });
        setOpen(true);
    };

    const registerFields = [
        { label: 'Tên đăng nhập', name: 'username', required: true },
        { label: 'Mật khẩu', name: 'password', required: true },
    ];

    return (
        <Box sx={{ height: 400, width: '100%', marginBottom: '60px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '10px' }}>
                {role === 'superAdmin' && (
                    <Button onClick={handleAddNew} variant="contained" color="primary">
                        Thêm Admin
                    </Button>
                )}
            </Box>
            <StyledDataGrid
                rows={rows}
                getRowId={(row) => row.username}
                columns={userColumns(handleToggleStatus)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                experimentalFeatures={{ newEditingApi: true }}
            />
            <EditDialog
                open={open}
                onClose={handleClose}
                product={currentProduct}
                onSave={handleSave}
                fields={registerFields}
                title={'Thêm admin'}
            />
        </Box>
    );
};

export default UserTable;
