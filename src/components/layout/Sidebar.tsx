import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Globe,
  FolderOpen,
  CreditCard,
  Settings,
  ShieldAlert,
  Sparkles,
  Zap,
  HardDrive,
  Palette
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { usage, user, setIsUpgradeModalOpen, customLogo, setIsLogoModalOpen } = useApp();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/chat', label: 'AI Chat (High Accuracy)', icon: MessageSquare, badge: 'Search' },
    { to: '/image-studio', label: 'Image Studio', icon: ImageIcon },
    { to: '/video-studio', label: 'Video Studio', icon: Video, badge: 'AI' },
    { to: '/community', label: 'Public Gallery', icon: Globe },
    { to: '/library', label: 'Media Library', icon: FolderOpen },
    { to: '/pricing', label: 'Pricing & Plans', icon: CreditCard, pkrBadge: '₨300' },
    { to: '/admin', label: 'Admin Panel', icon: ShieldAlert },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const isFree = usage?.plan === 'free';
  const remaining = usage?.remainingToday ?? 47;
  const limit = usage?.limitToday ?? 50;
  const usedPercent = Math.min(100, Math.round(((usage?.usedToday ?? 3) / limit) * 100));

  const storageUsed = usage?.storageUsedMB ?? 38;
  const storageLimit = usage?.storageLimitMB ?? 500;
  const storagePercent = Math.min(100, Math.round((storageUsed / storageLimit) * 100));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0d0c15] border-r border-purple-900/20 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {/* Logo brand in sidebar for mobile view */}
          <div className="px-3 pb-3 border-b border-zinc-800/60 md:hidden flex items-center justify-between">
            <span className="font-extrabold text-lg text-white">DODO<span className="text-purple-400">.ai</span></span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
              {isFree ? 'FREE PLAN' : 'PREMIUM'}
            </span>
          </div>

          {/* Custom Brand Logo Quick Badge */}
          <div className="p-2.5 rounded-2xl bg-[#110f1c] border border-purple-900/30 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 p-0.5 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#0e0d16] rounded-[6px] flex items-center justify-center overflow-hidden p-0.5">
                  {customLogo ? (
                    <img src={customLogo} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-purple-400 fill-current">
                      <path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-white truncate">
                  {customLogo ? 'Custom Logo' : 'DODO Logo'}
                </p>
                <p className="text-[9px] text-zinc-400 truncate">
                  {customLogo ? 'Active workspace mark' : 'Default brand mark'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="p-1 text-zinc-400 hover:text-purple-300 hover:bg-purple-900/30 rounded-lg transition-colors"
              title="Change logo"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Workspace & Studios
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-900/40 text-purple-200 border border-purple-600/30 shadow-sm shadow-purple-600/20'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                  {item.pkrBadge && isFree && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {item.pkrBadge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Usage & Plan Status Card */}
        <div className="p-3 border-t border-purple-900/20 space-y-3 bg-[#0a0911]">
          {/* Daily Request Allowance Card */}
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-medium">Daily AI Allowance</span>
              <span className="text-purple-300 font-bold">{isFree ? `${remaining} left` : 'Unlimited'}</span>
            </div>

            {/* Progress bar */}
            {isFree ? (
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${100 - usedPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  {usage?.usedToday ?? 3} / 50 requests used today
                </p>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-xs text-purple-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-purple-400 fill-current" />
                <span>Premium Priority Active</span>
              </div>
            )}

            {/* Storage indicator */}
            <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
              <span className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-purple-400" />
                <span>Storage</span>
              </span>
              <span>
                {storageUsed}MB / {storageLimit >= 1024 ? `${(storageLimit / 1024).toFixed(0)}GB` : `${storageLimit}MB`}
              </span>
            </div>
          </div>

          {/* Quick Upgrade Callout if Free */}
          {isFree ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Upgrade (₨300 / mo)</span>
            </button>
          ) : (
            <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-700/30 text-center">
              <span className="text-[11px] text-purple-300 font-medium flex items-center justify-center space-x-1">
                <span>₨300/mo PKR Active Plan</span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
