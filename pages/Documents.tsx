
import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Download, Trash2, Edit3, Calendar, Layers, FileText, 
  User as UserIcon, Tag, X, Check, Folder, ChevronRight, LayoutGrid, List
} from 'lucide-react';
import { Document, User, Category, Department, UserRole } from '../types';
import { CATEGORIES, DEPARTMENTS, YEARS, CATEGORY_ICONS } from '../constants';

interface DocumentsProps {
  user: User;
  documents: Document[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Document>) => void;
}

const Documents: React.FC<DocumentsProps> = ({ user, documents, onDelete, onUpdate }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'folder'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>(
    user.role === UserRole.PRINCIPAL || user.role === UserRole.ADMIN ? 'All' : user.department
  );
  
  // Folder Navigation State
  const [currentPath, setCurrentPath] = useState<string[]>([]);

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           doc.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCat === 'All' || doc.category === selectedCat;
      const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
      
      // If in folder view, further filter by current path
      if (viewMode === 'folder') {
        if (currentPath.length === 1) return doc.department === currentPath[0];
        if (currentPath.length === 2) return doc.department === currentPath[0] && doc.category === currentPath[1];
      }

      return matchesSearch && matchesCat && matchesDept;
    });
  }, [documents, searchTerm, selectedCat, selectedDept, viewMode, currentPath]);

  // Folder View Logic
  const folderStructure = useMemo(() => {
    if (viewMode !== 'folder') return [];
    
    if (currentPath.length === 0) {
      // Show departments
      return DEPARTMENTS.filter(d => user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL || d === user.department)
        .map(d => ({ type: 'folder', name: d, count: documents.filter(doc => doc.department === d).length }));
    }
    
    if (currentPath.length === 1) {
      // Show categories inside department
      return CATEGORIES.map(c => ({
        type: 'folder',
        name: c,
        count: documents.filter(doc => doc.department === currentPath[0] && doc.category === c).length
      })).filter(f => f.count > 0);
    }

    return [];
  }, [viewMode, currentPath, documents, user]);

  const canManage = (doc: Document) => {
    return user.role === UserRole.ADMIN || 
           (user.role === UserRole.HOD && doc.department === user.department) ||
           doc.uploadedBy === user.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Academic Repository</h1>
          <p className="text-sm text-slate-500">Institutional directory of research and academics.</p>
        </div>
        
        <div className="flex items-center p-1 bg-slate-100 rounded-lg">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button 
            onClick={() => setViewMode('folder')}
            className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'folder' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
          >
            <Folder className="w-4 h-4" /> Folders
          </button>
        </div>
      </div>

      {/* Navigation Breadcrumbs for Folder View */}
      {viewMode === 'folder' && (
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <button onClick={() => setCurrentPath([])} className="hover:text-blue-600 font-medium">Root</button>
          {currentPath.map((p, i) => (
            <React.Fragment key={p}>
              <ChevronRight className="w-4 h-4" />
              <button 
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
                className={`font-medium ${i === currentPath.length - 1 ? 'text-slate-900' : 'hover:text-blue-600'}`}
              >
                {p}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none disabled:bg-slate-100"
            disabled={user.role !== UserRole.PRINCIPAL && user.role !== UserRole.ADMIN}
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {(user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL) && <option value="All">All Departments</option>}
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Document/Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Folders first */}
        {viewMode === 'folder' && folderStructure.map(folder => (
          <button 
            key={folder.name}
            onClick={() => setCurrentPath([...currentPath, folder.name])}
            className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-4 group"
          >
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Folder className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-900 leading-tight">{folder.name}</p>
              <p className="text-xs text-slate-500">{folder.count} items</p>
            </div>
          </button>
        ))}

        {/* Then Documents */}
        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg transition-all flex flex-col justify-between group">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-slate-50 text-blue-600 rounded-lg">{CATEGORY_ICONS[doc.category]}</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-blue-600"><Download className="w-3.5 h-3.5" /></button>
                  {canManage(doc) && (
                    <button onClick={() => onDelete(doc.id)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-tight mb-1">{doc.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{doc.description || 'No abstract provided.'}</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-400 uppercase tracking-tighter">{doc.department}</span>
              <span className="px-2 py-0.5 bg-slate-100 rounded font-bold text-slate-600">{doc.year}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && folderStructure.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Directory is empty</h3>
          <p className="text-slate-500">No documents match the current path or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Documents;
