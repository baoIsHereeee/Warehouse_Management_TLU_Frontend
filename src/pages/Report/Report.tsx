import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Box,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  getTotalNumberOfInventory,
  getTotalValueOfInventory,
  getTotalValueOfImports,
  getTotalValueOfExports,
  getInventoryValuePerWarehouse,
  getTotalInventoryPerWarehouse,
  getLowStockProducts,
  getInventoryDistributionByCategory,
} from '../../services/Report/report.service';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dw3x8orox/image/upload/v1747628006/b170870007dfa419295d949814474ab2_t_p4cjjq.jpg';

const Report: React.FC = () => {
  const [totalInventory, setTotalInventory] = useState<number | null>(null);
  const [totalInventoryValue, setTotalInventoryValue] = useState<number | null>(null);
  const [totalImportValue, setTotalImportValue] = useState<number | null>(null);
  const [totalExportValue, setTotalExportValue] = useState<number | null>(null);
  const [inventoryValuePerWarehouse, setInventoryValuePerWarehouse] = useState<any[]>([]);
  const [totalInventoryPerWarehouse, setTotalInventoryPerWarehouse] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [inventoryDistribution, setInventoryDistribution] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  const fetchData = async () => {
    if (!accessToken) return;

    const newErrors: string[] = [];

    const handleError = (err: any, label: string) => {
      console.error(`${label} error:`, err);
      const errorMessage = err.response?.data?.message || err.message;
      newErrors.push(`${label}: ${errorMessage}`);
    };

    try {
      const result = await getTotalNumberOfInventory(accessToken);
      setTotalInventory(result);
    } catch (err) {
      handleError(err, 'Total Inventory');
    }

    try {
      const result = await getTotalValueOfInventory(accessToken);
      setTotalInventoryValue(result);
    } catch (err) {
      handleError(err, 'Inventory Value');
    }

    try {
      const result = await getTotalValueOfImports(accessToken);
      setTotalImportValue(result);
    } catch (err) {
      handleError(err, 'Import Value');
    }

    try {
      const result = await getTotalValueOfExports(accessToken);
      setTotalExportValue(result);
    } catch (err) {
      handleError(err, 'Export Value');
    }

    try {
      const result = await getInventoryValuePerWarehouse(accessToken);
      setInventoryValuePerWarehouse(result);
    } catch (err) {
      handleError(err, 'Inventory Value/Warehouse');
    }

    try {
      const result = await getTotalInventoryPerWarehouse(accessToken);
      setTotalInventoryPerWarehouse(result);
    } catch (err) {
      handleError(err, 'Total Inventory/Warehouse');
    }

    try {
      const result = await getLowStockProducts(accessToken);
      setLowStockProducts(result);
    } catch (err) {
      handleError(err, 'Low Stock Products');
    }

    try {
      const result = await getInventoryDistributionByCategory(accessToken);
      setInventoryDistribution(result);
    } catch (err) {
      handleError(err, 'Inventory Distribution');
    }

    // Set all collected errors
    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Clear all errors after 1 second
      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
  };

  const handleCloseError = (index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: '30px' }}>
        Report Statistics
      </Typography>

      <Box display="flex" flexDirection="column" gap={2} maxWidth="100%">
        <TextField
          label="Total Number of Inventory"
          value={totalInventory ?? ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Total Inventory Value"
          value={totalInventoryValue?.toLocaleString() ?? ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Total Import Value (USD)"
          value={totalImportValue?.toLocaleString() ?? ''}
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Total Export Value (USD)"
          value={totalExportValue?.toLocaleString() ?? ''}
          InputProps={{ readOnly: true }}
        />
      </Box>

      {/* Inventory Value Per Warehouse */}
      <Typography variant="h6" mt={4} gutterBottom sx={{ fontWeight: 'bold' }}>
        Inventory Value Per Warehouse
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse Name</TableCell>
              <TableCell>Total Value (USD)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryValuePerWarehouse.map((row) => (
              <TableRow key={row.warehouseId}>
                <TableCell>{row.warehouseName}</TableCell>
                <TableCell>{row.totalValue.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Total Inventory Per Warehouse */}
      <Typography variant="h6" mt={4} gutterBottom sx={{ fontWeight: 'bold' }}>
        Total Inventory Per Warehouse
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Warehouse Name</TableCell>
              <TableCell>Total Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {totalInventoryPerWarehouse.map((row) => (
              <TableRow key={row.warehouseId}>
                <TableCell>{row.warehouseName}</TableCell>
                <TableCell>{row.totalQuantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Inventory Distribution By Category */}
      <Typography variant="h6" mt={4} gutterBottom sx={{ fontWeight: 'bold' }}>
        Inventory Distribution by Category per Warehouse
      </Typography>
      {inventoryDistribution.map((warehouse) => (
        <Box key={warehouse.warehouseId} sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {warehouse.warehouseName}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>Percentage (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouse.categories
                  .slice()
                  .sort((a: any, b: any) => b.percentage - a.percentage)
                  .map((category: any) => (
                    <TableRow key={category.categoryId}>
                      <TableCell>{category.categoryName}</TableCell>
                      <TableCell>{category.percentage.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Low Stock Products */}
      <Typography variant="h6" mt={4} gutterBottom sx={{ fontWeight: 'bold' }}>
        Low Stock Products
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Minimum Stock</TableCell>
              <TableCell>Selling Price</TableCell>
              <TableCell>Order Stock</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={product.image || DEFAULT_IMAGE}
                      alt={product.name}
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.currentStock}</TableCell>
                  <TableCell>{product.minimumStock ?? '—'}</TableCell>
                  <TableCell>${product.sellingPrice}</TableCell>
                  <TableCell>{product.orderStock ?? '—'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No low stock products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Multiple Snackbars for errors */}
      {errors.map((error, index) => (
        <Snackbar
          key={index}
          open={true}
          autoHideDuration={3000}
          onClose={() => handleCloseError(index)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{ bottom: `${(index + 1) * 60}px !important` }}
        >
          <Alert 
            onClose={() => handleCloseError(index)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
      ))}
    </Container>
  );
};

export default Report;
