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
import { getWarehouses } from '../../services/Warehouse/warehouse.service';
import { useNavigate } from 'react-router-dom';

const LIMIT = 5;

const WarehouseList: React.FC = () => {
  const navigate = useNavigate();

  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchWarehouses();
  }, [page]);

  // Chỉ gọi fetch khi nhấn Search hoặc Enter
  const handleSearch = () => {
    setPage(1); // reset page khi search mới
    fetchWarehouses();
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
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
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default WarehouseList;
