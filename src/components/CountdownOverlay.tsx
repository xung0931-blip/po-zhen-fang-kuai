/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface CountdownOverlayProps {
  countdown: number | null;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ countdown }) => {
  if (countdown === null) return null;

  const getStepData = (step: number) => {
    switch (step) {
      case 3:
        return {
          numeral: '3',
          chinese: '定心',
          subtitle: '凝神固本 · 洞察棋局',
          color: 'from-cyan-400 via-sky-300 to-indigo-300',
          glow: 'rgba(56, 189, 248, 0.45)',
          border: 'border-cyan-400/50',
        };
      case 2:
        return {
          numeral: '2',
          chinese: '凝神',
          subtitle: '氣定神閒 · 預判陣位',
          color: 'from-amber-300 via-yellow-200 to-orange-300',
          glow: 'rgba(251, 191, 36, 0.55)',
          border: 'border-amber-400/60',
        };
      case 1:
        return {
          numeral: '1',
          chinese: '聚氣',
          subtitle: '心意合一 · 引靈入陣',
          color: 'from-emerald-300 via-teal-200 to-cyan-300',
          glow: 'rgba(52, 211, 153, 0.55)',
          border: 'border-emerald-400/60',
        };
      case 0:
      default:
        return {
          numeral: '破',
          chinese: '破陣！',
          subtitle: '大陣啟動 · 方塊落位',
          color: 'from-amber-200 via-yellow-300 to-yellow-500',
          glow: 'rgba(234, 179, 8, 0.85)',
          border: 'border-yellow-400',
        };
    }
  };

  const data = getStepData(countdown);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      {/* Subtle darkening backdrop so the stationary piece is still visible underneath */}
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px] rounded-2xl transition-all duration-300" />

      {/* Center glowing talisman / countdown badge */}
      <div
        key={countdown}
        className="relative flex flex-col items-center justify-center px-6 py-5 rounded-2xl bg-slate-950/90 border backdrop-blur-md shadow-2xl animate-in zoom-in-75 duration-200 text-center"
        style={{
          boxShadow: `0 0 35px ${data.glow}`,
          borderColor: 'rgba(125, 211, 252, 0.35)',
        }}
      >
        {/* Celestial rotating rune ring */}
        <div
          className="absolute -inset-3 rounded-full border border-dashed border-cyan-400/30 animate-spin"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute -inset-1 rounded-full border border-sky-300/20 animate-spin"
          style={{ animationDuration: '3s', animationDirection: 'reverse' }}
        />

        {/* Large numeral / symbol */}
        <div className="relative">
          <div
            className={`font-serif text-5xl font-black tracking-wider bg-gradient-to-b ${data.color} bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,255,255,0.4)]`}
          >
            {data.numeral}
          </div>
        </div>

        {/* Chinese designation */}
        <div className="flex items-center gap-1.5 mt-1 font-serif text-base font-bold text-amber-200 tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
          <span>{data.chinese}</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
        </div>

        {/* Hint text */}
        <div className="text-[10px] text-slate-300/90 mt-1 font-serif tracking-wider font-medium">
          {data.subtitle}
        </div>
      </div>
    </div>
  );
};
