import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, you'd fetch the user profile here using the token
    const token = localStorage.getItem('access_token');
    const role = localStorage.getItem('user_role');
    if (token && role) {
      setUser({ role });
    }
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await api.post('/auth/login/manual', { email, password });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      // We assume role verification is done correctly, backend should ideally return user details
      localStorage.setItem('user_role', role); 
      setUser({ role });
      
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
      return true;
    } catch (error) {
      throw error;
    }
  };

  const loginGoogle = async (credential, role) => {
    try {
      const response = await api.post('/auth/login/google', { credential });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_role', role);
      setUser({ role });
      
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
      return true;
    } catch (error) {
      if (error.response?.status === 404 && role === 'EMPLOYEE') {
        // Redirect to registration with prepopulated data
        navigate('/employee/register', { state: { googleData: error.response.data.detail } });
      } else if (error.response?.status === 404 && role === 'ADMIN') {
        throw new Error('Unauthorized Administrator Account.');
      } else {
        throw error;
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
