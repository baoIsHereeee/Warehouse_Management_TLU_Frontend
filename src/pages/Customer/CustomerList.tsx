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
  CircularProgress
} from '@mui/material';
import { getCustomers } from '../../services/Customer/customer.service';
import { useNavigate } from 'react-router-dom';

const CustomerList: React.FC = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const accessToken = localStorage.getItem('accessToken');
      const data = await getCustomers(page, 5, search, accessToken);

      setCustomers(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearch = () => {
    setPage(1); // Reset về trang đầu khi tìm kiếm
    fetchCustomers();
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Customer List
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" color="primary" onClick={() => navigate('/customers/create')}>
          Create
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={3}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Full Name</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                  >
                    <TableCell>{customer.fullname}</TableCell>
                    <TableCell>{customer.email || '_'}</TableCell>
                    <TableCell>{customer.phone || '_'}</TableCell>
                    <TableCell>{customer.address || '_'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No customers found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default CustomerList;
