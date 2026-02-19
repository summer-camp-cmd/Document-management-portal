
import React, { useState } from 'react';
import { Upload as UploadIcon, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, Category, Department } from '../types';
import { CATEGORIES, DEPARTMENTS, YEARS } from '../constants';

interface UploadProps {
  user: User;
  onUpload: (data: any) => void;
}

const Upload: React.FC<UploadProps> = ({ user, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0],
    department: user.department,
    year: YEARS[0],
    file: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.title) {
      setError('Please provide a title and select a file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    // Simulate backend upload delay
    setTimeout(() => {
      onUpload({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        department: formData.department,
        year: formData.year,
        uploadedBy: user.id,
        uploaderName: user.name,
        filePath: `/uploads/${formData.department}/${formData.category}/${formData.year}_${formData.title.replace(/\s+/g, '_').toLowerCase()}.pdf`
      });
      
      setIsUploading(false);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: CATEGORIES[0],
        department: user.department,
        year: YEARS[0],
        file: null
      });

      setTimeout(() => setSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Add New Document</h1>
        <p className="text-slate-500">Contribute research papers, books, or projects to the central repository.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span>Document uploaded successfully! It is now visible to the department.</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">Document Title</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Advanced Quantum Computing Algorithms"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">Description (Optional)</label>
            <textarea 
              rows={3}
              placeholder="Provide a brief abstract or summary..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Category</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Academic Year</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
            >
              {YEARS.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">File Upload (PDF Preferred)</label>
            <div className="relative group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({...formData, file});
                }}
              />
              <div className={`p-8 border-2 border-dashed rounded-xl text-center transition-all ${
                formData.file 
                ? 'border-emerald-200 bg-emerald-50' 
                : 'border-slate-200 bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50'
              }`}>
                {formData.file ? (
                  <div className="flex flex-col items-center">
                    <File className="w-10 h-10 text-emerald-500 mb-2" />
                    <p className="text-sm font-medium text-slate-900">{formData.file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(formData.file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({...formData, file: null});
                      }}
                      className="mt-4 p-2 bg-white border border-slate-200 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                      <UploadIcon className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, ZIP (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 md:col-span-2 border-t border-slate-100 flex justify-end gap-3">
             <button 
                type="button"
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                onClick={() => setFormData({...formData, file: null, title: '', description: ''})}
              >
                Clear Form
              </button>
              <button 
                type="submit"
                disabled={isUploading}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-md shadow-blue-200"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Publish Document
                  </>
                )}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
