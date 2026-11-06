import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ShieldCheck, CheckCircle2, Code2, Users, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'PF';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white text-black font-bold flex items-center justify-center text-sm tracking-wider">
            PF
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">PeerForge</span>
          <span className="ml-2 text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            Phase 1 Active
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
            <div className="w-6 h-6 rounded-full bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center">
              {getInitials(user?.name)}
            </div>
            <span className="text-xs text-neutral-300 font-medium hidden sm:inline">
              {user?.name || 'Developer'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800/80 transition-all border border-neutral-800"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-10 flex flex-col gap-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Authenticated Session Verified
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {user?.name || 'Developer'}
            </h1>
            <p className="text-neutral-400 text-sm max-w-xl">
              Your account has been initialized and secured with HTTP-only JWT authentication. You are ready for peer mock interviews.
            </p>
          </div>
          {/* Subtle gradient accent */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* User Profile Card & Phase Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white text-lg font-bold">
                  {getInitials(user?.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">{user?.name}</h3>
                  <p className="text-xs text-neutral-400">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>User ID:</span>
                  <span className="font-mono text-neutral-300">{user?.id?.slice(-8) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Role:</span>
                  <span className="text-neutral-300">Developer</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Zone:</span>
                  <span className="text-neutral-300">{user?.profile?.timeZone || 'UTC'}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-800/80">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Auth Verification: Active
              </span>
            </div>
          </div>

          {/* Phase 2 Teaser: Profiles */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/20 p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-300 mb-4">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-white text-base mb-1">Developer Profile</h3>
              <p className="text-xs text-neutral-400">
                Phase 2 deliverable: Add primary tech stacks, target company tiers, and scheduling preferences.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/50 text-xs text-neutral-500">
              Phase 2: Up Next
            </div>
          </div>

          {/* Phase 3 Teaser: Matchmaking */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/20 p-6 flex flex-col justify-between opacity-80 hover:opacity-100 transition-opacity">
            <div>
              <div className="w-10 h-10 rounded-xl bg-neutral-800/80 flex items-center justify-center text-neutral-300 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-medium text-white text-base mb-1">Mock Interview Match</h3>
              <p className="text-xs text-neutral-400">
                Phase 3 &amp; 4 deliverable: Queue up for instant DSA / Frontend pairing and collaborative live coding.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-800/50 text-xs text-neutral-500">
              Phase 3 &amp; 4: Coming Soon
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
