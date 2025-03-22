import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box } from '@mui/material';

// Define the types for the props
interface CustomizedDataGridProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  onAddButtonClick?: () => void;
  onRefreshButtonClick?: () => void;
}

// Custom Toolbar with Add Button, Refresh Button, Search, Export, and Density Selector
const CustomToolbar: React.FC<{
  onAddButtonClick?: () => void;
  onRefreshButtonClick?: () => void;
}> = ({ onAddButtonClick, onRefreshButtonClick }) => {
  return (
    <GridToolbarContainer>
      {/* Add Button */}
      <Button
        variant="outlined"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddButtonClick}
        sx={{ marginRight: '8px' }}
      >
        Add
      </Button>

      {/* Refresh Button */}
      {/* <Button
        variant="outlined"
        color="primary"
        startIcon={<RefreshIcon />}
        onClick={onRefreshButtonClick}
        sx={{ marginRight: '8px' }}
      >
        Refresh
      </Button> */}

      {/* Export Button */}
      {/* <GridToolbarExport
        sx={{ marginRight: '8px' }}
        csvOptions={{
          fileName: 'data-grid-export',
          delimiter: ',',
          utf8WithBom: true,
        }}
      /> */}

      {/* Density Selector */}
      {/* <GridToolbarDensitySelector sx={{ marginRight: '8px' }} /> */}

      {/* Quick Search Field */}
      <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <GridToolbarQuickFilter />
      </Box>
    </GridToolbarContainer>
  );
};

const CustomizedDataGrid: React.FC<CustomizedDataGridProps> = ({
  rows,
  columns,
  onAddButtonClick,
  onRefreshButtonClick,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) => (params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd')}
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        sx={(theme) => ({
          borderColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
          '& .MuiDataGrid-cell': {
            borderColor:
              theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
          },
        })}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slots={{
          toolbar: () => (
            <CustomToolbar
              onAddButtonClick={onAddButtonClick}
              onRefreshButtonClick={onRefreshButtonClick}
            />
          ), // Add custom toolbar
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true, // Enable quick filter
          },
        }}
      />
    </div>
  );
};

export default CustomizedDataGrid;