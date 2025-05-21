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
import { getImports } from '../../services/Import/import.service'; 

const ImportList: React.FC = () => {
  const navigate = useNavigate();

  const [imports, setImports] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImports = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const data = await getImports(page, 5, search, token);
      setImports(data.items);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error('Failed to fetch imports:', error);
    }
  };

  useEffect(() => {
    fetchImports();
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchImports();
  };

  const handleRowClick = (importId: string) => {
    navigate(`/imports/${importId}`);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Import List
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          label="Search import..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>

        <Button variant="outlined" color="primary" onClick={() => navigate('/imports/create')}>
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
            {imports.length > 0 ? (
              imports.map((record, index) => (
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
                  No imports found.
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

export default ImportList;
