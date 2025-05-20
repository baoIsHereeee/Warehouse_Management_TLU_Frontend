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
  Pagination,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getExports } from '../../services/Export/export.service';

const ExportList: React.FC = () => {
  const navigate = useNavigate();

  const [exports, setExports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchExports = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await getExports(page, 5, search, token);
      setExports(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch exports:', error);
    }
  };

  useEffect(() => {
    fetchExports();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchExports();
  };

  const handleRowClick = (exportId: string) => {
    navigate(`/exports/${exportId}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Export List
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Search export..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" color="primary" onClick={() => navigate('/exports/create')}>
          Create
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>#</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exports.length > 0 ? (
              exports.map((record, index) => (
                <TableRow
                  key={record.id}
                  onClick={() => handleRowClick(record.id)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
                >
                  <TableCell>{(page - 1) * 5 + index + 1}</TableCell>
                  <TableCell>{record.description}</TableCell>
                  <TableCell>{new Date(record.updatedAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No exports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mb={3} mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default ExportList;
     