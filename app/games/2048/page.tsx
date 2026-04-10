"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

type Board = number[][];

function createEmptyBoard(): Board {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
}

function addRandomTile(board: Board): Board {
  const newBoard = board.map((row) => [...row]);
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (newBoard[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return newBoard;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

function rotateBoard(board: Board): Board {
  const n = board.length;
  const rotated = createEmptyBoard();
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      rotated[c][n - 1 - r] = board[r][c];
    }
  }
  return rotated;
}

function slideLeft(board: Board): { board: Board; score: number; moved: boolean } {
  let score = 0;
  let moved = false;
  const newBoard = createEmptyBoard();

  for (let r = 0; r < 4; r++) {
    const filtered = board[r].filter((v) => v !== 0);
    const merged: number[] = [];
    let i = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const val = filtered[i] * 2;
        merged.push(val);
        score += val;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }
    for (let c = 0; c < 4; c++) {
      newBoard[r][c] = merged[c] || 0;
      if (newBoard[r][c] !== board[r][c]) moved = true;
    }
  }
  return { board: newBoard, score, moved };
}

function move(board: Board, direction: "left" | "right" | "up" | "down") {
  let rotated = board.map((row) => [...row]);
  const rotations =
    direction === "left" ? 0 : direction === "down" ? 1 : direction === "right" ? 2 : 3;

  for (let i = 0; i < rotations; i++) rotated = rotateBoard(rotated);

  const result = slideLeft(rotated);

  let finalBoard = result.board;
  for (let i = 0; i < (4 - rotations) % 4; i++) finalBoard = rotateBoard(finalBoard);

  return { board: finalBoard, score: result.score, moved: result.moved };
}

function isGameOver(board: Board): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c] === 0) return false;
      if (c < 3 && board[r][c] === board[r][c + 1]) return false;
      if (r < 3 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}

function hasWon(board: Board): boolean {
  return board.some((row) => row.some((v) => v >= 2048));
}

const TILE_COLORS: Record<number, string> = {
  0: "bg-gray-200 dark:bg-gray-700",
  2: "bg-yellow-100 text-gray-800",
  4: "bg-yellow-200 text-gray-800",
  8: "bg-orange-300 text-white",
  16: "bg-orange-400 text-white",
  32: "bg-orange-500 text-white",
  64: "bg-red-400 text-white",
  128: "bg-yellow-300 text-white text-2xl",
  256: "bg-yellow-400 text-white text-2xl",
  512: "bg-yellow-500 text-white text-2xl",
  1024: "bg-yellow-600 text-white text-xl",
  2048: "bg-yellow-500 text-white text-xl font-black",
};

export default function Game2048() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Initialisierung
  useEffect(() => {
    const saved = localStorage.getItem("2048-best");
    if (saved) setBest(Number(saved));
    startNewGame();
  }, []);

  const startNewGame = () => {
    let b = createEmptyBoard();
    b = addRandomTile(b);
    b = addRandomTile(b);
    setBoard(b);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const handleMove = useCallback(
    (direction: "left" | "right" | "up" | "down") => {
      if (gameOver) return;
      const result = move(board, direction);
      if (!result.moved) return;

      const newBoard = addRandomTile(result.board);
      const newScore = score + result.score;
      setBoard(newBoard);
      setScore(newScore);

      if (newScore > best) {
        setBest(newScore);
        localStorage.setItem("2048-best", String(newScore));
      }
      if (hasWon(newBoard) && !won) setWon(true);
      if (isGameOver(newBoard)) setGameOver(true);
    },
    [board, score, best, gameOver, won]
  );

  // Tastatur
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
        a: "left",
        d: "right",
        w: "up",
        s: "down",
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleMove]);

  // Touch/Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (Math.max(absX, absY) < 30) return;

    if (absX > absY) {
      handleMove(dx > 0 ? "right" : "left");
    } else {
      handleMove(dy > 0 ? "down" : "up");
    }
    touchStart.current = null;
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8 select-none">
      <Link
        href="/games"
        className="self-start mb-6 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        ← Zurück zu Spiele
      </Link>

      <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
        2048
      </h1>

      {/* Score */}
      <div className="flex gap-4 mb-6">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl px-6 py-3 text-center min-w-[100px]">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Score</p>
          <p className="text-2xl font-black text-gray-800 dark:text-white">{score}</p>
        </div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl px-6 py-3 text-center min-w-[100px]">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Best</p>
          <p className="text-2xl font-black text-gray-800 dark:text-white">{best}</p>
        </div>
      </div>

      {/* Board */}
      <div
        className="relative bg-gray-300 dark:bg-gray-600 rounded-2xl p-3 shadow-xl"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 gap-2">
          {board.flat().map((val, i) => (
            <div
              key={i}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-black text-lg sm:text-2xl transition-all duration-100 ${
                TILE_COLORS[val] || "bg-purple-500 text-white text-lg"
              }`}
            >
              {val > 0 ? val : ""}
            </div>
          ))}
        </div>

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
            <p className="text-3xl font-black text-white mb-4">Game Over!</p>
            <p className="text-xl text-yellow-300 mb-6">Score: {score}</p>
            <button
              onClick={startNewGame}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors"
            >
              Nochmal spielen
            </button>
          </div>
        )}

        {/* Win Overlay */}
        {won && !gameOver && (
          <div className="absolute inset-0 bg-yellow-500/80 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm">
            <p className="text-3xl font-black text-white mb-4">🎉 Du hast gewonnen!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setWon(false)}
                className="px-6 py-3 bg-white text-yellow-700 font-bold rounded-xl hover:bg-yellow-50 transition-colors"
              >
                Weiterspielen
              </button>
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-yellow-700 text-white font-bold rounded-xl hover:bg-yellow-800 transition-colors"
              >
                Neues Spiel
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={startNewGame}
        className="mt-6 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-lg"
      >
        Neues Spiel
      </button>

      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Pfeiltasten / WASD / Swipe zum Spielen
      </p>
    </div>
  );
}
