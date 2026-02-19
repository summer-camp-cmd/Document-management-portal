
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Upload, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface LayoutProps {
  user: UserType;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeTab, setActiveTab, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: [UserRole.STAFF, UserRole.HOD, UserRole.PRINCIPAL] },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" />, roles: [UserRole.HOD, UserRole.PRINCIPAL] },
    { id: 'documents', label: user.role === UserRole.STAFF ? 'My Repository' : 'Academic Repository', icon: <FileText className="w-5 h-5" />, roles: [UserRole.STAFF, UserRole.HOD, UserRole.PRINCIPAL, UserRole.ADMIN] },
    { id: 'upload', label: 'Upload New', icon: <Upload className="w-5 h-5" />, roles: [UserRole.STAFF, UserRole.HOD] },
    { id: 'admin', label: 'System Admin', icon: <ShieldCheck className="w-5 h-5" />, roles: [UserRole.ADMIN] },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" />, roles: [UserRole.STAFF, UserRole.HOD, UserRole.PRINCIPAL, UserRole.ADMIN] },
  ].filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shrink-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-lg truncate">ADMP Portal</span>}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role} • {user.department}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
              <User className="w-6 h-6" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const GraduationCap = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);

export default Layout;
