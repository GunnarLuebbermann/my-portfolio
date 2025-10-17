"use client";
import React, { useState } from "react";

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

  const revealCell = (r: number, c: number, b: Cell[][]): Cell[][] => {
    if (b[r][c].revealed || b[r][c].flagged) return b;
    b[r][c].revealed = true;

    if (b[r][c].adjacentMines === 0 && !b[r][c].hasMine) {
      // Flood fill für angrenzende leere Felder
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
  };

  const numberColors: Record<number, string> = {
    1: "text-blue-600",
    2: "text-green-600",
    3: "text-red-600",
    4: "text-blue-900",
    5: "text-yellow-800",
    6: "text-teal-600",
    7: "text-black",
    8: "text-gray-600",
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">Minesweeper</h1>

      <div className="mb-4 flex gap-4">
        {(["Easy", "Medium", "Hard"] as Difficulty[]).map((diff) => (
          <button
            key={diff}
            onClick={() => resetGame(diff)}
            className={`px-4 py-2 rounded font-bold ${
              diff === difficulty
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {diff}
          </button>
        ))}
        <button
          onClick={() => resetGame()}
          className="px-4 py-2 rounded bg-red-500 text-white font-bold"
        >
          Neustart
        </button>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${cols}, 2rem)`,
          gridTemplateRows: `repeat(${rows}, 2rem)`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleClick(r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              className={`flex items-center justify-center border select-none font-bold text-lg ${
                cell.revealed
                  ? "bg-gray-300 border-gray-500"
                  : "bg-gray-500 hover:bg-gray-400 cursor-pointer border-gray-600"
              }`}
            >
              {cell.revealed
                ? cell.hasMine
                  ? "💣"
                  : cell.adjacentMines > 0
                  ? numberColors[cell.adjacentMines] &&
                    <span className={numberColors[cell.adjacentMines]}>
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

      {gameOver && (
        <div className="mt-4 text-xl font-bold text-red-600">
          {win ? "Du hast gewonnen! 🎉" : "Game Over 💥"}
        </div>
      )}
    </div>
  );
}
