import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { USER_ROLES } from '../utils/constants';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ success: false, message: 'Not initialized' }),
  signup: async () => ({ success: false, message: 'Not initialized' }),
  logout: async () => {},
  hasRole: () => false,
  isAdmin: false,
  isSuperAdmin: false
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.name || 'User',
          role: firebaseUser.role || USER_ROLES.USER,
          phone: firebaseUser.phone || '',
          address: firebaseUser.address || ''
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    return result;
  };

  const signup = async (name, email, password) => {
    const result = await authService.signup(name, email, password);
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const hasRole = (role) => {
    if (!user) return false;
    if (user.role === USER_ROLES.SUPERADMIN) return true;
    if (role === USER_ROLES.ADMIN && (user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.SUPERADMIN)) return true;
    return user.role === role;
  };

  const isAdmin = hasRole(USER_ROLES.ADMIN);
  const isSuperAdmin = hasRole(USER_ROLES.SUPERADMIN);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      signup,
      logout,
      hasRole,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
