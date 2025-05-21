import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoles, createRole, deleteRole } from '../../services/Role/role.service';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const data = await getRoles(accessToken!);
      if (search.trim()) {
        setRoles(
          data.filter((role: any) =>
            role.name.toLowerCase().includes(search.toLowerCase())
          )
        );
      } else {
        setRoles(data);
      }
    } catch (err) {
      setError('Failed to fetch roles');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearch = () => {
    fetchRoles();
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      await createRole({ name: newRoleName }, accessToken!);
      setNewRoleName('');
      setSuccessMessage('Role created successfully');
      await fetchRoles();
    } catch (err) {
      setError('Failed to create role');
      console.error(err);
    }
  };

  const openDeleteDialog = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!roleToDelete) return;

    try {
      const accessToken = localStorage.getItem('accessToken');
      await deleteRole(roleToDelete, accessToken!);
      setSuccessMessage('Role deleted successfully');
      await fetchRoles();
    } catch (err) {
      setError('Failed to delete role');
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Search role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow
                  key={role.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <TableCell
                    onClick={() => navigate(`/roles/${role.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {role.name}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => openDeleteDialog(role.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No roles found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h5" gutterBottom>
        Create New Role
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          label="Role name"
          fullWidth
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreateRole()}
        />
        <Button variant="contained" onClick={handleCreateRole}>
          Create
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
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
            onClick={handleDelete}
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

export default Dashboard;
