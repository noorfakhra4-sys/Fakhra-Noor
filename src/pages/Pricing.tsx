import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Crown,
  Lock,
  ArrowRight,
  AlertTriangle,
  Receipt,
  FileCheck
} from 'lucide-react';

export const Pricing: React.FC = () => {
  const { usage, user, setIsUpgradeModalOpen, cancelSubscription, showNotification } = useApp();
  const [isCancelling, setIsCancelling] = useState(false);

  const isFree = usage?.plan === 'free';
  const remaining = usage?.remainingToday ?? 47;
  const limit = usage?.limitToday ?? 50;

  const handleCancelClick = async () => {
    if (window.confirm('Are you sure you want to cancel your Premium subscription? You will return to the Free Plan (50 AI requests/day).')) {
      setIsCancelling(true);
      const res = await cancelSubscription();
      setIsCancelling(false);
      if (res.success) {
        showNotification(res.message, 'info');
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-600/30 text-purple-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-purple-400" />
          <span>Transparent Pricing in Pakistani Rupees (PKR)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Choose Your Computing Plan
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Start free with 50 daily requests or elevate to unlimited high-priority factual AI with DODO Premium.
        </p>
      </div>

      {/* Subscription Status Card */}
      <div className="p-6 rounded-2xl bg-[#131021] border border-purple-900/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-zinc-400">Current Plan Status</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isFree
                  ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
              }`}
            >
              {isFree ? 'Free Plan' : 'Premium Plan (Active)'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">
            {isFree ? '50 AI requests/day' : 'Priority Unlimited AI Computing'}
          </h2>
          <p className="text-xs text-zinc-400">
            {isFree
              ? `You currently have ${remaining} / ${limit} requests remaining today.`
              : `Billed at ₨300 / month in Pakistani Rupees. Next renewal: ${user?.nextBillingAt ? new Date(user.nextBillingAt).toLocaleDateString() : 'Next Month'}.`}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {isFree ? (
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Premium (₨300 / month)</span>
            </button>
          ) : (
            <button
              onClick={handleCancelClick}
              disabled={isCancelling}
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-rose-950/40 hover:text-rose-400 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
            >
              {isCancelling ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      </div>

      {/* Two Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FREE PLAN */}
        <div className="relative rounded-3xl bg-[#131021] border border-zinc-800 p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Entry Tier</span>
              <h3 className="text-2xl font-bold text-white">FREE PLAN</h3>
              <p className="text-xs text-zinc-400">Ideal for everyday factual questions and personal tasks.</p>
            </div>

            <div className="pt-2">
              <div className="text-4xl font-extrabold text-white">₨0</div>
              <div className="text-xs text-zinc-400 mt-1">Free forever • No credit card required</div>
            </div>

            {/* Inclusions */}
            <div className="space-y-3 pt-4 border-t border-zinc-800 text-xs text-zinc-300">
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>50 AI requests per day</strong> (“50 AI requests/day”)</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Daily allowance reset every 24 hours</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Factual AI Chat with Google Search Grounding</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Standard image generator (1K resolution)</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Standard video preview generator</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>500MB cloud media storage</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>Public Community Gallery access</span>
              </div>
            </div>
          </div>

          <div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center text-xs text-zinc-400 font-semibold">
              {isFree ? 'Current Active Plan' : 'Free Tier'}
            </div>
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#1c1630] via-[#141026] to-[#0f0c1c] border-2 border-purple-500/50 p-8 flex flex-col justify-between space-y-6 shadow-2xl glow-purple">
          {/* Popular Tag */}
          <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-lg">
            Recommended
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">Flagship Tier</span>
              <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>PREMIUM PLAN</span>
                <Crown className="w-5 h-5 text-purple-400" />
              </h3>
              <p className="text-xs text-purple-200">
                Engineered for professionals, researchers, and creators needing power and high limits.
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-baseline space-x-1">
                <div className="text-4xl font-extrabold text-white">₨300</div>
                <div className="text-sm font-semibold text-purple-300">/ month</div>
              </div>
              <div className="text-xs text-purple-300/80 mt-1">Billed in Pakistani Rupees (PKR) • Cancel anytime</div>
            </div>

            {/* Inclusions */}
            <div className="space-y-3 pt-4 border-t border-purple-900/40 text-xs text-zinc-200">
              <div className="flex items-start space-x-2.5">
                <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 fill-current" />
                <span><strong>Higher AI request limits</strong> (Priority unlimited computing)</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Larger file limits & larger PDF processing</strong> for in-depth analysis</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Higher image generation limits</strong> with 2K & 4K upscaling</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Higher video generation limits</strong> with Veo neural synthesis</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Advanced AI tools</strong> with multi-source comparative RAG</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Advanced image & video editing</strong> workspaces</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>Priority processing</strong> & faster response times</span>
              </div>
              <div className="flex items-start space-x-2.5">
                <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span><strong>10GB Encrypted Cloud Storage</strong> (20x more storage)</span>
              </div>
            </div>
          </div>

          <div>
            {isFree ? (
              <button
                onClick={() => setIsUpgradeModalOpen(true)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/40 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upgrade to Premium (₨300/mo)</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-purple-900/40 border border-purple-500/40 text-center text-xs text-purple-200 font-bold flex items-center justify-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Your Active Subscription (₨300/mo PKR)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security & Billing Assurance */}
      <div className="p-6 rounded-2xl bg-[#0f0d1a] border border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400">
        <div className="flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Bank-Grade Tokenization</h4>
            <p className="mt-1">
              Payment card credentials are tokenized through secure PCI-DSS level 1 processors and never saved in our database.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <CreditCard className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Local Pakistani Wallets</h4>
            <p className="mt-1">
              Seamless checkout with JazzCash, EasyPaisa, UnionPay, and all local Pakistani Visa & Mastercard debit/credit cards.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Receipt className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">Instant PKR Invoices</h4>
            <p className="mt-1">
              Official tax-compliant PKR receipts are automatically generated and archived in your billing settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
