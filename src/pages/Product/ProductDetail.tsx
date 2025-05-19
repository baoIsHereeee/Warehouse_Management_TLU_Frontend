import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  MenuItem,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct, deleteProduct, getCategories } from '../../services/Product/product.service';

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dw3x8orox/image/upload/v1747628006/b170870007dfa419295d949814474ab2_t_p4cjjq.jpg';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currentStock: '',
    sellingPrice: '',
    minimumStock: '',
    orderStock: '',
    categoryId: '',
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'error' | 'info',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!id || !accessToken) throw new Error('Missing required data');

        const [productData, categoriesData] = await Promise.all([
          getProductById(id, accessToken),
          getCategories(accessToken)
        ]);

        setProduct(productData);
        setCategories(categoriesData);
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          currentStock: productData.currentStock?.toString() || '0',
          sellingPrice: productData.sellingPrice?.toString() || '',
          minimumStock: productData.minimumStock?.toString() || '',
          orderStock: productData.orderStock?.toString() || '',
          categoryId: productData.category?.id || '',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!id || !accessToken) throw new Error('Missing required data');

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('sellingPrice', formData.sellingPrice);
      formDataToSend.append('minimumStock', formData.minimumStock);
      if (formData.minimumStock) {
        formDataToSend.append('orderStock', formData.orderStock);
      }
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      } else if (!product.image) {
        formDataToSend.append('image', '');
      }
      formDataToSend.append('categoryId', formData.categoryId || '');

      await updateProduct(id, formDataToSend, accessToken);
      setSnackbar({
        open: true,
        message: 'Product updated successfully',
        severity: 'success'
      });
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to update product',
        severity: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!id || !accessToken) throw new Error('Missing required data');

      await deleteProduct(id, accessToken);
      setSnackbar({
        open: true,
        message: 'Product deleted successfully',
        severity: 'success'
      });
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Failed to delete product',
        severity: 'error'
      });
    }
  };

  const handleRemoveImage = () => {
    setProduct((prev: typeof product) => ({ ...prev, image: null }));
    setSnackbar({
      open: true,
      message: 'Image Removed!',
      severity: 'info'
    });
  };

  if (error) return <Container sx={{ mt: 4 }}><Alert severity="error">{error}</Alert></Container>;
  if (!product) return <Container sx={{ mt: 4 }}>Loading...</Container>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Product Details: {product.name}
      </Typography>

      <Box mb={2} display="flex" justifyContent="center" alignItems="center" position="relative">
        <img
          src={selectedImage ? URL.createObjectURL(selectedImage) : (product.image || DEFAULT_IMAGE)}
          alt={product.name}
          style={{
            maxWidth: '300px',
            maxHeight: '200px',
            objectFit: 'contain',  
            border: '1px solid #ccc',
            borderRadius: 4,
            backgroundColor: '#f5f5f5',
          }}
        />
        {product.image && !selectedImage && (
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: 'absolute',
              top: 8,
              right: 'calc(50% - 150px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
          >
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>

      <Box mb={2} display="flex" justifyContent="center" alignItems="center">
        <Box mt={1}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Image
            </Button>
          </label>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          multiline
        />
        <TextField
          name="currentStock"
          label="Current Stock"
          value={formData.currentStock}
          disabled
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          name="sellingPrice"
          label="Selling Price"
          type="number"
          value={formData.sellingPrice}
          onChange={handleChange}
          required
        />
        <TextField
          name="minimumStock"
          label="Minimum Stock"
          type="number"
          value={formData.minimumStock}
          onChange={handleChange}
        />
        {formData.minimumStock && (
          <TextField
            name="orderStock"
            label="Order Stock"
            type="number"
            value={formData.orderStock}
            onChange={handleChange}
          />
        )}
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
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>

        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleUpdate}
          >
            Update Product
          </Button>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete Product
          </Button>
        </Box>
      </Box>

    <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
            sx: {
            borderRadius: 3,
            padding: 2,
            minWidth: 400,
            }
        }}
        >
        <DialogTitle sx={{ fontWeight: 600, textAlign: 'center' }}>
            Delete Product
        </DialogTitle>

        <DialogContent>
            <DialogContentText sx={{ textAlign: 'center', color: 'text.secondary', mb: 1 }}>
            Are you sure you want to delete this product?
            </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center' }}>
            <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            color="primary"
            sx={{ minWidth: 100, borderRadius: 2 }}
            >
            Cancel
            </Button>
            <Button 
            onClick={handleDelete} 
            variant="contained"
            color="error"
            sx={{ minWidth: 100, borderRadius: 2 }}
            autoFocus
            >
            Delete
            </Button>
        </DialogActions>
    </Dialog>


      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={1000} 
        onClose={(_, reason) => {
          if (reason === 'timeout' || reason === 'clickaway') {
            setSnackbar(prev => ({ ...prev, open: false }));
            if (snackbar.severity === 'success') {
              navigate('/products'); 
            }
          }
        }}
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

export default ProductDetail;
