/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, Award, Flame } from 'lucide-react';
import { ArrayBreakNotification } from '../types/game';

interface BreakArrayFXProps {
  notification: ArrayBreakNotification | null;
}

export const BreakArrayFX: React.FC<BreakArrayFXProps> = ({ notification }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [notification]);

  if (!visible || !notification) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-300">
      {/* Golden Expanding Runic Shockwave */}
      <div className="absolute w-[360px] h-[360px] rounded-full border-2 border-amber-400/40 animate-ping opacity-60" style={{ animationDuration: '2s' }} />
      <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-400/50 animate-ping opacity-50" style={{ animationDuration: '1.5s' }} />

      {/* Floating Sparkles & Light Beams */}
      <div className="absolute inset-x-0 h-48 bg-gradient-to-b from-transparent via-amber-500/15 to-transparent blur-xl" />

      {/* Central Celestial Seal Pop-Up Badge */}
      <div className="relative z-10 mx-4 max-w-xs rounded-2xl bg-gradient-to-b from-slate-950/95 via-sky-950/90 to-amber-950/90 border-2 border-amber-400/80 p-4 shadow-2xl shadow-amber-500/30 text-center backdrop-blur-md animate-in zoom-in-90 duration-300">
        {/* Ancient Daoist Corner accents */}
        <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-300" />
        <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-300" />
        <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-300" />
        <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-300" />

        <div className="flex items-center justify-center gap-1.5 text-amber-300 text-xs font-serif font-bold tracking-widest uppercase">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>【 破陣大成 · 靈光大盛 】</span>
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>

        <div className="mt-1 text-base font-serif font-extrabold text-white text-gold-glow">
          {notification.levelName} · 陣破！
        </div>

        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-xs font-bold text-amber-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            +5 共通修為入道
          </span>
        </div>

        {notification.unlockedLevel && (
          <div className="mt-2 text-xs text-cyan-200 font-medium flex items-center justify-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>解鎖第 {notification.unlockedLevel} 重陣法！</span>
          </div>
        )}

        {notification.unlockedTitle && (
          <div className="mt-1 text-[11px] text-amber-200/90 flex items-center justify-center gap-1 font-serif">
            <Award className="w-3 h-3 text-amber-300" />
            <span>榮獲道號：【{notification.unlockedTitle}】</span>
          </div>
        )}

        <div className="mt-2 text-[9px] text-slate-400 border-t border-sky-900/50 pt-1">
          靈氣不絕，請凝神繼續遊玩
        </div>
      </div>
    </div>
  );
};
