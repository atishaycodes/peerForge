import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import SkillTagInput from '../components/profile/SkillTagInput.jsx';
import TimezoneSelect from '../components/profile/TimezoneSelect.jsx';
import AvailabilityToggle from '../components/profile/AvailabilityToggle.jsx';

const TARGET_ROLE_OPTIONS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Mobile',
  'DevOps / Cloud',
  'Systems',
  'AI / ML',
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: '',
    avatarUrl: '',
    targetRoles: [],
    skills: [],
    timeZone: 'UTC',
    availability: {
      isSearching: true,
      preferredWindows: ['Weekday Evenings', 'Weekends'],
    },
  });

  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Populate form with user profile on mount
  useEffect(() => {
    if (user?.profile) {
      setFormData({
        bio: user.profile.bio || '',
        avatarUrl: user.profile.avatarUrl || '',
        targetRoles: user.profile.targetRoles || [],
        skills: user.profile.skills || [],
        timeZone: user.profile.timeZone || 'UTC',
        availability: user.profile.availability || {
          isSearching: true,
          preferredWindows: ['Weekday Evenings', 'Weekends'],
        },
      });
      setAvatarLoadError(false);
    }
  }, [user]);

  const handleToggleRole = (role) => {
    setFormData((prev) => {
      const exists = prev.targetRoles.includes(role);
      return {
        ...prev,
        targetRoles: exists
          ? prev.targetRoles.filter((r) => r !== role)
          : [...prev.targetRoles, role],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSuccessMessage('Profile preferences saved successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(res.error || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800">
      {/* Top Header */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-sm tracking-tight text-white">PeerForge</span>
          <span className="text-neutral-600 text-xs">/</span>
          <span className="text-xs text-neutral-400 font-normal">Profile Preferences</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            {user?.email}
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 sm:p-8 flex flex-col gap-6">
        {/* Page Context Header */}
        <div className="pb-2 border-b border-neutral-900">
          <h1 className="text-xl font-semibold tracking-tight text-white">
            Developer Profile &amp; Preferences
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure your technical focus, target interview roles, and availability for peer matching
          </p>
        </div>

        {/* Feedback Notifications */}
        {successMessage && (
          <div className="p-3 rounded-md bg-emerald-950/40 border border-emerald-800/80 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-md bg-red-950/40 border border-red-800/80 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Identity & Avatar */}
          <section className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <h2 className="text-sm font-medium text-white flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-400" />
              Identity
            </h2>

            <div className="flex items-start gap-4">
              {/* Avatar Preview */}
              <div className="w-14 h-14 rounded-lg bg-neutral-800 border border-neutral-700/80 flex items-center justify-center overflow-hidden shrink-0">
                {formData.avatarUrl && !avatarLoadError ? (
                  <img
                    src={formData.avatarUrl}
                    alt={user?.name || 'Developer Avatar'}
                    onError={() => setAvatarLoadError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-semibold font-mono text-neutral-200">
                    {getInitials(user?.name)}
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="block text-xs font-medium text-neutral-400">
                  Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.avatarUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, avatarUrl: e.target.value });
                    setAvatarLoadError(false);
                  }}
                  placeholder="https://github.com/your-username.png"
                  className="w-full px-3 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition-colors"
                />
                <p className="text-[11px] text-neutral-500">
                  Leave blank to use your generated initials badge. Supports GitHub or Gravatar image URLs.
                </p>
              </div>
            </div>

            {/* Bio Field with character counter */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-800/60">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-neutral-400">
                  Short Bio
                </label>
                <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                  {formData.bio.length} / 300
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Software engineer interested in backend architecture and distributed systems..."
                className="w-full px-3 py-2 rounded-md bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition-colors resize-none"
              />
            </div>
          </section>

          {/* Section 2: Target Roles */}
          <section className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
            <div>
              <h2 className="text-sm font-medium text-white mb-0.5">
                Target Interview Roles
              </h2>
              <p className="text-[11px] text-neutral-400">
                Select the engineering tracks you want to practice for (multi-select)
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TARGET_ROLE_OPTIONS.map((role) => {
                const isSelected = formData.targetRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleToggleRole(role)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-neutral-100 text-neutral-900 border-neutral-100 font-semibold'
                        : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Technical Skills */}
          <section className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-3">
            <div>
              <h2 className="text-sm font-medium text-white mb-0.5">
                Primary Tech Stack &amp; Skills
              </h2>
              <p className="text-[11px] text-neutral-400">
                Languages, frameworks, and topics you want to interview on or be interviewed with
              </p>
            </div>

            <SkillTagInput
              value={formData.skills}
              onChange={(nextSkills) => setFormData({ ...formData, skills: nextSkills })}
            />
          </section>

          {/* Section 4: Timezone & Availability */}
          <section className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-4">
            <div>
              <h2 className="text-sm font-medium text-white mb-0.5">
                Availability &amp; Timezone
              </h2>
              <p className="text-[11px] text-neutral-400">
                Set when you are available for live peer interview matching
              </p>
            </div>

            <TimezoneSelect
              value={formData.timeZone}
              onChange={(tz) => setFormData({ ...formData, timeZone: tz })}
            />

            <div className="pt-2 border-t border-neutral-800/60">
              <AvailabilityToggle
                value={formData.availability}
                onChange={(avail) => setFormData({ ...formData, availability: avail })}
              />
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-md text-xs font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-neutral-900 font-medium text-xs transition-colors cursor-pointer disabled:opacity-60 flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving changes...</span>
                </>
              ) : (
                <span>Save Profile</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
