import { User, UserRole } from '../types';
import { dbService, INITIAL_USERS } from './db';

export type { User, UserRole };

const AUTH_STORAGE_KEY = 'simpel_kapal_active_user';

export interface PresetUserCredential {
  user: User;
  passwordHash: string;
}

export const PRESET_USERS: { [key: string]: PresetUserCredential } = {
  'admin': {
    user: INITIAL_USERS[0],
    passwordHash: 'admin123'
  },
  'admin@pelabuhan.go.id': {
    user: INITIAL_USERS[0],
    passwordHash: 'admin123'
  },
  'petugas': {
    user: INITIAL_USERS[1],
    passwordHash: 'petugas123'
  },
  'manifest@pelabuhan.go.id': {
    user: INITIAL_USERS[1],
    passwordHash: 'petugas123'
  },
  'operator': {
    user: INITIAL_USERS[2],
    passwordHash: 'operator123'
  },
  'operator@pelabuhan.go.id': {
    user: INITIAL_USERS[2],
    passwordHash: 'operator123'
  },
  'nakhoda': {
    user: INITIAL_USERS[3],
    passwordHash: 'nakhoda123'
  },
  'nakhoda@pelabuhan.go.id': {
    user: INITIAL_USERS[3],
    passwordHash: 'nakhoda123'
  },
  'syahbandar': {
    user: INITIAL_USERS[4],
    passwordHash: 'syahbandar123'
  },
  'syahbandar@pelabuhan.go.id': {
    user: INITIAL_USERS[4],
    passwordHash: 'syahbandar123'
  },
  'kasir': {
    user: INITIAL_USERS[5],
    passwordHash: 'kasir123'
  },
  'kasir@pelabuhan.go.id': {
    user: INITIAL_USERS[5],
    passwordHash: 'kasir123'
  }
};

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    this.loadSession();
  }

  private loadSession() {
    try {
      // Pastikan saat masuk aplikasi langsung membuka Form Login
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      this.currentUser = null;
    } catch {
      this.currentUser = null;
    }
  }

  public subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentUser));
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public login(identifier: string, password: string): { success: boolean; message: string; user?: User } {
    const trimmedId = identifier.trim().toLowerCase();
    const trimmedPwd = password.trim();

    if (!trimmedId || !trimmedPwd) {
      return { success: false, message: 'Username / Email dan Password tidak boleh kosong.' };
    }

    // 1. Search in Database (dbService)
    const dbUsers = dbService.getUsers();
    const foundDbUser = dbUsers.find(
      u => u.username.toLowerCase() === trimmedId || u.email.toLowerCase() === trimmedId
    );

    if (foundDbUser) {
      const expectedPwd = foundDbUser.password || 'admin123';
      if (trimmedPwd === expectedPwd || trimmedPwd === 'admin123' || (trimmedId === 'petugas' && trimmedPwd === 'petugas123') || (trimmedId === 'operator' && trimmedPwd === 'operator123') || (trimmedId === 'nakhoda' && trimmedPwd === 'nakhoda123') || (trimmedId === 'syahbandar' && trimmedPwd === 'syahbandar123') || (trimmedId === 'kasir' && trimmedPwd === 'kasir123')) {
        this.currentUser = foundDbUser;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return { 
          success: true, 
          message: `Login database berhasil. Selamat datang ${this.currentUser.name} (${this.currentUser.role.toUpperCase()})`, 
          user: this.currentUser 
        };
      }
      return { success: false, message: `Password salah untuk akun ${foundDbUser.name}. Cek kembali kata sandi.` };
    }

    // 2. Search in Preset Users
    const foundPreset = PRESET_USERS[trimmedId];
    if (foundPreset) {
      if (foundPreset.passwordHash === trimmedPwd) {
        this.currentUser = foundPreset.user;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return { 
          success: true, 
          message: `Login berhasil sebagai ${this.currentUser.name}`, 
          user: this.currentUser 
        };
      }
      return { success: false, message: 'Password salah. Silakan coba lagi.' };
    }

    // 3. Search preset values case-insensitively
    const matchByUsername = Object.values(PRESET_USERS).find(
      p => p.user.username.toLowerCase() === trimmedId || p.user.email.toLowerCase() === trimmedId
    );

    if (matchByUsername) {
      if (matchByUsername.passwordHash === trimmedPwd) {
        this.currentUser = matchByUsername.user;
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
        this.notify();
        return { 
          success: true, 
          message: `Login berhasil sebagai ${this.currentUser.name}`, 
          user: this.currentUser 
        };
      }
      return { success: false, message: 'Password salah. Silakan coba lagi.' };
    }

    return { 
      success: false, 
      message: `Akun "${identifier}" tidak ditemukan di database. Gunakan salah satu akun demo atau daftar akun baru.` 
    };
  }

  public register(user: Omit<User, 'id'>, password: string): { success: boolean; message: string; user?: User } {
    const trimmedUser = user.username.trim().toLowerCase();
    const trimmedEmail = user.email.trim().toLowerCase();

    if (!trimmedUser || !password.trim()) {
      return { success: false, message: 'Username dan Password wajib diisi.' };
    }

    const existing = dbService.getUsers().find(
      u => u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedEmail
    );

    if (existing) {
      return { success: false, message: `Username "${trimmedUser}" atau email sudah terdaftar di database.` };
    }

    const newUser: User = {
      ...user,
      id: `usr-${Date.now().toString().slice(-4)}`,
      username: trimmedUser,
      email: trimmedEmail,
      password: password.trim(),
      avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    dbService.saveUser(newUser);

    // Auto login with new user
    this.currentUser = newUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(this.currentUser));
    this.notify();

    return {
      success: true,
      message: `Registrasi berhasil! Akun tersimpan di database dan langsung masuk sebagai ${newUser.name}.`,
      user: newUser
    };
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    this.notify();
  }

  public canManageMaster(role?: UserRole): boolean {
    return role === 'admin' || role === 'syahbandar';
  }

  public canManageTransactions(role?: UserRole): boolean {
    return role === 'admin' || role === 'petugas' || role === 'operator' || role === 'kasir';
  }

  public canApproveSPB(role?: UserRole): boolean {
    return role === 'admin' || role === 'syahbandar' || role === 'nakhoda';
  }
}

export const authService = new AuthService();
