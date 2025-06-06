import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProductList } from '../../services/Product/product.service';
import { getWarehouseList, getWarehouseTransferById, updateWarehouseTransfer, deleteWarehouseTransfer } from '../../services/Warehouse/warehouse.service';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: string;
}

interface Product {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface WarehouseTransferDetailItem {
  id: string;
  quantity: number;
  product: Product;
}

const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch {
    return null;
  }
};

const WarehouseTransferDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [details, setDetails] = useState<
    { id?: string; productId: string; quantity: number }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Load initial data: products, warehouses, and warehouse transfer detail
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token');
        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) throw new Error('No tenant ID');

        const [productRes, warehouseRes, transferRes] = await Promise.all([
          getProductList(token, tenantId),
          getWarehouseList(token, tenantId),
          getWarehouseTransferById(id!, token),
        ]);

        setProducts(productRes);
        setWarehouses(warehouseRes);

        // Map response data to form state
        setDescription(transferRes.description || '');
        setFromWarehouseId(transferRes.fromWarehouse?.id || '');
        setToWarehouseId(transferRes.toWarehouse?.id || '');
        setDetails(
          transferRes.warehouseTransferDetails.map((detail: WarehouseTransferDetailItem) => ({
            id: detail.id,
            productId: detail.product.id,
            quantity: detail.quantity,
          }))
        );
      } catch (error) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, [id]);

  const handleAddDetail = () => {
    setDetails([...details, { productId: '', quantity: 1 }]);
  };

  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) return;
    const updated = [...details];
    updated.splice(index, 1);
    setDetails(updated);
  };

  const handleDetailChange = (
    index: number,
    field: 'productId' | 'quantity',
    value: string | number
  ) => {
    const updated = [...details];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' ? Number(value) || 0 : value,
    };
    setDetails(updated);
  };

  const validateForm = (): boolean => {
    if (!description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!fromWarehouseId || !toWarehouseId) {
      setError('Please select both source and destination warehouse');
      return false;
    }
    if (fromWarehouseId === toWarehouseId) {
      setError('Source and destination warehouse must be different');
      return false;
    }
    if (details.some((d) => !d.productId || d.quantity <= 0)) {
      setError('Please fill all transfer details correctly');
      return false;
    }
    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');
      const userId = getUserIdFromToken();
      if (!userId) throw new Error('User authentication required');

      const payload = {
        userId,
        description,
        fromWarehouseId,
        toWarehouseId,
        warehouseTransferDetails: details.map(({ id, productId, quantity }) => ({
          id,
          productId,
          quantity,
        })),
      };

      await updateWarehouseTransfer(id!, payload, token);
      setSuccess('Warehouse transfer updated successfully!');
      setTimeout(() => setSuccess(null), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update warehouse transfer');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      await deleteWarehouseTransfer(id!, token);
      setSuccess('Warehouse transfer deleted successfully!');
      setTimeout(() => {
        setSuccess(null);
        navigate('/warehouses');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete warehouse transfer');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Warehouse Transfer Detail</Typography>
        <Button variant="outlined" onClick={() => navigate('/warehouses')}>
          Back to List
        </Button>
      </Box>

      <Box mb={3}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Box>

      <Box mb={3} sx={{ display: 'flex', gap: 2 }}>
        <TextField
          select
          fullWidth
          label="From Warehouse"
          value={fromWarehouseId}
          onChange={(e) => setFromWarehouseId(e.target.value)}
          required
        >
          {warehouses.map((w) => (
            <MenuItem key={w.id} value={w.id}>
              {w.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          label="To Warehouse"
          value={toWarehouseId}
          onChange={(e) => setToWarehouseId(e.target.value)}
          required
        >
          {warehouses
            .filter((w) => w.id !== fromWarehouseId)
            .map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
              </MenuItem>
            ))}
        </TextField>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }} gutterBottom>
        Transfer Details
      </Typography>

      <Box mb={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddDetail}>
          Add Detail
        </Button>
      </Box>

      {details.map((detail, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            select
            fullWidth
            label="Product"
            value={detail.productId}
            onChange={(e) => handleDetailChange(index, 'productId', e.target.value)}
            required
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity"
            fullWidth
            value={detail.quantity}
            onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
            inputProps={{ min: 1 }}
            required
          />

          <IconButton
            color="error"
            onClick={() => handleRemoveDetail(index)}
            disabled={details.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box mt={3} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={() => setConfirmDeleteOpen(true)}
        >
          Delete
        </Button>

        <Button variant="text" onClick={() => navigate('/warehouses')}>
          Cancel
        </Button>
      </Box>

      {/* Error and Success Snackbar */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={1500} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this warehouse transfer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WarehouseTransferDetail;
