import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Paper,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme as useMuiTheme
} from '@mui/material';
import LogoImage from '../assets/logo.svg';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const routes = [
    { label: '홈', value: '/', icon: <HomeIcon /> },
    { label: '매장', value: '/shops', icon: <StoreIcon /> },
    { label: '예약', value: '/bookings', icon: <CalendarMonthIcon /> },
    { label: '프로필', value: '/profile', icon: <PersonIcon /> },
  ];

  const currentRoute = routes.find(route => route.value === location.pathname)?.value || '/';

  const showBackButton = location.pathname.includes('/shops/') && location.pathname !== '/shops';

  return (
    <Box sx={{ pb: 7, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          bgcolor: isDarkMode ? 'background.paper' : 'primary.main',
          borderBottom: `1px solid ${muiTheme.palette.divider}`
        }}
      >
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => navigate(-1)}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            <img 
              src={LogoImage} 
              alt="Beauty Book" 
              style={{ 
                height: '32px',
                width: 'auto',
                filter: isDarkMode ? 'brightness(1.2)' : 'none'
              }}
            />
          </Box>
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Box sx={{ pt: 1 }}>
        <Outlet />
      </Box>
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${muiTheme.palette.divider}`
        }} 
        elevation={8}
      >
        <BottomNavigation
          value={currentRoute}
          onChange={(event, newValue) => {
            navigate(newValue);
          }}
          sx={{
            bgcolor: 'background.paper',
            '& .MuiBottomNavigationAction-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }
          }}
        >
          {routes.map((route) => (
            <BottomNavigationAction
              key={route.value}
              label={route.label}
              value={route.value}
              icon={route.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
};

export default Layout;