import React from 'react';
import { Box, TextField, InputAdornment, Chip, Paper } from '@mui/material';
import { Search, X, FileText, BookOpen, Award, GraduationCap } from 'lucide-react';

const ProfileSearch = ({ searchQuery, onSearchChange, activeFilter, onFilterChange }) => {
  const filters = [
    { label: 'All Record Items', value: 'all', icon: null },
    { label: 'Documents', value: 'documents', icon: <FileText size={14} /> },
    { label: 'Courses', value: 'courses', icon: <BookOpen size={14} /> },
    { label: 'Training', value: 'training', icon: <GraduationCap size={14} /> },
    { label: 'Certificates', value: 'certificates', icon: <Award size={14} /> }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        mb: 3,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Search service record by course title, document name, certification ID, training or skill..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search size={18} color="#64748B" />
            </InputAdornment>
          ),
          endAdornment: searchQuery ? (
            <InputAdornment position="end">
              <X 
                size={16} 
                color="#64748B" 
                style={{ cursor: 'pointer' }} 
                onClick={() => onSearchChange('')} 
              />
            </InputAdornment>
          ) : null,
          sx: { borderRadius: 2.5, bgcolor: '#F8FAFC' }
        }}
      />

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
        {filters.map((f) => (
          <Chip
            key={f.value}
            icon={f.icon}
            label={f.label}
            size="small"
            clickable
            color={activeFilter === f.value ? 'primary' : 'default'}
            variant={activeFilter === f.value ? 'filled' : 'outlined'}
            onClick={() => onFilterChange(f.value)}
            sx={{ fontWeight: 600, fontSize: '0.75rem', borderRadius: 2 }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default ProfileSearch;
