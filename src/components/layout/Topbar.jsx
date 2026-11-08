import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  ShieldCheck,
  RefreshCw,
  Settings,
  Circle,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Topbar({ onMenuClick, onRefresh, isRefreshing, title = 'Developer Workspace' }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isSearching = user?.profile?.availability?.isSearching ?? true;

  return (
    <header className="h-14 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Left: Mobile hamburger & breadcrumbs/title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tracking-tight">
            {title}
          </span>
          <span className="hidden sm:inline-block text-neutral-700">/</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400">
            <span className={`w-1.5 h-1.5 rounded-full ${isSearching ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
            {isSearching ? 'Match Active' : 'Away'}
          </span>
        </div>
      </div>

      {/* Right: Actions & User Meta */}
      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-colors cursor-pointer disabled:opacity-60"
            title="Refresh dashboard state"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline text-[11px] font-mono">Refresh</span>
          </button>
        )}

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-colors cursor-pointer"
          title="Account Preferences"
        >
          <Settings className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline text-[11px] font-mono">Preferences</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900/60 border border-neutral-800 text-[11px] font-mono text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Active</span>
        </div>
      </div>
    </header>
  );
}
