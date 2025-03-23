import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Box,
  SxProps,
  Theme,
  Card,
  Typography,
  Divider,
} from '@mui/material';

interface GenericModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  actions?: React.ReactNode; // Optional custom actions
  width?: number | string; // Optional width of the modal
  loading?: boolean; // Optional loading state
  sx?: SxProps<Theme>; // Optional custom styles
}

const GenericModal: React.FC<GenericModalProps> = ({
  open,
  onClose,
  title,
  content,
  actions,
  width = '50%', // Default width
  loading = false, // Default loading state
  sx, // Custom styles
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg" // Set the maximum width of the modal
      fullWidth // Make the modal take up the full width
      slotProps={{
        paper: {
          sx: {
            width: width, // Set the width of the modal
            borderRadius: 2, // Rounded corners
            boxShadow: 24, // Subtle shadow
            ...sx, // Apply custom styles
          },
        },
      }}
    >
      {/* Dialog Title */}
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      {/* Divider between title and content */}
      <Divider />

      {/* Dialog Content */}
      <DialogContent>
        {loading ? ( // Show a loading spinner if loading is true
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ padding: 2 }}>{content}</Box> // Render the content if not loading
        )}
      </DialogContent>

      {/* Dialog Actions */}
      {actions && (
        <>
          <Divider />
          <DialogActions sx={{ padding: 2 }}>{actions}</DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default GenericModal;