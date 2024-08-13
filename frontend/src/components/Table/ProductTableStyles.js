import styled from '@emotion/styled';
import { DataGrid } from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)`
    .MuiDataGrid-root {
        width: 100% !important;
        box-sizing: border-box;
        user-select: none;
    }
    .MuiDataGrid-cell {
        text-align: center;
        overflow: hidden;
        box-sizing: border-box;
        font-size: 1.2rem;
        text-transform: capitalize;
        text-overflow: clip;
    }
    .MuiDataGrid-columnHeader {
        text-align: center;
        font-size: 1.2rem;
        text-transform: capitalize;
    }
    .MuiDataGrid-columnHeaderTitleContainerContent {
        flex: 1;
    }
    .MuiDataGrid-columnHeaderTitle {
        flex: 1;
    }
    .image-cell {
        width: 100px;
        height: 60px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        margin: auto;
    }
`;
