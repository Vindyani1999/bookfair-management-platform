import { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';
import ReusableTable from '../components/atoms/ReusableTable';
import StatusButton from '../components/atoms/StatusButton';
import UserFormModal from '../components/molecules/UserFormModal';
import DeleteConfirmationModal from '../components/molecules/DeleteConfirmationModal';
import { userAPI } from '../services/api';
import type { User } from '../types';
import type { Column } from '../types/types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers();

      let usersData: User[];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else {
        usersData = response.data.data || [];
      }

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      showSnackbar('Failed to load users', 'error');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUserModal = (user?: User) => {
    setFormError(null);
    if (user) {
      setSelectedUser(user);
    } else {
      setSelectedUser(null);
    }
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
    setFormError(null);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setFormLoading(true);
      setFormError(null);

      if (selectedUser) {
        await userAPI.updateUser(selectedUser.id, data);
        showSnackbar('User updated successfully', 'success');
      } else {
        await userAPI.createUser(data);
        showSnackbar('User created successfully', 'success');
      }

      handleCloseFormModal();
      fetchUsers();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save user';
      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await userAPI.deleteUser(userToDelete.id);
      showSnackbar('User deleted successfully', 'success');
      handleCloseDeleteModal();
      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      showSnackbar(errorMessage, 'error');
    }
  };

  const showSnackbar = (message: string, type: 'success' | 'error') => {
    setSnackbar({ open: true, message, type });

    setTimeout(() => {
      setSnackbar({ open: false, message: '', type: 'success' });
    }, 4000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: '', type: 'success' });
  };

  type UserRow = {
    id: number;
    contactPerson: string;
    email: string;
    phoneNumber: string;
  };

  const columns: Column<UserRow>[] = [
    {
      id: 'id',
      header: 'ID',
      field: 'id',
      width: 60,
      hidden: false,
      render: (row: UserRow) => String(row.id).padStart(2, '0'),
    },
    {
      id: 'contactPerson',
      header: 'Full Name',
      field: 'contactPerson',
      hidden: false,
    },
    {
      id: 'email',
      header: 'Email Address',
      field: 'email',
      hidden: false,
    },
    {
      id: 'phoneNumber',
      header: 'Contact Number',
      field: 'phoneNumber',
      hidden: false,
    },
    {
      id: 'edit',
      header: 'Edit',
      width: 100,
      align: 'center',
      hidden: false,
      render: (row: UserRow) => (
        <Button
          variant="outlined"
          size="small"
          color="success"
          startIcon={<EditIcon />}
          onClick={() => {
            const user = users.find(u => u.id === row.id);
            if (user) handleOpenUserModal(user);
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      id: 'remove',
      header: 'Remove',
      width: 120,
      align: 'center',
      hidden: false,
      render: (row: UserRow) => (
        <Button
          variant="contained"
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => {
            const user = users.find(u => u.id === row.id);
            if (user) handleOpenDeleteModal(user);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  const tableRows: UserRow[] = users.map(user => ({
    id: user.id,
    contactPerson: user.contactPerson || '-',
    email: user.email || '-',
    phoneNumber: user.phoneNumber || '-',
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Manage Users
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Box />
        <StatusButton
          status="confirm"
          onClick={() => handleOpenUserModal()}
          size="small"
          sx={{ borderRadius: 4, boxShadow: '0 6px 18px rgba(20,60,120,0.08)' }}
        >
          + Add new User
        </StatusButton>
      </Box>

      <ReusableTable
        columns={columns}
        rows={tableRows}
        showSearch
        searchPlaceholder="Search users, emails, phone..."
        defaultRowsPerPage={10}
        rowsPerPageOptions={[10, 25, 50]}
        toolbarActions={null}
        loading={loading}
        emptyState={
          <Typography color="text.secondary">
            No users found. Click "Add new User" to create one.
          </Typography>
        }
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        user={selectedUser}
        loading={formLoading}
        error={formError}
        mode="user"
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        itemName={userToDelete?.contactPerson || ''}
        loading={formLoading}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.type}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}