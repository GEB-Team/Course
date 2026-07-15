import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#87CEEB', // Sky Blue
      contrastText: '#4B5563', // Dark Grey
    },
    secondary: {
      main: '#E5E7EB', // Grey
      contrastText: '#4B5563', // Dark Grey
    },
    info: {
      main: '#38BDF8',
    },
    background: {
      default: '#F3F4F6', // Light Grey
      paper: '#FFFFFF', // Pure White
    },
    text: {
      primary: '#4B5563', // Dark Grey text
      secondary: '#9CA3AF',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
      color: '#4B5563', // Force header to dark grey
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(135, 206, 235, 0.4)', // sky blue shadow
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E5E7EB', // Border grey
            borderWidth: '1.5px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#87CEEB', // Sky blue on hover
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#87CEEB', // Sky blue on focus
            borderWidth: '1.5px',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 4px rgba(135, 206, 235, 0.2)', // sky blue ring
          },
        },
      },
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          marginLeft: '8px',
          marginRight: '8px',
          fontSize: '1.2rem',
        }
      }
    }
  },
});

export default theme;
