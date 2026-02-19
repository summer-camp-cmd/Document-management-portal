
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, FileCheck, Award, DownloadCloud } from 'lucide-react';
import { Document, User, UserRole, Department } from '../types';
import { DEPARTMENTS, CATEGORIES } from '../constants';

interface AnalyticsProps {
  user: User;
  documents: Document[];
}

const Analytics: React.FC<AnalyticsProps> = ({ user, documents }) => {
  const data = useMemo(() => {
    // Dept comparison
    const deptStats = DEPARTMENTS.map(dept => ({
      name: dept,
      count: documents.filter(d => d.department === dept).length
    }));

    // Category distribution
    const categoryStats = CATEGORIES.map(cat => ({
      name: cat,
      value: documents.filter(d => d.category === cat).length
    })).filter(c => c.value > 0);

    // Monthly Trend (Last 6 months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trendData = Array.from({ length: 6 }, (_, i) => {
      const mIdx = (currentMonth - (5 - i) + 12) % 12;
      return {
        name: months[mIdx],
        uploads: documents.filter(d => new Date(d.uploadDate).getMonth() === mIdx).length
      };
    });

    // Leaderboard
    const contributors: Record<string, { name: string, count: number }> = {};
    documents.forEach(d => {
      if (!contributors[d.uploadedBy]) contributors[d.uploadedBy] = { name: d.uploaderName, count: 0 };
      contributors[d.uploadedBy].count++;
    });
    const leaderboard = Object.values(contributors).sort((a, b) => b.count - a.count).slice(0, 5);

    return { deptStats, categoryStats, trendData, leaderboard };
  }, [documents]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
          <p className="text-slate-500">Insights into institutional academic growth.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
          <DownloadCloud className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Upload Velocity (6 Months)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Pie */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Resource Mix</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.categoryStats} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.categoryStats.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dept Bar Chart (Visible to Admin/Principal) */}
        {(user.role === UserRole.ADMIN || user.role === UserRole.PRINCIPAL) && (
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Departmental Comparison</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.deptStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${user.role !== UserRole.ADMIN && user.role !== UserRole.PRINCIPAL ? 'lg:col-span-3' : ''}`}>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            Top Contributors
          </h3>
          <div className="space-y-4">
            {data.leaderboard.map((staff, idx) => (
              <div key={staff.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-slate-400 border border-slate-200">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-tight">Active Faculty</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600">{staff.count}</p>
                  <p className="text-[10px] text-slate-400">Files</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
