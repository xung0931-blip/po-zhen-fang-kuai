/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, HelpCircle, ArrowLeft, Pause, Play } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  inGame?: boolean;
  onBackToLobby?: () => void;
  onTogglePause?: () => void;
  isPaused?: boolean;
  onOpenRules: () => void;
  playerTitle: string;
  cultivationPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  inGame = false,
  onBackToLobby,
  onTogglePause,
  isPaused = false,
  onOpenRules,
  playerTitle,
  cultivationPoints,
}) => {
  const [isMuted, setIsMuted] = useState(() => sound.isMuted());

  const handleToggleSound = () => {
    const next = sound.toggleMute();
    setIsMuted(next);
  };

  return (
    <header className="w-full max-w-md mx-auto px-4 py-2.5 flex items-center justify-between border-b border-sky-900/40 bg-slate-950/70 backdrop-blur-md z-40 select-none">
      {/* Left Slot: Back button or Game Title */}
      <div className="flex items-center gap-2">
        {inGame && onBackToLobby ? (
          <button
            onClick={onBackToLobby}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 border border-slate-700/60 active:scale-95 transition-all"
            title="返回修行大廳"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>大廳</span>
          </button>
        ) : null}

        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-base tracking-wider bg-gradient-to-r from-sky-200 via-cyan-300 to-amber-200 bg-clip-text text-transparent drop-shadow-sm">
              破陣方塊
            </span>
            <span className="text-[10px] text-cyan-400/80 font-sans tracking-tight">
              Xiaoxue AI World
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <span className="text-amber-300 font-serif font-medium">{playerTitle}</span>
            <span aria-hidden="true">·</span>
            <span className="text-sky-300 tabular-nums">修為 {cultivationPoints} 點</span>
          </div>
        </div>
      </div>

      {/* Right Slot: Action buttons */}
      <div className="flex items-center gap-2">
        {inGame && onTogglePause && (
          <button
            onClick={onTogglePause}
            className={`p-2 rounded-lg border transition-all active:scale-95 ${
              isPaused
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white'
            }`}
            title={isPaused ? '繼續遊戲' : '暫停'}
            aria-label={isPaused ? '繼續遊戲' : '暫停'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>
        )}

        <button
          onClick={handleToggleSound}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white active:scale-95 transition-all"
          title={isMuted ? '開啟仙音' : '靜音'}
          aria-label={isMuted ? '開啟仙音' : '靜音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>

        <button
          onClick={onOpenRules}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white active:scale-95 transition-all"
          title="破陣修行法則"
          aria-label="破陣修行法則"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </header>
  );
};
