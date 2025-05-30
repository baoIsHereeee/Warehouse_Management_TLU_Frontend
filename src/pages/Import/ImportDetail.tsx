import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import { getImportById, updateImport, deleteImport } from '../../services/Import/import.service';
import { getProductList } from '../../services/Product/product.service';
import { getSupplierList } from '../../services/Supplier/supplier.service';
import { getWarehouseList } from '../../services/Warehouse/warehouse.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
}

interface ImportDetailItem {
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

interface User {
  id: string;
  fullname: string;
  email: string;
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

const ImportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [importDetails, setImportDetails] = useState<ImportDetailItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token || !id) throw new Error('No access token or import ID');

        const tenantId = localStorage.getItem('tenantId');  
        if (!tenantId) throw new Error('No tenant ID found');

        const [importRes, productRes, supplierRes, warehouseRes] = await Promise.all([
          getImportById(id, token),
          getProductList(token),
          getSupplierList(token, tenantId),
          getWarehouseList(token)
        ]);

        setDescription(importRes.description);
        setSupplierId(importRes.supplier?.id || '');
        setProducts(productRes);
        setSuppliers(supplierRes);
        setWarehouses(warehouseRes);
        setUpdatedAt(new Date(importRes.updatedAt).toLocaleString());
        setUser(importRes.user);

        const details = importRes.importDetails.map((detail: any) => ({
          productId: detail.product.id,
          warehouseId: detail.warehouse.id,
          quantity: detail.quantity,
          importPrice: parseFloat(detail.importPrice),
        }));

        setImportDetails(details);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load import details.');
      }
    };

    fetchData();
  }, [id]);

  const handleAddDetail = () => {
    setImportDetails([...importDetails, { productId: '', warehouseId: '', quantity: 1, importPrice: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    if (importDetails.length === 1) return;
    const updated = [...importDetails];
    updated.splice(index, 1);
    setImportDetails(updated);
  };

  const handleDetailChange = (index: number, field: keyof ImportDetailItem, value: string | number) => {
    const updated = [...importDetails];
    updated[index] = {
      ...updated[index],
      [field]: field === 'quantity' || field === 'importPrice' ? Number(value) || 0 : value
    };
    setImportDetails(updated);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id || !userId) throw new Error('Invalid request');

      const payload = {
        description,
        supplierId,
        userId,
        importDetails: importDetails.map(({ productId, warehouseId, quantity, importPrice }) => ({
          productId,
          warehouseId,
          quantity,
          importPrice,
        }))
      };

      await updateImport(id, payload, token);
      setSuccess('Import updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update import');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) throw new Error('Invalid request');
      await deleteImport(id, token);
      setSuccess('Import deleted successfully!');

      setTimeout(() => {
        navigate('/imports');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete import');
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Import Detail</Typography>
        <Button variant="outlined" onClick={() => navigate('/imports')}>
          Back to List
        </Button>
      </Box>

      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Updated At"
          fullWidth
          value={updatedAt}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Updated By"
          fullWidth
          value={user?.fullname || ''}
          InputProps={{ readOnly: true }}
        />
      </Box>

      <TextField
        select
        fullWidth
        label="Supplier"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
        sx={{ mb: 3 }}
      >
        {suppliers.map(s => (
          <MenuItem key={s.id} value={s.id}>{s.fullname}</MenuItem>
        ))}
      </TextField>

      <Typography variant="h6" sx={{ mb: 1 }}>Import Details</Typography>
      <Box mb={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddDetail}>Add Detail</Button>
      </Box>

      {importDetails.map((detail, index) => (
        <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            select
            fullWidth
            label="Product"
            value={detail.productId}
            onChange={(e) => handleDetailChange(index, 'productId', e.target.value)}
          >
            {products.map(p => (
              <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Warehouse"
            value={detail.warehouseId}
            onChange={(e) => handleDetailChange(index, 'warehouseId', e.target.value)}
          >
            {warehouses.map(w => (
              <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity"
            fullWidth
            value={detail.quantity}
            onChange={(e) => handleDetailChange(index, 'quantity', e.target.value)}
          />

          <TextField
            type="number"
            label="Import Price"
            fullWidth
            value={detail.importPrice}
            onChange={(e) => handleDetailChange(index, 'importPrice', e.target.value)}
          />

          <IconButton color="error" onClick={() => handleRemoveDetail(index)} disabled={importDetails.length === 1}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      <Box mt={3} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
        <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Delete</Button>
        <Button variant="outlined" onClick={() => navigate('/imports')}>Cancel</Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this import record?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={1500} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ImportDetail;
