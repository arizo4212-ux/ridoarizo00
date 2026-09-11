import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Database, 
  User as UserIcon, 
  LogOut, 
  LayoutDashboard, 
  FolderKanban, 
  ReceiptText, 
  FileSpreadsheet, 
  Clock, 
  KeyRound,
  ShieldAlert,
  ArrowRightLeft
} from 'lucide-react';
import { User, DatabaseConfig } from '../types';
import { dbService } from '../services/db';

export type NavTabType = 'dashboard' | 'master' | 'transaksi' | 'laporan' | 'login';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab?: (tab: NavTabType) => void;
  onSelectTab?: (tab: NavTabType) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenDbModal: () => void;
  onOpenLoginModal: () => void;
  dbConfig?: DatabaseConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onSelectTab,
  currentUser,
  onLogout,
  onOpenDbModal,
  onOpenLoginModal,
  dbConfig: propDbConfig,
}) => {
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(propDbConfig || dbService.getConfig());
  const [currentTime, setCurrentTime] = useState<string>('');

  const changeTab = (tab: NavTabType) => {
    if (setActiveTab) setActiveTab(tab);
    if (onSelectTab) onSelectTab(tab);
  };

  useEffect(() => {
    const unsub = dbService.subscribe(() => {
      setDbConfig(dbService.getConfig());
    });

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB'
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  const getProviderBadge = () => {
    switch (dbConfig.provider) {
      case 'supabase':
        return { label: 'Supabase Cloud', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'neon':
        return { label: 'Neon Postgres', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
      case 'firebase':
        return { label: 'Firebase Cloud', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      default:
        return { label: 'Local Persistent DB', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' };
    }
  };

  const providerBadge = getProviderBadge();

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'Super Admin';
      case 'petugas':
        return 'Petugas Manifest';
      case 'operator':
        return 'Operator Pelabuhan';
      case 'nakhoda':
        return 'Nakhoda Kapal';
      case 'syahbandar':
        return 'Syahbandar KSOP';
      case 'kasir':
        return 'Kasir Loket';
      default:
        return 'Pengguna Terdaftar';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => changeTab('dashboard')}
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-lg shadow-cyan-500/20">
              <Ship className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                  SIMPEL-KAPAL
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 rounded-full uppercase tracking-wider">
                  Sistem Muatan & Pax
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Sistem Informasi Terpadu Pelabuhan & Manifest Penyeberangan
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            <button
              id="nav-dashboard-btn"
              onClick={() => changeTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-master-btn"
              onClick={() => changeTab('master')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'master'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Master Data</span>
            </button>

            <button
              id="nav-transaksi-btn"
              onClick={() => changeTab('transaksi')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'transaksi'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ReceiptText className="w-4 h-4" />
              <span>Transaksi Data</span>
            </button>

            <button
              id="nav-laporan-btn"
              onClick={() => changeTab('laporan')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'laporan'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Laporan & SPB</span>
            </button>

            {/* Dedicated Form Login Tab */}
            <button
              id="nav-login-tab-btn"
              onClick={() => changeTab('login')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-amber-300 hover:text-white hover:bg-amber-500/10'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Form Login & Akun</span>
            </button>
          </nav>

          {/* Right Controls: Clock, DB Status, User */}
          <div className="flex items-center space-x-2.5">
            {/* Clock */}
            <div className="hidden xl:flex items-center space-x-1.5 text-xs text-slate-400 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/40">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono text-slate-200">{currentTime}</span>
            </div>

            {/* Database Indicator & Switcher Button */}
            <button
              id="db-settings-btn"
              onClick={onOpenDbModal}
              title="Konfigurasi Database Real-time (Supabase / Neon DB / Firebase / Local)"
              className={`flex items-center space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer hover:ring-2 hover:ring-cyan-500/40 ${providerBadge.color}`}
            >
              <div className="relative flex items-center">
                <Database className="w-3.5 h-3.5 mr-1" />
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <span className="hidden sm:inline">{providerBadge.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {dbConfig.latencyMs ? `${dbConfig.latencyMs}ms` : 'Ready'}
              </span>
            </button>

            {/* User Profile / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 pl-2 border-l border-slate-700/60">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {currentUser.name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                    {getRoleLabel(currentUser.role)}
                  </div>
                </div>

                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-cyan-500/50 object-cover"
                />

                <button
                  id="switch-user-btn"
                  onClick={() => changeTab('login')}
                  title="Form Login / Ganti Pengguna"
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                <button
                  id="logout-btn"
                  onClick={onLogout}
                  title="Keluar dari Sistem (Ke Form Login)"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="login-btn"
                onClick={() => changeTab('login')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-cyan-600/30 animate-pulse"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Form Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => changeTab('dashboard')}
            className={`flex flex-col items-center py-1 px-1.5 rounded ${
              activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[9px]">Dashboard</span>
          </button>
          <button
            onClick={() => changeTab('master')}
            className={`flex flex-col items-center py-1 px-1.5 rounded ${
              activeTab === 'master' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span className="text-[9px]">Master</span>
          </button>
          <button
            onClick={() => changeTab('transaksi')}
            className={`flex flex-col items-center py-1 px-1.5 rounded ${
              activeTab === 'transaksi' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ReceiptText className="w-4 h-4" />
            <span className="text-[9px]">Transaksi</span>
          </button>
          <button
            onClick={() => changeTab('laporan')}
            className={`flex flex-col items-center py-1 px-1.5 rounded ${
              activeTab === 'laporan' ? 'text-cyan-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="text-[9px]">Laporan</span>
          </button>
          <button
            onClick={() => changeTab('login')}
            className={`flex flex-col items-center py-1 px-1.5 rounded ${
              activeTab === 'login' ? 'text-cyan-400 font-bold' : 'text-amber-400'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span className="text-[9px]">Login</span>
          </button>
        </div>
      </div>
    </header>
  );
};
