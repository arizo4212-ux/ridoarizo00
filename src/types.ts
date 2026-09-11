export type DatabaseProvider = 'local' | 'supabase' | 'neon' | 'firebase';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  isConnected: boolean;
  lastSync?: string;
  latencyMs?: number;
  supabase?: {
    url: string;
    anonKey: string;
    tableNamePrefix?: string;
  };
  neon?: {
    connectionString: string;
    endpointUrl: string;
  };
  firebase?: {
    projectId: string;
    apiKey: string;
    databaseId?: string;
  };
}

export type UserRole = 'admin' | 'petugas' | 'operator' | 'nakhoda' | 'syahbandar' | 'kasir';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  password?: string;
}

export type StatusKapal = 'Berlayar' | 'Sandar' | 'Docking' | 'Perbaikan' | 'Menunggu';
export type TipeKapal = 'Ferry RORO' | 'Kapal Penumpang (Pelni)' | 'Cargo Kontainer' | 'Speedboat Eksekutif' | 'Tongkang / LCT';

export interface Kapal {
  id: string;
  kodeKapal: string;
  namaKapal: string;
  tipe: TipeKapal;
  kapasitasPenumpang: number; // Pax
  kapasitasMuatanTon: number; // Ton
  panjangMeter: number;
  lebarMeter: number;
  draftMeter: number;
  kecepatanMaksKnot: number;
  status: StatusKapal;
  tahunPembuatan: number;
  posisiDermaga?: string;
  fotoUrl?: string;
}

export interface Dermaga {
  id: string;
  kodeDermaga: string;
  namaPelabuhan: string;
  namaDermaga: string;
  kedalamanDraftMeter: number;
  kapasitasMaksTon: number;
  statusOperasional: 'Aktif' | 'Perawatan' | 'Penuh';
  lokasiKota: string;
}

export type KategoriTarif = 'Penumpang' | 'Kendaraan' | 'Kargo';

export interface TarifGolongan {
  id: string;
  kode: string;
  kategori: KategoriTarif;
  namaGolongan: string;
  deskripsi: string;
  tarifDasar: number; // IDR
  asuransi: number; // IDR
  totalTarif: number; // IDR
  satuan: string; // 'Orang', 'Unit', 'Ton', 'M3'
}

export type StatusJadwal = 'On Time' | 'Delayed' | 'Boarding' | 'Berlayar' | 'Selesai';

export interface JadwalPelayaran {
  id: string;
  kodeJadwal: string;
  kapalId: string;
  namaKapal: string;
  pelabuhanAsal: string;
  pelabuhanTujuan: string;
  dermagaId: string;
  namaDermaga: string;
  waktuKeberangkatan: string; // ISO string or format YYYY-MM-DD HH:mm
  waktuKedatanganEstimasi: string;
  status: StatusJadwal;
  keterangan?: string;
}

export type StatusTiket = 'Issued' | 'Boarded' | 'Cancelled';

export interface TiketPenumpang {
  id: string;
  nomorTiket: string;
  jadwalId: string;
  kapalId: string;
  namaPenumpang: string;
  identitasNo: string; // KTP / Paspor
  jenisKelamin: 'L' | 'P';
  usia: number;
  tarifGolonganId: string;
  namaGolongan: string;
  kelasLayanan: 'Ekonomi' | 'Bisnis' | 'VIP';
  nomorKursiDek: string;
  totalBiaya: number;
  status: StatusTiket;
  waktuBooking: string;
  waktuBoarding?: string;
  nomorTelepon: string;
}

export type StatusMuatan = 'Terdaftar' | 'Timbang' | 'Loading' | 'Onboard' | 'Discharged';

export interface ManifestMuatan {
  id: string;
  nomorManifest: string;
  jadwalId: string;
  kapalId: string;
  tipeMuatan: 'Kendaraan' | 'Logistik Curah' | 'Kontainer' | 'General Cargo';
  tarifGolonganId: string;
  namaGolongan: string;
  nomorPolisiKontainer: string;
  namaPengirim: string;
  namaPenerima: string;
  deskripsiBarang: string;
  beratKotorKg: number; // Kg
  beratNettoKg: number;
  dimensiM3?: number;
  isDangerousGoods: boolean; // Barang Berbahaya (B3)
  posisiDek: string; // e.g. "Dek Bawah - Slot A-04"
  status: StatusMuatan;
  totalBiaya: number;
  waktuInput: string;
}

export interface PortOperationalSummary {
  totalKapal: number;
  kapalAktif: number;
  totalPenumpangHariIni: number;
  totalMuatanHariIniTon: number;
  totalPendapatanHariIni: number;
  rataOkupansiPersen: number;
}
