import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  User,
  ShieldCheck,
  CheckCircle2,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import PerformanceSummaryCard from '../components/dashboard/PerformanceSummaryCard.jsx';
import SessionHistoryTable from '../components/dashboard/SessionHistoryTable.jsx';
import SessionDetailDrawer from '../components/dashboard/SessionDetailDrawer.jsx';
import UpcomingSessionsList from '../components/dashboard/UpcomingSessionsList.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [histRes, anaRes, upcRes] = await Promise.all([
        fetch('/api/sessions/history', { credentials: 'include' }),
        fetch('/api/sessions/analytics', { credentials: 'include' }),
        fetch('/api/sessions/upcoming', { credentials: 'include' }),
      ]);

      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(histData.sessions || []);
      }
      if (anaRes.ok) {
        const anaData = await anaRes.json();
        setAnalytics(anaData.analytics || null);
      }
      if (upcRes.ok) {
        const upcData = await upcRes.json();
        setUpcoming(upcData.upcoming || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const targetRoles = user?.profile?.targetRoles || [];
  const skills = user?.profile?.skills || [];
  const timeZone = user?.profile?.timeZone || 'UTC';
  const isSearching = user?.profile?.availability?.isSearching ?? true;

  // Profile essentials count
  const hasRoles = targetRoles.length > 0;
  const hasSkills = skills.length > 0;
  const hasTimezone = Boolean(timeZone && timeZone !== 'UTC');

  const completedCount = (hasRoles ? 1 : 0) + (hasSkills ? 1 : 0) + (hasTimezone ? 1 : 0);
  const isProfileComplete = completedCount === 3;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800">
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-white text-black font-mono font-semibold flex items-center justify-center text-xs tracking-tight">
            PF
          </div>
          <span className="font-medium text-sm tracking-tight text-white">PeerForge</span>
          <span className="text-neutral-600 text-xs">/</span>
          <span className="text-xs text-neutral-400 font-normal">Workspace</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 transition-colors cursor-pointer"
            title="Edit profile"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSearching ? 'bg-emerald-500' : 'bg-neutral-500'
              }`}
            />
            <span className="font-mono text-neutral-300 text-[11px] hidden sm:inline">
              {user?.email}
            </span>
            <Settings className="w-3 h-3 text-neutral-400" />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-colors duration-150 border border-neutral-800 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col gap-6">
        {/* Page Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-neutral-900">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Developer Workspace
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Account status, past interview feedback scorecards, and live matchmaking queue
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 cursor-pointer transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified
            </span>
          </div>
        </div>

        {/* Non-Blocking Profile Completion Banner */}
        {!isProfileComplete ? (
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {completedCount} of 3 Essentials Set
                </span>
                <span className="text-xs font-medium text-white">Complete Profile for Matching</span>
              </div>
              <p className="text-xs text-neutral-400">
                Add your target roles, primary tech stack, and time zone to unlock peer interview pairing.
              </p>
            </div>

            <button
              onClick={() => navigate('/profile')}
              className="px-3.5 py-2 rounded-md bg-white hover:bg-neutral-200 text-neutral-900 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto shadow-sm active:scale-[0.99]"
            >
              <span>Complete Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-950/60 bg-emerald-950/10 p-3.5 px-4 flex items-center justify-between text-xs text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Profile fully configured &mdash; match ready</span>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs text-emerald-300 hover:text-white underline font-medium cursor-pointer"
            >
              Edit preferences
            </button>
          </div>
        )}

        {/* Top Split: 3 Core Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Identity & Account Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-white text-sm font-semibold font-mono overflow-hidden">
                  {user?.profile?.avatarUrl ? (
                    <img
                      src={user.profile.avatarUrl}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(user?.name)
                  )}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-sm font-medium text-white truncate">{user?.name}</h2>
                  <p className="text-xs text-neutral-400 font-mono truncate">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-neutral-800/80 text-xs">
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Target Roles</span>
                  <div className="text-right flex flex-wrap justify-end gap-1 max-w-[150px]">
                    {targetRoles.length > 0 ? (
                      targetRoles.slice(0, 2).map((r) => (
                        <span
                          key={r}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-mono"
                        >
                          {r}
                        </span>
                      ))
                    ) : (
                      <span className="text-neutral-500 italic">None set</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center text-neutral-400">
                  <span>Time Zone</span>
                  <span className="text-neutral-300 font-mono text-[11px] truncate max-w-[140px]">
                    {timeZone}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span>Matching Status</span>
              <span
                className={`font-medium inline-flex items-center gap-1 ${
                  isSearching ? 'text-emerald-400' : 'text-neutral-500'
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {isSearching ? 'Active' : 'Away'}
              </span>
            </div>
          </div>

          {/* 2. Matchmaking Quick Jump Card */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-neutral-800/80 border border-neutral-700/50 flex items-center justify-center text-white mb-3">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-medium text-white mb-1">Live Matchmaking Lobby</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Queue up for DSA, Frontend Architecture, or Backend System Design peer mocks.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Queue Ready
              </span>
              <button
                onClick={() => navigate('/lobby')}
                className="text-white hover:text-neutral-300 font-medium cursor-pointer flex items-center gap-1"
              >
                <span>Enter Lobby</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. Performance & Competency Summary Card */}
          <PerformanceSummaryCard analytics={analytics} loading={loading} />
        </div>

        {/* Middle Section: Upcoming Scheduled Slots */}
        <UpcomingSessionsList upcoming={upcoming} loading={loading} />

        {/* Bottom Section: Past Session History Table */}
        <SessionHistoryTable
          sessions={history}
          loading={loading}
          onSelectSession={(session) => setSelectedSession(session)}
        />
      </main>

      {/* Slide-over Scorecard Drawer */}
      <SessionDetailDrawer
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        currentUser={user}
      />
    </div>
  );
}
