/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Award, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { ARRAY_LEVELS } from '../config/levels';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-2xl bg-gradient-to-b from-slate-900 via-sky-950 to-slate-950 border border-sky-500/50 shadow-2xl shadow-sky-950/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-sky-900/60 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-white">
              破陣方塊 · 修行手冊
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Core Concept */}
          <div className="rounded-xl p-3 bg-sky-950/40 border border-sky-800/40 space-y-1.5">
            <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              一、慢活修仙 · 破陣心境
            </div>
            <p className="leading-relaxed text-slate-300">
              破陣方塊是 Xiaoxue AI World 中的慢活修行之所。核心為標準俄羅斯方塊，將消除行數化為破陣印記。
              本遊戲不以高分排名為限，玩家可隨心情挑選難度，日常遊玩自然累積共通修為。
            </p>
          </div>

          {/* Level & Reward Rules */}
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="font-serif font-bold text-cyan-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              二、關卡解鎖與共通修為
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>
                <span className="text-white font-medium">逐關解鎖：</span>
                初入遊戲開放第 1 關，完成當前最高關卡後解鎖下一關。
              </li>
              <li>
                <span className="text-white font-medium">自由選擇：</span>
                所有已解鎖關卡永久開放，玩家可自由重複選擇，無需每次從頭開始。
              </li>
              <li>
                <span className="text-amber-300 font-medium">固定修為獎勵：</span>
                每次完成所選關卡的消行目標，固定獲得 <span className="text-amber-400 font-bold">+5 點共通修為</span>。重複挑戰亦能再次領取。
              </li>
              <li>
                <span className="text-white font-medium">不中斷遊戲：</span>
                達成破陣目標時，小型提示即時顯示，<span className="text-cyan-300">遊戲絕對不暫停、不重新開始、不中斷操作</span>，玩家可盡情繼續遊玩至 Game Over。
              </li>
            </ul>
          </div>

          {/* Titles & Nine Arrays */}
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="font-serif font-bold text-amber-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              三、九重陣法與專屬稱號
            </div>
            <div className="space-y-1">
              {ARRAY_LEVELS.map((lvl) => (
                <div
                  key={`rule-lvl-${lvl.level}`}
                  className="flex items-center justify-between py-1 border-b border-slate-800/40 text-[11px]"
                >
                  <span className="text-slate-300 font-medium">
                    第{lvl.level}關【{lvl.name}】
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">{lvl.targetLines} 行</span>
                    <span className="text-amber-300 font-serif font-semibold">
                      {lvl.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              * 稱號始終以玩家曾達成的最高解鎖關卡為準，重玩低階關卡絕不會降低稱號。
            </p>
          </div>

          {/* Controls Summary */}
          <div className="rounded-xl p-3 bg-slate-900/60 border border-slate-800 space-y-1">
            <div className="font-serif font-bold text-slate-200">
              四、操作方式
            </div>
            <p className="text-[11px] text-slate-300">
              <span className="text-cyan-300">手機觸控：</span> 底部專屬觸控按鍵（左右移動、加速下落、落陣直達、方塊旋轉、HOLD 保留互換）。
            </p>
            <p className="text-[11px] text-slate-300">
              <span className="text-cyan-300">電腦鍵盤：</span>
              方向鍵 ← → 移動，↓ 加速下落，↑ 或 X 順時針旋轉，Z 逆時針旋轉，空白鍵 Space 瞬間落陣，C 或 Shift 保留互換 (HOLD)，P 或 Esc 暫停。
            </p>
          </div>
        </div>

        {/* Footer Button */}
        <div className="px-5 py-3 border-t border-sky-900/60 bg-slate-950/80">
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-medium text-xs active:scale-95 transition-all shadow-md"
          >
            知曉道心 · 繼續修行
          </button>
        </div>
      </div>
    </div>
  );
};
