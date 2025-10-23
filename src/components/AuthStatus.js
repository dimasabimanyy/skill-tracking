'use client';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';

export default function AuthStatus() {
  const { isAuthenticated, isConfigured, user } = useAuth();
  const { theme } = useTheme();

  if (!isConfigured) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
        theme === 'light'
          ? 'bg-yellow-100 border border-yellow-300'
          : 'bg-yellow-900/30 border border-yellow-700'
      }`}>
        <ShieldX size={14} className={theme === 'light' ? 'text-yellow-700' : 'text-yellow-400'} />
        <span className={`text-xs ${theme === 'light' ? 'text-yellow-800' : 'text-yellow-300'}`}>Demo Mode</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
        theme === 'light'
          ? 'bg-green-100 border border-green-300'
          : 'bg-green-900/30 border border-green-700'
      }`}>
        <ShieldCheck size={14} className={theme === 'light' ? 'text-green-700' : 'text-green-400'} />
        <span className={`text-xs ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Authenticated</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
      theme === 'light'
        ? 'bg-gray-100 border border-gray-300'
        : 'bg-gray-800 border border-gray-600'
    }`}>
      <Shield size={14} className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'} />
      <span className={`text-xs ${theme === 'light' ? 'text-gray-700' : 'text-gray-400'}`}>Not signed in</span>
    </div>
  );
}