import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import StatusButton from '../atoms/StatusButton';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Close from '@mui/icons-material/Close';
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemName: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteConfirmationModal({
  isOpen,
  itemName,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '30px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          bgcolor: '#EDF1F3',
          minHeight: '280px',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: '24px',
          color: '#333',
          bgcolor: '#F5F5F5',
          borderBottom: 'none',
          px: 8,
          py: 4,
          pb: 3,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            mb: 0.5,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(239,68,68,0.3)',
              mb: 1,
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 32, color: '#fff' }} />
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, color: '#D64545' }}
          >
            Delete User
          </Typography>
        </Box>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[600],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 3, bgcolor: '#F5F5F5', px: 8 }}>
        <Typography
          sx={{
            color: '#57656F',
            mb: 2,
            textAlign: 'center',
            fontSize: '15px',
          }}
        >
          Are you sure you want to delete
        </Typography>
        <Typography
          sx={{
            fontWeight: 700,
            color: '#1F3A4A',
            mb: 2,
            textAlign: 'center',
            fontSize: '16px',
          }}
        >
          {itemName}?
        </Typography>
        <Typography
          sx={{
            color: '#8A95A1',
            fontSize: '14px',
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          This action cannot be undone. All associated data will be permanently removed.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          justifyContent: 'center',
          bgcolor: '#F5F5F5',
          borderTop: '1px solid #E0E0E0',
        }}
      >
        <StatusButton
          status="cancel"
          onClick={onClose}
          disabled={isDeleting}
          sx={{ minWidth: 120 }}
        >
          Cancel
        </StatusButton>

        <StatusButton
          status="delete"
          onClick={handleConfirm}
          disabled={isDeleting}
          sx={{ minWidth: 120 }}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
}