/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayerData } from '../types/game';
import { ARRAY_LEVELS } from '../config/levels';
import {
  Lock,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Play,
  Compass,
  RotateCcw,
} from 'lucide-react';

interface LevelSelectProps {
  playerData: PlayerData;
  onSelectLevel: (level: number) => void;
  onOpenRules: () => void;
  onResetData: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({
  playerData,
  onSelectLevel,
  onOpenRules,
  onResetData,
}) => {
  const highestUnlocked = playerData.breaker_highest_level;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col flex-1 px-4 py-3 overflow-y-auto space-y-4">
      {/* Player Cultivation Profile Banner */}
      <div className="relative rounded-2xl bg-gradient-to-br from-sky-950/90 via-slate-900/90 to-amber-950/80 border border-sky-500/40 p-4 shadow-xl shadow-sky-950/50 backdrop-blur-md">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-400 font-sans tracking-wide">
                Xiaoxue AI World · 破陣修行
              </span>
            </div>
            <h1 className="text-xl font-bold font-serif text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 bg-clip-text text-transparent">
                【{playerData.breaker_title}】
              </span>
            </h1>
            <p className="text-xs text-slate-300">
              最高解鎖至第 <span className="text-amber-300 font-bold">{highestUnlocked}</span> 關 · 
              道行深厚，步步精進
            </p>
          </div>

          <div className="flex flex-col items-end">
            <div className="rounded-xl px-3 py-1.5 bg-amber-500/10 border border-amber-400/40 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-[10px] text-amber-300/80">共通修為</div>
                <div className="text-sm font-bold text-amber-300 tabular-nums">
                  {playerData.cultivation_points} 點
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-sky-900/50 text-center">
          <div className="bg-slate-950/40 rounded-xl py-1.5 px-2 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">歷史最高分</div>
            <div className="text-xs font-semibold text-cyan-300 tabular-nums">
              {playerData.breaker_highest_score.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl py-1.5 px-2 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">累計消行</div>
            <div className="text-xs font-semibold text-slate-200 tabular-nums">
              {playerData.breaker_total_lines} 行
            </div>
          </div>

          <div className="bg-slate-950/40 rounded-xl py-1.5 px-2 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">已破陣法</div>
            <div className="text-xs font-semibold text-amber-300 tabular-nums">
              {playerData.breaker_completed_levels.length} / 9
            </div>
          </div>
        </div>

        {/* Slow-life cultivation reminder & Reset action */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-300/90 bg-sky-950/50 px-3 py-1.5 rounded-lg border border-sky-800/40">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">慢活修仙：已解鎖關卡每次通關固定 +5 修為</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-1.5">
            <button
              onClick={onOpenRules}
              className="text-[10px] text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              規則詳情
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                if (window.confirm('確定要將通關紀錄與修為歸零重設嗎？（便於重新測試）')) {
                  onResetData();
                }
              }}
              className="text-[10px] text-rose-300 hover:text-rose-200 flex items-center gap-0.5 bg-rose-500/15 hover:bg-rose-500/25 px-1.5 py-0.5 rounded border border-rose-500/30 transition-colors"
              title="將所有通關紀錄歸零"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>歸零重置</span>
            </button>
          </div>
        </div>
      </div>

      {/* Array Levels Grid (9 Levels) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-serif font-bold text-sky-200 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            九重大陣修行譜
          </h2>
          <span className="text-[10px] text-slate-400">
            已開放 1～{highestUnlocked} 關自由挑選
          </span>
        </div>

        <div className="space-y-2">
          {ARRAY_LEVELS.map((cfg) => {
            const isUnlocked = cfg.level <= highestUnlocked;
            const isHighest = cfg.level === highestUnlocked;
            const isCompleted = playerData.breaker_completed_levels.includes(cfg.level);

            return (
              <div
                key={`lvl-${cfg.level}`}
                className={`relative rounded-xl p-3 border transition-all duration-200 ${
                  isUnlocked
                    ? isHighest
                      ? 'bg-gradient-to-r from-sky-950/80 via-slate-900/90 to-sky-950/80 border-amber-400/60 shadow-lg shadow-amber-900/20'
                      : 'bg-slate-900/70 border-sky-800/50 hover:border-sky-600/80'
                    : 'bg-slate-950/60 border-slate-800/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Level Number Orb */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm shrink-0 border ${
                        isUnlocked
                          ? isHighest
                            ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-white border-amber-300 shadow-md shadow-amber-500/30'
                            : 'bg-gradient-to-b from-sky-800 to-sky-950 text-cyan-200 border-sky-600/60'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {isUnlocked ? (
                        <span>{cfg.level}</span>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    {/* Level Title & Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-white">
                          第{cfg.level}關 · {cfg.name}
                        </span>
                        {isCompleted && (
                          <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-sans">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            已破陣
                          </span>
                        )}
                        {isHighest && !isCompleted && (
                          <span className="text-[10px] text-amber-300 font-medium px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400/40">
                            當前挑戰
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="text-cyan-300 font-medium">
                          目標：消除 {cfg.targetLines} 行
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-300/90 flex items-center gap-0.5">
                          <Award className="w-3 h-3" />
                          稱號：{cfg.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Slot */}
                  <div>
                    {isUnlocked ? (
                      <button
                        onClick={() => onSelectLevel(cfg.level)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap active:scale-95 transition-all shadow-md ${
                          isHighest
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                            : 'bg-sky-700/80 hover:bg-sky-600 text-white border border-sky-500/40'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>入陣</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 whitespace-nowrap">
                        需先破第 {cfg.level - 1} 關
                      </span>
                    )}
                  </div>
                </div>

                {/* Lore text preview */}
                <div className="mt-2 text-[10px] text-slate-400/90 line-clamp-1 border-t border-slate-800/40 pt-1.5">
                  {cfg.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
