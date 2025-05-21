import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, TextField, Button, CircularProgress,
  Snackbar, Alert, MenuItem, Select, FormControl, InputLabel,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUserById,
  updateUser,
  deleteUser,
  getRoles,
  addUserRole,
  removeUserRole
} from '../../services/User/user.service';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [fullname, setFullname] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      const data = await getUserById(id!, token);
      setUser(data);
      setFullname(data.fullname);
      setAge(data.age.toString());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const roles = await getRoles(token);
      setAvailableRoles(roles);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load roles');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchRoles();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await updateUser(id!, { fullname, age: +age }, token);
      setSuccessMessage('User updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await deleteUser(id!, token);
      setSuccessMessage('User deleted successfully');
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await removeUserRole(id!, roleId, token);
      setSuccessMessage('Role removed successfully');
      await fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove role');
    }
  };

  const handleAddRole = async () => {
    if (!selectedRoleId) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await addUserRole(id!, selectedRoleId, token);
      setSelectedRoleId('');
      setSuccessMessage('Role added successfully');
      await fetchUser();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add role');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Detail: {user?.fullname}</Typography>
        <Button variant="outlined" onClick={() => navigate('/users')}>
          Back to List
        </Button>
      </Box>

      <TextField
        label="Full Name"
        fullWidth
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Age"
        fullWidth
        value={age}
        onChange={(e) => setAge(e.target.value)}
        margin="normal"
        type="number"
      />

      <Box display="flex" gap={2} mt={2}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>
        <Button variant="outlined" color="error" onClick={() => setDeleteDialogOpen(true)}>
          Delete
        </Button>
      </Box>

      <Typography variant="h5" mt={5} mb={2}>
        Roles
      </Typography>

      {/* Add Role */}
      <Box display="flex" flexDirection="column" gap={2} mb={3}>
        <FormControl fullWidth>
          <InputLabel>Add Role</InputLabel>
          <Select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            label="Add Role"
          >
            {availableRoles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleAddRole} fullWidth>
          Add
        </Button>
      </Box>

      {/* Role List in Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Role Name</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user?.roles.map((role: any) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteRole(role.id)}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, padding: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>Delete User</DialogTitle>
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

      {/* Snackbar Success */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={1000}
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
    </Container>
  );
};

export default UserDetail;
