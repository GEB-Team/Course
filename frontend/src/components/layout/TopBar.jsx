import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, Menu, MenuItem, InputBase, Tooltip, Button } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Notifications, Brightness4, Brightness7, Language, Person, Settings, Logout } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ handleDrawerToggle, toggleTheme, isDarkMode, notificationCount = 0 }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ 
      width: { md: `calc(100% - 280px)` }, 
      ml: { md: `280px` },
      backgroundColor: 'background.paper',
      color: 'text.primary',
      borderBottom: '1px solid',
      borderColor: 'divider',
      backdropFilter: 'blur(8px)',
      background: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', backgroundColor: 'action.hover', borderRadius: 2, px: 2, py: 0.5, width: 300 }}>
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Search courses, certificates..." sx={{ width: '100%', fontSize: '0.9rem' }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button variant="contained" color="primary" size="small" sx={{ display: { xs: 'none', md: 'block' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
            Quick Actions
          </Button>

          <Tooltip title="Toggle Theme">
            <IconButton onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Language">
            <IconButton color="inherit">
              <Language />
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0, ml: 2 }}>
            <Avatar alt={user?.full_name} src={user?.profile_picture} sx={{ width: 40, height: 40, border: '2px solid', borderColor: 'primary.main' }} />
          </IconButton>
        </Box>
      </Toolbar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, minWidth: 200, borderRadius: 2 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold">{user?.full_name}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.employee_id || 'Employee'}</Typography>
        </Box>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <Person sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> My Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
          <Settings sx={{ mr: 2, fontSize: 20, color: 'text.secondary' }} /> Settings
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); logout(); }} sx={{ py: 1.5, color: 'error.main' }}>
          <Logout sx={{ mr: 2, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default TopBar;
