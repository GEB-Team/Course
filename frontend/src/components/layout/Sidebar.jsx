import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { 
  Dashboard, VerifiedUser, Person, MenuBook, 
  AppRegistration, PlayLesson, AutoGraph, School, 
  WorkspacePremium, Payment, Notifications, Lightbulb, 
  Help, Settings, Logout, Close 
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/employee/dashboard' },
  { text: 'Document Verification', icon: <VerifiedUser />, path: '/onboarding' },
  { text: 'My Profile', icon: <Person />, path: '/profile' },
  { text: 'Course Management', isHeader: true },
  { text: 'Register Course', icon: <AppRegistration />, path: '/courses/register' },
  { text: 'Learning Module', icon: <MenuBook />, path: '/courses/learning' },
  { text: 'Course Progress', icon: <AutoGraph />, path: '/courses/progress' },
  { text: 'Training Module', icon: <PlayLesson />, path: '/training' },
  { text: 'Certification', icon: <WorkspacePremium />, path: '/certification' },
  { text: 'Payment', icon: <Payment />, path: '/payment' },
  { text: 'Other', isHeader: true },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
  { text: 'AI Recommendations', icon: <Lightbulb />, path: '/recommendations' },
  { text: 'Help & Support', icon: <Help />, path: '/support' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) handleDrawerToggle();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', color: 'white' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="#38BDF8">GEB Portal</Typography>
          <Typography variant="caption" color="gray">Employee Area</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, overflowY: 'auto', px: 2, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' } }}>
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <Typography key={index} variant="overline" sx={{ color: 'gray', display: 'block', mt: 2, mb: 1, ml: 2 }}>
                {item.text}
              </Typography>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => handleNavigation(item.path)}
              component={motion.div}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                color: isActive ? '#38BDF8' : '#cbd5e1',
                '&:hover': {
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38BDF8'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }} />
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <Box sx={{ p: 2 }}>
        <ListItem 
          button 
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: '#f87171',
            '&:hover': {
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
