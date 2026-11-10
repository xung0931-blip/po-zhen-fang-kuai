/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export type CellValue = TetrominoType | null;

export type BoardMatrix = CellValue[][];

export interface Position {
  x: number;
  y: number;
}

export interface ActivePiece {
  type: TetrominoType;
  matrix: number[][];
  x: number;
  y: number;
}

export interface LevelConfig {
  level: number;
  name: string; // 陣法名稱, e.g. "仙門石鎖"
  targetLines: number; // 消除行數目標, e.g. 20, 40, ...
  title: string; // 專屬稱號, e.g. "初入陣門"
  element: string; // 靈氣屬性, e.g. "青玄水靈"
  description: string; // 陣法奧秘
  flavorText: string; // 修行寄語
}

export interface PlayerData {
  breaker_highest_level: number; // 目前最高解鎖關卡 (1-9)
  breaker_title: string; // 目前專屬稱號
  breaker_total_lines: number; // 累積消除行數
  breaker_highest_score: number; // 歷史最高分
  breaker_completed_levels: number[]; // 已完成關卡紀錄
  cultivation_points: number; // 總大廳共通修為 (+5 每次破陣)
}

export type GameState = 'LOBBY' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';

export interface GameStats {
  score: number;
  lines: number;
  levelSpeed: number;
  combo: number;
  backToBack: boolean;
  lastClearType: string | null;
}

export interface ArrayBreakNotification {
  id: string;
  level: number;
  levelName: string;
  unlockedLevel: number | null;
  unlockedTitle: string | null;
  cultivationAdded: number;
  timestamp: number;
}
