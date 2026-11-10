/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  TetrominoType,
  BoardMatrix,
  ActivePiece,
  GameStats,
  ArrayBreakNotification,
} from '../types/game';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TOTAL_ROWS,
  BUFFER_HEIGHT,
  TETROMINOES,
  WALL_KICK_DATA,
  WALL_KICK_I_DATA,
} from '../utils/tetrisConstants';
import { sound } from '../utils/audio';
import { recordLevelCompletion, recordGameStats } from '../services/playerData';
import { getLevelConfig } from '../config/levels';

function createEmptyBoard(): BoardMatrix {
  return Array.from({ length: TOTAL_ROWS }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

// 7-bag randomizer
function generateBag(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

// Matrix rotation
function rotateMatrix(matrix: number[][], clockwise: boolean = true): number[][] {
  const n = matrix.length;
  const result = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (clockwise) {
        result[c][n - 1 - r] = matrix[r][c];
      } else {
        result[n - 1 - c][r] = matrix[r][c];
      }
    }
  }
  return result;
}

function checkCollision(
  board: BoardMatrix,
  matrix: number[][],
  posX: number,
  posY: number
): boolean {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        const boardX = posX + c;
        const boardY = posY + r;

        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= TOTAL_ROWS) {
          return true;
        }

        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

export interface UseTetrisOptions {
  selectedLevel: number;
  onGoalAchieved: (notification: ArrayBreakNotification) => void;
  onGameOver: (finalStats: GameStats, goalAchieved: boolean) => void;
}

export function useTetris({ selectedLevel, onGoalAchieved, onGameOver }: UseTetrisOptions) {
  const levelConfig = getLevelConfig(selectedLevel);

  const [board, setBoard] = useState<BoardMatrix>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<ActivePiece | null>(null);
  const [rotationIndex, setRotationIndex] = useState<number>(0);
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState<boolean>(true);
  const [nextQueue, setNextQueue] = useState<TetrominoType[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null); // 3 -> 2 -> 1 -> 0 (破陣) -> null
  const [isStationaryBuffer, setIsStationaryBuffer] = useState<boolean>(false); // 屏幕背後的遊戲畫面停留 1.5 秒鐘

  // Run stats
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lines: 0,
    levelSpeed: 1,
    combo: 0,
    backToBack: false,
    lastClearType: null,
  });

  // Track if this single game run already completed the chosen level goal
  const [hasAchievedGoal, setHasAchievedGoal] = useState<boolean>(false);

  // Cleared lines animation flash
  const [clearingLines, setClearingLines] = useState<number[]>([]);

  // Refs for loop management and atomic synchronization
  const bagRef = useRef<TetrominoType[]>([]);
  const lockTimerRef = useRef<number | null>(null);
  const lockResetsRef = useRef<number>(0);
  const fallTimerRef = useRef<number | null>(null);
  const isLockingRef = useRef<boolean>(false);
  const currentPieceRef = useRef<ActivePiece | null>(null);
  currentPieceRef.current = currentPiece;
  const boardRef = useRef<BoardMatrix>(board);
  boardRef.current = board;
  const rotationIndexRef = useRef<number>(rotationIndex);
  rotationIndexRef.current = rotationIndex;
  const statsRef = useRef<GameStats>(stats);
  statsRef.current = stats;
  const hasAchievedGoalRef = useRef<boolean>(hasAchievedGoal);
  hasAchievedGoalRef.current = hasAchievedGoal;
  const selectedLevelRef = useRef<number>(selectedLevel);
  selectedLevelRef.current = selectedLevel;

  // Helper to reliably cancel lock delay
  const clearLockTimer = useCallback(() => {
    if (lockTimerRef.current !== null) {
      window.clearTimeout(lockTimerRef.current);
      lockTimerRef.current = null;
    }
  }, []);

  // Next piece generation helper
  const pullNextPiece = useCallback((): TetrominoType => {
    if (bagRef.current.length < 7) {
      bagRef.current = [...bagRef.current, ...generateBag()];
    }
    const next = bagRef.current.shift()!;
    return next;
  }, []);

  // Spawn a new piece with full state isolation from previous piece
  const spawnPiece = useCallback(
    (typeToSpawn?: TetrominoType) => {
      clearLockTimer();
      isLockingRef.current = false;

      // Ensure queue is populated
      let queue = [...nextQueue];
      while (queue.length < 5) {
        queue.push(pullNextPiece());
      }
      const type = typeToSpawn || queue.shift()!;
      setNextQueue(queue);

      const matrix = TETROMINOES[type];
      const startX = Math.floor((BOARD_WIDTH - matrix[0].length) / 2);
      const startY = 0; // Buffer area

      // Check immediate game over if spawn collides with current board
      if (checkCollision(boardRef.current, matrix, startX, startY)) {
        setIsGameOver(true);
        setIsPlaying(false);
        sound.playGameOver();
        recordGameStats(statsRef.current.lines, statsRef.current.score);
        onGameOver(statsRef.current, hasAchievedGoalRef.current);
        return;
      }

      const piece: ActivePiece = {
        type,
        matrix,
        x: startX,
        y: startY,
      };

      currentPieceRef.current = piece;
      setCurrentPiece(piece);
      setRotationIndex(0);
      setCanHold(true);
      lockResetsRef.current = 0;
    },
    [clearLockTimer, nextQueue, onGameOver, pullNextPiece]
  );

  // Compute ghost piece position using latest board
  const getGhostY = useCallback((): number => {
    const piece = currentPieceRef.current;
    if (!piece) return 0;
    let ghostY = piece.y;
    while (!checkCollision(boardRef.current, piece.matrix, piece.x, ghostY + 1)) {
      ghostY++;
    }
    return ghostY;
  }, []);

  // Lock the current piece into the board cleanly and atomically
  const lockPiece = useCallback(() => {
    clearLockTimer();

    // Prevent concurrent locking
    if (isLockingRef.current) return;
    isLockingRef.current = true;

    const piece = currentPieceRef.current;
    if (!piece) {
      isLockingRef.current = false;
      return;
    }

    // Immediately detach active piece so it cannot linger or interfere
    currentPieceRef.current = null;
    setCurrentPiece(null);

    const currentBoard = boardRef.current;
    const newBoard = currentBoard.map((row) => [...row]);

    // Stamp piece into the board
    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c] !== 0) {
          const by = piece.y + r;
          const bx = piece.x + c;
          if (by >= 0 && by < TOTAL_ROWS && bx >= 0 && bx < BOARD_WIDTH) {
            newBoard[by][bx] = piece.type;
          }
        }
      }
    }

    // Synchronize ref immediately for instant subsequent collision calculations
    boardRef.current = newBoard;

    // Identify full lines
    const fullLineIndices: number[] = [];
    for (let r = 0; r < TOTAL_ROWS; r++) {
      if (newBoard[r].every((cell) => cell !== null)) {
        fullLineIndices.push(r);
      }
    }

    if (fullLineIndices.length > 0) {
      sound.playLineClear(fullLineIndices.length);
      setClearingLines(fullLineIndices);

      // Brief animation settle
      setTimeout(() => {
        // Remove cleared rows and insert empty rows at top
        const filteredBoard = newBoard.filter((_, idx) => !fullLineIndices.includes(idx));
        const emptyRows = Array.from({ length: fullLineIndices.length }, () =>
          Array.from({ length: BOARD_WIDTH }, () => null)
        );
        const resolvedBoard = [...emptyRows, ...filteredBoard];
        
        boardRef.current = resolvedBoard;
        setBoard(resolvedBoard);
        setClearingLines([]);

        // Score calculation
        const clearedCount = fullLineIndices.length;
        const currentStats = statsRef.current;
        const newLines = currentStats.lines + clearedCount;
        const basePoints =
          clearedCount === 1 ? 100 :
          clearedCount === 2 ? 300 :
          clearedCount === 3 ? 500 : 800;
        const combo = currentStats.combo + 1;
        const levelSpeed = Math.min(15, Math.floor(newLines / 10) + 1);
        const gainedScore = (basePoints * levelSpeed) + (combo > 1 ? combo * 50 * levelSpeed : 0);

        const newStats: GameStats = {
          score: currentStats.score + gainedScore,
          lines: newLines,
          levelSpeed,
          combo,
          backToBack: clearedCount === 4,
          lastClearType:
            clearedCount === 4 ? '九天破陣 (Tetris!)' :
            clearedCount === 3 ? '三才消融' :
            clearedCount === 2 ? '雙儀互化' : '一元破陣',
        };
        statsRef.current = newStats;
        setStats(newStats);

        // Check level goal achievement
        const target = levelConfig.targetLines;
        if (newLines >= target && !hasAchievedGoalRef.current) {
          hasAchievedGoalRef.current = true;
          setHasAchievedGoal(true);
          sound.playGoalAchieved();

          // 終止／暫停後面的遊戲進度，彈出達成目標確認視窗
          setIsPaused(true);
          clearLockTimer();
          if (fallTimerRef.current) {
            clearInterval(fallTimerRef.current);
            fallTimerRef.current = null;
          }

          // Save progress & award +5 cultivation
          const clearResult = recordLevelCompletion(selectedLevelRef.current);

          onGoalAchieved({
            id: `break-${Date.now()}`,
            level: selectedLevelRef.current,
            levelName: levelConfig.name,
            unlockedLevel: clearResult.unlockedLevel,
            unlockedTitle: clearResult.unlockedTitle,
            cultivationAdded: clearResult.cultivationAdded,
            timestamp: Date.now(),
          });
        }

        spawnPiece();
      }, 140);
    } else {
      setBoard(newBoard);
      setStats((prev) => ({
        ...prev,
        combo: 0,
        lastClearType: null,
      }));
      spawnPiece();
    }
  }, [clearLockTimer, levelConfig.name, levelConfig.targetLines, onGoalAchieved, spawnPiece]);

  // Movement handlers with proper on-ground and in-air state detection
  const moveLeft = useCallback(() => {
    if (isLockingRef.current || !currentPiece || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
    if (!checkCollision(boardRef.current, currentPiece.matrix, currentPiece.x - 1, currentPiece.y)) {
      const nextX = currentPiece.x - 1;
      const updatedPiece = { ...currentPiece, x: nextX };
      currentPieceRef.current = updatedPiece;
      setCurrentPiece(updatedPiece);
      sound.playMove();

      // Check if piece is touching ground at new position
      const onGround = checkCollision(boardRef.current, updatedPiece.matrix, nextX, updatedPiece.y + 1);
      if (onGround) {
        if (lockResetsRef.current < 15) {
          lockResetsRef.current++;
          clearLockTimer();
          lockTimerRef.current = window.setTimeout(lockPiece, 500);
        }
      } else {
        // Moved off ledge into empty air: CANCEL lock timer so it doesn't freeze in mid-air
        clearLockTimer();
      }
    }
  }, [clearLockTimer, countdown, currentPiece, isGameOver, isPaused, isStationaryBuffer, lockPiece]);

  const moveRight = useCallback(() => {
    if (isLockingRef.current || !currentPiece || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
    if (!checkCollision(boardRef.current, currentPiece.matrix, currentPiece.x + 1, currentPiece.y)) {
      const nextX = currentPiece.x + 1;
      const updatedPiece = { ...currentPiece, x: nextX };
      currentPieceRef.current = updatedPiece;
      setCurrentPiece(updatedPiece);
      sound.playMove();

      const onGround = checkCollision(boardRef.current, updatedPiece.matrix, nextX, updatedPiece.y + 1);
      if (onGround) {
        if (lockResetsRef.current < 15) {
          lockResetsRef.current++;
          clearLockTimer();
          lockTimerRef.current = window.setTimeout(lockPiece, 500);
        }
      } else {
        clearLockTimer();
      }
    }
  }, [clearLockTimer, countdown, currentPiece, isGameOver, isPaused, isStationaryBuffer, lockPiece]);

  const moveDown = useCallback(() => {
    if (isLockingRef.current || !currentPiece || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
    if (!checkCollision(boardRef.current, currentPiece.matrix, currentPiece.x, currentPiece.y + 1)) {
      const nextY = currentPiece.y + 1;
      const updatedPiece = { ...currentPiece, y: nextY };
      currentPieceRef.current = updatedPiece;
      setCurrentPiece(updatedPiece);
      setStats((s) => ({ ...s, score: s.score + 1 }));

      // If after moving down it is now on ground, start lock timer
      if (checkCollision(boardRef.current, updatedPiece.matrix, updatedPiece.x, nextY + 1)) {
        if (!lockTimerRef.current) {
          lockTimerRef.current = window.setTimeout(lockPiece, 500);
        }
      } else {
        clearLockTimer();
      }
    } else {
      // Piece is already touching ground
      if (!lockTimerRef.current) {
        lockTimerRef.current = window.setTimeout(lockPiece, 500);
      }
    }
  }, [clearLockTimer, countdown, currentPiece, isGameOver, isPaused, isStationaryBuffer, lockPiece]);

  const hardDrop = useCallback(() => {
    if (isLockingRef.current || !currentPiece || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
    clearLockTimer();

    const targetY = getGhostY();
    const dropDistance = targetY - currentPiece.y;

    sound.playHardDrop();
    setStats((s) => ({ ...s, score: s.score + dropDistance * 2 }));

    // Prepare updated piece at target location and lock directly
    currentPieceRef.current = {
      ...currentPiece,
      y: targetY,
    };
    lockPiece();
  }, [clearLockTimer, countdown, currentPiece, getGhostY, isGameOver, isPaused, isStationaryBuffer, lockPiece]);

  const rotate = useCallback(
    (clockwise: boolean = true) => {
      if (isLockingRef.current || !currentPiece || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
      if (currentPiece.type === 'O') return; // O doesn't rotate

      const newMatrix = rotateMatrix(currentPiece.matrix, clockwise);
      const fromRot = rotationIndex;
      const toRot = clockwise ? (fromRot + 1) % 4 : (fromRot + 3) % 4;
      const kickKey = `${fromRot}->${toRot}`;

      const kickTable = currentPiece.type === 'I' ? WALL_KICK_I_DATA : WALL_KICK_DATA;
      const tests = kickTable[kickKey] || [[0, 0]];

      for (const [ox, oy] of tests) {
        const testX = currentPiece.x + ox;
        const testY = currentPiece.y - oy; // Inversion for standard Y coords

        if (!checkCollision(boardRef.current, newMatrix, testX, testY)) {
          const updatedPiece = { ...currentPiece, matrix: newMatrix, x: testX, y: testY };
          currentPieceRef.current = updatedPiece;
          setCurrentPiece(updatedPiece);
          setRotationIndex(toRot);
          sound.playRotate();

          // Check if piece is touching ground after rotation
          const onGround = checkCollision(boardRef.current, newMatrix, testX, testY + 1);
          if (onGround) {
            if (lockResetsRef.current < 15) {
              lockResetsRef.current++;
              clearLockTimer();
              lockTimerRef.current = window.setTimeout(lockPiece, 500);
            }
          } else {
            clearLockTimer();
          }
          return;
        }
      }
    },
    [clearLockTimer, countdown, currentPiece, isGameOver, isPaused, isStationaryBuffer, lockPiece, rotationIndex]
  );

  const hold = useCallback(() => {
    if (isLockingRef.current || !currentPiece || !canHold || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;
    clearLockTimer();

    sound.playHold();
    const currentType = currentPiece.type;

    if (holdPiece === null) {
      // 首次存入：將當前方塊存入備用格，引出下一顆方塊
      setHoldPiece(currentType);
      spawnPiece();
    } else {
      // 經典互換：將備用方塊調出使用，並將當前方塊換入備用格
      const nextType = holdPiece;
      setHoldPiece(currentType);
      spawnPiece(nextType);
    }

    setCanHold(false); // 本顆方塊落定前鎖定互換
  }, [canHold, clearLockTimer, countdown, currentPiece, holdPiece, isGameOver, isPaused, isStationaryBuffer, spawnPiece]);

  // Countdown timers
  const countdownTimerRef = useRef<number[]>([]);

  const clearCountdownTimers = useCallback(() => {
    countdownTimerRef.current.forEach((t) => window.clearTimeout(t));
    countdownTimerRef.current = [];
    setIsStationaryBuffer(false);
  }, []);

  const startCountdownSequence = useCallback((onComplete?: () => void) => {
    clearCountdownTimers();
    setIsStationaryBuffer(false);
    setCountdown(3);
    sound.playCountdown(3);

    const t1 = window.setTimeout(() => {
      setCountdown(2);
      sound.playCountdown(2);
    }, 500);

    const t2 = window.setTimeout(() => {
      setCountdown(1);
      sound.playCountdown(1);
    }, 1000);

    const t3 = window.setTimeout(() => {
      setCountdown(0); // 破陣！
      sound.playCountdown(0);
    }, 1500);

    // 依使用者指示：
    // 「改在遊戲畫面中靜止停留整整 0.5 秒（500ms）；
    // 「破陣！」一消失，畫面立即回到乾淨無遮擋的遊戲廳／棋盤畫面；
    // 此時頂部第一顆方塊、幽靈落點與整個棋盤完全清晰可見，並在遊戲畫面中靜止停留整整 0.5 秒（500ms）」
    const t4 = window.setTimeout(() => {
      setCountdown(null); // 破陣！遮罩正常消失
      setIsStationaryBuffer(true); // 屏幕背後的遊戲畫面停留 0.5 秒鐘 (500ms)
    }, 1900);

    // 遊戲畫面靜態停留 0.5 秒（500ms）後，重力下落與操作正式啟動
    const t5 = window.setTimeout(() => {
      setIsStationaryBuffer(false);
      onComplete?.();
    }, 2400); // 1900 + 500 = 2400ms (0.5s pause!)

    countdownTimerRef.current = [t1, t2, t3, t4, t5];
  }, [clearCountdownTimers]);

  // Start new game with 3-2-1 countdown buffer
  const startGame = useCallback(() => {
    clearLockTimer();
    clearCountdownTimers();
    isLockingRef.current = false;
    const freshBoard = createEmptyBoard();
    boardRef.current = freshBoard;
    setBoard(freshBoard);

    bagRef.current = generateBag();
    const initialQueue: TetrominoType[] = [];
    while (initialQueue.length < 5) {
      initialQueue.push(bagRef.current.shift()!);
    }
    setNextQueue(initialQueue);
    setHoldPiece(null);
    setCanHold(true);
    setHasAchievedGoal(false);
    hasAchievedGoalRef.current = false;
    setIsGameOver(false);
    setIsPaused(false);
    setStats({
      score: 0,
      lines: 0,
      levelSpeed: 1,
      combo: 0,
      backToBack: false,
      lastClearType: null,
    });
    setIsPlaying(true);

    const firstPieceType = initialQueue.shift()!;
    setNextQueue(initialQueue);
    const matrix = TETROMINOES[firstPieceType];
    const piece: ActivePiece = {
      type: firstPieceType,
      matrix,
      x: Math.floor((BOARD_WIDTH - matrix[0].length) / 2),
      y: 0,
    };
    currentPieceRef.current = piece;
    setCurrentPiece(piece);
    setRotationIndex(0);

    // Trigger 3-2-1 countdown buffer
    startCountdownSequence();
  }, [clearCountdownTimers, clearLockTimer, startCountdownSequence]);

  const resumeGameWithCountdown = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    setIsPaused(false);
    startCountdownSequence();
  }, [isGameOver, isPlaying, startCountdownSequence]);

  const togglePause = useCallback(() => {
    if (!isPlaying || isGameOver) return;
    if (isPaused) {
      // Unpausing: unpause and trigger 3-2-1 buffer so player has time to prepare
      setIsPaused(false);
      startCountdownSequence();
    } else {
      clearCountdownTimers();
      setCountdown(null);
      setIsStationaryBuffer(false);
      setIsPaused(true);
    }
  }, [clearCountdownTimers, isGameOver, isPaused, isPlaying, startCountdownSequence]);

  // Automatic Gravity Fall Loop (Waits during countdown and 0.5s buffer)
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || !currentPiece || countdown !== null || isStationaryBuffer) {
      if (fallTimerRef.current) clearInterval(fallTimerRef.current);
      return;
    }

    // Speed calculation in milliseconds based on level speed
    const speedMs = Math.max(120, 800 - (stats.levelSpeed - 1) * 45);

    fallTimerRef.current = window.setInterval(() => {
      if (isLockingRef.current || !currentPieceRef.current) return;
      const p = currentPieceRef.current;
      const b = boardRef.current;

      if (!checkCollision(b, p.matrix, p.x, p.y + 1)) {
        const nextPiece = { ...p, y: p.y + 1 };
        currentPieceRef.current = nextPiece;
        setCurrentPiece(nextPiece);
        if (lockTimerRef.current) {
          window.clearTimeout(lockTimerRef.current);
          lockTimerRef.current = null;
        }
      } else {
        // Collided with floor or placed block; initiate lock delay
        if (!lockTimerRef.current) {
          lockTimerRef.current = window.setTimeout(lockPiece, 500);
        }
      }
    }, speedMs);

    return () => {
      if (fallTimerRef.current) clearInterval(fallTimerRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, currentPiece, countdown, isStationaryBuffer, stats.levelSpeed, lockPiece]);

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying || isPaused || isGameOver || countdown !== null || isStationaryBuffer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          e.preventDefault();
          rotate(true);
          break;
        case 'z':
        case 'Z':
          e.preventDefault();
          rotate(false);
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'c':
        case 'C':
        case 'Shift':
          e.preventDefault();
          hold();
          break;
        case 'p':
        case 'P':
        case 'Escape':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver, countdown, isStationaryBuffer, moveLeft, moveRight, moveDown, rotate, hardDrop, hold, togglePause]);

  return {
    board,
    currentPiece,
    ghostY: getGhostY(),
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
  };
}
