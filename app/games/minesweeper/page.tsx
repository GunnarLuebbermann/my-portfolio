"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

type Cell = {
  hasMine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacentMines: number;
};

type Difficulty = "Easy" | "Medium" | "Hard";

function getBoardConfig(difficulty: Difficulty) {
  switch (difficulty) {
    case "Easy":
      return { rows: 9, cols: 9, mines: 10 };
    case "Medium":
      return { rows: 16, cols: 16, mines: 40 };
    case "Hard":
      return { rows: 16, cols: 30, mines: 99 };
  }
}

function generateBoard(rows: number, cols: number, mines: number): Cell[][] {
  const board: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      hasMine: false,
      revealed: false,
      flagged: false,
      adjacentMines: 0,
    }))
  );

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].hasMine) {
      board[r][c].hasMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!board[r][c].hasMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (
              nr >= 0 &&
              nr < rows &&
              nc >= 0 &&
              nc < cols &&
              board[nr][nc].hasMine
            ) {
              count++;
            }
          }
        }
        board[r][c].adjacentMines = count;
      }
    }
  }

  return board;
}

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const { rows, cols, mines } = getBoardConfig(difficulty);

  const [board, setBoard] = useState<Cell[][]>(generateBoard(rows, cols, mines));
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (gameStarted && !gameOver) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const revealCell = (r: number, c: number, b: Cell[][]): Cell[][] => {
    if (b[r][c].revealed || b[r][c].flagged) return b;
    b[r][c].revealed = true;

    if (b[r][c].adjacentMines === 0 && !b[r][c].hasMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            !b[nr][nc].revealed
          ) {
            b = revealCell(nr, nc, b);
          }
        }
      }
    }
    return b;
  };

  const handleClick = (r: number, c: number) => {
    if (gameOver || win) return;
    
    // Start timer on first click
    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

    if (newBoard[r][c].hasMine) {
      newBoard[r][c].revealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const updatedBoard = revealCell(r, c, newBoard);
    setBoard(updatedBoard);

    const allCells = updatedBoard.flat();
    if (allCells.every((cell) => cell.revealed || cell.hasMine)) {
      setWin(true);
      setGameOver(true);
    }
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win) return;

    // Start timer on first right click too
    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    newBoard[r][c].flagged = !newBoard[r][c].flagged;
    setBoard(newBoard);
  };

  const resetGame = (newDifficulty?: Difficulty) => {
    const diff = newDifficulty || difficulty;
    setDifficulty(diff);
    const config = getBoardConfig(diff);
    setBoard(generateBoard(config.rows, config.cols, config.mines));
    setGameOver(false);
    setWin(false);
    setGameStarted(false);
    setTimer(0);
  };

  const numberColors: Record<number, string> = {
    1: "text-blue-600",
    2: "text-green-600", 
    3: "text-red-600",
    4: "text-purple-600",
    5: "text-yellow-600",
    6: "text-pink-600",
    7: "text-black",
    8: "text-gray-800",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl font-bold text-white text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Minesweeper
        </h1>

        {/* Game Stats */}
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="bg-white/20 rounded-lg px-4 py-2 text-white font-semibold">
            💣 {mines} Mines
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-white font-semibold">
            🎯 {difficulty}
          </div>
          <div className="bg-white/20 rounded-lg px-4 py-2 text-white font-semibold">
            ⏱️ {formatTime(timer)}
          </div>
        </div>

        {/* Difficulty Controls */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => resetGame(diff)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                diff === difficulty
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {diff}
            </button>
          ))}
          <button
            onClick={() => resetGame()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-400 to-red-600 text-white font-bold hover:from-red-500 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            🔄 Reset
          </button>
        </div>

        {/* Game Board */}
        <div className="flex justify-center">
          <div
            className="grid gap-0.5 p-6 bg-gray-900/80 rounded-xl backdrop-blur-sm border border-gray-600 shadow-2xl"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              maxWidth: `${Math.min(cols * 32 + 48, 800)}px`,
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            onClick={() => handleClick(r, c)}
            onContextMenu={(e) => handleRightClick(e, r, c)}
            className={`
              aspect-square flex items-center justify-center font-bold text-xs
              transition-all duration-200 transform hover:scale-105
              select-none cursor-pointer border border-gray-500
              ${
                cell.revealed
            ? cell.hasMine
              ? "bg-red-600 text-white shadow-inner"
              : "bg-gray-200 text-gray-800 shadow-inner border-gray-300"
            : cell.flagged
            ? "bg-orange-500 text-white shadow-md border-orange-400"
            : "bg-gray-400 hover:bg-gray-300 shadow-md border-gray-300"
              }
            `}
            style={{ minHeight: '24px', minWidth: '24px' }}
          >
            {cell.revealed
              ? cell.hasMine
                ? "💣"
                : cell.adjacentMines > 0
                ? <span className={numberColors[cell.adjacentMines]}>
              {cell.adjacentMines}
            </span>
                : ""
              : cell.flagged
              ? "🚩"
              : ""}
          </div>
              ))
            )}
          </div>
        </div>

        {/* Game Status */}
        {gameOver && (
          <div className="mt-8 text-center">
            <div className={`text-2xl font-bold p-4 rounded-xl backdrop-blur-sm border ${
              win 
                ? "text-green-300 bg-green-500/20 border-green-400/50" 
                : "text-red-300 bg-red-500/20 border-red-400/50"
            }`}>
              {win ? "🎉 Congratulations! You Won!" : "💥 Game Over!"}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
