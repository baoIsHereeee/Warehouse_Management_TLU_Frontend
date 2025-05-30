import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createExport } from '../../services/Export/export.service';
import { getProductList, getProductById } from '../../services/Product/product.service';
import { getCustomerList } from '../../services/Customer/customer.service';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  id: number;
}

interface ExportDetail {
  productId: string;
  warehouseId: string;
  quantity: number;
  sellingPrice: number;
  productWarehouses?: Warehouse[];
}

interface Product {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface Customer {
  id: string;
  fullname: string;
}

const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.id;
  } catch {
    return null;
  }
};

const CreateExport: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [exportDetails, setExportDetails] = useState<ExportDetail[]>([
    { productId: '', warehouseId: '', quantity: 1, sellingPrice: 0, productWarehouses: [] },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token found');

        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) throw new Error('No tenant ID found');

        const [productRes, customerRes] = await Promise.all([
          getProductList(token),
          getCustomerList(token, tenantId),
        ] as const);

        setProducts(productRes);
        setCustomers(customerRes || []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleAddDetail = () => {
    setExportDetails([
      ...exportDetails,
      { productId: '', warehouseId: '', quantity: 1, sellingPrice: 0, productWarehouses: [] },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    if (exportDetails.length === 1) return;
    const updated = [...exportDetails];
    updated.splice(index, 1);
    setExportDetails(updated);
  };

  const handleDetailChange = async (index: number, field: keyof ExportDetail, value: string | number) => {
    const updated = [...exportDetails];

    if (field === 'productId') {
      updated[index].productId = value as string;
      updated[index].warehouseId = '';
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token');
        const productData = await getProductById(value as string, token);
        updated[index].productWarehouses = productData.warehouseDetails?.map((wd: any) => wd.warehouse) || [];
      } catch {
        setError('Failed to fetch product warehouse data');
        updated[index].productWarehouses = [];
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: field === 'quantity' || field === 'sellingPrice'
          ? Number(value) || 0
          : value
      };
    }

    setExportDetails(updated);
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
    if (exportDetails.some(detail =>
      !detail.productId || !detail.warehouseId || detail.quantity <= 0 || detail.sellingPrice <= 0
    )) {
      setError('Please fill all export details correctly');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token found');

      const payload = {
        description,
        userId,
        customerId,
        exportDetails: exportDetails.map(({ productId, warehouseId, quantity, sellingPrice }) => ({
          productId,
          warehouseId,
          quantity,
          sellingPrice,
        }))
      };
      await createExport(payload, token);
      setSuccess('Export record created successfully!');
      setTimeout(() => navigate('/exports'), 1500);
    } catch (err) {
      setError('Failed to create export record. Please try again.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create Export Record
      </Typography>

      <Box mb={3}>
        <TextField
          label="Description"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Box>

      <Box mb={3}>
        <TextField
          select
          fullWidth
          label="Customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          {customers.map((customer) => (
            <MenuItem key={customer.id} value={customer.id}>
              {customer.fullname}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }} gutterBottom>
        Export Details
      </Typography>

      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddDetail}
        >
          Add Detail
        </Button>
      </Box>

      {exportDetails.map((detail, index) => (
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
            select
            fullWidth
            label="Warehouse"
            value={detail.warehouseId}
            onChange={(e) => handleDetailChange(index, 'warehouseId', e.target.value)}
            required
            disabled={!detail.productWarehouses?.length}
          >
            {(detail.productWarehouses || []).map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name}
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

          <TextField
            type="number"
            label="Selling Price"
            fullWidth
            value={detail.sellingPrice}
            onChange={(e) => handleDetailChange(index, 'sellingPrice', e.target.value)}
            inputProps={{ min: 0 }}
            required
          />

          <IconButton
            color="error"
            onClick={() => handleRemoveDetail(index)}
            disabled={exportDetails.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box mt={3}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Export
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

export default CreateExport;
