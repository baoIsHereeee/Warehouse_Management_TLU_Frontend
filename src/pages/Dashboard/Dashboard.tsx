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
  Alert,
  Checkbox
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoles, createRole, deleteRole } from '../../services/Role/role.service';
import { addRolePermission, removeRolePermission } from '../../services/Role/role.service';
import { getPermissions } from '../../services/Role/role.service';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [newRoleName, setNewRoleName] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch roles từ API, có filter theo search
  const fetchRoles = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const data = await getRoles(accessToken!);

      const filtered = search.trim()
        ? data.filter((role: any) => role.name.toLowerCase().includes(search.toLowerCase()))
        : data;

      setRoles(filtered);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch roles');
      console.error(err);
    }
  };

  // Fetch tất cả permissions trong hệ thống từ API
  const fetchPermissions = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const data = await getPermissions(accessToken!);
      setPermissions(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch permissions');
      console.error(err);
    }
  };

  // Khi component mount, gọi fetchRoles và fetchPermissions
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // Search khi click nút hoặc enter
  const handleSearch = () => {
    fetchRoles();
  };

  // Tạo role mới
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      await createRole({ name: newRoleName }, accessToken!);
      setNewRoleName('');
      setSuccessMessage('Role created successfully');
      await fetchRoles();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create role');
      console.error(err);
    }
  };

  // Mở dialog xóa
  const openDeleteDialog = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Xóa role
  const handleDelete = async () => {
    if (!roleToDelete) return;
    try {
      const accessToken = localStorage.getItem('accessToken');
      await deleteRole(roleToDelete, accessToken!);
      setSuccessMessage('Role deleted successfully');
      await fetchRoles();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete role');
      console.error(err);
    } finally {
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    }
  };

  // Thêm hoặc xóa permission khỏi role
  const handleTogglePermission = async (roleId: string, permissionId: number, checked: boolean) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (checked) {
        await addRolePermission(roleId, permissionId, accessToken);
        setSuccessMessage('Permission added to role');
      } else {
        await removeRolePermission(roleId, permissionId, accessToken);
        setSuccessMessage('Permission removed from role');
      }
      await fetchRoles();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update role permission');
      console.error(err);
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

      {/* Danh sách role */}
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
                  sx={{ '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell
                    onClick={() => navigate(`/roles/${role.id}`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {role.name}
                  </TableCell>
                  <TableCell align="right">
                    {['Admin', 'Manager', 'Staff'].includes(role.name) ? (
                      <Button variant="text" disabled size="small" sx={{ color: 'gray' }}>
                        System role
                      </Button>
                    ) : (
                      <IconButton color="error" onClick={() => openDeleteDialog(role.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
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

      {/* Form tạo role mới */}
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>
        Create New Role
      </Typography>

      <Box display="flex" gap={2} mb={4}>
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

      {/* Bảng permission matrix */}
      <Typography variant="h5" gutterBottom>
        Role Permission Table
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4, mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Permission</strong></TableCell>
              {roles.map((role) => (
                <TableCell key={role.id} align="center"><strong>{role.name}</strong></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((perm) => (
              <TableRow key={perm.id}>
                <TableCell>{perm.name}</TableCell>
                {roles.map((role) => {
                  // Kiểm tra permission có trong role.rolePermissions không
                  const isChecked = role.rolePermissions?.some(
                    (rp: any) => rp.permissionId === perm.id
                  );
                  return (
                    <TableCell key={role.id} align="center">
                      <Checkbox
                        checked={!!isChecked}
                        onChange={(e) =>
                          handleTogglePermission(role.id, perm.id, e.target.checked)
                        }
                      />
                    </TableCell>
                  );
                })}
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
          <Button onClick={handleDelete} variant="contained" color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Success */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={1500}
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
