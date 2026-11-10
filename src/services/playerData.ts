/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlayerData } from '../types/game';
import { CULTIVATION_REWARD_PER_CLEAR, getTitleForLevel } from '../config/levels';

const STORAGE_KEY = 'xiaoxue_breaker_player_data_v4';

// Clear legacy test data from prior iterations to ensure clean zeroed state
try {
  localStorage.removeItem('xiaoxue_breaker_player_data');
  localStorage.removeItem('xiaoxue_breaker_player_data_v2');
  localStorage.removeItem('xiaoxue_breaker_player_data_v3');
} catch (e) {
  // Ignore in SSR / iframe
}

const DEFAULT_PLAYER_DATA: PlayerData = {
  breaker_highest_level: 1,
  breaker_title: '初入陣門',
  breaker_total_lines: 0,
  breaker_highest_score: 0,
  breaker_completed_levels: [],
  cultivation_points: 0,
};

/**
 * Loads the current player data from persistent storage.
 */
export function loadPlayerData(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePlayerData(DEFAULT_PLAYER_DATA);
      return { ...DEFAULT_PLAYER_DATA };
    }
    const parsed = JSON.parse(raw);
    return {
      breaker_highest_level: Math.max(1, Math.min(9, Number(parsed.breaker_highest_level) || 1)),
      breaker_title: parsed.breaker_title || getTitleForLevel(Number(parsed.breaker_highest_level) || 1),
      breaker_total_lines: Number(parsed.breaker_total_lines) || 0,
      breaker_highest_score: Number(parsed.breaker_highest_score) || 0,
      breaker_completed_levels: Array.isArray(parsed.breaker_completed_levels)
        ? parsed.breaker_completed_levels
        : [],
      cultivation_points: Number(parsed.cultivation_points) || 0,
    };
  } catch (err) {
    console.warn('Failed to load player data from localStorage:', err);
    return { ...DEFAULT_PLAYER_DATA };
  }
}

/**
 * Resets all progress, clear records, titles, and cultivation points back to 0.
 */
export function resetPlayerData(): PlayerData {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('xiaoxue_breaker_player_data');
    localStorage.removeItem('xiaoxue_breaker_player_data_v2');
    localStorage.removeItem('xiaoxue_breaker_player_data_v3');
  } catch (err) {}
  const fresh = { ...DEFAULT_PLAYER_DATA };
  savePlayerData(fresh);
  return fresh;
}

/**
 * Saves player data to storage.
 */
export function savePlayerData(data: PlayerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('xiaoxue_player_data_updated', { detail: data }));
  } catch (err) {
    console.error('Failed to save player data:', err);
  }
}

export interface RecordClearResult {
  previousHighest: number;
  newHighest: number;
  unlockedLevel: number | null; // e.g. 2 if unlocked, null if replaying lower or max
  unlockedTitle: string | null;
  cultivationAdded: number;
  totalCultivation: number;
}

/**
 * Records that a chosen level has met its target lines goal.
 * Called exactly ONCE per game session when the target is reached.
 * 
 * Rules:
 * - Fixed +5 common cultivation points
 * - If current level == breaker_highest_level and level < 9:
 *     unlock next level (highest_level + 1)
 *     update title to match highest unlocked level
 * - If level < breaker_highest_level:
 *     do not decrease title or highest level
 * - If level == 9:
 *     already max level, no further level unlock
 */
export function recordLevelCompletion(levelCleared: number): RecordClearResult {
  const current = loadPlayerData();
  const previousHighest = current.breaker_highest_level;
  let newHighest = previousHighest;
  let unlockedLevel: number | null = null;
  let unlockedTitle: string | null = null;

  // Check if this cleared level unlocks the next stage
  if (levelCleared === previousHighest && previousHighest < 9) {
    newHighest = previousHighest + 1;
    unlockedLevel = newHighest;
    unlockedTitle = getTitleForLevel(newHighest);
  }

  // Update completed levels set
  const completedSet = new Set(current.breaker_completed_levels);
  completedSet.add(levelCleared);

  // Cultivation points always +5
  const cultivationAdded = CULTIVATION_REWARD_PER_CLEAR;
  const totalCultivation = current.cultivation_points + cultivationAdded;

  // Title always reflects highest unlocked level
  const updatedTitle = getTitleForLevel(newHighest);

  const updatedData: PlayerData = {
    ...current,
    breaker_highest_level: newHighest,
    breaker_title: updatedTitle,
    breaker_completed_levels: Array.from(completedSet).sort((a, b) => a - b),
    cultivation_points: totalCultivation,
  };

  savePlayerData(updatedData);

  return {
    previousHighest,
    newHighest,
    unlockedLevel,
    unlockedTitle,
    cultivationAdded,
    totalCultivation,
  };
}

/**
 * Updates post-game run statistics (accumulated lines, high score).
 */
export function recordGameStats(linesClearedInRun: number, scoreInRun: number): PlayerData {
  const current = loadPlayerData();
  const updatedData: PlayerData = {
    ...current,
    breaker_total_lines: current.breaker_total_lines + linesClearedInRun,
    breaker_highest_score: Math.max(current.breaker_highest_score, scoreInRun),
  };
  savePlayerData(updatedData);
  return updatedData;
}
