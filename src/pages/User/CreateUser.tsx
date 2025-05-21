import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../services/User/user.service';

const CreateUser: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    age: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullname.trim()) {
      setSnackbar({
        open: true,
        message: 'Full name is required',
        severity: 'error',
      });
      return false;
    }
    if (!formData.email.trim()) {
      setSnackbar({
        open: true,
        message: 'Email is required',
        severity: 'error',
      });
      return false;
    }
    if (!formData.password.trim()) {
      setSnackbar({
        open: true,
        message: 'Password is required',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setSnackbar({
        open: true,
        message: 'Authentication required',
        severity: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    const userPayload: any = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
    };

    if (formData.age.trim()) {
      userPayload.age = Number(formData.age);
    }

    try {
      await createUser(userPayload, accessToken);
      setSnackbar({
        open: true,
        message: 'User created successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error: any) {
      console.error('Create user error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to create user!',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New User
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="fullname"
          label="Full Name"
          value={formData.fullname}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          required
        />
        <TextField
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          type="password"
          required
        />
        <TextField
          name="age"
          label="Age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          helperText="Optional"
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateUser;
