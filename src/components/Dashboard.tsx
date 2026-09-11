import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Users, 
  Truck, 
  Banknote, 
  TrendingUp, 
  AlertTriangle, 
  Waves, 
  Wind, 
  ShieldCheck, 
  Anchor, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Gauge, 
  PlusCircle
} from 'lucide-react';
import { 
  Kapal, 
  JadwalPelayaran, 
  TiketPenumpang, 
  ManifestMuatan 
} from '../types';
import { dbService } from '../services/db';

interface DashboardProps {
  onNavigateTab: (tab: 'master' | 'transaksi' | 'laporan') => void;
  onOpenNewTicket: () => void;
  onOpenNewCargo: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigateTab, 
  onOpenNewTicket, 
  onOpenNewCargo 
}) => {
  const [kapalList, setKapalList] = useState<Kapal[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalPelayaran[]>([]);
  const [tiketList, setTiketList] = useState<TiketPenumpang[]>([]);
  const [muatanList, setMuatanList] = useState<ManifestMuatan[]>([]);
  const [selectedKapalId, setSelectedKapalId] = useState<string>('');

  const loadData = () => {
    const k = dbService.getKapal();
    const j = dbService.getJadwal();
    const t = dbService.getTiket();
    const m = dbService.getMuatan();

    setKapalList(k);
    setJadwalList(j);
    setTiketList(t);
    setMuatanList(m);

    if (k.length > 0 && !selectedKapalId) {
      setSelectedKapalId(k[0].id);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = dbService.subscribe(loadData);
    return unsub;
  }, []);

  // Compute live analytics metrics
  const totalKapal = kapalList.length;
  const kapalBerlayar = kapalList.filter(k => k.status === 'Berlayar').length;
  const kapalSandar = kapalList.filter(k => k.status === 'Sandar').length;

  const totalPax = tiketList.length;
  const boardedPax = tiketList.filter(t => t.status === 'Boarded').length;

  const totalBeratKargoKg = muatanList.reduce((acc, m) => acc + Number(m.beratKotorKg || 0), 0);
  const totalBeratTon = (totalBeratKargoKg / 1000).toFixed(1);

  const totalPendapatanTiket = tiketList.reduce((acc, t) => acc + Number(t.totalBiaya || 0), 0);
  const totalPendapatanMuatan = muatanList.reduce((acc, m) => acc + Number(m.totalBiaya || 0), 0);
  const totalPendapatan = totalPendapatanTiket + totalPendapatanMuatan;

  // Selected Ship Capacity Inspection
  const currentKapal = kapalList.find(k => k.id === selectedKapalId) || kapalList[0];
  
  const shipTiketCount = currentKapal ? tiketList.filter(t => t.kapalId === currentKapal.id).length : 0;
  const shipCargoKg = currentKapal 
    ? muatanList.filter(m => m.kapalId === currentKapal.id).reduce((acc, m) => acc + Number(m.beratKotorKg || 0), 0)
    : 0;
  const shipCargoTon = Number((shipCargoKg / 1000).toFixed(1));

  const paxOccupancy = currentKapal && currentKapal.kapasitasPenumpang > 0 
    ? Math.min(100, Math.round((shipTiketCount / currentKapal.kapasitasPenumpang) * 100))
    : 0;

  const cargoOccupancy = currentKapal && currentKapal.kapasitasMuatanTon > 0 
    ? Math.min(100, Math.round((shipCargoTon / currentKapal.kapasitasMuatanTon) * 100))
    : 0;

  const isOverloadRisk = paxOccupancy > 85 || cargoOccupancy > 85;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner with Quick Actions */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Anchor className="w-4 h-4" />
            <span>Pusat Kendali Operasi Pelabuhan Terpadu</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Dashboard Muatan Kapal & Penumpang
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Pantau arus pergerakan kapal, manifest penumpang, tonase muatan kargo, dan pendapatan operasional secara real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="dash-add-ticket-btn"
            onClick={onOpenNewTicket}
            className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Registrasi Tiket Pax</span>
          </button>

          <button
            id="dash-add-cargo-btn"
            onClick={onOpenNewCargo}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-700/50 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>+ Input Manifest Muatan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Kapal Beroperasi */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Armada Kapal</span>
            <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <Ship className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalKapal}</span>
            <span className="text-xs text-slate-400">Unit Kapal</span>
          </div>
          <div className="mt-2 text-xs flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {kapalBerlayar} Berlayar
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {kapalSandar} Sandar
            </span>
          </div>
        </div>

        {/* Card 2: Total Penumpang */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Penumpang</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalPax.toLocaleString()}</span>
            <span className="text-xs text-slate-400">Orang (Pax)</span>
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{boardedPax} telah naik ke kapal (Boarded)</span>
          </div>
        </div>

        {/* Card 3: Tonase Muatan Kargo */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Muatan & Kargo</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-white">{totalBeratTon}</span>
            <span className="text-xs text-slate-400">Ton Muatan</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span>{muatanList.length} Unit Kendaraan & Koli terdaftar</span>
          </div>
        </div>

        {/* Card 4: Total Pendapatan Operasional */}
        <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pendapatan</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Banknote className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-400">
              Rp {totalPendapatan >= 1000000 ? `${(totalPendapatan / 1000000).toFixed(2)} Jt` : totalPendapatan.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
            <span>Pax: Rp {totalPendapatanTiket.toLocaleString()}</span>
            <span>Kargo: Rp {totalPendapatanMuatan.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Real-Time Vessel Load Gauge & Live Schedule Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Vessel Load Inspector & Safety Gauge */}
        <div className="lg:col-span-2 bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <span>Monitoring Stabilitas & Utilisasi Muatan Kapal</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pemeriksaan batas aman muatan (Plimsoll Line) & kapasitas penumpang kapal
              </p>
            </div>

            {/* Select Vessel Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Pilih Kapal:</span>
              <select
                id="dash-select-ship"
                value={selectedKapalId}
                onChange={e => setSelectedKapalId(e.target.value)}
                className="bg-slate-900 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-medium"
              >
                {kapalList.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.namaKapal} ({k.tipe})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentKapal ? (
            <div className="space-y-6">
              
              {/* Vessel Specs Overview Card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tipe Kapal:</span>
                  <span className="font-semibold text-white">{currentKapal.tipe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Panjang x Lebar:</span>
                  <span className="font-semibold text-white">{currentKapal.panjangMeter}m x {currentKapal.lebarMeter}m</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Draft Kedalaman:</span>
                  <span className="font-semibold text-cyan-400">{currentKapal.draftMeter} Meter</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status Operasi:</span>
                  <span className={`font-semibold inline-block px-2 py-0.5 rounded text-[10px] ${
                    currentKapal.status === 'Berlayar' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {currentKapal.status}
                  </span>
                </div>
              </div>

              {/* Passenger Capacity Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Kapasitas Penumpang Terisi:</span>
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {shipTiketCount} / {currentKapal.kapasitasPenumpang} Pax ({paxOccupancy}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-700/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      paxOccupancy > 90
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                    }`}
                    style={{ width: `${paxOccupancy}%` }}
                  ></div>
                </div>
              </div>

              {/* Cargo Weight Bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Beban Tonase Muatan (Kargo & Kendaraan):</span>
                  </span>
                  <span className="font-mono text-amber-300 font-bold">
                    {shipCargoTon} / {currentKapal.kapasitasMuatanTon} Ton ({cargoOccupancy}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-700/60 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cargoOccupancy > 90
                        ? 'bg-gradient-to-r from-amber-500 to-red-500'
                        : 'bg-gradient-to-r from-emerald-600 to-amber-400'
                    }`}
                    style={{ width: `${cargoOccupancy}%` }}
                  ></div>
                </div>
              </div>

              {/* Safety Alert or Status Confirmation */}
              {isOverloadRisk ? (
                <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-start space-x-3 text-xs text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Peringatan Kapasitas Tinggi (&gt;85%):</span>
                    <p className="mt-0.5 text-amber-300/90">
                      Kapal {currentKapal.namaKapal} mendekati batas maksimal muatan. Petugas diimbau untuk membatasi penambahan kendaraan berat golongan VII-VIII demi keselamatan pelayaran.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs text-emerald-300">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Kapasitas dan stabilitas kapal dalam batas aman regulasi keselamatan maritim (SOLAS).</span>
                  </div>
                  <span className="font-semibold text-emerald-400 bg-emerald-900/60 px-2 py-1 rounded text-[11px]">
                    Kelaiklautan Aman
                  </span>
                </div>
              )}

            </div>
          ) : (
            <p className="text-xs text-slate-500">Tidak ada data kapal tersedia.</p>
          )}

          {/* Graphical Representation of Cargo Distribution */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
              <span>Distribusi Kargo & Kendaraan Aktif:</span>
              <button
                onClick={() => onNavigateTab('transaksi')}
                className="text-cyan-400 hover:underline text-[11px] flex items-center space-x-1"
              >
                <span>Lihat Detail Manifest</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Mobil Pribadi (Gol IV)</span>
                <span className="text-base font-bold text-white">
                  {muatanList.filter(m => m.tarifGolonganId.includes('GOL-IV')).length} Unit
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Truk & Bus (Gol VI-VII)</span>
                <span className="text-base font-bold text-amber-400">
                  {muatanList.filter(m => m.tarifGolonganId.includes('GOL-VI') || m.tarifGolonganId.includes('GOL-VII')).length} Unit
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Peti Kemas Kontainer</span>
                <span className="text-base font-bold text-cyan-400">
                  {muatanList.filter(m => m.tipeMuatan === 'Kontainer').length} Box
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">General Cargo</span>
                <span className="text-base font-bold text-emerald-400">
                  {muatanList.filter(m => m.tipeMuatan === 'General Cargo').length} Koli
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1 Col): Live Schedule & Port Weather */}
        <div className="space-y-6">
          
          {/* Live Schedule Departure Board */}
          <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Papan Jadwal Pelayaran</h3>
              </div>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
            </div>

            <div className="space-y-3">
              {jadwalList.slice(0, 4).map(j => (
                <div key={j.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[130px]">{j.namaKapal}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      j.status === 'Boarding'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                        : j.status === 'Berlayar'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {j.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{j.pelabuhanAsal.replace('Pelabuhan ', '')} &rarr; {j.pelabuhanTujuan.replace('Pelabuhan ', '')}</span>
                    <span className="font-mono text-cyan-400">{j.waktuKeberangkatan.slice(11, 16)} WIB</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('master')}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-xl transition-colors text-center"
            >
              Lihat Semua Jadwal & Rute Pelayaran
            </button>
          </div>

          {/* Port Marine Weather Bulletin */}
          <div className="bg-gradient-to-br from-slate-850 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Waves className="w-4 h-4" />
                <span>Kondisi Cuaca & Gelombang</span>
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">BMKG Maritim</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tinggi Gelombang:</span>
                <span className="font-bold text-white">0.75 - 1.25 m</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Kategori Rendah / Tenang</span>
              </div>
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Kecepatan Angin:</span>
                <span className="font-bold text-white">8 - 14 Knot</span>
                <span className="text-[10px] text-cyan-400 block mt-0.5">Arah Barat Daya</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center space-x-2">
              <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Jalur penyeberangan aman untuk pelayaran kapal ferry RORO dan kapal kargo.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
