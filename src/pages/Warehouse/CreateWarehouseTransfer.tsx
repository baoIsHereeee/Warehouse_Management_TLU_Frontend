import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { getProductList } from '../../services/Product/product.service';
import { getWarehouseList } from '../../services/Warehouse/warehouse.service';
import { createWarehouseTransfer } from '../../services/Warehouse/warehouse.service';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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

interface WarehouseTransferDetail {
  productId: string;
  quantity: number;
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

const CreateWarehouseTransfer: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [fromWarehouseId, setFromWarehouseId] = useState('');
  const [toWarehouseId, setToWarehouseId] = useState('');
  const [details, setDetails] = useState<WarehouseTransferDetail[]>([
    { productId: '', quantity: 1 },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token');
        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) throw new Error('No tenant ID');

        const [productRes, warehouseRes] = await Promise.all([
          getProductList(token, tenantId),
          getWarehouseList(token, tenantId),
        ]);

        setProducts(productRes);
        setWarehouses(warehouseRes);
      } catch {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  const handleAddDetail = () => {
    setDetails([...details, { productId: '', quantity: 1 }]);
  };

  const handleRemoveDetail = (index: number) => {
    if (details.length === 1) return;
    const updated = [...details];
    updated.splice(index, 1);
    setDetails(updated);
  };

  const handleDetailChange = (index: number, field: keyof WarehouseTransferDetail, value: string | number) => {
    const updated = [...details];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' ? Number(value) || 0 : value,
    };
    setDetails(updated);
  };

  const validateForm = (): boolean => {
    if (!userId) {
      setError('User authentication required');
      return false;
    }
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
    if (details.some(d => !d.productId || d.quantity <= 0)) {
      setError('Please fill all transfer details correctly');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      const payload = {
        userId,
        fromWarehouseId,
        toWarehouseId,
        description,
        warehouseTransferDetails: details.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      };

      await createWarehouseTransfer(payload, token);
      setSuccess('Warehouse transfer created successfully!');
      setTimeout(() => navigate('/warehouses'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create warehouse transfer');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Create Warehouse Transfer</Typography>
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
            .filter(w => w.id !== fromWarehouseId)
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

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Transfer
        </Button>
      </Box>

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
    </Container>
  );
};

export default CreateWarehouseTransfer;
