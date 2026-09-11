import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Plus, 
  Search, 
  QrCode, 
  Printer, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  X, 
  AlertTriangle, 
  Scale, 
  Check, 
  ReceiptText 
} from 'lucide-react';
import { 
  TiketPenumpang, 
  ManifestMuatan, 
  Kapal, 
  JadwalPelayaran, 
  TarifGolongan, 
  StatusTiket, 
  StatusMuatan 
} from '../types';
import { dbService } from '../services/db';

interface TransaksiViewProps {
  onPrintTicket: (tiket: TiketPenumpang, kapal?: Kapal, jadwal?: JadwalPelayaran) => void;
  onPrintCargo: (muatan: ManifestMuatan, kapal?: Kapal, jadwal?: JadwalPelayaran) => void;
}

export const TransaksiView: React.FC<TransaksiViewProps> = ({ 
  onPrintTicket, 
  onPrintCargo 
}) => {
  const [activeTab, setActiveTab] = useState<'tiket' | 'muatan'>('tiket');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [tiketList, setTiketList] = useState<TiketPenumpang[]>([]);
  const [muatanList, setMuatanList] = useState<ManifestMuatan[]>([]);
  const [kapalList, setKapalList] = useState<Kapal[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalPelayaran[]>([]);
  const [tarifList, setTarifList] = useState<TarifGolongan[]>([]);

  // Modals
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isCargoModalOpen, setIsCargoModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editingCargoId, setEditingCargoId] = useState<string | null>(null);

  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({
    jadwalId: '',
    kapalId: '',
    namaPenumpang: '',
    identitasNo: '',
    jenisKelamin: 'L' as 'L' | 'P',
    usia: 30,
    tarifGolonganId: '',
    kelasLayanan: 'Ekonomi' as 'Ekonomi' | 'Bisnis' | 'VIP',
    nomorKursiDek: 'Dek B-01',
    totalBiaya: 25000,
    status: 'Issued' as StatusTiket,
    nomorTelepon: '0812'
  });

  // Cargo Form State
  const [cargoForm, setCargoForm] = useState({
    jadwalId: '',
    kapalId: '',
    tipeMuatan: 'Kendaraan' as 'Kendaraan' | 'Logistik Curah' | 'Kontainer' | 'General Cargo',
    tarifGolonganId: '',
    nomorPolisiKontainer: '',
    namaPengirim: '',
    namaPenerima: '',
    deskripsiBarang: '',
    beratKotorKg: 2000,
    beratNettoKg: 1800,
    dimensiM3: 12,
    isDangerousGoods: false,
    posisiDek: 'Dek Car Deck - Bay 01',
    status: 'Terdaftar' as StatusMuatan,
    totalBiaya: 485000
  });

  const refreshData = () => {
    setTiketList(dbService.getTiket());
    setMuatanList(dbService.getMuatan());
    setKapalList(dbService.getKapal());
    setJadwalList(dbService.getJadwal());
    setTarifList(dbService.getTarif());
  };

  useEffect(() => {
    refreshData();
    const unsub = dbService.subscribe(refreshData);
    return unsub;
  }, []);

  // Open Ticket Add Modal
  const handleOpenAddTicket = () => {
    setEditingTicketId(null);
    const firstJadwal = jadwalList[0];
    const paxTarif = tarifList.filter(t => t.kategori === 'Penumpang');
    const firstTarif = paxTarif[0] || tarifList[0];

    setTicketForm({
      jadwalId: firstJadwal ? firstJadwal.id : '',
      kapalId: firstJadwal ? firstJadwal.kapalId : (kapalList[0]?.id || ''),
      namaPenumpang: '',
      identitasNo: '',
      jenisKelamin: 'L',
      usia: 28,
      tarifGolonganId: firstTarif ? firstTarif.id : '',
      kelasLayanan: 'Ekonomi',
      nomorKursiDek: `Dek B-${Math.floor(10 + Math.random() * 80)}`,
      totalBiaya: firstTarif ? firstTarif.totalTarif : 25000,
      status: 'Issued',
      nomorTelepon: '08123456789'
    });
    setIsTicketModalOpen(true);
  };

  // Open Cargo Add Modal
  const handleOpenAddCargo = () => {
    setEditingCargoId(null);
    const firstJadwal = jadwalList[0];
    const vehTarif = tarifList.filter(t => t.kategori === 'Kendaraan' || t.kategori === 'Kargo');
    const firstTarif = vehTarif[0] || tarifList[0];

    setCargoForm({
      jadwalId: firstJadwal ? firstJadwal.id : '',
      kapalId: firstJadwal ? firstJadwal.kapalId : (kapalList[0]?.id || ''),
      tipeMuatan: 'Kendaraan',
      tarifGolonganId: firstTarif ? firstTarif.id : '',
      nomorPolisiKontainer: '',
      namaPengirim: '',
      namaPenerima: '',
      deskripsiBarang: '',
      beratKotorKg: 2200,
      beratNettoKg: 1900,
      dimensiM3: 15,
      isDangerousGoods: false,
      posisiDek: `Car Deck - Bay 0${Math.floor(1 + Math.random() * 8)}`,
      status: 'Terdaftar',
      totalBiaya: firstTarif ? firstTarif.totalTarif : 485000
    });
    setIsCargoModalOpen(true);
  };

  // Edit Ticket
  const handleOpenEditTicket = (t: TiketPenumpang) => {
    setEditingTicketId(t.id);
    setTicketForm({
      jadwalId: t.jadwalId,
      kapalId: t.kapalId,
      namaPenumpang: t.namaPenumpang,
      identitasNo: t.identitasNo,
      jenisKelamin: t.jenisKelamin,
      usia: t.usia,
      tarifGolonganId: t.tarifGolonganId,
      kelasLayanan: t.kelasLayanan,
      nomorKursiDek: t.nomorKursiDek,
      totalBiaya: t.totalBiaya,
      status: t.status,
      nomorTelepon: t.nomorTelepon
    });
    setIsTicketModalOpen(true);
  };

  // Edit Cargo
  const handleOpenEditCargo = (m: ManifestMuatan) => {
    setEditingCargoId(m.id);
    setCargoForm({
      jadwalId: m.jadwalId,
      kapalId: m.kapalId,
      tipeMuatan: m.tipeMuatan,
      tarifGolonganId: m.tarifGolonganId,
      nomorPolisiKontainer: m.nomorPolisiKontainer,
      namaPengirim: m.namaPengirim,
      namaPenerima: m.namaPenerima,
      deskripsiBarang: m.deskripsiBarang,
      beratKotorKg: m.beratKotorKg,
      beratNettoKg: m.beratNettoKg,
      dimensiM3: m.dimensiM3 || 0,
      isDangerousGoods: m.isDangerousGoods,
      posisiDek: m.posisiDek,
      status: m.status,
      totalBiaya: m.totalBiaya
    });
    setIsCargoModalOpen(true);
  };

  // Quick Check-in Passenger
  const handleCheckInTicket = (id: string, name: string) => {
    dbService.checkInTiket(id);
  };

  // Quick Advance Cargo Status
  const handleAdvanceCargoStatus = (m: ManifestMuatan) => {
    const nextStatus: Record<StatusMuatan, StatusMuatan> = {
      'Terdaftar': 'Timbang',
      'Timbang': 'Loading',
      'Loading': 'Onboard',
      'Onboard': 'Discharged',
      'Discharged': 'Discharged'
    };
    dbService.updateMuatan(m.id, { status: nextStatus[m.status] });
  };

  // Delete handlers
  const handleDeleteTicket = (id: string, no: string) => {
    if (window.confirm(`Batalkan dan hapus tiket ${no}?`)) {
      dbService.deleteTiket(id);
    }
  };

  const handleDeleteCargo = (id: string, no: string) => {
    if (window.confirm(`Hapus data manifest kargo ${no}?`)) {
      dbService.deleteMuatan(id);
    }
  };

  // Save Ticket Modal
  const handleSaveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTarif = tarifList.find(t => t.id === ticketForm.tarifGolonganId);
    const selectedJadwal = jadwalList.find(j => j.id === ticketForm.jadwalId);

    const payload = {
      ...ticketForm,
      kapalId: selectedJadwal ? selectedJadwal.kapalId : ticketForm.kapalId,
      namaGolongan: selectedTarif ? selectedTarif.namaGolongan : 'Penumpang Reguler',
      totalBiaya: selectedTarif ? selectedTarif.totalTarif : ticketForm.totalBiaya,
      waktuBooking: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    if (editingTicketId) {
      dbService.updateTiket(editingTicketId, payload);
    } else {
      dbService.addTiket(payload);
    }

    setIsTicketModalOpen(false);
  };

  // Save Cargo Modal
  const handleSaveCargo = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTarif = tarifList.find(t => t.id === cargoForm.tarifGolonganId);
    const selectedJadwal = jadwalList.find(j => j.id === cargoForm.jadwalId);

    const payload = {
      ...cargoForm,
      kapalId: selectedJadwal ? selectedJadwal.kapalId : cargoForm.kapalId,
      namaGolongan: selectedTarif ? selectedTarif.namaGolongan : 'General Cargo',
      totalBiaya: selectedTarif ? selectedTarif.totalTarif : cargoForm.totalBiaya,
      waktuInput: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    if (editingCargoId) {
      dbService.updateMuatan(editingCargoId, payload);
    } else {
      dbService.addMuatan(payload);
    }

    setIsCargoModalOpen(false);
  };

  // Filters
  const filteredTiket = tiketList.filter(t => 
    t.namaPenumpang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.nomorTiket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.identitasNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMuatan = muatanList.filter(m => 
    m.nomorPolisiKontainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.nomorManifest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.namaPengirim.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Pusat Transaksi Muatan & Manifest Penumpang
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pencatatan tiket boarding pass penumpang, timbangan jembatan kargo, dan manifest kendaraan kapal
          </p>
        </div>

        {/* Action Button */}
        {activeTab === 'tiket' ? (
          <button
            id="trx-add-ticket-btn"
            onClick={handleOpenAddTicket}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Terbitkan Tiket Penumpang</span>
          </button>
        ) : (
          <button
            id="trx-add-cargo-btn"
            onClick={handleOpenAddCargo}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/25 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrasi Manifest Muatan</span>
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Tab switch */}
        <div className="flex p-1 bg-slate-850 rounded-xl border border-slate-800 space-x-1">
          <button
            onClick={() => { setActiveTab('tiket'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tiket'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manifest Penumpang ({tiketList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('muatan'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'muatan'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Manifest Kargo & Kendaraan ({muatanList.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={activeTab === 'tiket' ? "Cari nama, no tiket, NIK..." : "Cari no polisi, kontainer, kargo..."}
            className="w-full pl-9 pr-3 py-2 bg-slate-850 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

      </div>

      {/* View 1: Tiket Penumpang Table */}
      {activeTab === 'tiket' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">No Tiket & Penumpang</th>
                  <th className="px-4 py-3.5">Identitas (NIK/Paspor)</th>
                  <th className="px-4 py-3.5">Golongan & Kelas</th>
                  <th className="px-4 py-3.5">Kapal & Kursi Dek</th>
                  <th className="px-4 py-3.5 text-right">Total Biaya</th>
                  <th className="px-4 py-3.5 text-center">Status Boarding</th>
                  <th className="px-4 py-3.5 text-center">Aksi Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTiket.map(t => {
                  const ship = kapalList.find(k => k.id === t.kapalId);
                  const jadwal = jadwalList.find(j => j.id === t.jadwalId);
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{t.namaPenumpang}</div>
                        <div className="text-[11px] font-mono text-cyan-400">{t.nomorTiket}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-slate-200">{t.identitasNo}</div>
                        <div className="text-slate-400 text-[11px]">{t.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}, {t.usia} th</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{t.namaGolongan}</div>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.kelasLayanan === 'VIP' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {t.kelasLayanan}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{ship?.namaKapal || 'Kapal Roro'}</div>
                        <div className="text-cyan-400 font-mono text-[11px]">{t.nomorKursiDek}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 text-sm">
                        Rp {t.totalBiaya.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          t.status === 'Boarded'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : t.status === 'Issued'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {t.status === 'Boarded' ? '✓ Naik Kapal' : t.status === 'Issued' ? 'Terbit (Belum Boarding)' : 'Dibatalkan'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {t.status === 'Issued' && (
                            <button
                              onClick={() => handleCheckInTicket(t.id, t.namaPenumpang)}
                              title="Check-In / Boarding Penumpang"
                              className="p-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onPrintTicket(t, ship, jadwal)}
                            title="Cetak Boarding Pass & QR Code"
                            className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditTicket(t)}
                            title="Ubah Tiket"
                            className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTicket(t.id, t.nomorTiket)}
                            title="Hapus Tiket"
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Manifest Muatan Table */}
      {activeTab === 'muatan' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">No Manifest & Identitas Muatan</th>
                  <th className="px-4 py-3.5">Tipe & Golongan</th>
                  <th className="px-4 py-3.5">Pengirim & Penerima</th>
                  <th className="px-4 py-3.5 text-right">Berat Timbang (Ton/Kg)</th>
                  <th className="px-4 py-3.5">Posisi Dek Kapal</th>
                  <th className="px-4 py-3.5 text-center">Status Muat</th>
                  <th className="px-4 py-3.5 text-center">Aksi Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredMuatan.map(m => {
                  const ship = kapalList.find(k => k.id === m.kapalId);
                  const jadwal = jadwalList.find(j => j.id === m.jadwalId);
                  return (
                    <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{m.nomorPolisiKontainer}</div>
                        <div className="text-[11px] font-mono text-amber-400">{m.nomorManifest}</div>
                        {m.isDangerousGoods && (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold border border-red-500/30 mt-1">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            <span>B3 (Dangerous Goods)</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{m.namaGolongan}</div>
                        <div className="text-slate-400 text-[11px]">{m.tipeMuatan}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-200 font-medium">Dari: {m.namaPengirim}</div>
                        <div className="text-slate-400 text-[11px]">Kepada: {m.namaPenerima}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <div className="font-bold text-amber-400 text-sm">{(m.beratKotorKg / 1000).toFixed(2)} Ton</div>
                        <div className="text-slate-400 text-[11px]">{m.beratKotorKg.toLocaleString()} Kg</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{ship?.namaKapal || 'Kapal'}</div>
                        <div className="text-cyan-400 text-[11px] font-mono">{m.posisiDek}</div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleAdvanceCargoStatus(m)}
                          title="Klik untuk memajukan status muat"
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer hover:ring-2 hover:ring-cyan-500/30 transition-all ${
                            m.status === 'Onboard'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : m.status === 'Loading'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse'
                              : m.status === 'Timbang'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-slate-700 text-slate-300 border-slate-600'
                          }`}
                        >
                          {m.status === 'Onboard' ? '✓ Onboard (Di Dek)' : m.status === 'Loading' ? '⟳ Sedang Muat' : m.status === 'Timbang' ? '⚖ Timbang' : m.status}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => onPrintCargo(m, ship, jadwal)}
                            title="Cetak Dokumen Manifest Muatan"
                            className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditCargo(m)}
                            title="Ubah Data Manifest"
                            className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCargo(m.id, m.nomorManifest)}
                            title="Hapus Manifest"
                            className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal 1: Form Registrasi Tiket Penumpang */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>{editingTicketId ? 'Ubah Tiket Penumpang' : 'Penerbitan Tiket Penumpang Baru'}</span>
              </h3>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nama Lengkap Penumpang:</label>
                <input
                  type="text"
                  value={ticketForm.namaPenumpang}
                  onChange={e => setTicketForm({ ...ticketForm, namaPenumpang: e.target.value })}
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">No. KTP / Paspor (NIK):</label>
                  <input
                    type="text"
                    value={ticketForm.identitasNo}
                    onChange={e => setTicketForm({ ...ticketForm, identitasNo: e.target.value })}
                    required
                    placeholder="16 digit NIK"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nomor WhatsApp / HP:</label>
                  <input
                    type="text"
                    value={ticketForm.nomorTelepon}
                    onChange={e => setTicketForm({ ...ticketForm, nomorTelepon: e.target.value })}
                    required
                    placeholder="0812..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Jenis Kelamin:</label>
                  <select
                    value={ticketForm.jenisKelamin}
                    onChange={e => setTicketForm({ ...ticketForm, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Usia (Tahun):</label>
                  <input
                    type="number"
                    value={ticketForm.usia}
                    onChange={e => setTicketForm({ ...ticketForm, usia: Number(e.target.value) })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Pilih Jadwal & Rute:</label>
                  <select
                    value={ticketForm.jadwalId}
                    onChange={e => setTicketForm({ ...ticketForm, jadwalId: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {jadwalList.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.namaKapal} ({j.pelabuhanAsal} &rarr; {j.pelabuhanTujuan})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Golongan Tiket Penumpang:</label>
                  <select
                    value={ticketForm.tarifGolonganId}
                    onChange={e => {
                      const sel = tarifList.find(t => t.id === e.target.value);
                      setTicketForm({ 
                        ...ticketForm, 
                        tarifGolonganId: e.target.value,
                        totalBiaya: sel ? sel.totalTarif : ticketForm.totalBiaya
                      });
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {tarifList.filter(t => t.kategori === 'Penumpang').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.namaGolongan} - Rp {t.totalTarif.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Kelas Layanan:</label>
                  <select
                    value={ticketForm.kelasLayanan}
                    onChange={e => setTicketForm({ ...ticketForm, kelasLayanan: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Bisnis">Bisnis</option>
                    <option value="VIP">VIP Lounge</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nomor Kursi / Dek:</label>
                  <input
                    type="text"
                    value={ticketForm.nomorKursiDek}
                    onChange={e => setTicketForm({ ...ticketForm, nomorKursiDek: e.target.value })}
                    required
                    placeholder="Contoh: Dek B-14"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  id="save-ticket-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Simpan & Terbitkan Tiket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Form Registrasi Manifest Muatan */}
      {isCargoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>{editingCargoId ? 'Ubah Manifest Muatan' : 'Input Manifest Muatan & Kendaraan'}</span>
              </h3>
              <button
                onClick={() => setIsCargoModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCargo} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">No Polisi / No Kontainer:</label>
                  <input
                    type="text"
                    value={cargoForm.nomorPolisiKontainer}
                    onChange={e => setCargoForm({ ...cargoForm, nomorPolisiKontainer: e.target.value })}
                    required
                    placeholder="Contoh: B 9912 UYZ / TEMU 123"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tipe Muatan:</label>
                  <select
                    value={cargoForm.tipeMuatan}
                    onChange={e => setCargoForm({ ...cargoForm, tipeMuatan: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Kendaraan">Kendaraan</option>
                    <option value="Kontainer">Kontainer</option>
                    <option value="General Cargo">General Cargo</option>
                    <option value="Logistik Curah">Logistik Curah</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Golongan Tarif:</label>
                  <select
                    value={cargoForm.tarifGolonganId}
                    onChange={e => {
                      const sel = tarifList.find(t => t.id === e.target.value);
                      setCargoForm({
                        ...cargoForm,
                        tarifGolonganId: e.target.value,
                        totalBiaya: sel ? sel.totalTarif : cargoForm.totalBiaya
                      });
                    }}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {tarifList.filter(t => t.kategori !== 'Penumpang').map(t => (
                      <option key={t.id} value={t.id}>
                        {t.namaGolongan} - Rp {t.totalTarif.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Pilih Kapal & Jadwal:</label>
                  <select
                    value={cargoForm.jadwalId}
                    onChange={e => setCargoForm({ ...cargoForm, jadwalId: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    {jadwalList.map(j => (
                      <option key={j.id} value={j.id}>
                        {j.namaKapal} ({j.pelabuhanAsal} &rarr; {j.pelabuhanTujuan})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nama Pengirim / Ekspedisi:</label>
                  <input
                    type="text"
                    value={cargoForm.namaPengirim}
                    onChange={e => setCargoForm({ ...cargoForm, namaPengirim: e.target.value })}
                    required
                    placeholder="PT Trans Logistik..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Nama Penerima / Gudang Tujuan:</label>
                  <input
                    type="text"
                    value={cargoForm.namaPenerima}
                    onChange={e => setCargoForm({ ...cargoForm, namaPenerima: e.target.value })}
                    required
                    placeholder="Depo Distribusi..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Weighbridge scale inputs */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span className="flex items-center space-x-1">
                    <Scale className="w-3.5 h-3.5" />
                    <span>Hasil Penimbangan Jembatan Timbang (Weighbridge):</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Berat Kotor / Gross (Kg):</label>
                    <input
                      type="number"
                      value={cargoForm.beratKotorKg}
                      onChange={e => setCargoForm({ ...cargoForm, beratKotorKg: Number(e.target.value) })}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-0.5">Berat Netto (Kg):</label>
                    <input
                      type="number"
                      value={cargoForm.beratNettoKg}
                      onChange={e => setCargoForm({ ...cargoForm, beratNettoKg: Number(e.target.value) })}
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Deskripsi Barang / Muatan:</label>
                <input
                  type="text"
                  value={cargoForm.deskripsiBarang}
                  onChange={e => setCargoForm({ ...cargoForm, deskripsiBarang: e.target.value })}
                  placeholder="Contoh: Sembako, tepung, beras, kendaraan pribadi..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Posisi Penempatan Dek Kapal:</label>
                  <input
                    type="text"
                    value={cargoForm.posisiDek}
                    onChange={e => setCargoForm({ ...cargoForm, posisiDek: e.target.value })}
                    placeholder="Dek Car Deck Bawah - Bay 02"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 text-xs text-red-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cargoForm.isDangerousGoods}
                      onChange={e => setCargoForm({ ...cargoForm, isDangerousGoods: e.target.checked })}
                      className="rounded bg-slate-800 border-red-500 text-red-500 focus:ring-red-500"
                    />
                    <span>Barang Berbahaya (B3 / Hazmat)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCargoModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  id="save-cargo-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl shadow-md shadow-amber-500/20"
                >
                  Simpan Manifest Muatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
