import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserUsage {
  plan: 'free' | 'premium';
  usedToday: number;
  limitToday: number;
  remainingToday: number;
  displayLimit: string;
  displayRemaining: string;
  isLimitReached: boolean;
  storageUsedMB: number;
  storageLimitMB: number;
  resetAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled';
  subscriptionPricePKR: number;
  billingCycle: 'monthly';
  nextBillingAt?: string;
}

interface AppContextType {
  user: UserProfile | null;
  usage: UserUsage | null;
  loading: boolean;
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;
  isLogoModalOpen: boolean;
  setIsLogoModalOpen: (open: boolean) => void;
  customLogo: string | null;
  setCustomLogo: (logo: string | null) => void;
  refreshUsage: () => Promise<void>;
  upgradeToPremium: (paymentMethod?: string) => Promise<{ success: boolean; message: string }>;
  cancelSubscription: () => Promise<{ success: boolean; message: string }>;
  recordUsageDeduction: () => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [customLogo, setCustomLogoState] = useState<string | null>(() => {
    try {
      return localStorage.getItem('dodo_custom_logo') || null;
    } catch {
      return null;
    }
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const setCustomLogo = (logo: string | null) => {
    setCustomLogoState(logo);
    try {
      if (logo) {
        localStorage.setItem('dodo_custom_logo', logo);
      } else {
        localStorage.removeItem('dodo_custom_logo');
      }
    } catch (e) {
      console.warn('Could not persist logo to localStorage:', e);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const refreshUsage = async () => {
    try {
      const res = await fetch('/api/user/usage');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setUsage(data.usage);
      }
    } catch (err) {
      console.error('Failed to fetch usage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsage();
  }, []);

  const recordUsageDeduction = () => {
    if (!usage) return;
    const newUsed = usage.usedToday + 1;
    const newRemaining = Math.max(0, usage.limitToday - newUsed);
    setUsage({
      ...usage,
      usedToday: newUsed,
      remainingToday: newRemaining,
      displayRemaining: `${newRemaining} / ${usage.limitToday} requests remaining today`,
      isLimitReached: usage.plan === 'free' && newUsed >= usage.limitToday,
    });
  };

  const upgradeToPremium = async (paymentMethod = 'JazzCash / EasyPaisa / Card (PKR)') => {
    try {
      const res = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification('🎉 Upgraded to Premium! Enjoy priority processing and higher limits.', 'success');
        await refreshUsage();
        return { success: true, message: data.message };
      } else {
        showNotification(data.error || 'Upgrade failed', 'error');
        return { success: false, message: data.error };
      }
    } catch (err: any) {
      showNotification('Payment network error', 'error');
      return { success: false, message: err.message };
    }
  };

  const cancelSubscription = async () => {
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        showNotification('Subscription cancelled. Reverted to Free plan (50 requests/day).', 'info');
        await refreshUsage();
        return { success: true, message: data.message };
      }
      return { success: false, message: 'Cancellation failed' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        usage,
        loading,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isLogoModalOpen,
        setIsLogoModalOpen,
        customLogo,
        setCustomLogo,
        refreshUsage,
        upgradeToPremium,
        cancelSubscription,
        recordUsageDeduction,
        notification,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
