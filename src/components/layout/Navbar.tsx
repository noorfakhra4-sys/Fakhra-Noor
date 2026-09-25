import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Zap, Shield, Menu, X, Crown, ChevronRight, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { usage, user, setIsUpgradeModalOpen, customLogo, setIsLogoModalOpen } = useApp();

  const isFree = usage?.plan === 'free';
  const remaining = usage?.remainingToday ?? 47;
  const limit = usage?.limitToday ?? 50;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#0e0d16]/90 backdrop-blur-xl border-b border-purple-900/20 px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Mobile menu toggle + Logo + Quick Logo Customizer */}
      <div className="flex items-center space-x-2 md:space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center space-x-1.5 md:space-x-2">
          <Link to="/" className="flex items-center space-x-2.5 group">
            {/* DODO Avian Icon or Custom Chosen Logo */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0e0d16] rounded-[10px] flex items-center justify-center overflow-hidden p-0.5">
                {customLogo ? (
                  <img
                    src={customLogo}
                    alt="Custom App Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-400 fill-current">
                    <path d="M12 2C7.03 2 3 6.03 3 11c0 3.2 1.68 6 4.2 7.6L6 21l3.5-1.2c.8.14 1.64.2 2.5.2 4.97 0 9-4.03 9-9s-4.03-9-9-9zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" opacity="0"/>
                    {/* Custom stylized DODO bird silhouette */}
                    <path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">DODO<span className="text-purple-400">.ai</span></span>
                {isFree ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    FREE
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm shadow-purple-500/30 flex items-center space-x-0.5">
                    <Crown className="w-3 h-3 fill-current inline mr-0.5" />
                    PREMIUM
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* Quick "Choose Logo" button */}
          <button
            type="button"
            onClick={() => setIsLogoModalOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-purple-900/30 border border-transparent hover:border-purple-800/40 transition-all text-xs flex items-center space-x-1 group ml-1"
            title="Choose your own logo"
            aria-label="Choose your own logo"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline text-[11px] text-zinc-400 group-hover:text-purple-200">
              {customLogo ? 'Change Logo' : 'Choose Logo'}
            </span>
          </button>
        </div>
      </div>

      {/* Right side: Usage Counter + Plan Actions */}
      <div className="flex items-center space-x-3">
        {/* Real-time daily requests counter */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-purple-900/30 text-xs">
          <div className={`w-2 h-2 rounded-full ${isFree && remaining <= 5 ? 'bg-amber-400 animate-ping' : 'bg-purple-400'}`} />
          {isFree ? (
            <span className="text-zinc-300 font-medium">
              <strong className="text-purple-300">{remaining}</strong> / {limit} requests remaining today
            </span>
          ) : (
            <span className="text-purple-300 font-medium flex items-center space-x-1">
              <Zap className="w-3 h-3 text-purple-400 fill-current" />
              <span>Priority Unlimited Requests</span>
            </span>
          )}
        </div>

        {/* Upgrade button for Free users */}
        {isFree && (
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-600/30 flex items-center space-x-1.5 transition-all transform hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Upgrade to Premium</span>
            <span className="hidden lg:inline text-purple-200 text-[11px]">(₨300/mo)</span>
          </button>
        )}

        {/* User Mini Avatar / Profile */}
        <Link
          to="/settings"
          className="flex items-center space-x-2 p-1 pl-2 rounded-full bg-zinc-900/60 border border-zinc-800 hover:border-purple-600/40 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user?.name ? user.name.charAt(0) : 'N'}
          </div>
          <span className="hidden xl:inline text-xs font-medium text-zinc-300 pr-2">
            {user?.name || 'Account'}
          </span>
        </Link>
      </div>
    </header>
  );
};
