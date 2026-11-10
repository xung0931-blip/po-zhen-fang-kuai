/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PlayerData, ArrayBreakNotification, GameStats } from './types/game';
import { loadPlayerData, recordGameStats, resetPlayerData } from './services/playerData';
import { useTetris } from './hooks/useTetris';
import { Header } from './components/Header';
import { LevelSelect } from './components/LevelSelect';
import { Board } from './components/Board';
import { CountdownOverlay } from './components/CountdownOverlay';
import { HoldBox, NextQueueBox, SideStats } from './components/HoldNext';
import { TouchControls } from './components/TouchControls';
import { GoalModal } from './components/GoalModal';
import { BreakArrayFX } from './components/BreakArrayFX';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { getLevelConfig } from './config/levels';
import { Trophy, Play, RotateCcw } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'LOBBY' | 'GAME'>('LOBBY');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [playerData, setPlayerData] = useState<PlayerData>(() => loadPlayerData());
  const [activeNotification, setActiveNotification] = useState<ArrayBreakNotification | null>(null);
  const [rulesOpen, setRulesOpen] = useState<boolean>(false);
  const [lastGameResult, setLastGameResult] = useState<{
    stats: GameStats;
    goalAchieved: boolean;
  } | null>(null);

  const handleResetData = useCallback(() => {
    const fresh = resetPlayerData();
    setPlayerData(fresh);
    setSelectedLevel(1);
  }, []);

  // Sync player data across custom events and storage changes
  useEffect(() => {
    const handleDataUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<PlayerData>;
      if (customEvent.detail) {
        setPlayerData(customEvent.detail);
      } else {
        setPlayerData(loadPlayerData());
      }
    };

    window.addEventListener('xiaoxue_player_data_updated', handleDataUpdate);
    return () => {
      window.removeEventListener('xiaoxue_player_data_updated', handleDataUpdate);
    };
  }, []);

  // Goal achieved callback - Pauses game and opens GoalModal
  const handleGoalAchieved = useCallback((notification: ArrayBreakNotification) => {
    setActiveNotification(notification);
    // Reload player data to reflect +5 cultivation points and unlocked level
    setPlayerData(loadPlayerData());
  }, []);

  // Game over callback
  const handleGameOver = useCallback((finalStats: GameStats, goalAchieved: boolean) => {
    setLastGameResult({
      stats: finalStats,
      goalAchieved,
    });
    setPlayerData(loadPlayerData());
  }, []);

  // Tetris game hook
  const {
    board,
    currentPiece,
    ghostY,
    holdPiece,
    canHold,
    nextQueue,
    stats,
    isPlaying,
    isPaused,
    isGameOver,
    countdown,
    isStationaryBuffer,
    hasAchievedGoal,
    clearingLines,
    levelConfig,
    startGame,
    togglePause,
    resumeGameWithCountdown,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    hold,
  } = useTetris({
    selectedLevel,
    onGoalAchieved: handleGoalAchieved,
    onGameOver: handleGameOver,
  });

  const handleResumeFromGoalModal = useCallback(() => {
    setActiveNotification(null);
    resumeGameWithCountdown();
  }, [resumeGameWithCountdown]);

  const handleNextLevelFromGoalModal = useCallback((nextLvl: number) => {
    setActiveNotification(null);
    handleSelectLevel(nextLvl);
  }, []);

  // Start selected level
  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setView('GAME');
    setActiveNotification(null);
    setLastGameResult(null);
    setTimeout(() => {
      startGame();
    }, 50);
  };

  const handleRestartCurrentLevel = () => {
    setLastGameResult(null);
    setActiveNotification(null);
    startGame();
  };

  const handleBackToLobby = () => {
    if (isPlaying && !isGameOver) {
      // Record any progress achieved so far
      recordGameStats(stats.lines, stats.score);
    }
    setView('LOBBY');
    setLastGameResult(null);
    setActiveNotification(null);
    setPlayerData(loadPlayerData());
  };

  const activeLevelConfig = getLevelConfig(selectedLevel);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center overflow-x-hidden selection:bg-cyan-500/30 selection:text-white">
      {/* Background Image: Celestial Oriental Realm */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-screen pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundImage: `url('/src/assets/images/celestial_xianxia_bg_1794197345528.jpg')`,
        }}
      />

      {/* Atmospheric Starry Grid Overlay */}
      <div className="fixed inset-0 z-0 bg-radial from-transparent via-slate-950/70 to-slate-950 pointer-events-none" />

      {/* Main Container - 9:16 mobile frame on desktop, full responsive on mobile */}
      <div className="relative z-10 w-full max-w-[430px] h-[100dvh] max-h-[100dvh] flex flex-col justify-between bg-slate-950/75 border-x border-sky-900/30 shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Navigation & Header */}
        <Header
          inGame={view === 'GAME'}
          onBackToLobby={handleBackToLobby}
          onTogglePause={togglePause}
          isPaused={isPaused}
          onOpenRules={() => setRulesOpen(true)}
          playerTitle={playerData.breaker_title}
          cultivationPoints={playerData.cultivation_points}
        />

        {/* View Switching */}
        {view === 'LOBBY' ? (
          <LevelSelect
            playerData={playerData}
            onSelectLevel={handleSelectLevel}
            onOpenRules={() => setRulesOpen(true)}
            onResetData={handleResetData}
          />
        ) : (
          /* Active Game View */
          <main className="flex-1 flex flex-col justify-between pt-1 pb-1 px-2.5 overflow-hidden">
            {/* Top Level Goal & Status Bar */}
            <div className="rounded-xl bg-slate-950/85 border border-sky-900/50 px-2.5 py-1.5 backdrop-blur-sm shadow-md space-y-1 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xs text-white">
                    第{activeLevelConfig.level}關 · {activeLevelConfig.name}
                  </span>
                  <span className="text-[10px] text-amber-300 font-serif">
                    【{activeLevelConfig.title}】
                  </span>
                </div>

                {hasAchievedGoal ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/50">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    已破陣 (+5修為)
                  </span>
                ) : (
                  <span className="text-[10px] text-cyan-300 font-medium tabular-nums">
                    目標：{activeLevelConfig.targetLines} 行
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${
                      hasAchievedGoal
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-sm shadow-amber-400'
                        : 'bg-gradient-to-r from-cyan-400 to-sky-300'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (stats.lines / activeLevelConfig.targetLines) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[9.5px] text-slate-300 font-medium tabular-nums shrink-0">
                  {stats.lines} / {activeLevelConfig.targetLines} 行
                </span>
              </div>
            </div>

            {/* Matrix & Side HUDs: Aligned to top (items-start), naturally balanced in viewport */}
            <div className="relative flex items-start justify-center gap-1.5 my-auto">
              {/* Left Side: HOLD & Mini Stats (Aligned to top) */}
              <div className="flex flex-col gap-1 items-center shrink-0 pt-0.5">
                <HoldBox
                  holdPiece={holdPiece}
                  canHold={canHold}
                  onHoldClick={hold}
                />
                <SideStats
                  levelConfig={activeLevelConfig}
                  lines={stats.lines}
                  score={stats.score}
                  speed={stats.levelSpeed}
                  hasAchievedGoal={hasAchievedGoal}
                />
              </div>

              {/* Center: Tetris 10x20 Board (Anchored upward) */}
              <div className="relative shrink-0">
                <Board
                  board={board}
                  currentPiece={currentPiece}
                  ghostY={ghostY}
                  clearingLines={clearingLines}
                />

                {/* Countdown Buffer Overlay (3-2-1 凝神) */}
                <CountdownOverlay countdown={countdown} />

                {/* Pause Overlay - Only shown when paused manually, not during GoalModal */}
                {isPaused && !activeNotification && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-2xl bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
                    <div className="font-serif font-bold text-base text-amber-300 mb-1">
                      定神靜慮 · 暫停修行
                    </div>
                    <p className="text-xs text-slate-300 mb-4">
                      道心不亂，稍作調息
                    </p>
                    <button
                      onClick={togglePause}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all shadow-lg shadow-sky-900/50"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>繼續破陣</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Right Side: NEXT Queue & Element Stamp (Aligned to top) */}
              <div className="flex flex-col gap-1 items-center shrink-0 pt-0.5">
                <NextQueueBox nextQueue={nextQueue} />

                {/* Element Seal Stamp */}
                <div className="rounded-xl p-1.5 bg-slate-950/80 border border-sky-900/50 text-center w-[58px]">
                  <div className="text-[7.5px] text-slate-400">陣靈</div>
                  <div className="text-[11px] font-serif font-bold text-amber-300 mt-0.5">
                    {activeLevelConfig.element.slice(0, 2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Touch Controls: Permanently visible above bottom edge */}
            <div className="mt-auto shrink-0 pb-1">
              <TouchControls
                onMoveLeft={moveLeft}
                onMoveRight={moveRight}
                onMoveDown={moveDown}
                onRotate={() => rotate(true)}
                onHardDrop={hardDrop}
                onHold={hold}
                hasHoldPiece={holdPiece !== null}
                canHold={canHold}
                disabled={isPaused || isGameOver || countdown !== null || isStationaryBuffer}
              />
            </div>
          </main>
        )}

        {/* Game Over Modal */}
        {isGameOver && lastGameResult && (
          <GameOverModal
            stats={lastGameResult.stats}
            levelConfig={activeLevelConfig}
            goalAchieved={lastGameResult.goalAchieved}
            playerData={playerData}
            onRestart={handleRestartCurrentLevel}
            onSelectLevel={() => {
              setView('LOBBY');
              setLastGameResult(null);
            }}
            onNextLevel={() => {
              if (selectedLevel < 9) {
                handleSelectLevel(selectedLevel + 1);
              }
            }}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {/* Goal Achieved Victory Modal (Pauses game until player confirms) */}
        {activeNotification && (
          <GoalModal
            notification={activeNotification}
            levelConfig={activeLevelConfig}
            onResumeGame={handleResumeFromGoalModal}
            onNextLevel={handleNextLevelFromGoalModal}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {/* Rules & Lore Modal */}
        <RulesModal
          isOpen={rulesOpen}
          onClose={() => setRulesOpen(false)}
        />

        {/* Celestial Break Array Ascension Animation */}
        <BreakArrayFX notification={activeNotification} />
      </div>
    </div>
  );
}
