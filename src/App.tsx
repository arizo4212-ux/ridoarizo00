import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { MasterDataView } from './components/MasterDataView';
import { TransaksiView } from './components/TransaksiView';
import { LaporanView } from './components/LaporanView';
import { DatabaseModal } from './components/DatabaseModal';
import { LoginModal } from './components/LoginModal';
import { LoginFormView } from './components/LoginFormView';
import { PrintModal } from './components/PrintModal';
import { authService, User } from './services/auth';
import { dbService } from './services/db';
import { DatabaseConfig, TiketPenumpang, ManifestMuatan, Kapal, JadwalPelayaran } from './types';
import { Ship, Database } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(dbService.getConfig());

  // Modals
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Print Modal
  const [printModalState, setPrintModalState] = useState<{
    isOpen: boolean;
    type: 'ticket' | 'cargo';
    tiketData?: TiketPenumpang | null;
    cargoData?: ManifestMuatan | null;
    kapalData?: Kapal | null;
    jadwalData?: JadwalPelayaran | null;
  }>({
    isOpen: false,
    type: 'ticket',
    tiketData: null,
    cargoData: null
  });

  useEffect(() => {
    const unsubAuth = authService.subscribe((usr) => {
      setCurrentUser(usr);
    });
    const unsubDb = dbService.subscribe(() => {
      setDbConfig(dbService.getConfig());
    });
    return () => {
      unsubAuth();
      unsubDb();
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    setActiveTab('dashboard');
  };

  const handleSuccessfulLogin = () => {
    setCurrentUser(authService.getCurrentUser());
    setActiveTab('dashboard');
    setIsLoginModalOpen(false);
  };

  // Printing triggers
  const handlePrintTicket = (tiket: TiketPenumpang, kapal?: Kapal, jadwal?: JadwalPelayaran) => {
    setPrintModalState({
      isOpen: true,
      type: 'ticket',
      tiketData: tiket,
      cargoData: null,
      kapalData: kapal,
      jadwalData: jadwal
    });
  };

  const handlePrintCargo = (muatan: ManifestMuatan, kapal?: Kapal, jadwal?: JadwalPelayaran) => {
    setPrintModalState({
      isOpen: true,
      type: 'cargo',
      tiketData: null,
      cargoData: muatan,
      kapalData: kapal,
      jadwalData: jadwal
    });
  };

  // IF NOT LOGGED IN: Directly display the Login Portal on app open
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
        
        {/* Top Header for Login Screen */}
        <header className="border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md py-3 px-4 sm:px-6 sticky top-0 z-30 shadow-lg no-print">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
                <Ship className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                    SIMPEL-KAPAL
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold bg-cyan-900/80 text-cyan-300 border border-cyan-700/50 rounded-full uppercase tracking-wider">
                    Portal Masuk Petugas & Syahbandar
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden md:block">
                  Sistem Informasi Manajemen Muatan & Manifest Penumpang Pelabuhan
                </p>
              </div>
            </div>

            {/* Quick Database Status & Configuration Trigger */}
            <div className="flex items-center space-x-2">
              <button
                id="login-page-db-btn"
                onClick={() => setIsDbModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-cyan-300 transition-all cursor-pointer shadow"
                title="Buka Pengaturan Koneksi Database (Supabase / Neon DB / Firebase / Local)"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-mono uppercase">DB: {dbConfig.provider}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Center: Full-featured Dedicated Login Portal */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
          <LoginFormView
            onSuccessLogin={handleSuccessfulLogin}
            onOpenDbConfig={() => setIsDbModalOpen(true)}
            isStandalonePage={true}
          />
        </main>

        <footer className="border-t border-slate-900 bg-slate-950/80 py-3.5 text-center text-xs text-slate-500 no-print">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-400">SIMPEL-KAPAL v2.4</span> &bull; Terhubung ke Database Pelabuhan Penyeberangan
            </div>
            <div className="text-[11px] text-slate-400">
              Direktorat Jenderal Perhubungan Laut &bull; Kantor Kesyahbandaran dan Otoritas Pelabuhan
            </div>
          </div>
        </footer>

        {/* Database Configuration Modal (Supabase, Neon, Firebase) */}
        <DatabaseModal
          isOpen={isDbModalOpen}
          onClose={() => setIsDbModalOpen(false)}
          config={dbConfig}
          onSaveConfig={cfg => {
            dbService.updateConfig(cfg);
            setDbConfig(cfg);
          }}
        />
      </div>
    );
  }

  // IF LOGGED IN: Render full system with Navbar, Dashboard, Master, Transaksi, Laporan
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectTab={setActiveTab}
        dbConfig={dbConfig}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        currentUser={currentUser}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigateTab={setActiveTab}
            onOpenNewTicket={() => {
              setActiveTab('transaksi');
            }}
            onOpenNewCargo={() => {
              setActiveTab('transaksi');
            }}
          />
        )}

        {activeTab === 'master' && (
          <MasterDataView />
        )}

        {activeTab === 'transaksi' && (
          <TransaksiView
            onPrintTicket={handlePrintTicket}
            onPrintCargo={handlePrintCargo}
          />
        )}

        {activeTab === 'laporan' && (
          <LaporanView />
        )}

        {activeTab === 'login' && (
          <div className="py-2">
            <LoginFormView
              onSuccessLogin={handleSuccessfulLogin}
              onOpenDbConfig={() => setIsDbModalOpen(true)}
              isStandalonePage={true}
            />
          </div>
        )}
      </main>

      {/* Footer info bar (hidden on print) */}
      <footer className="no-print border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-bold text-slate-400">SIMPEL-KAPAL</span> &bull; Sistem Informasi Manajemen Muatan & Penumpang Kapal Pelabuhan
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>Database: <span className="font-semibold text-cyan-400">{dbConfig.provider.toUpperCase()}</span></span>
            <span>&bull;</span>
            <span>Status: <span className="text-emerald-400 font-semibold">{dbConfig.isConnected ? 'Online' : 'Lokal Fallback'}</span></span>
            {currentUser && (
              <>
                <span>&bull;</span>
                <span className="text-slate-300">Masuk sebagai: <strong className="text-cyan-400">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
              </>
            )}
          </div>
        </div>
      </footer>

      {/* Database Configuration Modal (Supabase, Neon, Firebase) */}
      <DatabaseModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        config={dbConfig}
        onSaveConfig={cfg => {
          dbService.updateConfig(cfg);
          setDbConfig(cfg);
        }}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleSuccessfulLogin}
        onOpenDbConfig={() => {
          setIsLoginModalOpen(false);
          setIsDbModalOpen(true);
        }}
      />

      {/* Boarding Pass & Cargo Slip Print Modal */}
      <PrintModal
        isOpen={printModalState.isOpen}
        onClose={() => setPrintModalState(prev => ({ ...prev, isOpen: false }))}
        type={printModalState.type}
        tiketData={printModalState.tiketData}
        cargoData={printModalState.cargoData}
        kapalData={printModalState.kapalData}
        jadwalData={printModalState.jadwalData}
      />

    </div>
  );
}
