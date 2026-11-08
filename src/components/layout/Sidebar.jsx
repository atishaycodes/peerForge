import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  User,
  LogOut,
  ShieldCheck,
  Code2,
  Calendar,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const navItems = [
    {
      label: 'Workspace',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Matchmaking Lobby',
      path: '/lobby',
      icon: Users,
    },
    {
      label: 'Developer Profile',
      path: '/profile',
      icon: User,
    },
  ];

  const isSearching = user?.profile?.availability?.isSearching ?? true;

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-neutral-950 border-r border-neutral-800/80 text-neutral-300 font-sans">
      {/* Brand & Section Header */}
      <div>
        <div className="h-14 px-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-white text-black font-mono font-bold flex items-center justify-center text-xs tracking-tight shadow-sm">
              PF
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-white leading-none">
                PeerForge
              </span>
              <span className="text-[10px] text-neutral-500 font-mono mt-0.5">
                v1.0 • developer
              </span>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1">
          <span className="px-3 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
            Navigation
          </span>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose ? onClose : undefined}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white border border-neutral-800 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* User Section & Sign Out */}
      <div className="p-3 border-t border-neutral-800/80 space-y-2">
        <NavLink
          to="/profile"
          onClick={onClose ? onClose : undefined}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-neutral-900/60 border border-transparent hover:border-neutral-800/80 transition-colors group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-neutral-800 border border-neutral-700/80 flex items-center justify-center text-white text-xs font-mono font-semibold overflow-hidden shrink-0">
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
          <div className="overflow-hidden flex-1">
            <div className="text-xs font-medium text-white truncate group-hover:text-neutral-200">
              {user?.name || 'Developer'}
            </div>
            <div className="text-[11px] text-neutral-400 font-mono truncate">
              {user?.email}
            </div>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-neutral-900/50 transition-colors cursor-pointer border border-transparent hover:border-neutral-850"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
