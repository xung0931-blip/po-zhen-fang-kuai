/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrayBreakNotification, LevelConfig } from '../types/game';
import { Sparkles, Trophy, Award, Play, ArrowLeft, RotateCcw } from 'lucide-react';

interface GoalModalProps {
  notification: ArrayBreakNotification;
  levelConfig: LevelConfig;
  onResumeGame: () => void;
  onNextLevel?: (level: number) => void;
  onBackToLobby: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  notification,
  levelConfig,
  onResumeGame,
  onNextLevel,
  onBackToLobby,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 via-sky-950/95 to-slate-950 border border-amber-400/60 p-5 shadow-2xl shadow-amber-900/40 text-center relative overflow-hidden">
        {/* Ancient decorative corner seals */}
        <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400" />

        {/* Floating golden aura particles */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Title / Banner */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-[11px] text-amber-300 font-serif font-medium mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>破陣功成 · 道行大進</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </div>

          <h2 className="text-xl font-serif font-bold text-white tracking-wide">
            【第 {notification.level} 關 · {notification.levelName}】
          </h2>
          <div className="text-xs text-amber-300 font-serif mt-0.5">
            已成功破除大陣石鎖（達成 {levelConfig.targetLines} 行消行目標）
          </div>
        </div>

        {/* Reward Status Card */}
        <div className="rounded-xl p-3 mb-4 bg-amber-500/10 border border-amber-400/50 space-y-2">
          {/* Cultivation reward */}
          <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>獲得 +{notification.cultivationAdded} 點共通修為</span>
          </div>

          {/* Unlock notice if available */}
          {notification.unlockedLevel && (
            <div className="text-xs text-cyan-200 bg-sky-950/70 py-1.5 px-2.5 rounded-lg border border-sky-600/40 space-y-0.5">
              <div className="font-semibold text-cyan-300 flex items-center justify-center gap-1">
                <span>✦ 解鎖全新大陣：第 {notification.unlockedLevel} 關 ✦</span>
              </div>
              {notification.unlockedTitle && (
                <div className="text-[11px] text-amber-300 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>晉升稱號：【{notification.unlockedTitle}】</span>
                </div>
              )}
            </div>
          )}

          <div className="text-[10px] text-slate-300/90 font-sans">
            遊戲已為您暫停。您可以選擇繼續留在本陣衝擊更高得分，或直接登階前往下一關！
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Option A: Next Level if available */}
          {notification.unlockedLevel && onNextLevel && (
            <button
              onClick={() => onNextLevel(notification.unlockedLevel!)}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>破陣登階：前往第 {notification.unlockedLevel} 關</span>
            </button>
          )}

          {/* Option B: Continue Playing current run (Directly transitions to 3-2-1 countdown + 0.5s pause) */}
          <button
            onClick={onResumeGame}
            className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium text-xs flex flex-col items-center justify-center shadow-lg shadow-sky-900/40 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-1.5 font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>繼續修行（留陣挑戰高分）</span>
            </div>
            <span className="text-[9.5px] text-cyan-200/90 font-sans">
              轉接 3-2-1 凝神倒數（含 0.5 秒停頓緩衝）
            </span>
          </button>

          {/* Option C: Return to Lobby */}
          <button
            onClick={onBackToLobby}
            className="w-full h-9 rounded-xl bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>收陣存檔 · 返回大廳</span>
          </button>
        </div>
      </div>
    </div>
  );
};
