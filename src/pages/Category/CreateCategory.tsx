import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createCategory } from '../../services/Category/category.service';

const CreateCategory: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
  
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Access token not found, please login');
      return;
    }
  
    setLoading(true);
  
    try {
      await createCategory({ name, description }, accessToken);
      setSuccessMessage('Category created successfully!');
  
      setName('');
      setDescription('');
  
      setTimeout(() => {
        navigate('/categories');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Category
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ maxWidth: '100%' }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          margin="normal"
          disabled={loading}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <Button variant="outlined" onClick={() => navigate('/categories')} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateCategory;
