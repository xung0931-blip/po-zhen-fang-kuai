/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCw,
  Zap,
  Bookmark,
  ArrowLeftRight,
} from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  hasHoldPiece?: boolean;
  canHold?: boolean;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  hasHoldPiece = false,
  canHold = true,
  disabled = false,
}) => {
  // Auto-repeat timers for smooth DAS (Delayed Auto Shift)
  const repeatTimerRef = useRef<number | null>(null);
  const intervalTimerRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (repeatTimerRef.current) {
      window.clearTimeout(repeatTimerRef.current);
      repeatTimerRef.current = null;
    }
    if (intervalTimerRef.current) {
      window.clearInterval(intervalTimerRef.current);
      intervalTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startRepeating = (action: () => void) => {
    if (disabled) return;
    clearTimers();
    action();

    // Standard DAS: 180ms delay, then repeat every 55ms
    repeatTimerRef.current = window.setTimeout(() => {
      intervalTimerRef.current = window.setInterval(() => {
        action();
      }, 55);
    }, 180);
  };

  return (
    <div className="w-full max-w-sm mx-auto px-3 select-none touch-none py-1">
      <div className="grid grid-cols-2 gap-3 items-center">
        {/* Left Hand: Movement Cluster */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-950/60 rounded-2xl border border-sky-900/50 backdrop-blur-sm shadow-inner">
          {/* Left Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              startRepeating(onMoveLeft);
            }}
            onPointerUp={clearTimers}
            onPointerLeave={clearTimers}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-b from-sky-900/80 to-slate-900 border border-sky-600/50 text-cyan-200 active:scale-90 active:bg-cyan-700/80 transition-transform shadow-md"
            aria-label="向左移動"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Soft Drop Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              startRepeating(onMoveDown);
            }}
            onPointerUp={clearTimers}
            onPointerLeave={clearTimers}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-b from-sky-900/80 to-slate-900 border border-sky-600/50 text-cyan-200 active:scale-90 active:bg-cyan-700/80 transition-transform shadow-md"
            aria-label="加速下落"
          >
            <ArrowDown className="w-6 h-6" />
          </button>

          {/* Right Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              startRepeating(onMoveRight);
            }}
            onPointerUp={clearTimers}
            onPointerLeave={clearTimers}
            className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-b from-sky-900/80 to-slate-900 border border-sky-600/50 text-cyan-200 active:scale-90 active:bg-cyan-700/80 transition-transform shadow-md"
            aria-label="向右移動"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Right Hand: Action Cluster */}
        <div className="flex items-center justify-center gap-2 p-1 bg-slate-950/60 rounded-2xl border border-sky-900/50 backdrop-blur-sm shadow-inner">
          {/* Dynamic HOLD / SWAP Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              onHold();
            }}
            className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-transform shadow-md ${
              hasHoldPiece
                ? canHold
                  ? 'bg-gradient-to-b from-cyan-900/80 to-slate-900 border border-cyan-500/70 text-cyan-200 active:scale-90 active:border-cyan-300 shadow-cyan-950'
                  : 'bg-slate-900 border border-slate-700/60 text-slate-500 opacity-60'
                : 'bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-600/60 text-slate-300 active:scale-90 active:border-cyan-400'
            }`}
            aria-label={hasHoldPiece ? '互換方塊 (SWAP)' : '保留方塊 (HOLD)'}
          >
            {hasHoldPiece ? (
              <ArrowLeftRight className={`w-4 h-4 ${canHold ? 'text-cyan-300' : 'text-slate-500'}`} />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span className="text-[8px] font-medium mt-0.5">
              {hasHoldPiece ? 'SWAP' : 'HOLD'}
            </span>
          </button>

          {/* Hard Drop Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              onHardDrop();
            }}
            className="w-11 h-11 rounded-xl flex flex-col items-center justify-center bg-gradient-to-b from-amber-900/70 to-slate-900 border border-amber-500/60 text-amber-300 active:scale-90 active:bg-amber-600 active:text-white transition-transform shadow-md"
            aria-label="瞬間直接落下"
          >
            <Zap className="w-4 h-4" />
            <span className="text-[8px] font-medium mt-0.5">落陣</span>
          </button>

          {/* Large Rotate Button */}
          <button
            type="button"
            disabled={disabled}
            onPointerDown={(e) => {
              e.preventDefault();
              onRotate();
            }}
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-b from-sky-600 to-blue-800 border-2 border-cyan-300/80 text-white active:scale-90 active:shadow-cyan-400/80 transition-transform shadow-lg shadow-sky-900/50"
            aria-label="旋轉方塊"
          >
            <RotateCw className="w-6 h-6 text-white drop-shadow-sm" />
            <span className="text-[9px] font-bold tracking-tight">旋轉</span>
          </button>
        </div>
      </div>
    </div>
  );
};
