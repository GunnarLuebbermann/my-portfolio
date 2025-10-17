"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

type Grid = number[][];
const SIZE = 4;
const START_TILES = 2;
const STORAGE_KEY = "game2048_state";
const BEST_KEY = "game2048_best";

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function copyGrid(g: Grid): Grid {
  return g.map((row) => row.slice());
}

function getRandomEmptyCell(grid: Grid) {
  const empties: { r: number; c: number }[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) empties.push({ r, c });
    }
  }
  if (empties.length === 0) return null;
  const choice = empties[Math.floor(Math.random() * empties.length)];
  return choice;
}

function addRandomTile(grid: Grid) {
  const cell = getRandomEmptyCell(grid);
  if (!cell) return grid;
  const val = Math.random() < 0.9 ? 2 : 4;
  const ng = copyGrid(grid);
  ng[cell.r][cell.c] = val;
  return ng;
}

function rotateGrid(grid: Grid): Grid {
  const ng = emptyGrid();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      ng[c][SIZE - 1 - r] = grid[r][c];
    }
  }
  return ng;
}

function moveLeft(grid: Grid) {
  const ng = emptyGrid();
  let moved = false;
  let scoreGained = 0;

  for (let r = 0; r < SIZE; r++) {
    const row = grid[r].filter((v) => v !== 0);
    const newRow: number[] = [];
    let skip = false;
    for (let i = 0; i < row.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }
      const current = row[i];
      const next = row[i + 1];
      if (next !== undefined && current === next) {
        const merged = current + next;
        newRow.push(merged);
        scoreGained += merged;
        skip = true;
      } else {
        newRow.push(current);
      }
    }
    while (newRow.length < SIZE) newRow.push(0);
    ng[r] = newRow;
    if (!moved && newRow.some((v, idx) => v !== grid[r][idx])) moved = true;
  }

  return { grid: ng, moved, scoreGained };
}

function move(grid: Grid, dir: "left" | "right" | "up" | "down") {
  let g = copyGrid(grid);
  let rotations = 0;
  if (dir === "down") rotations = 1;
  if (dir === "right") rotations = 2;
  if (dir === "up") rotations = 3;
  for (let i = 0; i < rotations; i++) g = rotateGrid(g);

  const { grid: movedGrid, moved, scoreGained } = moveLeft(g);

  let resultGrid = movedGrid;
  for (let i = 0; i < (4 - rotations) % 4; i++) resultGrid = rotateGrid(resultGrid);

  return { grid: resultGrid, moved, scoreGained };
}

function isGameOver(grid: Grid) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === 0) return false;
    }
  }
  const dirs: Array<"left" | "right" | "up" | "down"> = ["left", "right", "up", "down"];
  for (const d of dirs) {
    const { moved } = move(grid, d);
    if (moved) return false;
  }
  return true;
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.grid) return parsed.grid;
      }
    } catch {}
    let g = emptyGrid();
    for (let i = 0; i < START_TILES; i++) g = addRandomTile(g);
    return g;
  });

  const [score, setScore] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.score === "number") return parsed.score;
      }
    } catch {}
    return 0;
  });

  const [best, setBest] = useState<number>(() => {
    const b = localStorage.getItem(BEST_KEY);
    return b ? Number(b) : 0;
  });

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [mergedCells, setMergedCells] = useState<Record<string, boolean>>({});
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ grid, score }));
    if (score > best) {
      setBest(score);
      localStorage.setItem(BEST_KEY, String(score));
    }
    setGameOver(isGameOver(grid));
  }, [grid, score]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "a", "w", "s", "d"].includes(key)) {
        e.preventDefault();
        if (key === "ArrowLeft" || key === "a") handleMove("left");
        if (key === "ArrowRight" || key === "d") handleMove("right");
        if (key === "ArrowUp" || key === "w") handleMove("up");
        if (key === "ArrowDown" || key === "s") handleMove("down");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grid, score, gameOver]);

  const handleMove = (dir: "left" | "right" | "up" | "down") => {
    if (gameOver) return;
    const prev = copyGrid(grid);
    const { grid: newGrid, moved, scoreGained } = move(grid, dir);
    if (!moved) return;

    // add random tile after move
    const withTile = addRandomTile(newGrid);

    // detect merged cells: new value > old value AND old !== 0
    const merged: Record<string, boolean> = {};
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const prevVal = prev[r][c];
        const newVal = withTile[r][c];
        if (prevVal !== 0 && newVal > prevVal) {
          // merged happened here (or value increased here)
          merged[`${r}-${c}`] = true;
        }
      }
    }

    // also detect spawn (old 0 -> new != 0) to animate appearance
    const spawned: Record<string, boolean> = {};
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (prev[r][c] === 0 && withTile[r][c] !== 0) {
          spawned[`${r}-${c}`] = true;
        }
      }
    }

    setGrid(withTile);
    setScore((s) => s + scoreGained);

    // set merged animation flags briefly
    setMergedCells({});
    // show merged first, then keep spawn animation separately in rendering by checking prev->new
    // we keep mergedCells for a short time to trigger animation
    if (Object.keys(merged).length > 0) {
      setMergedCells(merged);
      setTimeout(() => setMergedCells({}), 220); // animation length
    } else if (Object.keys(spawned).length > 0) {
      // if no merge, still briefly animate spawn by reusing mergedCells state for spawn keys
      setMergedCells(spawned);
      setTimeout(() => setMergedCells({}), 180);
    }
  };

  const restart = () => {
    let g = emptyGrid();
    for (let i = 0; i < START_TILES; i++) g = addRandomTile(g);
    setGrid(g);
    setScore(0);
    setGameOver(false);
    setMergedCells({});
  };

  // Touch handlers for swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 30;
    if (absX < threshold && absY < threshold) return;

    if (absX > absY) {
      if (dx > 0) handleMove("right");
      else handleMove("left");
    } else {
      if (dy > 0) handleMove("down");
      else handleMove("up");
    }
    touchStartRef.current = null;
  };

  const tileBg = (val: number) => {
    if (val === 0) return "bg-gray-800";
    if (val === 2) return "bg-yellow-100 text-gray-900";
    if (val === 4) return "bg-yellow-200 text-gray-900";
    if (val === 8) return "bg-orange-300 text-white";
    if (val === 16) return "bg-orange-400 text-white";
    if (val === 32) return "bg-red-400 text-white";
    if (val === 64) return "bg-red-500 text-white";
    if (val === 128) return "bg-purple-400 text-white text-sm";
    if (val === 256) return "bg-purple-500 text-white text-sm";
    if (val === 512) return "bg-indigo-600 text-white text-sm";
    if (val === 1024) return "bg-indigo-700 text-white text-sm";
    if (val >= 2048) return "bg-green-600 text-white text-sm";
    return "bg-gray-700 text-white";
  };

  return (
    <div className="flex flex-col items-center justify-start text-white px-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">2048</h1>
          <div className="flex gap-3 items-center">
            <div className="text-right">
              <div className="text-sm text-gray-400">Score</div>
              <div className="text-xl font-semibold">{score}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Best</div>
              <div className="text-xl font-semibold">{best}</div>
            </div>
            <button
              onClick={restart}
              className="ml-4 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
            >
              Neu starten
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="w-full md:w-96 mx-auto p-4 rounded-2xl bg-gray-900 shadow-inner"
          >
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
              }}
            >
              {grid.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const key = `${rIdx}-${cIdx}`;
                  const isMerged = Boolean(mergedCells[key]);
                  const isEmpty = cell === 0;
                  return (
                    <motion.div
                      key={key}
                      layout // smooth position transitions
                      initial={isEmpty ? { scale: 0.8, opacity: 0.6 } : { scale: 1, opacity: 1 }}
                      animate={
                        isMerged
                          ? { scale: [1, 1.18, 1], transition: { duration: 0.22 } }
                          : { scale: 1, opacity: 1, transition: { duration: 0.12 } }
                      }
                      className={`min-h-[64px] flex items-center justify-center rounded-lg ${tileBg(
                        cell
                      )}`}
                    >
                      {cell !== 0 ? (
                        <div className="text-2xl font-bold select-none">
                          {cell}
                        </div>
                      ) : null}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {gameOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 rounded-2xl p-6 text-center pointer-events-auto">
                <h2 className="text-2xl font-bold mb-2">Game Over</h2>
                <p className="text-gray-300 mb-4">Dein Score: {score}</p>
                <button
                  onClick={restart}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
                >
                  Noch mal
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-400 max-w-md">
          Steuere mit den Pfeiltasten (oder W/A/S/D) — auf dem Handy kannst du wischen.
        </p>
      </div>
    </div>
  );
}
