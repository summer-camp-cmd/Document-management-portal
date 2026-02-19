
import { User, UserRole, Document, SystemLog, Category } from '../types';

const USERS_KEY = 'admp_users';
const DOCS_KEY = 'admp_documents';
const LOGS_KEY = 'admp_logs';

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getDocuments: (): Document[] => {
    const data = localStorage.getItem(DOCS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveDocuments: (docs: Document[]) => {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  },
  getLogs: (): SystemLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addLog: (action: string, user: string, details: string) => {
    const logs = storage.getLogs();
    const newLog: SystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      user,
      timestamp: new Date().toISOString(),
      details
    };
    localStorage.setItem(LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 100)));
  },
  clearAll: () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(DOCS_KEY);
    localStorage.removeItem(LOGS_KEY);
  }
};
