import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoleById, updateRole, deleteRole } from '../../services/Role/role.service';

interface User {
  id: string;
  fullname: string;
  email: string;
  age: number;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolePermission {
  permissionId: number;
  roleId: string;
  permission: Permission;
}

interface Role {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  users: User[];
  rolePermissions: RolePermission[];
}

const RoleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchRole = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) throw new Error('Missing token or role ID');

      const res = await getRoleById(id, token);
      setRole(res);
      setRoleName(res.name);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch role');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!roleName.trim()) {
      setError('Role name is required');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) throw new Error('Missing token or role ID');

      await updateRole(id, { name: roleName }, token);
      setSuccessMessage('Role updated successfully');
      setTimeout(() => fetchRole(), 500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update role');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) throw new Error('Missing token or role ID');

      await deleteRole(id, token);
      setSuccessMessage('Role deleted successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete role');
    }
  };

  useEffect(() => {
    fetchRole();
  }, [id]);

  if (loading || !role) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Role Detail: {role?.name}</Typography>
        <Button variant="outlined" onClick={() => navigate('/dashboard')}>
          Back to List
        </Button>
      </Box>

      <TextField
        label="Role Name"
        fullWidth
        value={roleName}
        onChange={(e) => setRoleName(e.target.value)}
        margin="normal"
      />

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
          Delete
        </Button>
      </Box>

      {/* Users */}
      <Typography variant="h5" mt={5} mb={2}>
        Assigned Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Full Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Age</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {role.users.length > 0 ? (
              role.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.age}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">No users found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Permissions */}
      <Typography variant="h5" mt={5} mb={2}>
        Assigned Permissions
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {role.rolePermissions.length > 0 ? (
              role.rolePermissions.map((rp) => (
                <TableRow key={rp.permissionId}>
                  <TableCell>{rp.permission.name}</TableCell>
                  <TableCell>{rp.permission.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No permissions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar Success */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={2000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSuccessMessage(null)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar Error */}
      <Snackbar
        open={!!error}
        autoHideDuration={3000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, padding: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>Delete Role</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary' }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDelete();
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleDetail;
