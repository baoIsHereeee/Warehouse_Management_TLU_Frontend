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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '../../services/Supplier/supplier.service';

const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<any>(null);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [fullnameError, setFullnameError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchSupplier = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      const data = await getSupplierById(id!, token);
      setSupplier(data);
      setFullname(data.fullname);
      setEmail(data.email);
      setPhone(data.phone);
      setAddress(data.address);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!fullname.trim()) {
      setFullnameError('Full name is required');
      return;
    }
    setFullnameError('');

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await updateSupplier(id!, { fullname, email, phone, address }, token);
      setSuccessMessage('Supplier updated successfully');
      setTimeout(() => navigate('/suppliers'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update supplier');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Access token not found');

      await deleteSupplier(id!, token);
      setSuccessMessage('Supplier deleted successfully');
      setTimeout(() => navigate('/suppliers'), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete supplier');
    }
  };

  useEffect(() => {
    fetchSupplier();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Supplier Detail: {supplier?.fullname}</Typography>
        <Button variant="outlined" onClick={() => navigate('/suppliers')}>
          Back to List
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          label="Full Name"
          fullWidth
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
            if (e.target.value.trim()) setFullnameError('');
          }}
          error={!!fullnameError}
          helperText={fullnameError}
          margin="normal"
        />
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Phone"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Address"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
      </Box>

      <Typography variant="h5" mt={4} mb={2}>
        Import Records
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {supplier?.importRecords?.length > 0 ? (
              supplier.importRecords.map((record: any, index: number) => (
                <TableRow
                  key={record.id}
                  onClick={() => navigate(`/imports/${record.id}`)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{record.description}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No import records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar success */}
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

      {/* Snackbar error */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, padding: 2, minWidth: 400 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>Delete Supplier</DialogTitle>
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

export default SupplierDetail;
