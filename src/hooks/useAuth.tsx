'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, StoredUser } from '@/types/user';

const USERS_KEY = 'poly-users';
const AUTH_KEY = 'poly-auth';

const DEFAULT_USER: StoredUser = {
  id: 'test-001',
  name: 'Nguyễn Văn Test',
  email: 'test',
  phone: '0901234567',
  password: '123',
  createdAt: '2025-01-01',
};

function getUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(USERS_KEY);
  let users: StoredUser[] = raw ? JSON.parse(raw) : [];
  // Always ensure default test user exists
  if (!users.find((u) => u.id === DEFAULT_USER.id)) {
    users = [DEFAULT_USER, ...users.filter((u) => u.email !== 'test@polystore.vn')];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  // Update default user credentials if changed
  const testUser = users.find((u) => u.id === DEFAULT_USER.id);
  if (testUser && (testUser.email !== DEFAULT_USER.email || testUser.password !== DEFAULT_USER.password)) {
    users = users.map((u) => u.id === DEFAULT_USER.id ? DEFAULT_USER : u);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return users;
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getAuth(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveAuth(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function toPublicUser(u: StoredUser): User {
  return { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { name: string; email: string; phone: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: { name: string; phone: string }) => void;
  changePassword: (oldPw: string, newPw: string) => { ok: boolean; error?: string };
}

const noop = () => ({ ok: false, error: '' });
const defaultCtx: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => ({ ok: false, error: '' }),
  register: () => ({ ok: false, error: '' }),
  logout: () => {},
  updateProfile: () => {},
  changePassword: () => ({ ok: false, error: '' }),
};

const AuthContext = createContext<AuthContextType>(defaultCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getAuth());
    getUsers(); // seed default user if needed
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Email hoặc mật khẩu không đúng' };
    const pub = toPublicUser(found);
    setUser(pub);
    saveAuth(pub);
    return { ok: true };
  }, []);

  const register = useCallback((data: { name: string; email: string; phone: string; password: string }) => {
    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'Email đã được sử dụng' };
    }
    const newUser: StoredUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      createdAt: new Date().toISOString().split('T')[0],
    };
    saveUsers([...users, newUser]);
    const pub = toPublicUser(newUser);
    setUser(pub);
    saveAuth(pub);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    saveAuth(null);
  }, []);

  const updateProfile = useCallback((data: { name: string; phone: string }) => {
    if (!user) return;
    const users = getUsers();
    const updated = users.map((u) =>
      u.id === user.id ? { ...u, name: data.name, phone: data.phone } : u
    );
    saveUsers(updated);
    const newUser = { ...user, name: data.name, phone: data.phone };
    setUser(newUser);
    saveAuth(newUser);
  }, [user]);

  const changePassword = useCallback((oldPw: string, newPw: string) => {
    if (!user) return { ok: false, error: 'Chưa đăng nhập' };
    const users = getUsers();
    const found = users.find((u) => u.id === user.id);
    if (!found || found.password !== oldPw) return { ok: false, error: 'Mật khẩu cũ không đúng' };
    const updated = users.map((u) => (u.id === user.id ? { ...u, password: newPw } : u));
    saveUsers(updated);
    return { ok: true };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
