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
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getWarehouses, getWarehouseTransferList } from '../../services/Warehouse/warehouse.service';
import { useNavigate } from 'react-router-dom';

const LIMIT = 5;

const WarehouseList: React.FC = () => {
  const navigate = useNavigate();

  // Warehouses
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Warehouse Transfers
  const [transfers, setTransfers] = useState<any[]>([]);
  const [transferPage, setTransferPage] = useState(1);
  const [transferTotalPages, setTransferTotalPages] = useState(1);
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferSearch, setTransferSearch] = useState('');

  // Fetch Warehouses
  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token');

      const data = await getWarehouses(page, LIMIT, search, accessToken);
      setWarehouses(data.items || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Transfers
  const fetchTransfers = async () => {
    try {
      setTransferLoading(true);
      setTransferError(null);
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) throw new Error('No access token');

      const data = await getWarehouseTransferList(transferPage, LIMIT, transferSearch, accessToken);
      setTransfers(data.items || []);
      setTransferTotalPages(data.meta?.totalPages || 1);
    } catch (err: any) {
      setTransferError(err.message || 'Failed to fetch warehouse transfers');
    } finally {
      setTransferLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [page]);

  useEffect(() => {
    fetchTransfers();
  }, [transferPage]);

  const handleSearch = () => {
    setPage(1);
    fetchWarehouses();
  };

  const handleTransferSearch = () => {
    setTransferPage(1);
    fetchTransfers();
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTransferPageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setTransferPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse List
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          sx={{ flexGrow: 1 }}
          label="Search warehouses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" color="primary" onClick={() => navigate('/warehouses/create')}>
          Create
        </Button>
      </Box>

      {/* Warehouse Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Address</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warehouses.length > 0 ? (
                  warehouses.map((wh) => (
                    <TableRow
                      key={wh.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                      onClick={() => navigate(`/warehouses/${wh.id}`)}
                    >
                      <TableCell>{wh.name}</TableCell>
                      <TableCell>{wh.address}</TableCell>
                      <TableCell>{wh.phone}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No warehouses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box mt={2} display="flex" justifyContent="center">
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </>
      )}

      {/* Warehouse Transfers Table */}
      <Box mt={6}>
        <Typography variant="h4" gutterBottom>
          Warehouse Transfer List
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <TextField
            sx={{ flexGrow: 1 }}
            label="Search transfers..."
            value={transferSearch}
            onChange={(e) => setTransferSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTransferSearch()}
          />
          <Button variant="contained" onClick={handleTransferSearch}>
            Search
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/warehouse-transfers/create')}>
            Create
          </Button>
        </Box>

        {transferLoading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : transferError ? (
          <Alert severity="error">{transferError}</Alert>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Created At</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow
                      key={transfer.id}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                      }}
                      onClick={() => navigate(`/warehouse-transfers/${transfer.id}`)}
                    >
                      <TableCell>{transfer.description}</TableCell>
                      <TableCell>{new Date(transfer.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {transferTotalPages > 1 && (
              <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                  count={transferTotalPages}
                  page={transferPage}
                  onChange={handleTransferPageChange}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default WarehouseList;
