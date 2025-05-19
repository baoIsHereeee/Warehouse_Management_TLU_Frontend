import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/log-in');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 2 }}>
          <Typography variant="h6" noWrap>
            Warehouse Management
          </Typography>

          <Button color="inherit" component={Link} to="/products">
            Product
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
