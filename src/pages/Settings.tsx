import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOGO_PRESETS } from '../components/common/LogoModal';
import {
  Settings as SettingsIcon,
  User,
  CreditCard,
  Lock,
  Globe,
  Shield,
  Zap,
  Check,
  Save,
  Crown,
  Receipt,
  Download,
  Palette,
  RotateCcw,
  Sparkles,
  Upload
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, usage, setIsUpgradeModalOpen, cancelSubscription, showNotification, customLogo, setCustomLogo, setIsLogoModalOpen } = useApp();

  const [name, setName] = useState(user?.name || 'Noor Fakhra');
  const [email] = useState(user?.email || 'noorfakhra4@gmail.com');
  const [defaultPrivacy, setDefaultPrivacy] = useState<'private' | 'public'>('private');
  const [highAccuracyDefault, setHighAccuracyDefault] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isFree = usage?.plan === 'free';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    showNotification('Settings updated successfully', 'success');
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-purple-900/20">
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">Account & Platform Settings</h1>
        </div>
        <p className="text-xs md:text-sm text-zinc-400 mt-1">
          Manage your personal profile, Pakistani Rupee subscription, model parameters, and default privacy.
        </p>
      </div>

      {/* Profile & Identity */}
      <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <User className="w-4 h-4 text-purple-400" />
          <span>Profile Information</span>
        </h2>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-[#0e0d16] border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300">Email Address (Google Account)</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full p-2.5 bg-[#0e0d16]/60 border border-zinc-800/60 rounded-xl text-xs text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Brand Identity & Custom Logo Section */}
      <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Brand Identity & Custom Logo</span>
          </h2>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
              customLogo ? 'bg-purple-900/60 text-purple-300 border border-purple-600/40' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
            }`}
          >
            {customLogo ? 'Custom Logo Active' : 'Default DODO Brand'}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            {/* Active Logo Display */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 p-0.5 shadow-xl shadow-purple-600/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0e0d16] rounded-[14px] flex items-center justify-center overflow-hidden p-1.5">
                {customLogo ? (
                  <img src={customLogo} alt="Current Logo" className="w-full h-full object-contain" />
                ) : (
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-400 fill-current">
                    <path d="M12 3C8 3 4 6 4 10.5c0 3.1 1.7 5.8 4.3 7.2L7 21l4.5-1.5c.5.1 1 .1 1.5.1 4.4 0 8-3.6 8-8s-3.6-8.6-9-8.6zm-1.5 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5.5 6.5c-1.5 1.2-3.2 1.5-5 1.5-1.2 0-2.4-.2-3.5-.8l-.5-.3.5-.5c1.2-1.2 2.7-2 4.5-2 1.5 0 2.8.5 4 1.5l.5.6z" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Your Workspace Logo</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                This logo appears in the top navigation, sidebar, and across your DODO.ai suite.
              </p>
              <p className="text-[11px] text-purple-300 mt-1">
                {customLogo ? 'Customized image in use' : 'Using default classic purple avian silhouette'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsLogoModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-1.5 transition-all"
            >
              <Palette className="w-4 h-4" />
              <span>Choose / Upload Logo</span>
            </button>
            {customLogo && (
              <button
                type="button"
                onClick={() => {
                  setCustomLogo(null);
                  showNotification('Reset to original DODO logo', 'info');
                }}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold text-xs transition-colors flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Default</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Designer Presets Bar */}
        <div className="pt-3 border-t border-zinc-800/80 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Quick Preset Selection
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {LOGO_PRESETS.slice(0, 5).map((preset) => {
              const isSelected =
                (preset.id === 'default' && !customLogo) ||
                customLogo === preset.svgDataUri;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    if (preset.id === 'default') {
                      setCustomLogo(null);
                      showNotification('Reset to default brand logo', 'info');
                    } else {
                      setCustomLogo(preset.svgDataUri);
                      showNotification(`Selected ${preset.name} as logo`, 'success');
                    }
                  }}
                  className={`p-2.5 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                    isSelected
                      ? 'bg-purple-900/40 border-purple-500 text-white shadow-sm'
                      : 'bg-[#0e0d16] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-purple-900/30 p-1 flex items-center justify-center shrink-0">
                    <img src={preset.svgDataUri} alt={preset.name} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[11px] font-semibold truncate">{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Plan & Subscription Card */}
      <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Subscription & Billing</span>
          </h2>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
              isFree ? 'bg-zinc-800 text-zinc-300' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
            }`}
          >
            {isFree ? 'Free Plan' : 'Premium (₨300/mo PKR)'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {isFree ? '50 AI requests/day Allowance' : 'Active Premium Subscription'}
            </p>
            <p className="text-xs text-zinc-400">
              {isFree
                ? 'Standard compute speed with 50 daily requests.'
                : 'Billed in PKR at ₨300/month. Unlimited priority requests, 4K image synthesis, and Veo video studio.'}
            </p>
          </div>

          <div>
            {isFree ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 flex items-center space-x-2 transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Premium (₨300/mo)</span>
              </button>
            ) : (
              <button
                onClick={async () => {
                  if (confirm('Cancel subscription? You will return to Free Plan.')) {
                    await cancelSubscription();
                  }
                }}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-rose-950/60 text-zinc-300 hover:text-rose-300 text-xs font-semibold transition-colors"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Invoices list */}
        <div className="pt-3 border-t border-zinc-800/80 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Billing History (Pakistani Rupees)
          </span>
          <div className="space-y-1.5">
            <div className="p-3 rounded-xl bg-[#0e0d16] border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5">
                <Receipt className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="font-semibold text-white">
                    {isFree ? 'Free Tier Provisioning' : 'DODO.ai Premium Monthly'}
                  </p>
                  <p className="text-[10px] text-zinc-400">Tax Invoice #PKR-2026-0924</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-white">{isFree ? '₨0' : '₨300 PKR'}</span>
                <p className="text-[10px] text-emerald-400 font-medium">Paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Model & Privacy Defaults */}
      <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/20 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Privacy & Factual AI Defaults</span>
        </h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e0d16] border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Default Creations to Private</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Your generated images, videos, and chats remain strictly private unless you choose to share them publicly.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-purple-950/60 text-purple-300 font-bold border border-purple-600/30">
              Enforced (Private)
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0e0d16] border border-zinc-800">
            <div>
              <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Default High-Accuracy Web Search Grounding</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Automatically verify queries with live Google Search retrieval to maximize factual integrity.
              </p>
            </div>
            <input
              type="checkbox"
              checked={highAccuracyDefault}
              onChange={(e) => setHighAccuracyDefault(e.target.checked)}
              className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4 bg-zinc-900 border-zinc-700"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
