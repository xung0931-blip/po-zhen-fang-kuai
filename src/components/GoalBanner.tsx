/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrayBreakNotification } from '../types/game';
import { Sparkles, Trophy, Award } from 'lucide-react';

interface GoalBannerProps {
  notification: ArrayBreakNotification | null;
}

export const GoalBanner: React.FC<GoalBannerProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div
      className="pointer-events-none select-none z-30 w-full animate-in fade-in slide-in-from-top duration-300"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto max-w-sm rounded-xl bg-gradient-to-r from-amber-950/90 via-sky-950/90 to-amber-950/90 border border-amber-400/50 backdrop-blur-md px-3.5 py-2 shadow-lg shadow-amber-500/20 text-center">
        <div className="flex items-center justify-center gap-1.5 text-amber-300 font-semibold text-xs tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>【破陣成功 · 道行精進】</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <div className="mt-0.5 flex items-center justify-center gap-2 text-[11px] text-slate-200">
          <span className="text-amber-200 font-medium">
            +{notification.cultivationAdded} 共通修為已入囊中
          </span>
          {notification.unlockedLevel && (
            <>
              <span className="text-slate-400">·</span>
              <span className="text-cyan-300 font-medium flex items-center gap-1">
                <Trophy className="w-3 h-3 text-cyan-400" />
                解鎖第 {notification.unlockedLevel} 關
              </span>
            </>
          )}
        </div>

        {notification.unlockedTitle && (
          <div className="mt-0.5 text-[10px] text-amber-300/90 flex items-center justify-center gap-1">
            <Award className="w-3 h-3 text-amber-400" />
            <span>晉升稱號：【{notification.unlockedTitle}】</span>
          </div>
        )}

        <div className="mt-0.5 text-[9px] text-slate-400">
          陣法已破，道心常在，請繼續遊玩直到自然收陣
        </div>
      </div>
    </div>
  );
};
