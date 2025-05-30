import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createImport } from '../../services/Import/import.service';
import { getProductList } from '../../services/Product/product.service';
import { getSupplierList } from '../../services/Supplier/supplier.service';
import { getWarehouseList } from '../../services/Warehouse/warehouse.service';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  id: number;
}

interface ImportDetail {
  productId: string;
  warehouseId: string;
  quantity: number;
  importPrice: number;
}

interface Product {
  id: string;
  name: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface Supplier {
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

const CreateImport: React.FC = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [importDetails, setImportDetails] = useState<ImportDetail[]>([
    { productId: '', warehouseId: '', quantity: 1, importPrice: 0 },
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

        const [productRes, supplierRes, warehouseRes] = await Promise.all([
          getProductList(token, tenantId),
          getSupplierList(token, tenantId),
          getWarehouseList(token),
        ]);

        setProducts(productRes);
        setSuppliers(supplierRes || []);
        setWarehouses(warehouseRes || []);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleAddDetail = () => {
    setImportDetails([
      ...importDetails,
      { productId: '', warehouseId: '', quantity: 1, importPrice: 0 },
    ]);
  };

  const handleRemoveDetail = (index: number) => {
    if (importDetails.length === 1) return;
    const updated = [...importDetails];
    updated.splice(index, 1);
    setImportDetails(updated);
  };

  const handleDetailChange = (index: number, field: keyof ImportDetail, value: string | number) => {
    const updated = [...importDetails];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' || field === 'importPrice'
        ? Number(value) || 0
        : value
    };
    setImportDetails(updated);
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
    if (!supplierId) {
      setError('Please select a supplier');
      return false;
    }
    if (importDetails.some(detail =>
      !detail.productId || !detail.warehouseId || detail.quantity <= 0 || detail.importPrice <= 0
    )) {
      setError('Please fill all import details correctly');
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
        supplierId,
        importDetails: importDetails.map(({ productId, warehouseId, quantity, importPrice }) => ({
          productId,
          warehouseId,
          quantity,
          importPrice,
        }))
      };
      await createImport(payload, token);
      setSuccess('Import record created successfully!');
      setTimeout(() => navigate('/imports'), 1500);
    } catch (err) {
      setError('Failed to create import record. Please try again.');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Create Import Record</Typography>
        <Button variant="outlined" onClick={() => navigate('/imports')}>
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

      <Box mb={3}>
        <TextField
          select
          fullWidth
          label="Supplier"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          {suppliers.map((supplier) => (
            <MenuItem key={supplier.id} value={supplier.id}>
              {supplier.fullname}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }} gutterBottom>
        Import Details
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

      {importDetails.map((detail, index) => (
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
          >
            {warehouses.map((w) => (
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
            label="Import Price"
            fullWidth
            value={detail.importPrice}
            onChange={(e) => handleDetailChange(index, 'importPrice', e.target.value)}
            inputProps={{ min: 0 }}
            required
          />

          <IconButton
            color="error"
            onClick={() => handleRemoveDetail(index)}
            disabled={importDetails.length === 1}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box mt={3} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        <Button variant="outlined" onClick={() => navigate('/imports')}>Cancel</Button>
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

export default CreateImport;
