import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Code2, Users, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function InterviewRoom() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800">
      {/* Top Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Leave Room"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-sm tracking-tight text-white">PeerForge</span>
          <span className="text-neutral-600 text-xs">/</span>
          <span className="text-xs text-neutral-400 font-mono">Room: {roomId}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Match Connected
          </span>
        </div>
      </header>

      {/* Main Room Preview Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white mb-2">
          <Video className="w-8 h-8 text-neutral-400" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Interview Session Staged
          </h1>
          <p className="text-xs text-neutral-400 leading-relaxed font-mono">
            Room ID: {roomId}
          </p>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Phase 3 match confirmation is verified. Live WebRTC video, synchronized Monaco code editor, and role switcher are scheduled for Phase 4.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/lobby')}
            className="px-4 py-2 rounded-md bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-medium text-neutral-300 transition-colors cursor-pointer"
          >
            Return to Lobby
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}
