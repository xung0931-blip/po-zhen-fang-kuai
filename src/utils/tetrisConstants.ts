/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TetrominoType } from '../types/game';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BUFFER_HEIGHT = 2; // Extra rows above visible board for smooth spawn & rotations
export const TOTAL_ROWS = BOARD_HEIGHT + BUFFER_HEIGHT;

export const TETROMINOES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Celestial luminous styling per tetromino type (celestial blue, cyan, golden azure hues)
export interface BlockStyle {
  primary: string; // Tailwind/HEX class
  glow: string;
  border: string;
  highlight: string;
  shadow: string;
  textColor: string;
  runeChar: string; // Subtle daoist seal watermark on cell
}

export const TETROMINO_STYLES: Record<TetrominoType, BlockStyle> = {
  I: {
    primary: 'bg-cyan-400',
    glow: 'rgba(34, 211, 238, 0.7)',
    border: 'border-cyan-200',
    highlight: 'from-cyan-100 to-cyan-500',
    shadow: 'shadow-cyan-500/50',
    textColor: 'text-cyan-950',
    runeChar: '乾',
  },
  J: {
    primary: 'bg-blue-600',
    glow: 'rgba(37, 99, 235, 0.7)',
    border: 'border-blue-300',
    highlight: 'from-blue-300 to-blue-700',
    shadow: 'shadow-blue-600/50',
    textColor: 'text-blue-950',
    runeChar: '坎',
  },
  L: {
    primary: 'bg-amber-500',
    glow: 'rgba(245, 158, 11, 0.7)',
    border: 'border-amber-200',
    highlight: 'from-amber-200 to-amber-600',
    shadow: 'shadow-amber-500/50',
    textColor: 'text-amber-950',
    runeChar: '艮',
  },
  O: {
    primary: 'bg-yellow-400',
    glow: 'rgba(250, 204, 21, 0.7)',
    border: 'border-yellow-100',
    highlight: 'from-yellow-100 to-yellow-500',
    shadow: 'shadow-yellow-400/50',
    textColor: 'text-yellow-950',
    runeChar: '坤',
  },
  S: {
    primary: 'bg-emerald-400',
    glow: 'rgba(52, 211, 153, 0.7)',
    border: 'border-emerald-200',
    highlight: 'from-emerald-200 to-emerald-600',
    shadow: 'shadow-emerald-500/50',
    textColor: 'text-emerald-950',
    runeChar: '震',
  },
  T: {
    primary: 'bg-indigo-400',
    glow: 'rgba(129, 140, 248, 0.7)',
    border: 'border-indigo-200',
    highlight: 'from-indigo-200 to-indigo-600',
    shadow: 'shadow-indigo-500/50',
    textColor: 'text-indigo-950',
    runeChar: '離',
  },
  Z: {
    primary: 'bg-sky-500',
    glow: 'rgba(14, 165, 233, 0.7)',
    border: 'border-sky-200',
    highlight: 'from-sky-200 to-sky-600',
    shadow: 'shadow-sky-500/50',
    textColor: 'text-sky-950',
    runeChar: '兌',
  },
};

// SRS Wall-Kick Offsets for Standard Rotations
export const WALL_KICK_DATA: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '1->0': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '1->2': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
  '2->1': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
  '2->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
  '3->2': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '3->0': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  '0->3': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
};

export const WALL_KICK_I_DATA: Record<string, [number, number][]> = {
  '0->1': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '1->0': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '1->2': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
  '2->1': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '2->3': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
  '3->2': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
  '3->0': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  '0->3': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
};
