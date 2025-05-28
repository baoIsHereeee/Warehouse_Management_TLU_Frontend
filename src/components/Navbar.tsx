import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Button, Typography, Box,
} from '@mui/material';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookIcon from '@mui/icons-material/Book';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/log-in');
  };

  const navButtonStyle = {
    color: 'inherit',
    fontSize: '0.75rem', // nhỏ lại
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
          <Typography variant="h6" noWrap sx={{ marginRight: '10px' }}>
            Warehouse Management
          </Typography>

          <Button component={Link} to="/warehouses" sx={navButtonStyle}>
            <WarehouseIcon fontSize="medium" /> Warehouse
          </Button>

          <Button component={Link} to="/categories" sx={navButtonStyle}>
            <CategoryIcon fontSize="medium" /> Category
          </Button>

          <Button component={Link} to="/products" sx={navButtonStyle}>
            <InventoryIcon fontSize="medium" /> Product
          </Button>

          <Button component={Link} to="/imports" sx={navButtonStyle}>
            <MoveToInboxIcon fontSize="medium" /> Import
          </Button>

          <Button component={Link} to="/exports" sx={navButtonStyle}>
            <OutboxIcon fontSize="medium" /> Export
          </Button>

          <Button component={Link} to="/customers" sx={navButtonStyle}>
            <GroupIcon fontSize="medium" /> Customer
          </Button>

          <Button component={Link} to="/suppliers" sx={navButtonStyle}>
            <LocalShippingIcon fontSize="medium" /> Supplier
          </Button>

          <Button component={Link} to="/users" sx={navButtonStyle}>
            <AccountBoxIcon fontSize="medium" /> User
          </Button>

          <Button component={Link} to="/dashboard" sx={navButtonStyle}>
            <DashboardIcon fontSize="medium" /> Dashboard
          </Button>

          <Button component={Link} to="/report" sx={navButtonStyle}>
            <BookIcon fontSize="medium" /> Report
          </Button>
        </Box>

        <Button
          onClick={handleLogout}
          sx={{
            backgroundColor: 'error.main',
            color: 'common.white',
            fontWeight: 'bold',
            ml: 2,
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
