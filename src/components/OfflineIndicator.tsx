import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, CheckCircle2 } from 'lucide-react';

export const OfflineIndicator: React.FC<{ language?: string }> = ({ language = 'English' }) => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);
  const isSwahili = language === 'Swahili';

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-[#ffd700]/50 animate-in slide-in-from-bottom">
        <CheckCircle2 className="w-4 h-4 text-[#ffd700]" />
        <span>{isSwahili ? 'Umeunganishwa tena mtandaoni!' : 'Back online! Syncing latest content.'}</span>
      </div>
    );
  }

  if (isOnline) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-2xl bg-[#091a10] px-4 py-2.5 text-xs font-bold text-emerald-200 shadow-2xl border-2 border-amber-500/80 animate-in slide-in-from-bottom">
      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
      <WifiOff className="w-4 h-4 text-amber-400" />
      <div>
        <span className="text-white">
          {isSwahili ? 'Hali ya Nje ya Mtandao (Offline)' : 'Offline Mode Active'}
        </span>
        <span className="block text-[10px] text-slate-400">
          {isSwahili ? 'Unaweza kuendelea kusoma vitabu na makala zilizohifadhiwa.' : 'Cached books and reading materials remain accessible.'}
        </span>
      </div>
    </div>
  );
};
