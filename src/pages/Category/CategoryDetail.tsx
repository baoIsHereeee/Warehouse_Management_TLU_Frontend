import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, updateCategory, deleteCategory } from '../../services/Category/category.service';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);  // Sử dụng tên này cho dialog

  const fetchCategory = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Access token not found');

      const data = await getCategoryById(id!, accessToken);
      setCategory(data);
      setName(data.name);
      setDescription(data.description);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      setNameError('Name is required');
      return;
    }

    setNameError('');

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Access token not found');

      await updateCategory(id!, { name, description }, accessToken);
      setSuccessMessage('Category updated successfully');
      setTimeout(() => {
        navigate('/categories');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update category');
    }
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('Access token not found');

      await deleteCategory(id!, accessToken);
      navigate('/categories');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

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
        <Typography variant="h4">Category Detail</Typography>
        <Button variant="outlined" onClick={() => navigate('/categories')}>
          Back to List
        </Button>
      </Box>

      {/* Editable Fields */}
      <Box mb={3}>
        <TextField
          label="Name"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (e.target.value.trim()) {
              setNameError('');
            }
          }}
          margin="normal"
          error={!!nameError}
          helperText={nameError}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
        Related Products
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Image</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Current Stock</strong></TableCell>
              <TableCell><strong>Minimum Stock</strong></TableCell>
              <TableCell><strong>Order Stock</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {category?.products?.length > 0 ? (
              category.products.map((product: any) => (
                <TableRow
                  key={product.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <TableCell>
                    <Avatar
                      src={product.image}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.sellingPrice}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>{product.minimumStock ?? '—'}</TableCell>
                  <TableCell>{product.orderStock ?? '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No related products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar for success */}
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

      {/* Snackbar for error */}
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

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
          Delete Category
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="primary"
            sx={{ minWidth: 100, borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              handleDelete();
            }}
            variant="contained"
            color="error"
            sx={{ minWidth: 100, borderRadius: 2 }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CategoryDetail;
