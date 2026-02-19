
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  FileText, 
  Users, 
  PieChart, 
  ArrowUpRight, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { User, UserRole, Document, Category } from '../types';
import { CATEGORIES, CATEGORY_ICONS } from '../constants';

interface DashboardProps {
  user: User;
  documents: Document[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, documents }) => {
  const stats = useMemo(() => {
    const totalDocs = documents.length;
    const deptDocs = documents.filter(d => d.department === user.department).length;
    
    const categoryStats = CATEGORIES.map(cat => ({
      name: cat,
      count: documents.filter(d => d.category === cat).length
    })).filter(s => s.count > 0);

    const recentDocs = [...documents]
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, 5);

    // Calculate Dynamic Growth Rate
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthDocs = documents.filter(d => {
      const dDate = new Date(d.uploadDate);
      return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    }).length;

    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const lastMonthDocs = documents.filter(d => {
      const dDate = new Date(d.uploadDate);
      return dDate.getMonth() === lastMonth && dDate.getFullYear() === lastMonthYear;
    }).length;

    let growth = 0;
    if (lastMonthDocs === 0) {
      growth = thisMonthDocs > 0 ? 100 : 0;
    } else {
      growth = Math.round(((thisMonthDocs - lastMonthDocs) / lastMonthDocs) * 100);
    }

    return { totalDocs, deptDocs, categoryStats, recentDocs, growth };
  }, [documents, user.department]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b', '#06b6d4'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name}</h1>
          <p className="text-slate-500">Here's what's happening in your portal today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <Clock className="w-4 h-4 text-blue-500" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Documents" 
          value={stats.totalDocs} 
          icon={<FileText className="w-6 h-6 text-blue-600" />} 
          trend={`${stats.growth >= 0 ? '+' : ''}${stats.growth}% from last month`}
          color="blue"
        />
        <StatCard 
          title="Department Files" 
          value={stats.deptDocs} 
          icon={<Users className="w-6 h-6 text-emerald-600" />} 
          trend="In your department"
          color="emerald"
        />
        <StatCard 
          title="Categories Active" 
          value={stats.categoryStats.length} 
          icon={<PieChart className="w-6 h-6 text-amber-600" />} 
          trend="Diverse resource pool"
          color="amber"
        />
        <StatCard 
          title="Growth Rate" 
          value={`${stats.growth}%`} 
          icon={<TrendingUp className="w-6 h-6 text-violet-600" />} 
          trend="Monthly momentum"
          color="violet"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              Distribution by Category
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Recent Uploads</h3>
          <div className="space-y-4">
            {stats.recentDocs.length > 0 ? stats.recentDocs.map((doc) => (
              <div key={doc.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  {CATEGORY_ICONS[doc.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500 truncate">{doc.uploaderName} • {doc.department}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">
                  {new Date(doc.uploadDate).toLocaleDateString()}
                </span>
              </div>
            )) : (
              <p className="text-sm text-slate-500 text-center py-8">No recent documents</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }: any) => {
  const colorMap: any = {
    blue: 'bg-blue-50 border-blue-100',
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    violet: 'bg-violet-50 border-violet-100'
  };

  return (
    <div className={`p-6 rounded-xl border bg-white shadow-sm flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>{icon}</div>
        <ArrowUpRight className="w-4 h-4 text-slate-300" />
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">{title}</p>
        <h2 className="text-2xl font-bold text-slate-900">{value}</h2>
        <p className="text-xs text-slate-400 mt-2">{trend}</p>
      </div>
    </div>
  );
};

export default Dashboard;
