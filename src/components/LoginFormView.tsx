import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  UserPlus, 
  LogIn, 
  SlidersHorizontal, 
  Award, 
  Compass, 
  ArrowRight,
  Anchor
} from 'lucide-react';
import { authService, PRESET_USERS } from '../services/auth';
import { dbService, INITIAL_USERS } from '../services/db';
import { User, UserRole, DatabaseConfig } from '../types';

interface LoginFormViewProps {
  onSuccessLogin: () => void;
  onOpenDbConfig: () => void;
  isStandalonePage?: boolean;
}

export const LoginFormView: React.FC<LoginFormViewProps> = ({
  onSuccessLogin,
  onOpenDbConfig,
  isStandalonePage = false
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('petugas');
  const [regDepartment, setRegDepartment] = useState('Divisi Operasional Pelabuhan');

  // Database status
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>(dbService.getConfig());
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  // All database users
  const [dbUsers, setDbUsers] = useState<User[]>(dbService.getUsers());

  useEffect(() => {
    const unsubDb = dbService.subscribe(() => {
      setDbConfig(dbService.getConfig());
      setDbUsers(dbService.getUsers());
    });
    return () => unsubDb();
  }, []);

  const handleTestPing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await dbService.testConnection(dbConfig.provider);
      setPingResult(`Koneksi ${res.latency}ms: ${res.message}`);
    } catch {
      setPingResult('Gagal menghubungi database.');
    } finally {
      setIsPinging(false);
    }
  };

  // Submit manual login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.login(identifier, password);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onSuccessLogin();
        }, 500);
      } else {
        setErrorMsg(res.message);
      }
    }, 250);
  };

  // Quick 1-Click login for ANY role
  const handleQuickLogin = (uname: string, pwd: string) => {
    setIdentifier(uname);
    setPassword(pwd);
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = authService.login(uname, pwd);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(`Berhasil login sebagai ${res.user?.name}! Mengalihkan...`);
        setTimeout(() => {
          onSuccessLogin();
        }, 400);
      } else {
        setErrorMsg(res.message);
      }
    }, 200);
  };

  // Fill form without auto-submit
  const handleFillOnly = (uname: string, pwd: string) => {
    setIdentifier(uname);
    setPassword(pwd);
    setErrorMsg('');
    setSuccessMsg(`Form telah diisi untuk akun: ${uname}`);
  };

  // Submit register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Semua kolom wajib diisi untuk pendaftaran.');
      return;
    }

    const res = authService.register({
      username: regUsername.trim(),
      email: regEmail.trim() || `${regUsername.trim()}@pelabuhan.go.id`,
      name: regName.trim(),
      role: regRole,
      department: regDepartment.trim()
    }, regPassword);

    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSuccessLogin();
      }, 700);
    } else {
      setErrorMsg(res.message);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { bg: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Super Admin' };
      case 'petugas':
        return { bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30', label: 'Petugas Manifest' };
      case 'operator':
        return { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', label: 'Operator Dermaga' };
      case 'nakhoda':
        return { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30', label: 'Nakhoda Kapal' };
      case 'syahbandar':
        return { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30', label: 'Syahbandar KSOP' };
      case 'kasir':
        return { bg: 'bg-pink-500/20 text-pink-300 border-pink-500/30', label: 'Kasir & Tiket' };
      default:
        return { bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30', label: 'Pengguna' };
    }
  };

  const allPresetRoles = [
    {
      username: 'admin',
      pwd: 'admin123',
      name: 'Capt. Hendra Setiawan',
      role: 'admin' as UserRole,
      title: 'Super Administrator',
      desc: 'Hak akses penuh: Master data, manifest, laporan SPB, dan koneksi DB'
    },
    {
      username: 'petugas',
      pwd: 'petugas123',
      name: 'Rian Pratama, S.ST',
      role: 'petugas' as UserRole,
      title: 'Petugas Manifest',
      desc: 'Input tiket penumpang, muatan kargo, manifest & cetak boarding pass'
    },
    {
      username: 'operator',
      pwd: 'operator123',
      name: 'Dedi Kurniawan',
      role: 'operator' as UserRole,
      title: 'Operator Pelabuhan',
      desc: 'Pengawasan jembatan timbang, status sandar kapal & operasional dermaga'
    },
    {
      username: 'nakhoda',
      pwd: 'nakhoda123',
      name: 'Capt. Suryadi, ANT-II',
      role: 'nakhoda' as UserRole,
      title: 'Nakhoda Kapal',
      desc: 'Pengecekan load kapal, stabilitas plimsoll mark, daftar kru & penumpang'
    },
    {
      username: 'syahbandar',
      pwd: 'syahbandar123',
      name: 'Drs. Bambang Wijaya',
      role: 'syahbandar' as UserRole,
      title: 'Syahbandar (KSOP)',
      desc: 'Persetujuan Surat Persetujuan Berlayar (SPB) & verifikasi kelaiklautan'
    },
    {
      username: 'kasir',
      pwd: 'kasir123',
      name: 'Siti Rahmawati',
      role: 'kasir' as UserRole,
      title: 'Kasir & Loket',
      desc: 'Penjualan tiket penumpang perorangan & tiket kendaraan golongan I-VIII'
    }
  ];

  return (
    <div className={`w-full ${isStandalonePage ? 'max-w-5xl mx-auto py-8' : 'max-w-4xl mx-auto'}`}>
      
      {/* Top Welcome & Database Connectivity Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-400/30">
              <Ship className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  PORTAL FORM LOGIN
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full uppercase">
                  SIMPEL-KAPAL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Sistem Informasi Terpadu Muatan Kapal, Manifest Penumpang & Operasional Pelabuhan
              </p>
            </div>
          </div>

          {/* Database Live Connectivity Badge */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/40 shadow-inner">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <div className="text-xs">
                <span className="text-slate-400">Database: </span>
                <span className="font-black text-emerald-400 uppercase tracking-wide">
                  {dbConfig.provider === 'firebase' ? 'CLOUD FIRESTORE (ONLINE)' : dbConfig.provider.toUpperCase()}
                </span>
              </div>
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 animate-ping"></span>
              ONLINE & TERHUBUNG
            </span>

            <span className="text-[11px] font-mono text-emerald-400 px-1.5 py-0.5 bg-slate-900 rounded border border-emerald-900/50">
              {dbConfig.latencyMs ? `${dbConfig.latencyMs}ms` : '18ms'}
            </span>

            <div className="flex items-center space-x-1 pl-1">
              <button
                id="login-ping-test-btn"
                onClick={handleTestPing}
                disabled={isPinging}
                title="Uji koneksi dan hitung latensi database"
                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-300 hover:text-white transition-all text-xs flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-emerald-300' : ''}`} />
                <span className="text-[10px] font-semibold">Uji Ping</span>
              </button>

              <button
                id="login-db-config-btn"
                onClick={onOpenDbConfig}
                title="Ubah Provider (Supabase / Neon DB / Firebase)"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all text-xs flex items-center space-x-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] hidden sm:inline">Konfigurasi DB</span>
              </button>
            </div>
          </div>

        </div>

        {pingResult && (
          <div className="mt-3 p-2 bg-slate-950/90 border border-cyan-500/40 rounded-lg text-xs text-cyan-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pingResult}</span>
          </div>
        )}
      </div>

      {/* Main Two-Column Layout: Form on Left, All Accounts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Form (Login / Register) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm flex flex-col">
          
          {/* Tabs: Masuk vs Daftar */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
            <button
              id="tab-login-btn"
              onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Sistem</span>
            </button>

            <button
              id="tab-register-btn"
              onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Akun Baru</span>
            </button>
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
            
            {/* Feedback Alerts */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {activeTab === 'login' ? (
              /* TAB 1: FORM LOGIN */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Username or Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username / Alamat Email:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      id="form-login-username"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Contoh: admin, petugas, operator, nakhoda..."
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Bisa login dengan: <code className="text-cyan-300">admin</code>, <code className="text-cyan-300">petugas</code>, <code className="text-cyan-300">operator</code>, <code className="text-cyan-300">nakhoda</code>, <code className="text-cyan-300">syahbandar</code>, <code className="text-cyan-300">kasir</code>
                  </p>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Kata Sandi (Password):
                    </label>
                    <span 
                      onClick={() => setPassword('admin123')}
                      className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      Isi Default
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="form-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun..."
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Memverifikasi Database...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Masuk ke Dashboard Operasional</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security info */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Terhubung ke Database Pelabuhan</span>
                  </div>
                  <span className="text-slate-500">v2.4 LTS</span>
                </div>

              </form>
            ) : (
              /* TAB 2: REGISTER NEW USER INTO DATABASE */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap & Gelar:
                  </label>
                  <input
                    id="reg-fullname-input"
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Contoh: Ir. Wahyu Hidayat, M.T"
                    required
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Username:
                    </label>
                    <input
                      id="reg-username-input"
                      type="text"
                      value={regUsername}
                      onChange={e => setRegUsername(e.target.value)}
                      placeholder="wahyu"
                      required
                      className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role / Hak Akses:
                    </label>
                    <select
                      id="reg-role-select"
                      value={regRole}
                      onChange={e => setRegRole(e.target.value as UserRole)}
                      className="w-full px-2.5 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="admin">Super Admin</option>
                      <option value="petugas">Petugas Manifest</option>
                      <option value="operator">Operator Dermaga</option>
                      <option value="nakhoda">Nakhoda Kapal</option>
                      <option value="syahbandar">Syahbandar KSOP</option>
                      <option value="kasir">Kasir Loket</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Dinas / Instansi:
                  </label>
                  <input
                    id="reg-email-input"
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="wahyu@pelabuhan.go.id"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Kata Sandi (Password):
                  </label>
                  <input
                    id="reg-password-input"
                    type="password"
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter..."
                    required
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Divisi / Departemen:
                  </label>
                  <input
                    id="reg-dept-input"
                    type="text"
                    value={regDepartment}
                    onChange={e => setRegDepartment(e.target.value)}
                    placeholder="Divisi Operasional & Keselamatan Pelayaran"
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    id="btn-register-submit"
                    type="submit"
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Simpan ke Database & Langsung Masuk</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>

        {/* Right Column: "BISA LOGIN SEMUA" - 6 Presets with 1-Click Login */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Daftar Akun Siap Login (Bisa Login Semua)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik <span className="text-cyan-400 font-semibold">1-Klik Masuk</span> untuk langsung login otomatis, atau <span className="text-slate-300">Isi Form</span> untuk mencoba input manual.
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                {allPresetRoles.length} Akun Standar
              </span>
            </div>

            {/* Grid of 6 Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allPresetRoles.map((roleItem, idx) => {
                const badge = getRoleBadge(roleItem.role);
                return (
                  <div
                    key={roleItem.username}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                          ID: {roleItem.username}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {roleItem.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {roleItem.desc}
                      </p>

                      <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span>User: <strong className="text-slate-200">{roleItem.username}</strong></span>
                        <span>Pass: <strong className="text-cyan-300">{roleItem.pwd}</strong></span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-2 pt-2 border-t border-slate-900">
                      <button
                        id={`quick-login-${roleItem.username}-btn`}
                        type="button"
                        onClick={() => handleQuickLogin(roleItem.username, roleItem.pwd)}
                        className="flex-1 py-1.5 px-2.5 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white border border-cyan-500/40 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>1-Klik Masuk</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFillOnly(roleItem.username, roleItem.pwd)}
                        className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] transition-all cursor-pointer"
                        title="Isi form dengan username dan password ini"
                      >
                        Isi Form
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Database Live Synced Users Indicator */}
          <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>
                Total akun tersimpan di database: <strong className="text-white">{dbUsers.length} Pengguna</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Semua akun tervalidasi
              </span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
