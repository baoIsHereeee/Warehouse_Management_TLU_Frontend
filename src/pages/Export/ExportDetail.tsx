import React, { useEffect, useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, MenuItem, IconButton,
  Alert, Snackbar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import { getExportById, updateExport, deleteExport } from '../../services/Export/export.service';
import { getProductList, getProductById } from '../../services/Product/product.service';
import { getCustomerList } from '../../services/Customer/customer.service';
import { getWarehouseList } from '../../services/Warehouse/warehouse.service';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
}

interface ExportDetailItem {
  productId: string;
  warehouseId: string;
  quantity: number;
  sellingPrice: number;
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

interface User {
  id: string;
  fullname: string;
  email: string;
  age: number;
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

const ExportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [exportDetails, setExportDetails] = useState<ExportDetailItem[]>([]);
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
        if (!token || !id) throw new Error('No access token or export ID');

        const tenantId = localStorage.getItem('tenantId');
        if (!tenantId) throw new Error('No tenant ID found');

        const [exportRes, productRes, customerRes, warehouseRes] = await Promise.all([
          getExportById(id, token),
          getProductList(token, tenantId),
          getCustomerList(token, tenantId),
          getWarehouseList(token, tenantId)
        ]);

        setDescription(exportRes.description);
        setCustomerId(exportRes.customer?.id || '');
        setProducts(productRes);
        setCustomers(customerRes || []);
        setWarehouses(warehouseRes || []);
        setUpdatedAt(new Date(exportRes.updatedAt).toLocaleString());
        setUser(exportRes.user);

        const details = exportRes.exportDetails.map((detail: any) => ({
          productId: detail.product.id,
          warehouseId: detail.warehouse.id,
          quantity: detail.quantity,
          sellingPrice: parseFloat(detail.sellingPrice)
        }));

        setExportDetails(details);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load export details.');
      }
    };

    fetchData();
  }, [id]);

  const handleAddDetail = () => {
    setExportDetails([...exportDetails, { productId: '', warehouseId: '', quantity: 1, sellingPrice: 0 }]);
  };

  const handleRemoveDetail = (index: number) => {
    if (exportDetails.length === 1) return;
    const updated = [...exportDetails];
    updated.splice(index, 1);
    setExportDetails(updated);
  };

  const handleDetailChange = async (index: number, field: keyof ExportDetailItem, value: string | number) => {
    const updated = [...exportDetails];

    if (field === 'productId') {
      updated[index].productId = value as string;
      updated[index].warehouseId = '';

      try {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No access token');
        const productData = await getProductById(value as string, token);
        const defaultWarehouseId = productData?.warehouseDetails?.[0]?.warehouse?.id;
        updated[index].warehouseId = defaultWarehouseId || '';
      } catch {
        setError('Failed to fetch product warehouse data');
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: field === 'quantity' || field === 'sellingPrice' ? Number(value) || 0 : value
      };
    }

    setExportDetails(updated);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id || !userId) throw new Error('Invalid request');

      const payload = {
        description,
        customerId,
        userId,
        exportDetails: exportDetails.map(({ productId, warehouseId, quantity, sellingPrice }) => ({
          productId,
          warehouseId,
          quantity,
          sellingPrice,
        }))
      };

      await updateExport(id, payload, token);
      setSuccess('Export updated successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update export');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token || !id) throw new Error('Invalid request');
      await deleteExport(id, token);
      setSuccess('Export deleted successfully!');
      
      setTimeout(() => {
        navigate('/exports');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete export');
    }
  };

  // Tính tổng giá trị xuất
  const totalValue = exportDetails.reduce((total, item) => {
    return total + item.quantity * item.sellingPrice;
  }, 0);

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Export Detail</Typography>
        <Button variant="outlined" onClick={() => navigate('/exports')}>
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
        label="Customer"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        sx={{ mb: 3 }}
      >
        {customers.map(c => (
          <MenuItem key={c.id} value={c.id}>{c.fullname}</MenuItem>
        ))}
      </TextField>

      <Typography variant="h6" sx={{ mb: 1 }}>Export Details</Typography>
      <Box mb={2}>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddDetail}>Add Detail</Button>
      </Box>

      {exportDetails.map((detail, index) => (
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
            label="Selling Price"
            fullWidth
            value={detail.sellingPrice}
            onChange={(e) => handleDetailChange(index, 'sellingPrice', e.target.value)}
          />

          <IconButton color="error" onClick={() => handleRemoveDetail(index)} disabled={exportDetails.length === 1}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {/* Hiển thị tổng giá trị xuất */}
      <Box display="flex" justifyContent="center" mt={3}>
        <TextField
          label="Total Export Value (USD)"
          value={totalValue.toString()}
          InputProps={{ readOnly: true }}
          sx={{ width: 300 }}
        />
      </Box>

      <Box mt={3} sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>Update</Button>
        <Button variant="outlined" color="error" onClick={() => setConfirmOpen(true)}>Delete</Button>
        <Button variant="outlined" onClick={() => navigate('/exports')}>Cancel</Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this export record?</DialogContentText>
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

export default ExportDetail;
