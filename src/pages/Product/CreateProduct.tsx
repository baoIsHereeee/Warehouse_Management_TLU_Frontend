import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { createProduct } from '../../services/Product/product.service';
import { getCategories } from '../../services/Product/product.service';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number;
  email: string;
  roles: string[];
}

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    minimumStock: '',
    sellingPrice: '',
    orderStock: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const getUserIdFromToken = (): number | null => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.id;
    } catch {
      return null;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Product name is required',
        severity: 'error',
      });
      return false;
    }
    if (!formData.sellingPrice || Number(formData.sellingPrice) <= 0) {
      setSnackbar({
        open: true,
        message: 'Selling price must be greater than 0',
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
    const userId = getUserIdFromToken();

    if (!accessToken || !userId) {
      setSnackbar({
        open: true,
        message: 'Authentication required',
        severity: 'error',
      });
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    if (formData.minimumStock) {
      formDataToSend.append('minimumStock', formData.minimumStock);
    }
    formDataToSend.append('sellingPrice', formData.sellingPrice);
    if (formData.orderStock) {
      formDataToSend.append('orderStock', formData.orderStock);
    }
    formDataToSend.append('categoryId', formData.categoryId);
    formDataToSend.append('userId', userId.toString());

    // Log the FormData contents
    console.log('Form Data being sent:');
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      await createProduct(formDataToSend, accessToken);
      setSnackbar({
        open: true,
        message: 'Product created successfully!',
        severity: 'success',
      });
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error: any) {
      console.error('Failed to create product:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create product!',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const res = await getCategories(accessToken);
      setCategories(res);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load categories',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Product
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
          error={!formData.name.trim()}
          helperText={!formData.name.trim() ? "Name is required" : ""}
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
        />

        <Box>
          <input
            accept="image/*"
            type="file"
            id="image-upload"
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button variant="outlined" component="span">
              Upload Product Image
            </Button>
          </label>
          {imagePreview && (
            <Box mt={2}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
            </Box>
          )}
        </Box>

        <TextField
          name="minimumStock"
          label="Minimum Stock"
          type="number"
          value={formData.minimumStock}
          onChange={handleChange}
          inputProps={{ step: 1, min: 0 }}
        />

        <TextField
          name="orderStock"
          label="Order Stock"
          type="number"
          value={formData.orderStock}
          onChange={handleChange}
          disabled={!formData.minimumStock}
          helperText={!formData.minimumStock ? "This will automatically send email to supplier to restock! Available after setting minimum stock!" : ""}
          inputProps={{ step: 1, min: 0 }}
        />

        <TextField
          name="sellingPrice"
          label="Selling Price"
          type="number"
          value={formData.sellingPrice}
          onChange={handleChange}
          required
          error={!formData.sellingPrice || Number(formData.sellingPrice) <= 0}
          helperText={!formData.sellingPrice || Number(formData.sellingPrice) <= 0 ? "Selling price must be greater than 0" : ""}
        />

        <TextField
          select
          label="Category"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          error={false}
          helperText="Optional"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {categories.map((cat: any) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateProduct;
