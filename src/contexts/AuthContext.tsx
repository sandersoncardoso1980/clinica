import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Ana Silva',
    email: 'admin@clinica.com',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Dr. João Santos',
    email: 'joao@clinica.com',
    role: 'doctor',
    speciality: 'Cardiologia',
    crm: 'CRM/SP 123456'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria@clinica.com',
    role: 'receptionist'
  },
  {
    id: '4',
    name: 'Carlos Lima',
    email: 'carlos@email.com',
    role: 'patient',
    phone: '(11) 99999-9999'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('clinica_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('clinica_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Credenciais inválidas');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinica_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};