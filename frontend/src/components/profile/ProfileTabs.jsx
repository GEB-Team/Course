import React from 'react';
import { Box, Tabs, Tab, Paper, useTheme, useMediaQuery } from '@mui/material';
import { 
  User, Briefcase, Award, FileText, School, Clock, 
  BookOpen, GraduationCap, ShieldCheck, Sparkles, Activity, Settings 
} from 'lucide-react';

const tabsList = [
  { label: 'Personal Information', icon: <User size={16} /> },
  { label: 'Employment Details', icon: <Briefcase size={16} /> },
  { label: 'Registration Details', icon: <Award size={16} /> },
  { label: 'Uploaded Documents', icon: <FileText size={16} /> },
  { label: 'Qualification', icon: <School size={16} /> },
  { label: 'Experience', icon: <Clock size={16} /> },
  { label: 'Courses', icon: <BookOpen size={16} /> },
  { label: 'Training History', icon: <GraduationCap size={16} /> },
  { label: 'Certifications', icon: <ShieldCheck size={16} /> },
  { label: 'AI Recommendations', icon: <Sparkles size={16} /> },
  { label: 'Activity Timeline', icon: <Activity size={16} /> },
  { label: 'Settings', icon: <Settings size={16} /> }
];

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
        bgcolor: 'background.paper',
        overflow: 'hidden'
      }}
    >
      <Tabs
        value={activeTab}
        onChange={(e, val) => onTabChange(val)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 52,
          '& .MuiTabs-indicator': {
            height: 3,
            bgcolor: 'primary.main',
            borderRadius: '3px 3px 0 0'
          },
          '& .MuiTab-root': {
            minHeight: 52,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            color: 'text.secondary',
            py: 1.5,
            px: 2.2,
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
            '&.Mui-selected': {
              color: 'primary.main',
              fontWeight: 700
            }
          }
        }}
      >
        {tabsList.map((t, idx) => (
          <Tab 
            key={idx} 
            icon={t.icon} 
            iconPosition="start" 
            label={t.label} 
          />
        ))}
      </Tabs>
    </Paper>
  );
};

export default ProfileTabs;
