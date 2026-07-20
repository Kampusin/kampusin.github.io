import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Calendar, FileCheck, Award, BookOpen, 
  Bell, User, LogOut, Search, GraduationCap
} from 'lucide-react';
import clsx from 'clsx';

import { Overview } from './views/Overview';
import { Schedule } from './views/Schedule';
import { Attendance } from './views/Attendance';
import { Grades } from './views/Grades';
import { Courses } from './views/Courses';
import { Profile } from './views/Profile';

interface DashboardProps {
  session: any;
  onLogout?: () => void;
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    async function getProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(data || {
        role: 'mahasiswa',
        full_name: 'Nugraha Nastya',
        nim: '2024/5312345',
        prodi: 'Teknik Informatika',
        avatar: 'NN'
      });
    }
    getProfile();
  }, [session]);

  const handleLogout = async () => {
    if (session?.user?.id === 'demo') {
      if (onLogout) onLogout();
      return;
    }
    await supabase.auth.signOut();
    if (onLogout) onLogout();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Overview />;
      case 'schedule': return <Schedule />;
      case 'attendance': return <Attendance />;
      case 'grades': return <Grades />;
      case 'courses': return <Courses />;
      case 'profile': return <Profile profile={profile} />;
      default: return <Overview />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
    { id: 'schedule', label: 'Jadwal Kuliah', icon: Calendar },
    { id: 'attendance', label: 'Absensi', icon: FileCheck },
    { id: 'grades', label: 'Nilai', icon: Award },
    { id: 'courses', label: 'Mata Kuliah', icon: BookOpen },
    { id: 'profile', label: 'Profil', icon: User, mobileOnly: true },
  ];

  if (!profile) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">Memuat profil...</div>;

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 pb-[80px] md:pb-0">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-[260px] fixed h-screen p-6 bg-white border-r border-slate-200">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg text-white">
            <GraduationCap size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight">Kampus<span className="text-indigo-600">in</span></span>
        </div>

        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4 px-2">Menu Utama</div>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.filter(i => !i.mobileOnly).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  isActive ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto bg-slate-100 p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
              {profile.avatar}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold truncate">{profile.full_name}</div>
              <div className="text-xs text-slate-500 truncate">{profile.nim || profile.nidn}</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors w-full px-2"
          >
            <LogOut size={16} /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[260px] p-4 md:p-8">
        
        {/* Topbar */}
        <header className="flex items-center justify-between mb-8 pb-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-tight"
          >
            Dashboard
          </motion.h1>
          
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <Search size={16} className="text-slate-400" />
              <input type="text" placeholder="Cari jadwal..." className="bg-transparent text-sm outline-none w-48" />
            </div>
            <button className="relative p-2 bg-white border border-slate-200 rounded-full shadow-sm text-slate-500 hover:text-slate-900 transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="md:hidden w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 border border-slate-200">
              {profile.avatar}
            </div>
          </div>
        </header>

        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[80px] bg-white/80 backdrop-blur-2xl border-t border-slate-200 flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
        {navItems.filter(i => ['dashboard', 'schedule', 'attendance', 'profile'].includes(i.id)).map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300",
                isActive ? "text-indigo-600" : "text-slate-400"
              )}
            >
              <div
                className={clsx(
                  "transition-all duration-300 ease-out",
                  isActive ? "-translate-y-0.5 scale-110" : "translate-y-0 scale-100"
                )}
              >
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
}
