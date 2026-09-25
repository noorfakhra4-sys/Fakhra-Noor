import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { UpgradeModal } from '../common/UpgradeModal';
import { LogoModal } from '../common/LogoModal';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Sparkles, CheckCircle2, Info, X } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { usage, notification, setIsUpgradeModalOpen } = useApp();

  const isLimitReached = usage?.isLimitReached;

  return (
    <div className="min-h-screen bg-[#0b0a10] text-[#ede8f5] flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 max-w-md animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-xl border shadow-2xl flex items-center space-x-3 ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
                : 'bg-purple-950/90 border-purple-500/50 text-purple-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-purple-400 shrink-0" />
            )}
            <p className="text-xs font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Daily limit reached banner if triggered */}
      {isLimitReached && (
        <div className="bg-gradient-to-r from-purple-900/90 via-fuchsia-900/90 to-purple-900/90 border-b border-purple-500/50 px-4 py-2.5 text-center text-xs text-white flex items-center justify-center space-x-3 shadow-lg">
          <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0 animate-pulse" />
          <span>
            <strong>Daily Limit Reached:</strong> You’ve reached your daily limit of 50 AI requests. Your requests will reset tomorrow.
          </span>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="px-3 py-1 rounded-md bg-white text-purple-950 font-bold text-xs hover:bg-purple-100 flex items-center space-x-1 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Upgrade to Premium (₨300/mo)</span>
          </button>
        </div>
      )}

      {/* Main Body with Sidebar + Outlet */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 overflow-y-auto bg-[#0b0a10]">
          <Outlet />
        </main>
      </div>

      {/* Upgrade Modal & Custom Logo Modal */}
      <UpgradeModal />
      <LogoModal />
    </div>
  );
};
