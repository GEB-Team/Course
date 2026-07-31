import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleTheme = () => {
    // A robust theme toggler would interact with a context, for now we manage local state
    // and let the parent apply the theme if it's connected, or we just pass it down
    setIsDarkMode(!isDarkMode);
    // document.body.dataset.theme = isDarkMode ? 'light' : 'dark';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <CssBaseline />
      
      <TopBar 
        handleDrawerToggle={handleDrawerToggle} 
        toggleTheme={toggleTheme} 
        isDarkMode={isDarkMode} 
        notificationCount={5} // Mock dynamic count
      />
      
      <Sidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 280px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar /> {/* Spacer for TopBar */}
        <Box sx={{ flexGrow: 1, animation: 'fadeIn 0.5s ease-in-out' }}>
          {children}
        </Box>
      </Box>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default DashboardLayout;
