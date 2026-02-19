
import { storage } from './storage';
import { Document, Category, Department, UserRole } from '../types';

export const docService = {
  getAllDocuments: (): Document[] => storage.getDocuments(),
  
  getDocumentsByRole: (user: any): Document[] => {
    const all = storage.getDocuments();
    if (user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN) return all;
    if (user.role === UserRole.HOD) return all.filter(d => d.department === user.department);
    return all.filter(d => d.uploadedBy === user.id);
  },

  uploadDocument: (doc: Omit<Document, 'id' | 'uploadDate' | 'lastUpdated'>): Document => {
    const docs = storage.getDocuments();
    const newDoc: Document = {
      ...doc,
      id: Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    storage.saveDocuments([newDoc, ...docs]);
    storage.addLog('Upload', doc.uploaderName, `Uploaded document: ${doc.title}`);
    return newDoc;
  },

  updateDocument: (id: string, updates: Partial<Document>, userName: string) => {
    const docs = storage.getDocuments();
    const updatedDocs = docs.map(doc => {
      if (doc.id === id) {
        return { ...doc, ...updates, lastUpdated: new Date().toISOString() };
      }
      return doc;
    });
    storage.saveDocuments(updatedDocs);
    storage.addLog('Update', userName, `Updated document ID: ${id}`);
  },

  deleteDocument: (id: string, userName: string) => {
    const docs = storage.getDocuments();
    const filtered = docs.filter(d => d.id !== id);
    storage.saveDocuments(filtered);
    storage.addLog('Delete', userName, `Deleted document ID: ${id}`);
  },

  seedDummyData: (userId: string, userName: string, dept: Department) => {
    const dummyDocs: Document[] = [
      {
        id: '1',
        title: 'Network Security Fundamentals',
        description: 'Comprehensive guide to modern security',
        category: Category.BOOKS,
        department: dept,
        uploadedBy: userId,
        uploaderName: userName,
        year: 2023,
        filePath: '/uploads/CSE/Books/2023_security.pdf',
        uploadDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: '2',
        title: 'AI in Healthcare',
        description: 'Research paper on neural networks in diagnostics',
        category: Category.RESEARCH_PAPERS,
        department: dept,
        uploadedBy: userId,
        uploaderName: userName,
        year: 2024,
        filePath: '/uploads/CSE/Papers/2024_ai_health.pdf',
        uploadDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    ];
    storage.saveDocuments(dummyDocs);
  }
};
