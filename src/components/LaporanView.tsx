import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Filter, 
  Ship, 
  Calendar, 
  CheckCircle, 
  Anchor, 
  ShieldCheck, 
  Banknote, 
  Users, 
  Truck 
} from 'lucide-react';
import { dbService } from '../services/db';
import { Kapal, JadwalPelayaran, TiketPenumpang, ManifestMuatan } from '../types';

export const LaporanView: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<'manifest_spb' | 'pendapatan' | 'rekap_muatan'>('manifest_spb');
  const [selectedKapalId, setSelectedKapalId] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-11');

  const kapalList = dbService.getKapal();
  const jadwalList = dbService.getJadwal();
  const tiketList = dbService.getTiket();
  const muatanList = dbService.getMuatan();

  // Filter data according to selected ship
  const activeKapal = kapalList.find(k => k.id === selectedKapalId) || kapalList[0];

  const filteredTickets = selectedKapalId === 'all' 
    ? tiketList 
    : tiketList.filter(t => t.kapalId === selectedKapalId);

  const filteredMuatan = selectedKapalId === 'all' 
    ? muatanList 
    : muatanList.filter(m => m.kapalId === selectedKapalId);

  // Financial calculations
  const totalRevPax = filteredTickets.reduce((a, t) => a + Number(t.totalBiaya || 0), 0);
  const totalRevCargo = filteredMuatan.reduce((a, m) => a + Number(m.totalBiaya || 0), 0);
  const totalRevenue = totalRevPax + totalRevCargo;

  const totalPaxCount = filteredTickets.length;
  const totalCargoTon = (filteredMuatan.reduce((a, m) => a + Number(m.beratKotorKg || 0), 0) / 1000).toFixed(2);

  // Export to CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (selectedReport === 'manifest_spb' || selectedReport === 'rekap_muatan') {
      csvContent += "TIPE,NOMOR,NAMA_OR_NOPOL,GOLONGAN,KAPAL,STATUS,BIAYA_IDR\n";
      filteredTickets.forEach(t => {
        csvContent += `PENUMPANG,${t.nomorTiket},"${t.namaPenumpang}","${t.namaGolongan}",${t.kapalId},${t.status},${t.totalBiaya}\n`;
      });
      filteredMuatan.forEach(m => {
        csvContent += `MUATAN,${m.nomorManifest},"${m.nomorPolisiKontainer}","${m.namaGolongan}",${m.kapalId},${m.status},${m.totalBiaya}\n`;
      });
    } else {
      csvContent += "KATEGORI,JUMLAH_TRANSAKSI,SUBTOTAL_IDR\n";
      csvContent += `PENUMPANG,${filteredTickets.length},${totalRevPax}\n`;
      csvContent += `MUATAN_KENDARAAN,${filteredMuatan.length},${totalRevCargo}\n`;
      csvContent += `TOTAL_PENDAPATAN,${filteredTickets.length + filteredMuatan.length},${totalRevenue}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_SimpelKapal_${selectedReport}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls (Hidden during print) */}
      <div className="no-print bg-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
              <span>Laporan Resmi & Rekapitulasi Operasional Kapal</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dokumen resmi manifest keberangkatan kapal (SPB), laporan pendapatan harian, dan statistik muatan pelabuhan
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-600 transition-all cursor-pointer shadow"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Cetak Laporan (Print)</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor CSV / Excel</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800 text-xs">
          
          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Pilih Laporan:</span>
            <select
              value={selectedReport}
              onChange={e => setSelectedReport(e.target.value as any)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="manifest_spb" className="bg-slate-900">1. Manifest Resmi Berlayar (SPB)</option>
              <option value="pendapatan" className="bg-slate-900">2. Laporan Pendapatan Operasional</option>
              <option value="rekap_muatan" className="bg-slate-900">3. Rekapitulasi Muatan & Penumpang</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Ship className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Pilih Kapal:</span>
            <select
              value={selectedKapalId}
              onChange={e => setSelectedKapalId(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">-- Semua Armada Kapal --</option>
              {kapalList.map(k => (
                <option key={k.id} value={k.id} className="bg-slate-900">{k.namaKapal}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer font-mono"
            />
          </div>

        </div>
      </div>

      {/* Printable Paper Document Container */}
      <div className="bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-300 max-w-5xl mx-auto space-y-8 font-sans">
        
        {/* Document Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <Anchor className="w-8 h-8 text-blue-900" />
            <div>
              <h2 className="text-lg font-black tracking-wider text-slate-900 uppercase">
                KEMENTERIAN PERHUBUNGAN REPUBLIK INDONESIA
              </h2>
              <h3 className="text-sm font-bold tracking-wide text-blue-950 uppercase">
                DIREKTORAT JENDERAL PERHUBUNGAN LAUT | KANTOR SYAHBANDAR DAN OTORITAS PELABUHAN
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Sistem Informasi Manajemen Muatan & Manifest Penumpang Terpadu (SIMPEL-KAPAL)
          </p>
          <div className="text-sm font-black uppercase text-blue-900 mt-2 tracking-wide">
            {selectedReport === 'manifest_spb' && 'DAFTAR MANIFEST PENUMPANG & MUATAN KAPAL (PORT CLEARANCE)'}
            {selectedReport === 'pendapatan' && 'LAPORAN REKAPITULASI PENDAPATAN OPERASIONAL TIKET & KARGO'}
            {selectedReport === 'rekap_muatan' && 'REKAPITULASI TONASE MUATAN & KENDARAAN ANGKUTAN PENYEBERANGAN'}
          </div>
        </div>

        {/* Vessel & Voyage Metadata Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs">
          <div>
            <span className="text-slate-500 block">Nama Kapal / Armada:</span>
            <span className="font-bold text-slate-900 text-sm">
              {selectedKapalId === 'all' ? 'Seluruh Armada Pelabuhan' : activeKapal.namaKapal}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Tipe / Kode Panggilan:</span>
            <span className="font-bold text-slate-900">{activeKapal.tipe} ({activeKapal.kodeKapal})</span>
          </div>
          <div>
            <span className="text-slate-500 block">Rute Pelayaran:</span>
            <span className="font-bold text-slate-900">Merak &harr; Bakauheni (Selat Sunda)</span>
          </div>
          <div>
            <span className="text-slate-500 block">Tanggal / Waktu Laporan:</span>
            <span className="font-bold text-slate-900 font-mono">{selectedDate} | 10:00 WIB</span>
          </div>
        </div>

        {/* Section 1: Summary Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-semibold text-blue-800 uppercase block">Total Penumpang Onboard</span>
            <span className="text-2xl font-black text-blue-950">{totalPaxCount} Pax</span>
            <span className="text-[11px] text-blue-700 block mt-0.5">Asuransi Jasa Raharja Tercover</span>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 uppercase block">Total Muatan & Kendaraan</span>
            <span className="text-2xl font-black text-amber-950">{totalCargoTon} Ton</span>
            <span className="text-[11px] text-amber-700 block mt-0.5">{filteredMuatan.length} Unit Kendaraan / Koli</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 uppercase block">Total Nilai Transaksi</span>
            <span className="text-2xl font-black text-emerald-950">Rp {totalRevenue.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-700 block mt-0.5">Pendapatan Jasa Kepelabuhanan</span>
          </div>
        </div>

        {/* Section 2: Manifest Penumpang Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 uppercase flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-800" />
              <span>I. Daftar Manifest Penumpang Kapal ({filteredTickets.length} Jiwa)</span>
            </h4>
          </div>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="px-3 py-2">No</th>
                  <th className="px-3 py-2">No. Tiket</th>
                  <th className="px-3 py-2">Nama Penumpang</th>
                  <th className="px-3 py-2">No. Identitas (NIK)</th>
                  <th className="px-3 py-2">Golongan / Kelas</th>
                  <th className="px-3 py-2">Dek/Kursi</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredTickets.map((t, idx) => (
                  <tr key={t.id}>
                    <td className="px-3 py-2 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold">{t.nomorTiket}</td>
                    <td className="px-3 py-2 font-bold">{t.namaPenumpang}</td>
                    <td className="px-3 py-2 font-mono">{t.identitasNo}</td>
                    <td className="px-3 py-2">{t.namaGolongan} ({t.kelasLayanan})</td>
                    <td className="px-3 py-2 font-mono">{t.nomorKursiDek}</td>
                    <td className="px-3 py-2 text-center font-semibold">
                      {t.status === 'Boarded' ? 'ONBOARD' : 'ISSUED'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Manifest Muatan Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 uppercase flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-amber-800" />
              <span>II. Daftar Manifest Kendaraan & Kargo Kapal ({filteredMuatan.length} Unit)</span>
            </h4>
          </div>
          <div className="overflow-x-auto border border-slate-300 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-200 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="px-3 py-2">No</th>
                  <th className="px-3 py-2">No. Manifest</th>
                  <th className="px-3 py-2">No. Polisi / Kontainer</th>
                  <th className="px-3 py-2">Golongan / Tipe</th>
                  <th className="px-3 py-2 text-right">Berat (Kg)</th>
                  <th className="px-3 py-2">Pengirim / Penerima</th>
                  <th className="px-3 py-2 text-center">Posisi Dek</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {filteredMuatan.map((m, idx) => (
                  <tr key={m.id}>
                    <td className="px-3 py-2 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold">{m.nomorManifest}</td>
                    <td className="px-3 py-2 font-bold">{m.nomorPolisiKontainer}</td>
                    <td className="px-3 py-2">{m.namaGolongan}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold">{m.beratKotorKg.toLocaleString()}</td>
                    <td className="px-3 py-2">{m.namaPengirim} &rarr; {m.namaPenerima}</td>
                    <td className="px-3 py-2 text-center font-mono">{m.posisiDek}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legal Signatures Section */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-8 text-xs text-center text-slate-900">
          <div>
            <p className="font-semibold text-slate-600">Nakhoda Kapal (Master / Capt):</p>
            <div className="h-16 flex items-center justify-center italic text-slate-400">
              (Tanda Tangan Elektronik)
            </div>
            <p className="font-bold underline">Capt. Supriyadi, M.Mar</p>
            <p className="text-[11px] text-slate-500 font-mono">NIP. 19780412 200212 1 002</p>
          </div>

          <div>
            <p className="font-semibold text-slate-600">Petugas Manifest Pelabuhan:</p>
            <div className="h-16 flex items-center justify-center italic text-slate-400">
              (Tanda Tangan Elektronik)
            </div>
            <p className="font-bold underline">Rian Pratama, S.ST</p>
            <p className="text-[11px] text-slate-500 font-mono">NIP. 19890215 201101 1 003</p>
          </div>

          <div>
            <p className="font-semibold text-slate-600">Pejabat Kesyahbandaran (KSOP):</p>
            <div className="h-16 flex items-center justify-center italic text-slate-400">
              (Tanda Tangan & Cap Sah)
            </div>
            <p className="font-bold underline">Drs. H. M. Bambang Irawan, M.Si</p>
            <p className="text-[11px] text-slate-500 font-mono">NIP. 19681120 199303 1 001</p>
          </div>
        </div>

        {/* Footer verification note */}
        <div className="text-[10px] text-center text-slate-500 border-t border-slate-200 pt-3 flex items-center justify-between">
          <span>Dokumen ini dicetak secara sah melalui SIMPEL-KAPAL v2.5 Maritime Port Management System.</span>
          <span className="font-mono">Security Hash: SHA256-PORT-CLEARANCE-2026</span>
        </div>

      </div>

    </div>
  );
};
