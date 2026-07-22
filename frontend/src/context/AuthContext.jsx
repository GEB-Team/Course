import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      const profile = response.data;
      localStorage.setItem('user_role', profile.role);
      setUser(profile);
      return profile;
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_role');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchUserProfile();
      }
      setLoading(false);
    };
    initAuth();
  }, [fetchUserProfile]);

  const login = async (email, password, requestedRole) => {
    const response = await api.post('/auth/login/manual', { email, password });
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Fetch real profile from backend
    let profile = null;
    try {
      profile = await fetchUserProfile();
    } catch {
      profile = { email, role: requestedRole };
      setUser(profile);
    }

    const effectiveRole = profile?.role || requestedRole;
    localStorage.setItem('user_role', effectiveRole);

    if (effectiveRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
    return true;
  };

  const loginGoogle = async (credential, requestedRole) => {
    try {
      const response = await api.post('/auth/login/google', { credential });
      const { access_token, refresh_token } = response.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      
      let profile = null;
      try {
        profile = await fetchUserProfile();
      } catch {
        profile = { role: requestedRole };
        setUser(profile);
      }

      const effectiveRole = profile?.role || requestedRole;
      localStorage.setItem('user_role', effectiveRole);

      if (effectiveRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
      return true;
    } catch (error) {
      if (error.response?.status === 404 && requestedRole === 'EMPLOYEE') {
        navigate('/employee/register', { state: { googleData: error.response.data.detail } });
      } else if (error.response?.status === 404 && requestedRole === 'ADMIN') {
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
    <AuthContext.Provider value={{ user, login, loginGoogle, logout, loading, refreshUser: fetchUserProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
