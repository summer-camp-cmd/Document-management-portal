
import React, { useState, useEffect } from 'react';
import { User, UserRole, Document } from './types';
import { authService } from './services/authService';
import { docService } from './services/docService';
import { storage } from './services/storage';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Upload from './pages/Upload';
import AdminDebug from './pages/AdminDebug';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { GraduationCap, Mail, ChevronRight, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginEmail, setLoginEmail] = useState('');
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    authService.initializeAdmin();
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setDocuments(docService.getDocumentsByRole(currentUser));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loggedInUser = await authService.login(loginEmail);
    if (loggedInUser) {
      setUser(loggedInUser);
      setDocuments(docService.getDocumentsByRole(loggedInUser));
      setError('');
    } else {
      setError('Check email: admin@college.edu or principal@college.edu');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleUpload = (docData: any) => {
    docService.uploadDocument(docData);
    if (user) setDocuments(docService.getDocumentsByRole(user));
    setActiveTab('documents');
  };

  const handleUpdate = (id: string, updates: Partial<Document>) => {
    docService.updateDocument(id, updates, user?.name || 'System');
    if (user) setDocuments(docService.getDocumentsByRole(user));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this record permanently?')) {
      docService.deleteDocument(id, user?.name || 'System');
      if (user) setDocuments(docService.getDocumentsByRole(user));
    }
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('admp_current_user', JSON.stringify(updatedUser));
      
      // Persist to users list in storage
      const allUsers = storage.getUsers();
      const updatedUsers = allUsers.map(u => u.id === user.id ? updatedUser : u);
      storage.saveUsers(updatedUsers);
      
      storage.addLog('Settings', updatedUser.name, `Updated profile details: ${Object.keys(updates).join(', ')}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <div className="max-w-md w-full animate-in fade-in duration-700">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 mb-6 transform hover:rotate-6 transition-transform">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Academic Portal</h1>
            <p className="text-slate-400">Institutional Knowledge Repository</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-700/50">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="staff@college.edu"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-blue-500 transition-all text-slate-900"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-medium">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 group"
              >
                Enter Portal
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <span>Secured Environment</span>
            <span>•</span>
            <span>Local Storage Active</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard user={user} documents={documents} />}
      {activeTab === 'documents' && <Documents user={user} documents={documents} onDelete={handleDelete} onUpdate={handleUpdate} />}
      {activeTab === 'upload' && <Upload user={user} onUpload={handleUpload} />}
      {activeTab === 'analytics' && <Analytics user={user} documents={documents} />}
      {activeTab === 'settings' && <Settings user={user} onUpdateUser={handleUpdateUser} />}
      {activeTab === 'admin' && <AdminDebug />}
    </Layout>
  );
};

export default App;
