import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Box, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getWarehouseById, updateWarehouse, deleteWarehouse,
} from '../../services/Warehouse/warehouse.service';

const WarehouseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState<any | null>(null);
  const [loading, setLoading]   = useState(false);
  const [saving,  setSaving]    = useState(false);
  const [deleting,setDeleting]  = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [formValues, setFormValues] = useState({ name:'', address:'', phone:'' });
  const [formErrors, setFormErrors] = useState({ name:'', address:'' });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage,   setErrorMessage]   = useState<string | null>(null);

  const fetchWarehouse = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      const data = await getWarehouseById(id, token);
      setWarehouse(data);
      setFormValues({
        name   : data.name    ?? '',
        address: data.address ?? '',
        phone  : data.phone   ?? '',
      });
    } catch (err:any) {
      setErrorMessage(err.message || 'Failed to load warehouse');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWarehouse(); }, [id]);

  const handleInputChange = (field:string,val:string) => {
    setFormValues(p => ({ ...p, [field]: val }));
    setFormErrors(e => ({ ...e,  [field]: '' }));
  };

  const validateForm = () => {
    const errors = { name:'', address:'' };
    let valid = true;
    if (!formValues.name.trim())    { errors.name='Warehouse name is required'; valid=false; }
    if (!formValues.address.trim()) { errors.address='Address is required';      valid=false; }
    setFormErrors(errors);
    return valid;
  };

  const handleSave = async () => {
    if (!id || !validateForm()) return;
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      const updatedData = {
        name   : formValues.name.trim(),
        address: formValues.address.trim(),
        phone  : formValues.phone.trim(),
      };
      await updateWarehouse(id, updatedData, token);
      setSuccessMessage('Warehouse updated successfully!');
    } catch (err:any) {
        const serverMessage = err?.response?.data?.message || err.message || 'Failed to update warehouse';
        setErrorMessage(serverMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');

      await deleteWarehouse(id, token);
      setSuccessMessage('Warehouse deleted successfully!');
    } catch (err:any) {
        const serverMessage = err?.response?.data?.message || err.message || 'Failed to delete warehouse';
        setErrorMessage(serverMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessMessage(null);
    navigate('/warehouses');  
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>
  );
  if (!warehouse) return null;

  return (
    <Container sx={{ mt:4, mb:4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Warehouse Detail: {warehouse.name}</Typography>
        <Button variant="outlined" onClick={() => navigate('/warehouses')}>
          Back to List
        </Button>
      </Box>

      {/* Form */}
      <Box component="form" sx={{ display:'flex', flexDirection:'column', gap:2, mb:4 }}>
        <TextField
          fullWidth label="Warehouse Name"
          value={formValues.name}
          onChange={e=>handleInputChange('name',e.target.value)}
          error={!!formErrors.name} helperText={formErrors.name}
        />
        <TextField
          fullWidth label="Address"
          value={formValues.address}
          onChange={e=>handleInputChange('address',e.target.value)}
          error={!!formErrors.address} helperText={formErrors.address}
        />
        <TextField
          fullWidth label="Phone"
          value={formValues.phone}
          onChange={e=>handleInputChange('phone',e.target.value)}
        />
      </Box>

      {/* Actions */}
      <Box mb={3} display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving?'Updating...':'Update'}
        </Button>
        <Button variant="outlined" color="error" onClick={()=>setDeleteDialogOpen(true)} disabled={deleting}>
          {deleting?'Deleting...':'Delete'}
        </Button>
      </Box>

      {/* Products in warehouse */}
      <Typography variant="h5" gutterBottom>Products in Warehouse</Typography>
      {warehouse.warehouseDetails.length===0 ? (
        <Typography>No products found in this warehouse.</Typography>
      ):(
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product Name</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Current Stock</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {warehouse.warehouseDetails.map((d:any)=>(
                <TableRow key={d.productId}>
                  <TableCell>{d.product?.name}</TableCell>
                  <TableCell>{d.quantity}</TableCell>
                  <TableCell>{d.product?.currentStock}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Snackbar SUCCESS */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={1500}
        onClose={(_,reason)=>{ if(reason==='clickaway') return; handleSuccessClose(); }}
        anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
      >
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width:'100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar ERROR */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={3000}
        onClose={()=>setErrorMessage(null)}
        anchorOrigin={{ vertical:'bottom', horizontal:'left' }}
      >
        <Alert onClose={()=>setErrorMessage(null)} severity="error" sx={{ width:'100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={()=>setDeleteDialogOpen(false)}
        PaperProps={{ sx:{ borderRadius:3, p:2, minWidth:400 } }}
      >
        <DialogTitle sx={{ fontWeight:600, textAlign:'center' }}>Delete Warehouse</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign:'center', color:'text.secondary' }}>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent:'center' }}>
          <Button variant="outlined" color="primary" onClick={()=>setDeleteDialogOpen(false)} sx={{ minWidth:100 }}>
            Cancel
          </Button>
          <Button
            variant="contained" color="error" sx={{ minWidth:100 }} autoFocus
            onClick={()=>{
              setDeleteDialogOpen(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WarehouseDetail;
