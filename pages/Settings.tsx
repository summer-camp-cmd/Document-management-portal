
import React, { useState } from 'react';
import { 
  User, Shield, Bell, Monitor, Lock, Check, Save, 
  UserCheck, Smartphone, Globe, Eye, EyeOff, 
  AlertTriangle, Database, Activity, Mail
} from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface SettingsProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
}

type SettingsTab = 'profile' | 'security' | 'notifications' | 'interface' | 'admin';

const Settings: React.FC<SettingsProps> = ({ user, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email
  });
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Interface State (UI only simulation)
  const [uiSettings, setUiSettings] = useState({
    compactMode: false,
    highContrast: false,
    autoRefresh: true
  });

  const handleSaveProfile = () => {
    onUpdateUser(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Personal Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                    <input 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Institutional Email</label>
                    <input 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={profile.email}
                      onChange={e => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                  <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-blue-900">Assigned Role: {user.role}</p>
                    <p className="text-blue-700 mt-1">Role management is restricted. Your account belongs to the {user.department} department.</p>
                  </div>
                </div>
              </div>
            </section>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSaveProfile}
                className={`px-8 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                  saved ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700'
                }`}
              >
                {saved ? <><Check className="w-4 h-4" /> Changes Saved</> : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Authentication</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase">Change Password</label>
                  <div className="grid grid-cols-1 gap-3 max-w-sm">
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Current Password"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      />
                      <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <input type="password" placeholder="New Password" className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold w-fit">Update Password</button>
                  </div>
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-500">Secure your account with an extra layer of protection.</p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={false} />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50">
                <h3 className="font-bold text-slate-900 text-sm">Active Sessions</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-emerald-900">Current Session (Chrome / Linux)</p>
                      <p className="text-[10px] text-emerald-600">IP: 192.168.1.1 • Last active: Now</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[9px] font-bold uppercase">Active</span>
                </div>
              </div>
            </section>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Communication Preferences</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Notifications</p>
                  <ToggleRow label="Alert me on new department uploads" enabled={true} />
                  <ToggleRow label="Monthly summary of institutional activity" enabled={false} />
                  <ToggleRow label="Security alerts and login notifications" enabled={true} />
                </div>
                
                <hr className="border-slate-100" />
                
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Alerts</p>
                  <ToggleRow label="Show desktop push notifications" enabled={false} />
                  <ToggleRow label="In-app activity sound effects" enabled={true} />
                </div>
              </div>
            </section>
          </div>
        );

      case 'interface':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Display Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Customization</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Compact Mode</p>
                      <p className="text-xs text-slate-500">Minimize whitespace to show more data at once.</p>
                    </div>
                    <button 
                      onClick={() => setUiSettings(s => ({...s, compactMode: !s.compactMode}))}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${uiSettings.compactMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${uiSettings.compactMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">High Contrast Mode</p>
                      <p className="text-xs text-slate-500">Increase visibility for text and elements.</p>
                    </div>
                    <button 
                      onClick={() => setUiSettings(s => ({...s, highContrast: !s.highContrast}))}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${uiSettings.highContrast ? 'bg-blue-600' : 'bg-slate-300'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${uiSettings.highContrast ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </button>
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Regional</p>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Preferred Language</label>
                    <select className="w-full max-w-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                      <option>English (Institutional)</option>
                      <option>Spanish</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );

      case 'admin':
        if (user.role !== UserRole.ADMIN) return null;
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b bg-slate-50 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-600" />
                <h3 className="font-bold text-slate-900 text-sm">System Administration Settings</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-bold text-red-900">Privileged Access</p>
                    <p className="text-red-700 mt-1">Changes here affect the entire portal. Please exercise caution.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                      <p className="text-xs text-slate-500">Restrict non-admin access for system updates.</p>
                    </div>
                    <ToggleSwitch enabled={false} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900">External API Sync</p>
                      <p className="text-xs text-slate-500">Automatically sync records with university master database.</p>
                    </div>
                    <ToggleSwitch enabled={true} />
                  </div>
                </div>

                <hr className="border-slate-100" />

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Maintenance</p>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">
                      <Database className="w-3.5 h-3.5" /> Re-index Documents
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">
                      <Activity className="w-3.5 h-3.5" /> Clear System Cache
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors">
                      <Mail className="w-3.5 h-3.5" /> Test SMTP Server
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1">Manage institutional profile, security protocols, and interface preferences.</p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Last login: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          <SettingsNavButton 
            icon={<User className="w-4 h-4" />} 
            label="General Profile" 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          />
          <SettingsNavButton 
            icon={<Lock className="w-4 h-4" />} 
            label="Security" 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          />
          <SettingsNavButton 
            icon={<Bell className="w-4 h-4" />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          />
          <SettingsNavButton 
            icon={<Monitor className="w-4 h-4" />} 
            label="Interface" 
            active={activeTab === 'interface'} 
            onClick={() => setActiveTab('interface')}
          />
          {user.role === UserRole.ADMIN && (
            <SettingsNavButton 
              icon={<Shield className="w-4 h-4" />} 
              label="System Admin" 
              active={activeTab === 'admin'} 
              onClick={() => setActiveTab('admin')}
            />
          )}
        </div>

        {/* Main Content Pane */}
        <div className="lg:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

const SettingsNavButton = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all border ${
      active 
        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-100' 
        : 'text-slate-600 hover:bg-white hover:border-slate-200 border-transparent'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</span>
    {label}
  </button>
);

const ToggleRow = ({ label, enabled }: any) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button 
        onClick={() => setIsOn(!isOn)}
        className={`w-10 h-5 rounded-full p-1 transition-colors ${isOn ? 'bg-blue-600' : 'bg-slate-300'}`}
      >
        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
};

const ToggleSwitch = ({ enabled }: any) => {
  const [isOn, setIsOn] = useState(enabled);
  return (
    <button 
      onClick={() => setIsOn(!isOn)}
      className={`w-10 h-5 rounded-full p-1 transition-colors ${isOn ? 'bg-blue-600' : 'bg-slate-300'}`}
    >
      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isOn ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </button>
  );
}

export default Settings;
