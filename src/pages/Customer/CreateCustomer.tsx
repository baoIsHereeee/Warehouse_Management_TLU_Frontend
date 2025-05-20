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
import { createCustomer } from '../../services/Customer/customer.service';

const CreateCustomer: React.FC = () => {
  const navigate = useNavigate();

  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!fullname || !email || !phone || !address) {
      setError('All fields are required');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setError('Access token not found, please login');
      return;
    }

    setLoading(true);

    try {
      await createCustomer({ fullname, email, phone, address }, accessToken);
      setSuccessMessage('Customer created successfully!');

      // Reset form
      setFullname('');
      setEmail('');
      setPhone('');
      setAddress('');

      setTimeout(() => {
        navigate('/customers');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Customer
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

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          multiline
          rows={3}
          margin="normal"
          disabled={loading}
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <Button variant="outlined" onClick={() => navigate('/customers')} disabled={loading}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateCustomer;
