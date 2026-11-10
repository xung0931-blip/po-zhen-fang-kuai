/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TetrominoType, LevelConfig } from '../types/game';
import { TETROMINOES, TETROMINO_STYLES } from '../utils/tetrisConstants';
import { Lock, Layers, ArrowLeftRight, Bookmark } from 'lucide-react';

interface MiniPieceProps {
  type: TetrominoType | null;
  dimmed?: boolean;
}

const MiniPiece: React.FC<MiniPieceProps> = ({ type, dimmed }) => {
  if (!type) {
    return (
      <div className="w-12 h-12 flex items-center justify-center text-slate-600 text-xs font-serif">
        空
      </div>
    );
  }

  const matrix = TETROMINOES[type];
  const style = TETROMINO_STYLES[type];

  return (
    <div
      className={`grid gap-[1px] p-1 rounded transition-opacity duration-200 ${
        dimmed ? 'opacity-40' : 'opacity-100'
      }`}
      style={{
        gridTemplateColumns: `repeat(${matrix[0].length}, 11px)`,
        gridTemplateRows: `repeat(${matrix.length}, 11px)`,
      }}
    >
      {matrix.map((row, r) =>
        row.map((val, c) => (
          <div
            key={`mini-${r}-${c}`}
            className="w-[11px] h-[11px] rounded-[1px] flex items-center justify-center"
            style={{
              background:
                val === 1
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.95), rgba(14, 116, 144, 0.9))'
                  : 'transparent',
              boxShadow:
                val === 1
                  ? '0 0 5px rgba(56, 189, 248, 0.5), inset 1px 1px 1px rgba(255, 255, 255, 0.6)'
                  : 'none',
              border: val === 1 ? '0.5px solid rgba(224, 242, 254, 0.8)' : 'none',
            }}
          >
            {val === 1 && (
              <span className="text-[6px] font-serif text-white/80 font-bold">
                {style.runeChar}
              </span>
            )}
          </div>
        ))
      )}
    </div>
  );
};

interface HoldBoxProps {
  holdPiece: TetrominoType | null;
  canHold: boolean;
  onHoldClick?: () => void;
}

export const HoldBox: React.FC<HoldBoxProps> = ({ holdPiece, canHold, onHoldClick }) => {
  const isSwapMode = holdPiece !== null;

  return (
    <div
      onClick={onHoldClick}
      className={`flex flex-col items-center justify-center rounded-xl p-1.5 bg-slate-950/80 border transition-all duration-150 ${
        isSwapMode
          ? 'border-cyan-500/70 shadow-sm shadow-cyan-950'
          : 'border-sky-800/60'
      } backdrop-blur-sm ${
        canHold ? 'cursor-pointer hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10' : 'opacity-70 cursor-not-allowed'
      }`}
      style={{ minWidth: '58px', width: '58px' }}
      title={isSwapMode ? (canHold ? '點擊互換當前方塊 (SWAP)' : '此方塊落盤後解鎖互換') : '點擊將當前方塊保留存入 (HOLD)'}
    >
      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider">
        {isSwapMode ? (
          <span className="text-cyan-300 flex items-center gap-0.5">
            <ArrowLeftRight className="w-2.5 h-2.5 text-cyan-400" />
            SWAP
          </span>
        ) : (
          <span className="text-sky-300 flex items-center gap-0.5">
            <Bookmark className="w-2.5 h-2.5 text-sky-400" />
            HOLD
          </span>
        )}
        {!canHold && <Lock className="w-2.5 h-2.5 text-amber-400" />}
      </div>
      <div className="h-11 flex items-center justify-center">
        <MiniPiece type={holdPiece} dimmed={!canHold} />
      </div>
      <span className="text-[7.5px] text-slate-400">
        {!isSwapMode
          ? '點擊暫存'
          : canHold
          ? '點擊互換'
          : '落定解鎖'}
      </span>
    </div>
  );
};

interface NextQueueBoxProps {
  nextQueue: TetrominoType[];
}

export const NextQueueBox: React.FC<NextQueueBoxProps> = ({ nextQueue }) => {
  const previewPieces = nextQueue.slice(0, 3);

  return (
    <div
      className="flex flex-col items-center rounded-xl p-1.5 bg-slate-950/80 border border-sky-800/60 backdrop-blur-sm"
      style={{ minWidth: '58px', width: '58px' }}
    >
      <div className="flex items-center gap-1 text-[9px] text-sky-300 font-semibold tracking-wider">
        <Layers className="w-2.5 h-2.5 text-sky-400" />
        <span>NEXT</span>
      </div>
      <div className="flex flex-col items-center gap-1 my-0.5">
        {previewPieces.map((piece, idx) => (
          <div
            key={`next-${idx}`}
            className={`flex items-center justify-center ${
              idx === 0 ? 'scale-100 py-0.5' : 'scale-80 opacity-70'
            }`}
          >
            <MiniPiece type={piece} />
          </div>
        ))}
      </div>
      <span className="text-[8px] text-slate-400">預覽</span>
    </div>
  );
};

interface SideStatsProps {
  levelConfig: LevelConfig;
  lines: number;
  score: number;
  speed: number;
  hasAchievedGoal: boolean;
}

export const SideStats: React.FC<SideStatsProps> = ({
  levelConfig,
  lines,
  score,
  speed,
  hasAchievedGoal,
}) => {
  const target = levelConfig.targetLines;
  const progressPercent = Math.min(100, Math.round((lines / target) * 100));

  return (
    <div className="flex flex-col gap-1 w-[58px] text-left">
      {/* Target Progress Card */}
      <div className="rounded-xl p-1.5 bg-slate-950/80 border border-sky-800/60">
        <div className="text-[7.5px] text-slate-400">破陣進度</div>
        <div className="text-[10px] font-bold text-amber-300 tabular-nums leading-tight">
          {lines}<span className="text-[7px] text-slate-400 font-normal">/{target}</span>
        </div>
        
        {/* Micro progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              hasAchievedGoal ? 'bg-amber-400 shadow-sm shadow-amber-400' : 'bg-cyan-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[7px] text-slate-400 text-right mt-0.5 tabular-nums">
          {progressPercent}%
        </div>
      </div>

      {/* Score */}
      <div className="rounded-xl p-1.5 bg-slate-950/80 border border-sky-800/60">
        <div className="text-[7.5px] text-slate-400">得分</div>
        <div className="text-[10px] font-bold text-cyan-300 tabular-nums truncate leading-tight">
          {score.toLocaleString()}
        </div>
      </div>

      {/* Fall Speed */}
      <div className="rounded-xl p-1.5 bg-slate-950/80 border border-sky-800/60">
        <div className="text-[7.5px] text-slate-400">靈速</div>
        <div className="text-[10px] font-bold text-slate-200 tabular-nums leading-tight">
          Lv.{speed}
        </div>
      </div>
    </div>
  );
};
