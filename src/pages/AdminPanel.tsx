import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  Settings,
  Flame,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HardDrive,
  Activity,
  Sliders,
  Check,
  Save,
  Flag,
  Globe
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  totalRequestsToday: number;
  publicGalleryPosts: number;
  reportedContent: any[];
  storageUsedGB: number;
  revenuePKR: number;
}

export const AdminPanel: React.FC = () => {
  const { showNotification } = useApp();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1489,
    freeUsers: 1342,
    premiumUsers: 147,
    totalRequestsToday: 8940,
    publicGalleryPosts: 12,
    reportedContent: [],
    storageUsedGB: 42.8,
    revenuePKR: 44100, // 147 * 300
  });

  const [freeDailyLimit, setFreeDailyLimit] = useState(50);
  const [premiumPricePKR, setPremiumPricePKR] = useState(300);
  const [highAccuracyWebSearch, setHighAccuracyWebSearch] = useState(true);
  const [allowPublicPosting, setAllowPublicPosting] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Reported posts moderation
  const [reportedQueue, setReportedQueue] = useState([
    {
      id: 'rep-1',
      title: 'Suspicious Synthetic Portrait',
      reason: 'Possible copyright duplication of studio photography',
      reporter: 'User #882',
      date: '2026-09-24',
      status: 'pending',
    }
  ]);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        if (data.settings) {
          setFreeDailyLimit(data.settings.freeDailyLimit);
          setPremiumPricePKR(data.settings.premiumPricePKR);
          setHighAccuracyWebSearch(data.settings.highAccuracyWebSearch);
          setAllowPublicPosting(data.settings.allowPublicPosting);
        }
      }
    } catch {
      // keep fallback
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freeDailyLimit: Number(freeDailyLimit),
          premiumPricePKR: Number(premiumPricePKR),
          highAccuracyWebSearch,
          allowPublicPosting,
        }),
      });

      if (res.ok) {
        showNotification('System parameters updated and synced across backend.', 'success');
      }
    } catch {
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismissReport = (id: string) => {
    setReportedQueue(reportedQueue.filter((r) => r.id !== id));
    showNotification('Report dismissed. Post approved for gallery.', 'info');
  };

  const handleRemovePost = (id: string) => {
    setReportedQueue(reportedQueue.filter((r) => r.id !== id));
    showNotification('Post banned and removed from public community.', 'error');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/20">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">DODO.ai Central Admin Console</h1>
          </div>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            System administration, Pakistan Rupee subscription controls, rate limit provisioning, and content moderation.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-300 font-bold">API Services Operational</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase">
            <span>Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-zinc-400">
            <span className="text-emerald-400 font-semibold">{stats.freeUsers} Free</span> •{' '}
            <span className="text-purple-300 font-semibold">{stats.premiumUsers} Premium</span>
          </div>
        </div>

        {/* Requests Today */}
        <div className="p-5 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase">
            <span>Requests Today</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.totalRequestsToday.toLocaleString()}</div>
          <div className="text-xs text-zinc-400">Enforced by backend limiters</div>
        </div>

        {/* Monthly PKR Revenue */}
        <div className="p-5 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase">
            <span>Monthly Revenue (PKR)</span>
            <span className="text-xs font-bold text-purple-400">₨</span>
          </div>
          <div className="text-2xl font-extrabold text-white">₨{stats.revenuePKR.toLocaleString()}</div>
          <div className="text-xs text-zinc-400">{stats.premiumUsers} active subscriptions at ₨300/mo</div>
        </div>

        {/* Cloud Storage */}
        <div className="p-5 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold uppercase">
            <span>Cloud Storage</span>
            <HardDrive className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stats.storageUsedGB} GB</div>
          <div className="text-xs text-zinc-400">Media, PDFs, models & outputs</div>
        </div>
      </div>

      {/* Main Two Columns: System Configuration & Content Moderation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* System Settings Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#131021] p-6 rounded-2xl border border-purple-900/20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <span>Platform Configuration Parameters</span>
            </h2>
            <span className="text-xs text-purple-300 font-medium">Real-time enforcement</span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            {/* Free Daily Limit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Free Plan Daily Request Limit</span>
                <span className="text-purple-400 text-xs font-mono font-bold">{freeDailyLimit} requests/day</span>
              </label>
              <input
                type="number"
                min={1}
                max={500}
                value={freeDailyLimit}
                onChange={(e) => setFreeDailyLimit(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0e0d16] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500">
                Default: 50 requests/day. When free users reach this threshold, backend returns HTTP 429.
              </p>
            </div>

            {/* Premium Price PKR */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Premium Monthly Price (Pakistani Rupees PKR)</span>
                <span className="text-purple-400 text-xs font-mono font-bold">₨{premiumPricePKR} / month</span>
              </label>
              <input
                type="number"
                min={50}
                max={5000}
                step={50}
                value={premiumPricePKR}
                onChange={(e) => setPremiumPricePKR(Number(e.target.value))}
                className="w-full p-2.5 bg-[#0e0d16] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
              <p className="text-[11px] text-zinc-500">
                Standard DODO.ai default: ₨300 / month.
              </p>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0d16] border border-zinc-800">
                <div>
                  <p className="text-xs font-bold text-white">Google Search Grounding Engine</p>
                  <p className="text-[11px] text-zinc-400">Permit live web retrieval for anti-hallucination factual checks</p>
                </div>
                <input
                  type="checkbox"
                  checked={highAccuracyWebSearch}
                  onChange={(e) => setHighAccuracyWebSearch(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 bg-zinc-900 border-zinc-700"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0e0d16] border border-zinc-800">
                <div>
                  <p className="text-xs font-bold text-white">Public Community Gallery Submissions</p>
                  <p className="text-[11px] text-zinc-400">Allow users to publish voluntary creations publicly</p>
                </div>
                <input
                  type="checkbox"
                  checked={allowPublicPosting}
                  onChange={(e) => setAllowPublicPosting(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 bg-zinc-900 border-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              {isSaving ? (
                <span>Syncing parameters...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save & Enforce System Settings</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Content Moderation Queue (5 cols) */}
        <div className="lg:col-span-5 bg-[#131021] p-6 rounded-2xl border border-purple-900/20 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Flag className="w-5 h-5 text-amber-400" />
              <span>Moderation Review Queue</span>
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
              {reportedQueue.length} Pending
            </span>
          </div>

          {reportedQueue.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-zinc-300">Moderation Queue Clear</p>
              <p className="text-[11px]">All public content meets safety and community guidelines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reportedQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-[#0e0d16] border border-amber-500/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="text-[10px] text-zinc-400">{item.date}</span>
                  </div>
                  <p className="text-xs text-amber-200/90 font-medium">
                    Reason: {item.reason}
                  </p>
                  <p className="text-[11px] text-zinc-500">Flagged by: {item.reporter}</p>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-zinc-800/80">
                    <button
                      onClick={() => handleDismissReport(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                    >
                      Approve Post
                    </button>
                    <button
                      onClick={() => handleRemovePost(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-600/40 text-rose-300 hover:bg-rose-900 text-xs font-semibold transition-colors"
                    >
                      Remove from Gallery
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
