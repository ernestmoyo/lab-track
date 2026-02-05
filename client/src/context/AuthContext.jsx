import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('labtrack_token');
    if (token) {
      api.getProfile()
        .then((profile) => setUser(profile))
        .catch(() => localStorage.removeItem('labtrack_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email, password) {
    const { token, user: userData } = await api.login(email, password);
    localStorage.setItem('labtrack_token', token);
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('labtrack_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
