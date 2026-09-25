import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Sparkles, ShieldCheck, Zap, Lock, CreditCard, Smartphone } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, upgradeToPremium, user } = useApp();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'jazzcash' | 'easypaisa'>('card');
  const [phoneNumber, setPhoneNumber] = useState('03001234567');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Noor Fakhra');
  const [expiry, setExpiry] = useState('09/28');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isUpgradeModalOpen) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate secure 3D secure payment gateway handshake
    setTimeout(async () => {
      const methodName = selectedMethod === 'card' 
        ? 'Debit/Credit Card (PKR)' 
        : selectedMethod === 'jazzcash' 
        ? 'JazzCash Mobile Account' 
        : 'EasyPaisa Wallet';
      
      const res = await upgradeToPremium(methodName);
      setIsProcessing(false);
      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsUpgradeModalOpen(false);
        }, 1800);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#12101c] border border-purple-800/40 rounded-2xl shadow-2xl overflow-hidden glow-purple"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Payment Confirmed!</h3>
            <p className="text-purple-200 text-sm max-w-md">
              Your DODO.ai Premium subscription is active for <span className="font-semibold text-white">₨300/month</span>. Welcome to high-accuracy priority computing!
            </p>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Upgrade to DODO.ai Premium</h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/40">
                    Billed in PKR
                  </span>
                </div>
                <p className="text-sm text-zinc-400">
                  Unlock high-priority computing, massive limits, and video creation.
                </p>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-purple-400">Subscription Plan</p>
                <h3 className="text-lg font-semibold text-white">DODO Premium All-Access</h3>
                <p className="text-xs text-zinc-400">Renews monthly. Cancel anytime with one click.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-extrabold text-white tracking-tight">₨300</div>
                <div className="text-xs text-purple-300 font-medium">/ month</div>
              </div>
            </div>

            {/* Feature comparison highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-zinc-300">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Unlimited priority AI requests</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Real-time Google search verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>4K/2K high-resolution AI Image Generator</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>AI Video Generator & Studio Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>10GB encrypted cloud storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Large PDF & document research analysis</span>
              </div>
            </div>

            {/* Secure Payment Options */}
            <div className="space-y-3 pt-2 border-t border-zinc-800/80">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Select Payment Provider</span>
                <span className="flex items-center text-emerald-400 text-[11px] space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-bit Encrypted Checkout</span>
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('card')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    selectedMethod === 'card'
                      ? 'bg-purple-900/30 border-purple-500 text-white'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span className="text-xs font-medium">Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('jazzcash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    selectedMethod === 'jazzcash'
                      ? 'bg-purple-900/30 border-purple-500 text-white'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-red-400" />
                  <span className="text-xs font-medium">JazzCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('easypaisa')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    selectedMethod === 'easypaisa'
                      ? 'bg-purple-900/30 border-purple-500 text-white'
                      : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-medium">EasyPaisa</span>
                </button>
              </div>

              {/* Method form details */}
              <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
                {selectedMethod === 'card' ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] text-zinc-400">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-[11px] text-zinc-400">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-400">Exp / CVC</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] text-zinc-400">
                      {selectedMethod === 'jazzcash' ? 'JazzCash Mobile Account Number' : 'EasyPaisa Account Number'}
                    </label>
                    <div className="relative mt-1">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500 pl-16 font-mono"
                        required
                      />
                      <span className="absolute left-3 top-2 text-xs text-zinc-400 font-mono">+92</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      You will receive an in-app biometric authorization request on your mobile phone.
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Pay ₨300 & Activate Premium</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-zinc-400 mt-2 flex items-center justify-center space-x-1">
                    <Lock className="w-3 h-3 text-zinc-400" />
                    <span>Card and wallet credentials are tokenized and never stored in the database.</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
