import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import MatchmakingQuickCard from '@/components/dashboard/MatchmakingQuickCard';
import PerformanceSummaryCard from '@/components/dashboard/PerformanceSummaryCard';
import SessionHistoryTable from '@/components/dashboard/SessionHistoryTable';
import SessionDetailDrawer from '@/components/dashboard/SessionDetailDrawer';
import UpcomingSessionsList from '@/components/dashboard/UpcomingSessionsList';
import MatchAcceptModal from '@/components/lobby/MatchAcceptModal';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchData = async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setLoading(true);

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  return (
    <DashboardLayout
      title="Developer Workspace"
      onRefresh={() => fetchData(true)}
      isRefreshing={isRefreshing}
    >
      {/* Global Match Notification Modal */}
      <MatchAcceptModal />

      {/* Profile Setup / Completion Banner */}
      <ProfileCompletionCard user={user} />

      {/* Top 3 Column Overview: Identity, Live Matchmaking, Skill Competencies */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Developer Identity Card */}
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-white text-sm font-semibold font-mono overflow-hidden shrink-0">
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
                <h2 className="text-sm font-semibold text-white truncate">{user?.name}</h2>
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
                  {targetRoles.length > 2 && (
                    <span className="text-[10px] text-neutral-500 font-mono">
                      +{targetRoles.length - 2}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Time Zone</span>
                <span className="text-neutral-300 font-mono text-[11px] truncate max-w-[140px]">
                  {timeZone}
                </span>
              </div>

              <div className="flex justify-between items-center text-neutral-400">
                <span>Primary Skills</span>
                <span className="text-neutral-300 font-mono text-[11px] truncate max-w-[140px]">
                  {skills.length > 0 ? skills.slice(0, 3).join(', ') : 'None added'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
            <span>Availability Status</span>
            <span
              className={`font-medium inline-flex items-center gap-1 ${
                isSearching ? 'text-emerald-400' : 'text-neutral-500'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              {isSearching ? 'Match Active' : 'Away'}
            </span>
          </div>
        </div>

        {/* 2. Interactive Matchmaking Quick Card */}
        <MatchmakingQuickCard />

        {/* 3. Skill Competencies & Performance Summary */}
        <PerformanceSummaryCard analytics={analytics} loading={loading} />
      </div>

      {/* Middle: Upcoming and Active Interview Sessions */}
      <UpcomingSessionsList upcoming={upcoming} loading={loading} />

      {/* Bottom: Past Interview History Table */}
      <SessionHistoryTable
        sessions={history}
        loading={loading}
        onSelectSession={(session) => setSelectedSession(session)}
      />

      {/* Slide-over Scorecard Drawer */}
      <SessionDetailDrawer
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        currentUser={user}
      />
    </DashboardLayout>
  );
}
