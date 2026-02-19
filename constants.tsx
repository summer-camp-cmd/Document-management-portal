
import React from 'react';
import { 
  FileText, Book, Award, Globe, 
  Lightbulb, Briefcase, GraduationCap, Layers 
} from 'lucide-react';
import { Category, Department } from './types';

export const DEPARTMENTS: Department[] = ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE'];

export const CATEGORIES: Category[] = [
  Category.BOOKS,
  Category.RESEARCH_PAPERS,
  Category.JOURNALS,
  Category.PROJECTS,
  Category.PATENTS,
  Category.CONFERENCES,
  Category.ACHIEVEMENTS,
  Category.OTHERS,
];

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  [Category.BOOKS]: <Book className="w-4 h-4" />,
  [Category.RESEARCH_PAPERS]: <FileText className="w-4 h-4" />,
  [Category.JOURNALS]: <Layers className="w-4 h-4" />,
  [Category.PROJECTS]: <Briefcase className="w-4 h-4" />,
  [Category.PATENTS]: <Lightbulb className="w-4 h-4" />,
  [Category.CONFERENCES]: <Globe className="w-4 h-4" />,
  [Category.ACHIEVEMENTS]: <Award className="w-4 h-4" />,
  [Category.OTHERS]: <GraduationCap className="w-4 h-4" />,
};

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);
