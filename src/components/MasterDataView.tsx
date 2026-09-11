import React, { useState, useEffect } from 'react';
import { 
  Ship, 
  Anchor, 
  Tag, 
  CalendarDays, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { 
  Kapal, 
  Dermaga, 
  TarifGolongan, 
  JadwalPelayaran, 
  TipeKapal, 
  StatusKapal, 
  KategoriTarif, 
  StatusJadwal 
} from '../types';
import { dbService } from '../services/db';

type MasterTab = 'kapal' | 'dermaga' | 'tarif' | 'jadwal';

export const MasterDataView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MasterTab>('kapal');
  const [searchTerm, setSearchTerm] = useState('');

  // Data state
  const [kapalList, setKapalList] = useState<Kapal[]>([]);
  const [dermagaList, setDermagaList] = useState<Dermaga[]>([]);
  const [tarifList, setTarifList] = useState<TarifGolongan[]>([]);
  const [jadwalList, setJadwalList] = useState<JadwalPelayaran[]>([]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for Kapal
  const [kapalForm, setKapalForm] = useState({
    kodeKapal: '',
    namaKapal: '',
    tipe: 'Ferry RORO' as TipeKapal,
    kapasitasPenumpang: 500,
    kapasitasMuatanTon: 1500,
    panjangMeter: 85,
    lebarMeter: 16,
    draftMeter: 4.2,
    kecepatanMaksKnot: 15,
    status: 'Sandar' as StatusKapal,
    tahunPembuatan: 2018,
    posisiDermaga: 'Dermaga 1',
    fotoUrl: ''
  });

  // Form states for Dermaga
  const [dermagaForm, setDermagaForm] = useState({
    kodeDermaga: '',
    namaPelabuhan: '',
    namaDermaga: '',
    kedalamanDraftMeter: 7.5,
    kapasitasMaksTon: 10000,
    statusOperasional: 'Aktif' as 'Aktif' | 'Perawatan' | 'Penuh',
    lokasiKota: ''
  });

  // Form states for Tarif
  const [tarifForm, setTarifForm] = useState({
    kode: '',
    kategori: 'Kendaraan' as KategoriTarif,
    namaGolongan: '',
    deskripsi: '',
    tarifDasar: 100000,
    asuransi: 10000,
    satuan: 'Unit'
  });

  // Form states for Jadwal
  const [jadwalForm, setJadwalForm] = useState({
    kodeJadwal: '',
    kapalId: '',
    pelabuhanAsal: 'Pelabuhan Merak',
    pelabuhanTujuan: 'Pelabuhan Bakauheni',
    dermagaId: '',
    waktuKeberangkatan: '2026-09-12 08:00',
    waktuKedatanganEstimasi: '2026-09-12 09:45',
    status: 'On Time' as StatusJadwal,
    keterangan: 'Jadwal Reguler'
  });

  const refreshData = () => {
    setKapalList(dbService.getKapal());
    setDermagaList(dbService.getDermaga());
    setTarifList(dbService.getTarif());
    setJadwalList(dbService.getJadwal());
  };

  useEffect(() => {
    refreshData();
    const unsub = dbService.subscribe(refreshData);
    return unsub;
  }, []);

  // Open modal for Create
  const handleOpenAdd = () => {
    setEditingId(null);
    if (activeTab === 'kapal') {
      const randNum = Math.floor(100 + Math.random() * 900);
      setKapalForm({
        kodeKapal: `KMP-BARU-${randNum}`,
        namaKapal: '',
        tipe: 'Ferry RORO',
        kapasitasPenumpang: 600,
        kapasitasMuatanTon: 1200,
        panjangMeter: 80,
        lebarMeter: 15,
        draftMeter: 4.0,
        kecepatanMaksKnot: 14,
        status: 'Sandar',
        tahunPembuatan: 2020,
        posisiDermaga: 'Dermaga 1 Merak',
        fotoUrl: ''
      });
    } else if (activeTab === 'dermaga') {
      setDermagaForm({
        kodeDermaga: `DMG-${Math.floor(10 + Math.random() * 90)}`,
        namaPelabuhan: 'Pelabuhan Merak',
        namaDermaga: '',
        kedalamanDraftMeter: 8.0,
        kapasitasMaksTon: 15000,
        statusOperasional: 'Aktif',
        lokasiKota: 'Cilegon, Banten'
      });
    } else if (activeTab === 'tarif') {
      setTarifForm({
        kode: `GOL-${Math.floor(10 + Math.random() * 90)}`,
        kategori: 'Kendaraan',
        namaGolongan: '',
        deskripsi: '',
        tarifDasar: 150000,
        asuransi: 15000,
        satuan: 'Unit'
      });
    } else if (activeTab === 'jadwal') {
      const firstKapal = kapalList[0];
      setJadwalForm({
        kodeJadwal: `JDW-${Math.floor(100 + Math.random() * 900)}`,
        kapalId: firstKapal ? firstKapal.id : '',
        pelabuhanAsal: 'Pelabuhan Merak',
        pelabuhanTujuan: 'Pelabuhan Bakauheni',
        dermagaId: dermagaList[0]?.id || '',
        waktuKeberangkatan: new Date().toISOString().slice(0, 16).replace('T', ' '),
        waktuKedatanganEstimasi: new Date(Date.now() + 7200000).toISOString().slice(0, 16).replace('T', ' '),
        status: 'On Time',
        keterangan: 'Jadwal Penyeberangan Baru'
      });
    }
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'kapal') {
      setKapalForm({
        kodeKapal: item.kodeKapal,
        namaKapal: item.namaKapal,
        tipe: item.tipe,
        kapasitasPenumpang: item.kapasitasPenumpang,
        kapasitasMuatanTon: item.kapasitasMuatanTon,
        panjangMeter: item.panjangMeter,
        lebarMeter: item.lebarMeter,
        draftMeter: item.draftMeter,
        kecepatanMaksKnot: item.kecepatanMaksKnot,
        status: item.status,
        tahunPembuatan: item.tahunPembuatan,
        posisiDermaga: item.posisiDermaga || '',
        fotoUrl: item.fotoUrl || ''
      });
    } else if (activeTab === 'dermaga') {
      setDermagaForm({
        kodeDermaga: item.kodeDermaga,
        namaPelabuhan: item.namaPelabuhan,
        namaDermaga: item.namaDermaga,
        kedalamanDraftMeter: item.kedalamanDraftMeter,
        kapasitasMaksTon: item.kapasitasMaksTon,
        statusOperasional: item.statusOperasional,
        lokasiKota: item.lokasiKota
      });
    } else if (activeTab === 'tarif') {
      setTarifForm({
        kode: item.kode,
        kategori: item.kategori,
        namaGolongan: item.namaGolongan,
        deskripsi: item.deskripsi,
        tarifDasar: item.tarifDasar,
        asuransi: item.asuransi,
        satuan: item.satuan
      });
    } else if (activeTab === 'jadwal') {
      setJadwalForm({
        kodeJadwal: item.kodeJadwal,
        kapalId: item.kapalId,
        pelabuhanAsal: item.pelabuhanAsal,
        pelabuhanTujuan: item.pelabuhanTujuan,
        dermagaId: item.dermagaId,
        waktuKeberangkatan: item.waktuKeberangkatan,
        waktuKedatanganEstimasi: item.waktuKedatanganEstimasi,
        status: item.status,
        keterangan: item.keterangan || ''
      });
    }
    setIsModalOpen(true);
  };

  // Delete Action
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus data "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      if (activeTab === 'kapal') dbService.deleteKapal(id);
      else if (activeTab === 'dermaga') dbService.deleteDermaga(id);
      else if (activeTab === 'tarif') dbService.deleteTarif(id);
      else if (activeTab === 'jadwal') dbService.deleteJadwal(id);
    }
  };

  // Submit modal form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'kapal') {
      if (editingId) {
        dbService.updateKapal(editingId, kapalForm);
      } else {
        dbService.addKapal(kapalForm);
      }
    } else if (activeTab === 'dermaga') {
      if (editingId) {
        dbService.updateDermaga(editingId, dermagaForm);
      } else {
        dbService.addDermaga(dermagaForm);
      }
    } else if (activeTab === 'tarif') {
      if (editingId) {
        dbService.updateTarif(editingId, tarifForm);
      } else {
        dbService.addTarif(tarifForm);
      }
    } else if (activeTab === 'jadwal') {
      const selectedKapal = kapalList.find(k => k.id === jadwalForm.kapalId);
      const selectedDermaga = dermagaList.find(d => d.id === jadwalForm.dermagaId);
      const payload = {
        ...jadwalForm,
        namaKapal: selectedKapal ? selectedKapal.namaKapal : 'Kapal Penyeberangan',
        namaDermaga: selectedDermaga ? selectedDermaga.namaDermaga : 'Dermaga Reguler'
      };
      if (editingId) {
        dbService.updateJadwal(editingId, payload);
      } else {
        dbService.addJadwal(payload);
      }
    }

    setIsModalOpen(false);
  };

  // Search filtering
  const filteredKapal = kapalList.filter(k => 
    k.namaKapal.toLowerCase().includes(searchTerm.toLowerCase()) || 
    k.kodeKapal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.tipe.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDermaga = dermagaList.filter(d => 
    d.namaPelabuhan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.namaDermaga.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.lokasiKota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTarif = tarifList.filter(t => 
    t.namaGolongan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.kode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredJadwal = jadwalList.filter(j => 
    j.namaKapal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.kodeJadwal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.pelabuhanAsal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.pelabuhanTujuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header & Subtabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
            <span>Manajemen Master Data Pelabuhan & Armada</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola data pokok kapal, dermaga, tarif golongan tiket & kendaraan, serta jadwal rute pelayaran
          </p>
        </div>

        {/* Action Button: Tambah Baru */}
        <button
          id="master-add-btn"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Data {activeTab.toUpperCase()}</span>
        </button>
      </div>

      {/* Sub Tabs Selector & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-850 rounded-xl border border-slate-800">
          <button
            onClick={() => { setActiveTab('kapal'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kapal'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Master Kapal ({kapalList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('dermaga'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dermaga'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            <span>Master Dermaga ({dermagaList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('tarif'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tarif'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Tarif & Golongan ({tarifList.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('jadwal'); setSearchTerm(''); }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'jadwal'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Jadwal Pelayaran ({jadwalList.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={`Cari data ${activeTab}...`}
            className="w-full pl-9 pr-3 py-2 bg-slate-850 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

      </div>

      {/* Tab 1: Table Kapal */}
      {activeTab === 'kapal' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Kode & Nama Kapal</th>
                  <th className="px-4 py-3.5">Tipe Kapal</th>
                  <th className="px-4 py-3.5 text-right">Kapasitas Pax</th>
                  <th className="px-4 py-3.5 text-right">Kapasitas Muatan</th>
                  <th className="px-4 py-3.5">Dimensi & Draft</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredKapal.map(k => (
                  <tr key={k.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{k.namaKapal}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{k.kodeKapal} ({k.tahunPembuatan})</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-300">{k.tipe}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-white">{k.kapasitasPenumpang} Pax</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-amber-400">{k.kapasitasMuatanTon} Ton</td>
                    <td className="px-4 py-3 text-slate-400">
                      <div>{k.panjangMeter}m x {k.lebarMeter}m</div>
                      <div className="text-[11px] text-cyan-400">Draft: {k.draftMeter}m | {k.kecepatanMaksKnot} Knots</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        k.status === 'Berlayar'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : k.status === 'Sandar'
                          ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {k.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(k)}
                          title="Ubah Data Kapal"
                          className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(k.id, k.namaKapal)}
                          title="Hapus Kapal"
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Table Dermaga */}
      {activeTab === 'dermaga' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Kode & Nama Dermaga</th>
                  <th className="px-4 py-3.5">Nama Pelabuhan</th>
                  <th className="px-4 py-3.5">Lokasi Kota</th>
                  <th className="px-4 py-3.5 text-right">Kedalaman Draft</th>
                  <th className="px-4 py-3.5 text-right">Kapasitas Maks</th>
                  <th className="px-4 py-3.5 text-center">Status Operasional</th>
                  <th className="px-4 py-3.5 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredDermaga.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{d.namaDermaga}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{d.kodeDermaga}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-200">{d.namaPelabuhan}</td>
                    <td className="px-4 py-3 text-slate-400">{d.lokasiKota}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-cyan-400">{d.kedalamanDraftMeter} Meter</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-200">{d.kapasitasMaksTon.toLocaleString()} Ton</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        d.statusOperasional === 'Aktif'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {d.statusOperasional}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(d)}
                          className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.namaDermaga)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Table Tarif & Golongan */}
      {activeTab === 'tarif' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Kode & Nama Golongan</th>
                  <th className="px-4 py-3.5">Kategori</th>
                  <th className="px-4 py-3.5">Deskripsi Peruntukan</th>
                  <th className="px-4 py-3.5 text-right">Tarif Dasar</th>
                  <th className="px-4 py-3.5 text-right">Asuransi</th>
                  <th className="px-4 py-3.5 text-right">Total Tarif (IDR)</th>
                  <th className="px-4 py-3.5 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTarif.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{t.namaGolongan}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{t.kode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        t.kategori === 'Penumpang'
                          ? 'bg-blue-500/20 text-blue-400'
                          : t.kategori === 'Kendaraan'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {t.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">{t.deskripsi}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">Rp {t.tarifDasar.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-400">Rp {t.asuransi.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400 text-sm">
                      Rp {t.totalTarif.toLocaleString()} / {t.satuan}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.namaGolongan)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Table Jadwal Pelayaran */}
      {activeTab === 'jadwal' && (
        <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Kode & Kapal</th>
                  <th className="px-4 py-3.5">Rute Pelayaran</th>
                  <th className="px-4 py-3.5">Dermaga Sandar</th>
                  <th className="px-4 py-3.5">Jadwal Berangkat & Tiba</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5">Keterangan</th>
                  <th className="px-4 py-3.5 text-center">Aksi CRUD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredJadwal.map(j => (
                  <tr key={j.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-white text-sm">{j.namaKapal}</div>
                      <div className="text-[11px] font-mono text-cyan-400">{j.kodeJadwal}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{j.pelabuhanAsal}</div>
                      <div className="text-slate-400 text-[11px]">&rarr; {j.pelabuhanTujuan}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{j.namaDermaga}</td>
                    <td className="px-4 py-3 font-mono">
                      <div className="text-cyan-400 font-bold">{j.waktuKeberangkatan}</div>
                      <div className="text-[11px] text-slate-400">ETA: {j.waktuKedatanganEstimasi}</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        j.status === 'Boarding'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : j.status === 'Berlayar'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        {j.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs">{j.keterangan || '-'}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenEdit(j)}
                          className="p-1.5 bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(j.id, j.kodeJadwal)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Unified CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
              <h3 className="font-bold text-white text-base">
                {editingId ? `Ubah Data ${activeTab.toUpperCase()}` : `Tambah ${activeTab.toUpperCase()} Baru`}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4">
              
              {/* Form Kapal */}
              {activeTab === 'kapal' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kode Kapal:</label>
                      <input
                        type="text"
                        value={kapalForm.kodeKapal}
                        onChange={e => setKapalForm({ ...kapalForm, kodeKapal: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Nama Kapal:</label>
                      <input
                        type="text"
                        value={kapalForm.namaKapal}
                        onChange={e => setKapalForm({ ...kapalForm, namaKapal: e.target.value })}
                        required
                        placeholder="Contoh: KMP Dharma Rucitra"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Tipe Kapal:</label>
                      <select
                        value={kapalForm.tipe}
                        onChange={e => setKapalForm({ ...kapalForm, tipe: e.target.value as TipeKapal })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Ferry RORO">Ferry RORO</option>
                        <option value="Kapal Penumpang (Pelni)">Kapal Penumpang (Pelni)</option>
                        <option value="Cargo Kontainer">Cargo Kontainer</option>
                        <option value="Speedboat Eksekutif">Speedboat Eksekutif</option>
                        <option value="Tongkang / LCT">Tongkang / LCT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Status Operasional:</label>
                      <select
                        value={kapalForm.status}
                        onChange={e => setKapalForm({ ...kapalForm, status: e.target.value as StatusKapal })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Sandar">Sandar</option>
                        <option value="Berlayar">Berlayar</option>
                        <option value="Docking">Docking</option>
                        <option value="Perbaikan">Perbaikan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kapasitas Penumpang (Pax):</label>
                      <input
                        type="number"
                        value={kapalForm.kapasitasPenumpang}
                        onChange={e => setKapalForm({ ...kapalForm, kapasitasPenumpang: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kapasitas Muatan (Ton):</label>
                      <input
                        type="number"
                        value={kapalForm.kapasitasMuatanTon}
                        onChange={e => setKapalForm({ ...kapalForm, kapasitasMuatanTon: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Panjang (m):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={kapalForm.panjangMeter}
                        onChange={e => setKapalForm({ ...kapalForm, panjangMeter: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Lebar (m):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={kapalForm.lebarMeter}
                        onChange={e => setKapalForm({ ...kapalForm, lebarMeter: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Draft Kedalaman (m):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={kapalForm.draftMeter}
                        onChange={e => setKapalForm({ ...kapalForm, draftMeter: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form Dermaga */}
              {activeTab === 'dermaga' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kode Dermaga:</label>
                      <input
                        type="text"
                        value={dermagaForm.kodeDermaga}
                        onChange={e => setDermagaForm({ ...dermagaForm, kodeDermaga: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Nama Dermaga:</label>
                      <input
                        type="text"
                        value={dermagaForm.namaDermaga}
                        onChange={e => setDermagaForm({ ...dermagaForm, namaDermaga: e.target.value })}
                        required
                        placeholder="Contoh: Dermaga Eksekutif 2"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Nama Pelabuhan:</label>
                    <input
                      type="text"
                      value={dermagaForm.namaPelabuhan}
                      onChange={e => setDermagaForm({ ...dermagaForm, namaPelabuhan: e.target.value })}
                      required
                      placeholder="Contoh: Pelabuhan Merak"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kedalaman Draft (Meter):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={dermagaForm.kedalamanDraftMeter}
                        onChange={e => setDermagaForm({ ...dermagaForm, kedalamanDraftMeter: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kapasitas Maks (Ton):</label>
                      <input
                        type="number"
                        value={dermagaForm.kapasitasMaksTon}
                        onChange={e => setDermagaForm({ ...dermagaForm, kapasitasMaksTon: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Lokasi Kota / Provinsi:</label>
                    <input
                      type="text"
                      value={dermagaForm.lokasiKota}
                      onChange={e => setDermagaForm({ ...dermagaForm, lokasiKota: e.target.value })}
                      required
                      placeholder="Contoh: Cilegon, Banten"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Form Tarif */}
              {activeTab === 'tarif' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kode Tarif:</label>
                      <input
                        type="text"
                        value={tarifForm.kode}
                        onChange={e => setTarifForm({ ...tarifForm, kode: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kategori:</label>
                      <select
                        value={tarifForm.kategori}
                        onChange={e => setTarifForm({ ...tarifForm, kategori: e.target.value as KategoriTarif })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Penumpang">Penumpang</option>
                        <option value="Kendaraan">Kendaraan</option>
                        <option value="Kargo">Kargo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Nama Golongan / Tarif:</label>
                    <input
                      type="text"
                      value={tarifForm.namaGolongan}
                      onChange={e => setTarifForm({ ...tarifForm, namaGolongan: e.target.value })}
                      required
                      placeholder="Contoh: Golongan IV A (Mobil Penumpang)"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Tarif Dasar (Rp):</label>
                      <input
                        type="number"
                        value={tarifForm.tarifDasar}
                        onChange={e => setTarifForm({ ...tarifForm, tarifDasar: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Asuransi (Rp):</label>
                      <input
                        type="number"
                        value={tarifForm.asuransi}
                        onChange={e => setTarifForm({ ...tarifForm, asuransi: Number(e.target.value) })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Satuan:</label>
                      <input
                        type="text"
                        value={tarifForm.satuan}
                        onChange={e => setTarifForm({ ...tarifForm, satuan: e.target.value })}
                        required
                        placeholder="Unit, Orang, Ton"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Deskripsi:</label>
                    <textarea
                      value={tarifForm.deskripsi}
                      onChange={e => setTarifForm({ ...tarifForm, deskripsi: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {/* Form Jadwal */}
              {activeTab === 'jadwal' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Kode Jadwal:</label>
                      <input
                        type="text"
                        value={jadwalForm.kodeJadwal}
                        onChange={e => setJadwalForm({ ...jadwalForm, kodeJadwal: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Pilih Kapal Bertugas:</label>
                      <select
                        value={jadwalForm.kapalId}
                        onChange={e => setJadwalForm({ ...jadwalForm, kapalId: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="">-- Pilih Kapal --</option>
                        {kapalList.map(k => (
                          <option key={k.id} value={k.id}>{k.namaKapal} ({k.tipe})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Pelabuhan Asal:</label>
                      <input
                        type="text"
                        value={jadwalForm.pelabuhanAsal}
                        onChange={e => setJadwalForm({ ...jadwalForm, pelabuhanAsal: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Pelabuhan Tujuan:</label>
                      <input
                        type="text"
                        value={jadwalForm.pelabuhanTujuan}
                        onChange={e => setJadwalForm({ ...jadwalForm, pelabuhanTujuan: e.target.value })}
                        required
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Waktu Keberangkatan:</label>
                      <input
                        type="text"
                        value={jadwalForm.waktuKeberangkatan}
                        onChange={e => setJadwalForm({ ...jadwalForm, waktuKeberangkatan: e.target.value })}
                        required
                        placeholder="YYYY-MM-DD HH:mm"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Estimasi Tiba (ETA):</label>
                      <input
                        type="text"
                        value={jadwalForm.waktuKedatanganEstimasi}
                        onChange={e => setJadwalForm({ ...jadwalForm, waktuKedatanganEstimasi: e.target.value })}
                        required
                        placeholder="YYYY-MM-DD HH:mm"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Dermaga Sandar:</label>
                      <select
                        value={jadwalForm.dermagaId}
                        onChange={e => setJadwalForm({ ...jadwalForm, dermagaId: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="">-- Pilih Dermaga --</option>
                        {dermagaList.map(d => (
                          <option key={d.id} value={d.id}>{d.namaDermaga} ({d.namaPelabuhan})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Status Keberangkatan:</label>
                      <select
                        value={jadwalForm.status}
                        onChange={e => setJadwalForm({ ...jadwalForm, status: e.target.value as StatusJadwal })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="On Time">On Time</option>
                        <option value="Boarding">Boarding</option>
                        <option value="Berlayar">Berlayar</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  id="save-master-btn"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Data</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
