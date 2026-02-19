
import { storage } from './storage';
import { User, UserRole } from '../types';

export const authService = {
  login: async (email: string): Promise<User | null> => {
    const users = storage.getUsers();
    const user = users.find(u => u.email === email);
    if (user) {
      localStorage.setItem('admp_current_user', JSON.stringify(user));
      storage.addLog('Login', user.name, `User ${user.email} logged in`);
      return user;
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem('admp_current_user');
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem('admp_current_user');
    return data ? JSON.parse(data) : null;
  },
  initializeAdmin: () => {
    const users = storage.getUsers();
    if (users.length === 0) {
      const admin: User = {
        id: 'admin-1',
        name: 'System Administrator',
        email: 'admin@college.edu',
        role: UserRole.ADMIN,
        department: 'CSE',
        createdDate: new Date().toISOString()
      };
      const principal: User = {
        id: 'principal-1',
        name: 'Dr. Principal',
        email: 'principal@college.edu',
        role: UserRole.PRINCIPAL,
        department: 'CSE',
        createdDate: new Date().toISOString()
      };
      storage.saveUsers([admin, principal]);
    }
  }
};
