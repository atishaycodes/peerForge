import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  Play,
  Copy,
  Check,
  Link as LinkIcon,
  Code2,
  Layers,
  Server,
  Sparkles,
} from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MatchAcceptModal from '@/components/lobby/MatchAcceptModal';

const TRACKS = [
  {
    id: 'Data Structures & Algorithms (DSA)',
    name: 'Data Structures & Algorithms',
    short: 'DSA',
    desc: 'Arrays, Trees, Dynamic Programming, Graphs & Complexity analysis',
    icon: Code2,
  },
  {
    id: 'Frontend Web Architecture',
    name: 'Frontend Web Architecture',
    short: 'Frontend',
    desc: 'React, State management, DOM performance & Component architecture',
    icon: Layers,
  },
  {
    id: 'Backend & System Design',
    name: 'Backend & System Design',
    short: 'Backend',
    desc: 'Distributed systems, API scalability, Databases & Microservices',
    icon: Server,
  },
];

const DIFFICULTIES = ['Junior / Entry', 'Mid-Level', 'Senior / Staff'];

export default function Lobby() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    inQueue,
    queueData,
    elapsedSeconds,
    joinQueue,
    leaveQueue,
    createDirectInvite,
  } = useSocket();

  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0].id);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Mid-Level');
  const [directLink, setDirectLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartSearch = () => {
    joinQueue({
      track: selectedTrack,
      difficulty: selectedDifficulty,
    });
  };

  const handleCancelSearch = () => {
    leaveQueue();
  };

  const handleGenerateDirectLink = async () => {
    try {
      setIsGeneratingLink(true);
      const res = await createDirectInvite({
        track: selectedTrack,
        difficulty: selectedDifficulty,
      });

      const fullUrl = `${window.location.origin}/room/${res.roomId}`;
      setDirectLink(fullUrl);
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to generate invite:', err);
    } finally {
      setIsGeneratingLink(false);
    }
  };

  return (
    <DashboardLayout title="Matchmaking">
      {/* Match Acceptance Modal when peer found */}
      <MatchAcceptModal />

      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="pb-2 border-b border-neutral-900">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Interview Matchmaking
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure your technical discipline and target level to pair with a peer in real time
          </p>
        </div>

        {/* Live Queue Status Banner (active only when user joins queue) */}
        {inQueue && (
          <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Search className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Searching for an active partner...</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-950 text-emerald-400 border border-emerald-500/30">
                    {formatTimer(elapsedSeconds)}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                  {queueData?.track} &bull; {queueData?.difficulty}
                </p>
                {elapsedSeconds >= 45 && (
                  <p className="text-[11px] text-amber-400 mt-1">
                    Matching relaxed across difficulties for faster pairing.
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelSearch}
              className="px-4 py-2 rounded-md bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-xs font-medium text-neutral-200 hover:text-white transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5 text-neutral-400" />
              <span>Cancel Search</span>
            </button>
          </div>
        )}

        {/* Track Selection Section */}
        <section className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
            1. Select Interview Track
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {TRACKS.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTrack === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={inQueue}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-neutral-900 border-neutral-100 shadow-sm'
                      : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700 disabled:opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isSelected
                            ? 'bg-white text-black'
                            : 'bg-neutral-800 text-neutral-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <h3 className="text-xs font-semibold text-white mb-1">{t.name}</h3>
                    <p className="text-[11px] text-neutral-400 leading-relaxed">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Difficulty Selection Section */}
        <section className="space-y-3">
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider font-mono">
            2. Select Difficulty Tier
          </label>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  disabled={inQueue}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-black border-white font-semibold'
                      : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white disabled:opacity-60'
                  }`}
                >
                  {diff}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Panel: Queue CTA */}
        <section className="p-6 rounded-xl border border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Start Practice Session
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Pairs you with a developer for a 60-minute interview (30 min interviewer, 30 min candidate).
            </p>
          </div>

          {!inQueue ? (
            <button
              type="button"
              onClick={handleStartSearch}
              className="px-5 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 shadow-sm active:scale-[0.99]"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Join Matchmaking Queue</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelSearch}
              className="px-5 py-2.5 rounded-md bg-neutral-800 hover:bg-neutral-750 text-white font-medium text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 border border-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel Search</span>
            </button>
          )}
        </section>

        {/* Direct Session Invite Panel */}
        <section className="p-5 rounded-xl border border-neutral-800/80 bg-neutral-900/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />
                Practice Privately with a Colleague
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Generate a direct room link for {selectedTrack} ({selectedDifficulty}) to share directly.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateDirectLink}
              disabled={isGeneratingLink}
              className="px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Generate Direct Link</span>
                </>
              )}
            </button>
          </div>

          {directLink && (
            <div className="p-2.5 rounded-md bg-neutral-950 border border-neutral-800/80 font-mono text-xs text-neutral-300 select-all truncate">
              {directLink}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
