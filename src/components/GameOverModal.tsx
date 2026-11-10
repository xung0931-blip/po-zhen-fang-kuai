/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats, LevelConfig, PlayerData } from '../types/game';
import { RotateCcw, Compass, Sparkles, Award, ArrowLeft, Trophy, Play } from 'lucide-react';

interface GameOverModalProps {
  stats: GameStats;
  levelConfig: LevelConfig;
  goalAchieved: boolean;
  playerData: PlayerData;
  onRestart: () => void;
  onSelectLevel: () => void;
  onNextLevel?: () => void;
  onBackToLobby: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  levelConfig,
  goalAchieved,
  playerData,
  onRestart,
  onSelectLevel,
  onNextLevel,
  onBackToLobby,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 via-sky-950/95 to-slate-950 border border-sky-500/50 p-5 shadow-2xl shadow-sky-950/80 text-center relative overflow-hidden">
        {/* Ancient decorative corner seals */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400" />

        {/* Title / Banner */}
        <div className="mb-3">
          <div className="text-xs text-slate-400 font-sans tracking-wide">
            Xiaoxue AI World · 破陣收陣結算
          </div>
          <h2 className="text-xl font-serif font-bold text-white mt-1">
            {goalAchieved ? (
              <span className="text-amber-300 flex items-center justify-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                破陣功成 · 道心圓滿
              </span>
            ) : (
              <span className="text-slate-200">陣法未解 · 來日再戰</span>
            )}
          </h2>
          <div className="text-xs text-sky-300 mt-0.5">
            挑戰：第 {levelConfig.level} 關【{levelConfig.name}】
          </div>
        </div>

        {/* Reward Status Banner */}
        <div
          className={`rounded-xl p-2.5 mb-4 border ${
            goalAchieved
              ? 'bg-amber-500/10 border-amber-400/50 text-amber-200'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-300'
          }`}
        >
          {goalAchieved ? (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-amber-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>獲得 +5 點共通修為</span>
              </div>
              <p className="text-[11px] text-slate-300">
                已將修為計入 Xiaoxue AI World 總大廳個人屬性
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-400">
              消除行數尚未達到本關目標（{stats.lines} / {levelConfig.targetLines} 行），未能領取本次破陣修為
            </div>
          )}
        </div>

        {/* Run Performance Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-left">
          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">本局得分</div>
            <div className="text-base font-bold text-cyan-300 tabular-nums">
              {stats.score.toLocaleString()}
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">本局消行</div>
            <div className="text-base font-bold text-amber-300 tabular-nums">
              {stats.lines} 行
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">當前稱號</div>
            <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{playerData.breaker_title}</span>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-2.5 border border-sky-900/40">
            <div className="text-[10px] text-slate-400">最高開放</div>
            <div className="text-xs font-semibold text-slate-200">
              第 {playerData.breaker_highest_level} 關
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Proceed to Next Level (if cleared and has next level) */}
          {goalAchieved && levelConfig.level < 9 && onNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>破陣登階：前往第 {levelConfig.level + 1} 關</span>
            </button>
          )}

          {/* Retry Same Level */}
          <button
            onClick={onRestart}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-900/30 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>再次挑戰第 {levelConfig.level} 關</span>
          </button>

          {/* Change Level */}
          <button
            onClick={onSelectLevel}
            className="w-full h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-sky-700/50 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>選擇其他關卡</span>
          </button>

          {/* Return to Lobby */}
          <button
            onClick={onBackToLobby}
            className="w-full h-9 rounded-xl bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回總大廳修行</span>
          </button>
        </div>
      </div>
    </div>
  );
};
