import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
} from '@mui/material';
import Close from '@mui/icons-material/Close';
import StatusButton from '../atoms/StatusButton';
import type { User } from '../../types';

interface UserFormModalProps {
  isOpen: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  mode?: 'user' | 'admin';
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

export default function UserFormModal({
  isOpen,
  user,
  loading,
  error,
  mode = 'user',
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    contactPerson: '',
    email: '',
    phoneNumber: '',
    businessName: '',
    businessAddress: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        contactPerson: user.contactPerson || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        businessName: user.businessName || '',
        businessAddress: user.businessAddress || '',
      });
    } else {
      setFormData({
        contactPerson: '',
        email: '',
        phoneNumber: '',
        businessName: '',
        businessAddress: '',
      });
    }
    setValidationErrors({});
  }, [user, isOpen, mode]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.contactPerson.trim()) {
      errors.contactPerson = 'Contact person name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\-\+\(\)\s]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await onSubmit({
        contactPerson: formData.contactPerson,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        businessName: formData.businessName,
        businessAddress: formData.businessAddress,
      });

      setFormData({
        contactPerson: '',
        email: '',
        phoneNumber: '',
        businessName: '',
        businessAddress: '',
      });
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: 'admin-dialog-paper',
        sx: { width: 800 }
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, position: 'relative' }}>
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
            className="admin-dialog-header-icon"
            aria-hidden
            sx={{
              position: 'absolute',
              left: '50%',
              top: 15,
              transform: 'translateX(-50%)',
            }}
          >
            {user ? (
              <Box
                component="img"
                src="/adminedit.png"
                alt="Edit User Icon"
                sx={{ height: 80 }}
              />
            ) : (
              <Box
                component="img"
                src="/adminadd.png"
                alt="Add User Icon"
                sx={{ height: 80 }}
              />
            )}
          </Box>

          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 700, mt: 8 }}
          >
            {user ? 'Edit User' : 'Add New User'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: -1 }}>
            {user
              ? 'Update user details and contact information.'
              : 'Create a new user with contact and business information.'}
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

      <DialogContent sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '6px' }}>
            {error}
          </Alert>
        )}

        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="Username"
              value={formData.contactPerson}
              onChange={(e) => handleInputChange('contactPerson', e.target.value)}
              error={!!validationErrors.contactPerson}
              helperText={validationErrors.contactPerson}
              disabled={loading}
              autoFocus
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={loading}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              error={!!validationErrors.phoneNumber}
              helperText={validationErrors.phoneNumber}
              disabled={loading}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Business Name"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              helperText="Optional"
              disabled={loading}
            />
          </Box>

          <Box sx={{ gridColumn: '1 / -1' }}>
            <TextField
              fullWidth
              label="Business Address"
              value={formData.businessAddress}
              onChange={(e) => handleInputChange('businessAddress', e.target.value)}
              multiline
              rows={2}
              helperText="Optional"
              disabled={loading}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 2, justifyContent: 'center' }}>
        <StatusButton
          status="cancel"
          onClick={onClose}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          Cancel
        </StatusButton>

        <StatusButton
          status="confirm"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : undefined}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Saving...' : 'Ok'}
        </StatusButton>
      </DialogActions>
    </Dialog>
  );
}