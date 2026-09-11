import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  ExternalLink, 
  Flame, 
  Server, 
  HardDrive, 
  Layers
} from 'lucide-react';
import { DatabaseConfig, DatabaseProvider } from '../types';
import { dbService } from '../services/db';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = dbService.getConfig();
  const [selectedProvider, setSelectedProvider] = useState<DatabaseProvider>(currentConfig.provider);
  
  // Credentials state
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.supabase?.url || '');
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.supabase?.anonKey || '');
  
  const [neonConn, setNeonConn] = useState(currentConfig.neon?.connectionString || '');
  const [neonEndpoint, setNeonEndpoint] = useState(currentConfig.neon?.endpointUrl || '');
  
  const [firebaseProject, setFirebaseProject] = useState(currentConfig.firebase?.projectId || 'adept-hallway-pcvp7');
  const [firebaseKey, setFirebaseKey] = useState(currentConfig.firebase?.apiKey || 'AIzaSyBzch2HlpiN9mBUagUIisBtUFRuscc0Jz8');

  // Testing & Status
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showSqlTab, setShowSqlTab] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    let creds: any = {};
    if (selectedProvider === 'supabase') {
      creds = { url: supabaseUrl, anonKey: supabaseKey };
    } else if (selectedProvider === 'neon') {
      creds = { connectionString: neonConn, endpointUrl: neonEndpoint };
    } else if (selectedProvider === 'firebase') {
      creds = { projectId: firebaseProject, apiKey: firebaseKey };
    }

    const result = await dbService.testConnection(selectedProvider, creds);
    setTestResult(result);
    setIsTesting(false);
  };

  const handleSaveAndActivate = () => {
    dbService.updateConfig({
      provider: selectedProvider,
      isConnected: true,
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseKey,
      },
      neon: {
        connectionString: neonConn,
        endpointUrl: neonEndpoint,
      },
      firebase: {
        projectId: firebaseProject,
        apiKey: firebaseKey,
      }
    });

    onClose();
  };

  const handleCopySQL = () => {
    const sql = dbService.generateSQLSchema();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('Reset data ke kondisi awal pabrik (sample kapal, dermaga, tiket, dan manifest)?')) {
      dbService.resetToFactoryData();
      alert('Data operasional kapal berhasil di-reset ke sample standar.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Integrasi Real Database</h3>
              <p className="text-xs text-slate-400">
                Pilih dan hubungkan ke Supabase Cloud, Neon PostgreSQL, atau Firebase Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">

          {/* Database Provider Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Pilih Mesin Database Aktif:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              
              {/* Local Storage */}
              <button
                type="button"
                onClick={() => { setSelectedProvider('local'); setTestResult(null); }}
                className={`p-3 rounded-xl border text-left flex flex-col items-start transition-all cursor-pointer ${
                  selectedProvider === 'local'
                    ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <HardDrive className={`w-5 h-5 mb-2 ${selectedProvider === 'local' ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block">Local IndexedDB</span>
                <span className="text-[10px] text-slate-400">Offline & Instan</span>
              </button>

              {/* Supabase */}
              <button
                type="button"
                onClick={() => { setSelectedProvider('supabase'); setTestResult(null); }}
                className={`p-3 rounded-xl border text-left flex flex-col items-start transition-all cursor-pointer ${
                  selectedProvider === 'supabase'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-500/20 ring-1 ring-emerald-500'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Server className={`w-5 h-5 mb-2 ${selectedProvider === 'supabase' ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block">Supabase</span>
                <span className="text-[10px] text-slate-400">Postgres + REST</span>
              </button>

              {/* Neon DB */}
              <button
                type="button"
                onClick={() => { setSelectedProvider('neon'); setTestResult(null); }}
                className={`p-3 rounded-xl border text-left flex flex-col items-start transition-all cursor-pointer ${
                  selectedProvider === 'neon'
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Database className={`w-5 h-5 mb-2 ${selectedProvider === 'neon' ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block">Neon DB</span>
                <span className="text-[10px] text-slate-400">Serverless SQL</span>
              </button>

              {/* Firebase */}
              <button
                type="button"
                onClick={() => { setSelectedProvider('firebase'); setTestResult(null); }}
                className={`p-3 rounded-xl border text-left flex flex-col items-start transition-all cursor-pointer ${
                  selectedProvider === 'firebase'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-500'
                    : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Flame className={`w-5 h-5 mb-2 ${selectedProvider === 'firebase' ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="text-xs font-bold block">Firebase</span>
                <span className="text-[10px] text-slate-400">Firestore Sync</span>
              </button>

            </div>
          </div>

          {/* Credentials Inputs based on Provider */}
          <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/60">
            {selectedProvider === 'local' && (
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs">
                  <HardDrive className="w-4 h-4" />
                  <span>Mode Database Lokal (Browser IndexedDB & LocalStorage)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Semua data Master Kapal, Dermaga, Tarif Golongan, Jadwal, Tiket Penumpang, dan Manifest Muatan tersimpan aman di browser Anda tanpa perlu mendaftar akun cloud. Mendukung CRUD lengkap dan siap dipakai instan.
                </p>
                <div className="pt-2 flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3 py-1.5 rounded-lg text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                  >
                    Reset ke Demo Data Standar
                  </button>
                </div>
              </div>
            )}

            {selectedProvider === 'supabase' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center">
                    <Server className="w-3.5 h-3.5 mr-1" /> Konfigurasi Supabase Project
                  </span>
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center"
                  >
                    <span>supabase.com</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Project URL:</label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={e => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Anon / Public API Key:</label>
                  <input
                    type="password"
                    value={supabaseKey}
                    onChange={e => setSupabaseKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            )}

            {selectedProvider === 'neon' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-cyan-400 font-semibold flex items-center">
                    <Database className="w-3.5 h-3.5 mr-1" /> Konfigurasi Neon PostgreSQL
                  </span>
                  <a
                    href="https://neon.tech"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center"
                  >
                    <span>neon.tech</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">PostgreSQL Connection String / Host:</label>
                  <input
                    type="text"
                    value={neonConn}
                    onChange={e => setNeonConn(e.target.value)}
                    placeholder="postgresql://neondb_owner:***@ep-silent-wave-a1b2c3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">HTTP Serverless Query Endpoint (Opsional):</label>
                  <input
                    type="url"
                    value={neonEndpoint}
                    onChange={e => setNeonEndpoint(e.target.value)}
                    placeholder="https://ep-silent-wave-a1b2c3.ap-southeast-1.aws.neon.tech/sql"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>
            )}

            {selectedProvider === 'firebase' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1" /> Konfigurasi Google Cloud Firebase Firestore
                  </span>
                  <a
                    href="https://console.firebase.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center"
                  >
                    <span>firebase.google.com</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Project ID:</label>
                  <input
                    type="text"
                    value={firebaseProject}
                    onChange={e => setFirebaseProject(e.target.value)}
                    placeholder="simpel-kapal-port-app"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Web API Key:</label>
                  <input
                    type="password"
                    value={firebaseKey}
                    onChange={e => setFirebaseKey(e.target.value)}
                    placeholder="AIzaSyA8_EXAMPLE_API_KEY..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Test Connection Button & Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                id="test-db-btn"
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-600 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Menguji Koneksi...' : 'Uji Koneksi (Test Ping)'}</span>
              </button>

              {selectedProvider === 'firebase' && (
                <button
                  id="sync-cloud-btn"
                  type="button"
                  onClick={async () => {
                    setIsSyncing(true);
                    const res = await dbService.syncAllToCloud();
                    alert(res.message);
                    setIsSyncing(false);
                  }}
                  disabled={isSyncing}
                  className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition-all"
                >
                  <Flame className={`w-3.5 h-3.5 ${isSyncing ? 'animate-pulse' : ''}`} />
                  <span>{isSyncing ? 'Sinkronisasi...' : 'Sinkronkan Data ke Firestore Cloud'}</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowSqlTab(!showSqlTab)}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 rounded-xl transition-colors border border-cyan-800/40"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showSqlTab ? 'Sembunyikan Skema SQL' : 'Lihat Skema SQL Tabel Cloud'}</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs ${
                testResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/50 text-red-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{testResult.message}</p>
                {testResult.latency !== undefined && (
                  <p className="text-[11px] opacity-80 mt-0.5">Waktu respons: {testResult.latency} ms</p>
                )}
              </div>
            </div>
          )}

          {/* SQL Schema Preview */}
          {showSqlTab && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  PostgreSQL / Supabase Table DDL
                </span>
                <button
                  type="button"
                  onClick={handleCopySQL}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[11px] transition-colors"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'Tersalin!' : 'Salin SQL'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-800">
                {dbService.generateSQLSchema()}
              </pre>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-850 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Tutup
          </button>
          <button
            id="save-db-btn"
            type="button"
            onClick={handleSaveAndActivate}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Terapkan & Aktifkan Database
          </button>
        </div>

      </div>
    </div>
  );
};
