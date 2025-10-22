'use client';
import { useAuth } from '@/hooks/useAuth';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';

export default function AuthStatus() {
  const { isAuthenticated, isConfigured, user } = useAuth();

  if (!isConfigured) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-900/30 border border-yellow-700 rounded-lg">
        <ShieldX size={14} className="text-yellow-400" />
        <span className="text-xs text-yellow-300">Demo Mode</span>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-700 rounded-lg">
        <ShieldCheck size={14} className="text-green-400" />
        <span className="text-xs text-green-300">Authenticated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 border border-gray-600 rounded-lg">
      <Shield size={14} className="text-gray-400" />
      <span className="text-xs text-gray-400">Not signed in</span>
    </div>
  );
}