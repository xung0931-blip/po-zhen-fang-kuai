/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { BoardMatrix, ActivePiece, TetrominoType } from '../types/game';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BUFFER_HEIGHT,
  TETROMINO_STYLES,
} from '../utils/tetrisConstants';

interface BoardProps {
  board: BoardMatrix;
  currentPiece: ActivePiece | null;
  ghostY: number;
  clearingLines: number[];
}

export const Board: React.FC<BoardProps> = ({
  board,
  currentPiece,
  ghostY,
  clearingLines,
}) => {
  // Build composite 20x10 matrix (rows 2 to 21)
  const visibleGrid = useMemo(() => {
    // Start with placed cells
    const grid: {
      type: TetrominoType | null;
      isGhost: boolean;
      isActive: boolean;
      isClearing: boolean;
    }[][] = [];

    for (let r = BUFFER_HEIGHT; r < BUFFER_HEIGHT + BOARD_HEIGHT; r++) {
      const isLineClearing = clearingLines.includes(r);
      const row = [];
      for (let c = 0; c < BOARD_WIDTH; c++) {
        row.push({
          type: board[r][c],
          isGhost: false,
          isActive: false,
          isClearing: isLineClearing,
        });
      }
      grid.push(row);
    }

    // Overlay Ghost Piece
    if (currentPiece && ghostY !== currentPiece.y) {
      const { matrix, x } = currentPiece;
      for (let pr = 0; pr < matrix.length; pr++) {
        for (let pc = 0; pc < matrix[pr].length; pc++) {
          if (matrix[pr][pc] !== 0) {
            const gy = ghostY + pr - BUFFER_HEIGHT;
            const gx = x + pc;
            if (gy >= 0 && gy < BOARD_HEIGHT && gx >= 0 && gx < BOARD_WIDTH) {
              if (grid[gy][gx].type === null) {
                grid[gy][gx] = {
                  type: currentPiece.type,
                  isGhost: true,
                  isActive: false,
                  isClearing: false,
                };
              }
            }
          }
        }
      }
    }

    // Overlay Active Piece
    if (currentPiece) {
      const { matrix, x, y } = currentPiece;
      for (let pr = 0; pr < matrix.length; pr++) {
        for (let pc = 0; pc < matrix[pr].length; pc++) {
          if (matrix[pr][pc] !== 0) {
            const ay = y + pr - BUFFER_HEIGHT;
            const ax = x + pc;
            if (ay >= 0 && ay < BOARD_HEIGHT && ax >= 0 && ax < BOARD_WIDTH) {
              grid[ay][ax] = {
                type: currentPiece.type,
                isGhost: false,
                isActive: true,
                isClearing: false,
              };
            }
          }
        }
      }
    }

    return grid;
  }, [board, currentPiece, ghostY, clearingLines]);

  return (
    <div className="relative mx-auto flex items-center justify-center p-1 rounded-2xl bg-gradient-to-b from-sky-950/80 via-slate-950/95 to-slate-950/90 border-2 border-sky-500/40 shadow-2xl shadow-sky-900/50 backdrop-blur-md">
      {/* Ancient Daoist runic corner embellishments */}
      <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
      <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
      <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

      {/* Grid container scaled +30% to fill mobile viewport seamlessly */}
      <div
        className="grid grid-cols-10 gap-[1px] bg-slate-950/80 p-1 rounded-xl overflow-hidden border border-sky-900/60"
        style={{
          height: 'min(64vh, 540px)',
          width: 'min(32vh, 270px)',
        }}
      >
        {visibleGrid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            if (cell.isClearing) {
              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className="w-full h-full rounded-sm bg-gradient-to-r from-amber-200 via-white to-amber-200 animate-pulse shadow-md shadow-amber-300"
                />
              );
            }

            if (cell.type) {
              const style = TETROMINO_STYLES[cell.type];

              if (cell.isGhost) {
                return (
                  <div
                    key={`cell-${rIdx}-${cIdx}`}
                    className="w-full h-full rounded-sm border border-cyan-400/50 bg-cyan-500/10 flex items-center justify-center"
                    style={{
                      boxShadow: 'inset 0 0 4px rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    <span className="text-[7px] text-cyan-400/40 font-serif select-none">
                      {style.runeChar}
                    </span>
                  </div>
                );
              }

              // Solid or active piece with 3D bevel and celestial blue/gold glow
              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className={`w-full h-full rounded-sm relative flex items-center justify-center overflow-hidden transition-all duration-75 ${
                    cell.isActive ? 'scale-[1.02] z-10' : ''
                  }`}
                  style={{
                    background: cell.isActive
                      ? `linear-gradient(135deg, rgba(56, 189, 248, 0.95), rgba(14, 116, 144, 0.95))`
                      : `linear-gradient(135deg, rgba(30, 64, 175, 0.95), rgba(14, 116, 144, 0.9))`,
                    boxShadow: cell.isActive
                      ? `0 0 10px rgba(56, 189, 248, 0.8), inset 1px 1px 2px rgba(255, 255, 255, 0.7), inset -1px -1px 2px rgba(0, 0, 0, 0.6)`
                      : `0 0 6px rgba(14, 165, 233, 0.4), inset 1px 1px 2px rgba(255, 255, 255, 0.45), inset -1px -1px 2px rgba(0, 0, 0, 0.5)`,
                    border: cell.isActive
                      ? '1px solid rgba(224, 242, 254, 0.9)'
                      : '1px solid rgba(125, 211, 252, 0.5)',
                  }}
                >
                  {/* Inner bevel highlights */}
                  <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 h-[25%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  
                  {/* Daoist talisman seal watermark */}
                  <span className="text-[8px] font-serif font-bold text-sky-100/75 select-none drop-shadow-sm">
                    {style.runeChar}
                  </span>
                </div>
              );
            }

            // Empty cell with subtle starry grid marker
            return (
              <div
                key={`cell-${rIdx}-${cIdx}`}
                className="w-full h-full rounded-[1px] bg-slate-900/40 hover:bg-slate-800/20 border border-slate-800/30 flex items-center justify-center"
              >
                <div className="w-0.5 h-0.5 rounded-full bg-sky-900/30" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
