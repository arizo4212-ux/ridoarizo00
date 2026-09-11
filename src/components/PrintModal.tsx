import React from 'react';
import { X, Printer, QrCode, Ship, Anchor, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TiketPenumpang, ManifestMuatan, Kapal, JadwalPelayaran } from '../types';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ticket' | 'cargo';
  tiketData?: TiketPenumpang | null;
  cargoData?: ManifestMuatan | null;
  kapalData?: Kapal | null;
  jadwalData?: JadwalPelayaran | null;
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  type,
  tiketData,
  cargoData,
  kapalData,
  jadwalData
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden my-6 border border-slate-300 font-sans">
        
        {/* Action Header (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2 text-sm font-bold">
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Pratinjau Cetak {type === 'ticket' ? 'Boarding Pass Penumpang' : 'Dokumen Manifest Muatan'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-bold rounded-lg shadow transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-8 space-y-6">
          
          {/* TICKET / BOARDING PASS DESIGN */}
          {type === 'ticket' && tiketData && (
            <div className="border-2 border-dashed border-slate-400 rounded-2xl p-6 bg-gradient-to-r from-blue-50/50 via-white to-cyan-50/50 relative overflow-hidden shadow-inner">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-900 text-white rounded-xl">
                    <Ship className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-blue-950 uppercase">
                      BOARDING PASS PENYEBERANGAN LAUT
                    </h2>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      SIMPEL-KAPAL &bull; ASURANSI JASA RAHARJA TERLINDUNGI
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">NOMOR TIKET</span>
                  <span className="text-sm font-black font-mono text-blue-900">{tiketData.nomorTiket}</span>
                </div>
              </div>

              {/* Body Info Grid */}
              <div className="grid grid-cols-3 gap-4 my-5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Nama Penumpang</span>
                  <span className="text-sm font-black text-slate-900">{tiketData.namaPenumpang}</span>
                  <span className="text-[11px] text-slate-500 block font-mono">NIK: {tiketData.identitasNo}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Kapal & Kelas</span>
                  <span className="text-sm font-bold text-slate-900">{kapalData?.namaKapal || 'KMP Portlink III'}</span>
                  <span className="text-[11px] text-blue-800 font-semibold block">{tiketData.kelasLayanan} &bull; {tiketData.namaGolongan}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Dek / Kursi</span>
                  <span className="text-base font-black text-cyan-800 font-mono">{tiketData.nomorKursiDek}</span>
                </div>
              </div>

              {/* Route & Schedule */}
              <div className="bg-slate-100 rounded-xl p-3.5 grid grid-cols-3 gap-2 text-xs border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold">Pelabuhan Keberangkatan:</span>
                  <span className="font-bold text-slate-900">Pelabuhan Merak, Banten</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold">Pelabuhan Kedatangan:</span>
                  <span className="font-bold text-slate-900">Pelabuhan Bakauheni, Lampung</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-bold">Total Biaya:</span>
                  <span className="font-bold font-mono text-emerald-700 text-sm">Rp {tiketData.totalBiaya.toLocaleString()}</span>
                </div>
              </div>

              {/* QR Code & Barcode Section */}
              <div className="mt-5 pt-4 border-t border-slate-300 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 border border-slate-300 rounded-lg bg-white shadow-sm">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <span className="font-bold text-slate-800 block">Validasi Gate Elektronik</span>
                    <span>Tunjukkan kode QR ini ke scanner gate dermaga sebelum naik ke kapal.</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold ${
                    tiketData.status === 'Boarded' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{tiketData.status === 'Boarded' ? 'BOARDED' : 'VALID / UNBOARDED'}</span>
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* CARGO MANIFEST DESIGN */}
          {type === 'cargo' && cargoData && (
            <div className="border-2 border-slate-400 rounded-2xl p-6 bg-slate-50 relative overflow-hidden shadow-inner">
              
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                    <Anchor className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                      MANIFEST MUATAN & KENDARAAN KAPAL
                    </h2>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      SURAT JALAN ANGKUTAN PENYEBERANGAN LAUT RESMI
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">NOMOR MANIFEST</span>
                  <span className="text-sm font-black font-mono text-amber-700">{cargoData.nomorManifest}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 my-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">No Polisi / Kontainer</span>
                  <span className="text-base font-black text-slate-900 font-mono">{cargoData.nomorPolisiKontainer}</span>
                  <span className="text-[11px] text-slate-600 block">{cargoData.namaGolongan}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Armada Kapal & Posisi</span>
                  <span className="text-sm font-bold text-slate-900">{kapalData?.namaKapal || 'KMP Portlink III'}</span>
                  <span className="text-[11px] text-blue-800 font-mono block">{cargoData.posisiDek}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Hasil Timbang (Gross)</span>
                  <span className="text-base font-black text-amber-700 font-mono">
                    {(cargoData.beratKotorKg / 1000).toFixed(2)} Ton
                  </span>
                  <span className="text-[11px] text-slate-500 block font-mono">{cargoData.beratKotorKg.toLocaleString()} Kg</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-300 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Pengirim (Consignor):</span>
                    <span className="font-bold text-slate-900">{cargoData.namaPengirim}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Penerima (Consignee):</span>
                    <span className="font-bold text-slate-900">{cargoData.namaPenerima}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Uraian / Deskripsi Muatan:</span>
                  <span className="text-slate-800 font-medium">{cargoData.deskripsiBarang || 'Muatan Umum'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Telah melalui jembatan timbang resmi & laik muat di car deck.</span>
                </div>
                <div className="font-mono font-bold text-emerald-800 text-sm">
                  Tarif: Rp {cargoData.totalBiaya.toLocaleString()}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
