import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createWarehouse } from '../../services/Warehouse/warehouse.service';

const CreateWarehouse: React.FC = () => {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    let valid = true;
    const errors = { name: '', address: '' };

    if (!formValues.name.trim()) {
      errors.name = 'Name is required';
      valid = false;
    }
    if (!formValues.address.trim()) {
      errors.address = 'Address is required';
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      await createWarehouse(formValues, accessToken);
      setSnackbarOpen(true);
      setTimeout(() => navigate('/warehouses'), 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create warehouse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Create New Warehouse</Typography>
        <Button variant="outlined" onClick={() => navigate('/warehouses')}>
          Back to List
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: '100%',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Warehouse Name"
          value={formValues.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={!!formErrors.name}
          helperText={formErrors.name}
          fullWidth
        />

        <TextField
          label="Address"
          value={formValues.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={!!formErrors.address}
          helperText={formErrors.address}
          fullWidth
        />

        <TextField
          label="Phone"
          value={formValues.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          fullWidth
        />

        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>

          <Button variant="outlined" onClick={() => navigate('/warehouses')} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            Warehouse created successfully!
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default CreateWarehouse;
