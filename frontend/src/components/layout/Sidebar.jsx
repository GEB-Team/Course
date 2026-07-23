import React from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, 
  Typography, Divider, IconButton, useTheme, useMediaQuery, Chip 
} from '@mui/material';
import { 
  Dashboard, VerifiedUser, Person, MenuBook, 
  AppRegistration, PlayLesson, AutoGraph, 
  WorkspacePremium, Payment, Notifications, Lightbulb, 
  Help, Settings, Logout, Close, AdminPanelSettings, 
  People, AssignmentTurnedIn, HistoryEdu, CloudUpload
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const employeeMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/employee/dashboard' },
  { text: 'Document Verification', icon: <VerifiedUser />, path: '/onboarding', highlight: true },
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

const adminMenuItems = [
  { text: 'Admin Overview', icon: <Dashboard />, path: '/admin/dashboard' },
  { text: 'Document Approval Queue', icon: <AssignmentTurnedIn />, path: '/admin/documents', highlight: true },
  { text: 'Employee Directory', icon: <People />, path: '/admin/users' },
  { text: 'Course Management', icon: <MenuBook />, path: '/admin/courses' },
  { text: 'Audit & Activity Logs', icon: <HistoryEdu />, path: '/admin/logs' },
  { text: 'Portal Settings', icon: <Settings />, path: '/admin/settings' },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'ADMIN';
  const menuItems = isAdmin ? adminMenuItems : employeeMenuItems;

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) handleDrawerToggle();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#0F172A', color: 'white' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 38, 
            height: 38, 
            borderRadius: 2, 
            bgcolor: isAdmin ? '#EF4444' : '#38BDF8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {isAdmin ? <AdminPanelSettings /> : 'GEB'}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" color={isAdmin ? '#F87171' : '#38BDF8'} lineHeight={1.2}>
              GEB Portal
            </Typography>
            <Typography variant="caption" sx={{ color: '#94A3B8' }}>
              {isAdmin ? 'Administrator Area' : 'Employee Portal'}
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        )}
      </Box>

      {/* Quick Upload Action Button in Sidebar for Employee */}
      {!isAdmin && (
        <Box sx={{ px: 2, mb: 1 }}>
          <Box
            onClick={() => handleNavigation('/onboarding')}
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(56, 189, 248, 0.2) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(56, 189, 248, 0.2)',
                borderColor: '#38BDF8'
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CloudUpload sx={{ color: '#38BDF8', fontSize: 20 }} />
              <Typography variant="body2" fontWeight={600} color="#38BDF8">
                Upload Documents
              </Typography>
            </Box>
            <Chip label="AI OCR" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#38BDF8', color: '#0F172A', fontWeight: 'bold' }} />
          </Box>
        </Box>
      )}
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        px: 2, 
        py: 1,
        '&::-webkit-scrollbar': { width: '5px' }, 
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '3px' } 
      }}>
        {menuItems.map((item, index) => {
          if (item.isHeader) {
            return (
              <Typography key={index} variant="overline" sx={{ color: '#64748B', display: 'block', mt: 2, mb: 0.5, ml: 1.5, fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                {item.text}
              </Typography>
            );
          }

          const isActive = location.pathname === item.path;

          return (
            <ListItem 
              button="true"
              key={item.text} 
              onClick={() => handleNavigation(item.path)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.15)' : (item.highlight ? 'rgba(255,255,255,0.03)' : 'transparent'),
                color: isActive ? '#38BDF8' : '#cbd5e1',
                borderLeft: isActive ? '3px solid #38BDF8' : '3px solid transparent',
                transition: 'all 0.15s ease',
                '&:hover': {
                  backgroundColor: 'rgba(56, 189, 248, 0.12)',
                  color: '#38BDF8'
                }
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#38BDF8' : '#94A3B8', minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontSize: '0.875rem', 
                  fontWeight: isActive ? 600 : 400 
                }} 
              />
            </ListItem>
          );
        })}
      </List>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      
      {/* User Mini Profile & Logout */}
      <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.2)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" fontWeight="bold" noWrap color="white">
              {user?.full_name || (isAdmin ? 'Admin' : 'Employee')}
            </Typography>
            <Typography variant="caption" color="#94A3B8" noWrap display="block">
              {user?.email || 'Logged in'}
            </Typography>
          </Box>
          <Chip 
            label={isAdmin ? 'ADMIN' : (user?.verification_status || 'EMP')} 
            size="small" 
            sx={{ 
              height: 20, 
              fontSize: '0.65rem', 
              bgcolor: isAdmin ? '#EF4444' : (user?.verification_status === 'Verified' ? '#10B981' : '#F59E0B'),
              color: 'white',
              fontWeight: 'bold'
            }} 
          />
        </Box>
        <ListItem 
          button="true"
          onClick={logout}
          sx={{
            p: 1,
            borderRadius: 1.5,
            cursor: 'pointer',
            color: '#f87171',
            '&:hover': {
              backgroundColor: 'rgba(248, 113, 113, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.85rem' }} />
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
