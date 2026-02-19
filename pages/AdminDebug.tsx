
import React, { useState } from 'react';
import { storage } from '../services/storage';
import { User, UserRole, SystemLog } from '../types';
import { 
  Database, 
  HardDrive, 
  Activity, 
  Users, 
  Plus, 
  Trash2,
  RefreshCcw,
  ShieldAlert
} from 'lucide-react';
import { DEPARTMENTS } from '../constants';

const AdminDebug: React.FC = () => {
  const [users, setUsers] = useState<User[]>(storage.getUsers());
  const [logs] = useState<SystemLog[]>(storage.getLogs());
  const [newUser, setNewUser] = useState({ name: '', email: '', role: UserRole.STAFF, department: DEPARTMENTS[0] });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newUser,
      createdDate: new Date().toISOString()
    };
    const updated = [...users, user];
    storage.saveUsers(updated);
    setUsers(updated);
    storage.addLog('Admin', 'System', `Created new user: ${user.email}`);
    setNewUser({ name: '', email: '', role: UserRole.STAFF, department: DEPARTMENTS[0] });
  };

  const handleDeleteUser = (id: string) => {
    const updated = users.filter(u => u.id !== id);
    storage.saveUsers(updated);
    setUsers(updated);
    storage.addLog('Admin', 'System', `Deleted user ID: ${id}`);
  };

  const clearStorage = () => {
    if (confirm('Are you sure? This will delete all documents and users!')) {
      storage.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="text-red-500 w-7 h-7" />
          System Administration
        </h1>
        <button 
          onClick={clearStorage}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
        >
          Factory Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            System Health
          </h3>
          <div className="space-y-3">
            <HealthItem label="Database Status" status="Online" color="text-emerald-500" icon={<Database className="w-4 h-4" />} />
            <HealthItem label="Storage Usage" status="14%" color="text-blue-500" icon={<HardDrive className="w-4 h-4" />} />
            <HealthItem label="Active Users" status={users.length.toString()} color="text-slate-900" icon={<Users className="w-4 h-4" />} />
          </div>
        </div>

        {/* User Creation */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-500" />
            Create User Account
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input 
              placeholder="Full Name"
              className="px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none"
              value={newUser.name}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
            />
            <input 
              placeholder="Email"
              className="px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none"
              value={newUser.email}
              onChange={e => setNewUser({...newUser, email: e.target.value})}
            />
            <select 
              className="px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none"
              value={newUser.role}
              onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})}
            >
              {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <select 
              className="px-3 py-2 bg-slate-50 border rounded-lg text-sm outline-none"
              value={newUser.department}
              onChange={e => setNewUser({...newUser, department: e.target.value as any})}
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button 
              onClick={handleAddUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
            >
              Add User
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-900">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Dept</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === UserRole.ADMIN ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{u.department}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Recent Activity Logs</h3>
            <RefreshCcw className="w-4 h-4 text-slate-400 cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-3">
            {logs.map(log => (
              <div key={log.id} className="text-xs border-b border-slate-50 pb-2">
                <div className="flex justify-between text-slate-400 mb-1 font-mono">
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                  <span>{log.action}</span>
                </div>
                <p className="text-slate-700"><span className="font-bold text-blue-600">{log.user}:</span> {log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthItem = ({ label, status, color, icon }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-slate-600">
      {icon}
      <span>{label}</span>
    </div>
    <span className={`text-sm font-bold ${color}`}>{status}</span>
  </div>
);

export default AdminDebug;
