
export enum UserRole {
  STAFF = 'STAFF',
  HOD = 'HOD',
  PRINCIPAL = 'PRINCIPAL',
  ADMIN = 'ADMIN'
}

export enum Category {
  BOOKS = 'Books',
  RESEARCH_PAPERS = 'Research Papers',
  JOURNALS = 'Journals',
  PROJECTS = 'Projects',
  PATENTS = 'Patents',
  CONFERENCES = 'Conferences',
  ACHIEVEMENTS = 'Achievements',
  OTHERS = 'Others'
}

export type Department = 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'EEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  createdDate: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  category: Category;
  department: Department;
  uploadedBy: string; // User ID
  uploaderName: string;
  year: number;
  filePath: string;
  uploadDate: string;
  lastUpdated: string;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
}
