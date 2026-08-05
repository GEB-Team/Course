import React from 'react';
import { 
  AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, 
  Menu, MenuItem, Tooltip, Button, Chip, Divider 
} from '@mui/material';
import { 
  Menu as MenuIcon, Notifications, Brightness4, Brightness7, 
  Person, Settings, Logout, CloudUpload, AssignmentTurnedIn 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ handleDrawerToggle, toggleTheme, isDarkMode, notificationCount = 3 }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = React.useState(null);

  const isAdmin = user?.role === 'ADMIN';

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
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
      background: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      zIndex: (theme) => theme.zIndex.drawer + 1
    }}>
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: 64 }}>
        {/* Left Side: Mobile Menu Button & Title */}
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
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700} color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Government Employee Board
            </Typography>
            <Chip 
              label={isAdmin ? 'ADMINISTRATOR' : (user?.verification_status === 'Verified' ? 'VERIFIED' : 'EMPLOYEE')} 
              size="small" 
              color={isAdmin ? 'error' : (user?.verification_status === 'Verified' ? 'success' : 'primary')} 
              variant="outlined"
              sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            />
          </Box>
        </Box>

        {/* Right Side: Quick Action, Notifications, User Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Primary Quick Action Button */}
          {isAdmin ? (
            <Button 
              variant="contained" 
              color="error" 
              size="small" 
              startIcon={<AssignmentTurnedIn />}
              onClick={() => navigate('/admin/documents')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, display: { xs: 'none', sm: 'flex' } }}
            >
              Approval Queue
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="primary" 
              size="small" 
              startIcon={<CloudUpload />}
              onClick={() => navigate('/onboarding')}
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2, display: { xs: 'none', sm: 'flex' } }}
            >
              Upload Documents
            </Button>
          )}

          {/* Theme Toggle */}
          <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={toggleTheme} color="inherit" size="small">
              {isDarkMode ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="small" onClick={handleNotifOpen}>
              <Badge badgeContent={notificationCount} color="error">
                <Notifications fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* User Avatar Button */}
          <Box 
            onClick={handleProfileMenuOpen}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              cursor: 'pointer', 
              p: 0.5, 
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <Avatar 
              alt={user?.full_name || 'User'} 
              src={user?.profile_picture} 
              sx={{ 
                width: 36, 
                height: 36, 
                border: '2px solid', 
                borderColor: isAdmin ? '#EF4444' : 'primary.main',
                bgcolor: isAdmin ? '#EF4444' : 'primary.main',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : (isAdmin ? 'A' : 'E')}
            </Avatar>
            <Box sx={{ display: { xs: 'none', lg: 'block' }, textAlign: 'left' }}>
              <Typography variant="body2" fontWeight={600} lineHeight={1.2}>
                {user?.full_name || (isAdmin ? 'Admin User' : 'Employee')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.employee_id || (isAdmin ? 'System Admin' : user?.department || 'Portal User')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>

      {/* Notifications Popover */}
      <Menu
        anchorEl={notifAnchorEl}
        open={Boolean(notifAnchorEl)}
        onClose={handleNotifClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, minWidth: 300, maxWidth: 360, borderRadius: 2, p: 1 }
        }}
      >
        <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" fontWeight="bold">Notifications</Typography>
          <Chip label="3 New" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem' }} />
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleNotifClose(); navigate(isAdmin ? '/admin/documents' : '/onboarding'); }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {isAdmin ? 'New document awaiting review' : 'Document verification status'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isAdmin ? 'Employee John Doe uploaded identity card' : 'Your credentials are currently in active review.'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={() => { handleNotifClose(); navigate(isAdmin ? '/admin/dashboard' : '/notifications'); }}>
          <Box>
            <Typography variant="body2" fontWeight={600}>Mandatory Course Recommendation</Typography>
            <Typography variant="caption" color="text.secondary">New AI recommended learning modules assigned.</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" fullWidth onClick={() => { handleNotifClose(); navigate(isAdmin ? '/admin/logs' : '/notifications'); }}>
            View All Notifications
          </Button>
        </Box>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 4,
          sx: { mt: 1.5, minWidth: 220, borderRadius: 2 }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" fontWeight="bold">{user?.full_name || (isAdmin ? 'Admin' : 'Employee')}</Typography>
          <Typography variant="body2" color="text.secondary">{user?.email || 'user@geb.gov'}</Typography>
        </Box>
        <MenuItem onClick={() => { handleMenuClose(); navigate(isAdmin ? '/admin/dashboard' : '/profile'); }} sx={{ py: 1.2 }}>
          <Person sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> {isAdmin ? 'Admin Overview' : 'My Profile'}
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(isAdmin ? '/admin/documents' : '/onboarding'); }} sx={{ py: 1.2 }}>
          <CloudUpload sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> {isAdmin ? 'Approval Queue' : 'Upload Documents'}
        </MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate(isAdmin ? '/admin/settings' : '/settings'); }} sx={{ py: 1.2 }}>
          <Settings sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} /> Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); logout(); }} sx={{ py: 1.2, color: 'error.main' }}>
          <Logout sx={{ mr: 1.5, fontSize: 20 }} /> Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default TopBar;
