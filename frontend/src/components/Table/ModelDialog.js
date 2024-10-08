import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box } from '@mui/material';
import { Add } from '@mui/icons-material';
import EditDialog from './EditDialog';
import { variationTable } from './columns';
import { StyledDataGrid } from './ProductTableStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAddVariation, fetchDeleteVariation, fetchGetVariation } from '@/actions/productActions';

const ModelDialog = ({ open, onClose, product }) => {
    const [models, setModels] = useState([]);
    const [currentModel, setCurrentModel] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const data = useSelector((state) => state.product.variations);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchVariationData = async () => {
            if (product) {
                try {
                    await dispatch(fetchGetVariation(product.id));
                } catch (error) {
                    console.error('Có lỗi xảy ra khi tải dữ liệu mẫu mã:', error);
                }
            }
        };

        fetchVariationData();
    }, [product, dispatch]);

    useEffect(() => {
        if (data) {
            setModels(data);
        }
    }, [data]);

    const handleOpenAddDialog = () => {
        setCurrentModel({
            description: '',
            price: '',
            stock: '',
            image: '',
        });
        setIsEditing(false);
        setOpenEditDialog(true);
    };

    const handleOpenEditDialog = (model) => {
        setCurrentModel(model);
        setIsEditing(true);
        setOpenEditDialog(true);
    };

    const handleDeleteModel = async (modelId) => {
        try {
            await dispatch(fetchDeleteVariation(modelId));
            const updatedModels = models.filter((model) => model.id !== modelId);
            setModels(updatedModels);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSaveModel = async (newModel) => {
        if (isEditing) {
            setModels(models.map((model) => (model.id === currentModel.id ? { ...model, ...newModel } : model)));
        } else {
            const data = { productId: product.id, ...newModel };
            await dispatch(fetchAddVariation(data));
            await dispatch(fetchGetVariation(product.id));
        }
        setOpenEditDialog(false);
    };

    const modelFields = [
        { label: 'Mô tả', name: 'description', required: true },
        { label: 'Giá', name: 'price', type: 'number', required: true },
        { label: 'Số lượng trong kho', name: 'stock', type: 'number', required: true },
    ];

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true}>
            <DialogTitle>Quản lý mẫu mã của {product.name}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpenAddDialog}>
                        Thêm mẫu mã
                    </Button>
                </Box>

                <div style={{ height: 400, width: '100%' }}>
                    <StyledDataGrid
                        rows={models}
                        columns={variationTable(handleOpenEditDialog, handleDeleteModel)}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                </div>
            </DialogContent>

            {openEditDialog && (
                <EditDialog
                    open={openEditDialog}
                    onClose={() => setOpenEditDialog(false)}
                    product={currentModel}
                    onSave={handleSaveModel}
                    fields={modelFields}
                    title={isEditing ? 'Sửa mẫu mã' : 'Thêm mẫu mã'}
                    onImg={true}
                />
            )}
        </Dialog>
    );
};

export default ModelDialog;
