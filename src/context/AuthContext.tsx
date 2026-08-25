import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  loading: boolean;
  switchUser: (userId: string) => Promise<void>;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isRep: boolean;
  isMarketing: boolean;
  isAnalyst: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuth = async () => {
    try {
      setLoading(true);
      const [meRes, usersRes] = await Promise.all([
        api.getMe(),
        api.getUsers(),
      ]);
      setCurrentUser(meRes.user);
      setUsers(usersRes.users);
    } catch (err) {
      console.error('Failed to load user session:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  const switchUser = async (userId: string) => {
    try {
      localStorage.setItem('nexus_active_user_id', userId);
      const res = await api.switchUser(userId);
      setCurrentUser(res.user);
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!currentUser) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(currentUser.role);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'sales_manager';
  const isRep = currentUser?.role === 'sales_rep';
  const isMarketing = currentUser?.role === 'marketing';
  const isAnalyst = currentUser?.role === 'analyst';

  // Permission logic: Analysts are read-only
  const canEdit = !isAnalyst;
  const canDelete = isAdmin || isManager;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        loading,
        switchUser,
        hasRole,
        isAdmin,
        isManager,
        isRep,
        isMarketing,
        isAnalyst,
        canEdit,
        canDelete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
