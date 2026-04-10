"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
type Board = (number | null)[][];
type Notes = Set<number>[][];
type Difficulty = "easy" | "medium" | "hard";

// ── Sudoku Generator/Solver ────────────────────────────
function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(null));
}

function createEmptyNotes(): Notes {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set<number>())
  );
}

function isValid(board: Board, row: number, col: number, num: number): boolean {
  // Check row
  for (let c = 0; c < 9; c++) {
    if (board[row][c] === num) return false;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (board[r][col] === num) return false;
  }
  // Check 3x3 box
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  for (let r = boxR; r < boxR + 3; r++) {
    for (let c = boxC; c < boxC + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function solveSudoku(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) {
        // Try numbers in random order for generation
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = nums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        for (const num of nums) {
          if (isValid(board, r, c, num)) {
            board[r][c] = num;
            if (solveSudoku(board)) return true;
            board[r][c] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generatePuzzle(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const board = createEmptyBoard();
  solveSudoku(board);
  const solution = board.map((row) => [...row]) as Board;

  const cellsToRemove: Record<Difficulty, number> = {
    easy: 35,
    medium: 45,
    hard: 55,
  };

  const toRemove = cellsToRemove[difficulty];
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= toRemove) break;
    board[r][c] = null;
    removed++;
  }

  return { puzzle: board, solution };
}

function hasConflict(board: Board, row: number, col: number): boolean {
  const val = board[row][col];
  if (val === null) return false;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === val) return true;
  }
  // Check column
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === val) return true;
  }
  // Check 3x3 box
  const boxR = Math.floor(row / 3) * 3;
  const boxC = Math.floor(col / 3) * 3;
  for (let r = boxR; r < boxR + 3; r++) {
    for (let c = boxC; c < boxC + 3; c++) {
      if (r !== row || c !== col) {
        if (board[r][c] === val) return true;
      }
    }
  }
  return false;
}

function isBoardComplete(board: Board): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === null) return false;
      if (hasConflict(board, r, c)) return false;
    }
  }
  return true;
}

// ── Component ──────────────────────────────────────────
export default function SudokuPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [solution, setSolution] = useState<Board>(createEmptyBoard());
  const [initial, setInitial] = useState<boolean[][]>(
    Array.from({ length: 9 }, () => Array(9).fill(false))
  );
  const [notes, setNotes] = useState<Notes>(createEmptyNotes());
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [won, setWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const startNewGame = useCallback(
    (diff?: Difficulty) => {
      const d = diff ?? difficulty;
      const { puzzle, solution: sol } = generatePuzzle(d);
      const init = puzzle.map((row) => row.map((v) => v !== null));
      setBoard(puzzle);
      setSolution(sol);
      setInitial(init);
      setNotes(createEmptyNotes());
      setSelected(null);
      setWon(false);
      setTimer(0);
      setIsRunning(true);
      setMistakes(0);
      setHintsUsed(0);
      if (diff) setDifficulty(d);
    },
    [difficulty]
  );

  // Start first game
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    if (!isRunning || won) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, won]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCellClick = (row: number, col: number) => {
    if (won) return;
    setSelected([row, col]);
  };

  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selected || won) return;
      const [row, col] = selected;
      if (initial[row][col]) return;

      if (noteMode) {
        setNotes((prev) => {
          const next = prev.map((r) => r.map((s) => new Set(s)));
          if (next[row][col].has(num)) {
            next[row][col].delete(num);
          } else {
            next[row][col].add(num);
          }
          return next;
        });
      } else {
        setBoard((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = num;

          // Check if wrong
          if (solution[row][col] !== num) {
            setMistakes((m) => m + 1);
          }

          // Clear notes for this cell
          setNotes((prevNotes) => {
            const nn = prevNotes.map((r) => r.map((s) => new Set(s)));
            nn[row][col].clear();
            return nn;
          });

          // Check win
          if (isBoardComplete(next)) {
            setWon(true);
            setIsRunning(false);
          }

          return next;
        });
      }
    },
    [selected, won, initial, noteMode, solution]
  );

  const handleErase = useCallback(() => {
    if (!selected || won) return;
    const [row, col] = selected;
    if (initial[row][col]) return;

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = null;
      return next;
    });
    setNotes((prev) => {
      const next = prev.map((r) => r.map((s) => new Set(s)));
      next[row][col].clear();
      return next;
    });
  }, [selected, won, initial]);

  const handleHint = useCallback(() => {
    if (!selected || won) return;
    const [row, col] = selected;
    if (initial[row][col]) return;
    if (board[row][col] === solution[row][col]) return;

    setBoard((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = solution[row][col];

      setNotes((prevNotes) => {
        const nn = prevNotes.map((r) => r.map((s) => new Set(s)));
        nn[row][col].clear();
        return nn;
      });

      if (isBoardComplete(next)) {
        setWon(true);
        setIsRunning(false);
      }

      return next;
    });
    setHintsUsed((h) => h + 1);
  }, [selected, won, initial, board, solution]);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (won) return;

      if (e.key >= "1" && e.key <= "9") {
        handleNumberInput(parseInt(e.key));
        return;
      }

      if (e.key === "Backspace" || e.key === "Delete") {
        handleErase();
        return;
      }

      if (e.key === "n" || e.key === "N") {
        setNoteMode((m) => !m);
        return;
      }

      if (selected) {
        const [row, col] = selected;
        if (e.key === "ArrowUp" && row > 0) setSelected([row - 1, col]);
        if (e.key === "ArrowDown" && row < 8) setSelected([row + 1, col]);
        if (e.key === "ArrowLeft" && col > 0) setSelected([row, col - 1]);
        if (e.key === "ArrowRight" && col < 8) setSelected([row, col + 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, won, handleNumberInput, handleErase]);

  const getSelectedValue = () => {
    if (!selected) return null;
    return board[selected[0]][selected[1]];
  };

  const selectedValue = getSelectedValue();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/games"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Zurück
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            🧩 Sudoku
          </h1>
          <div className="w-16" />
        </div>

        {/* Difficulty */}
        <div className="flex justify-center gap-2 mb-4">
          {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => startNewGame(d)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                difficulty === d
                  ? d === "easy"
                    ? "bg-green-600 text-white"
                    : d === "medium"
                    ? "bg-yellow-600 text-white"
                    : "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {d === "easy" ? "Leicht" : d === "medium" ? "Mittel" : "Schwer"}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <div className="bg-gray-800 px-3 py-1.5 rounded-lg">
            ⏱️ {formatTime(timer)}
          </div>
          <div className="bg-gray-800 px-3 py-1.5 rounded-lg">
            ❌ {mistakes} Fehler
          </div>
          <div className="bg-gray-800 px-3 py-1.5 rounded-lg">
            💡 {hintsUsed} Hinweise
          </div>
        </div>

        {/* Board */}
        <div className="flex justify-center mb-4">
          <div
            className="grid bg-gray-700 gap-[1px] p-[2px] rounded-lg shadow-2xl"
            style={{
              gridTemplateColumns: "repeat(9, 1fr)",
              width: "min(100%, 400px)",
              aspectRatio: "1",
            }}
          >
            {board.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selected?.[0] === r && selected?.[1] === c;
                const isInitial = initial[r][c];
                const conflict = val !== null && hasConflict(board, r, c);
                const sameValue =
                  selectedValue !== null && val === selectedValue && val !== null;
                const sameRow = selected?.[0] === r;
                const sameCol = selected?.[1] === c;
                const sameBox =
                  selected &&
                  Math.floor(selected[0] / 3) === Math.floor(r / 3) &&
                  Math.floor(selected[1] / 3) === Math.floor(c / 3);
                const highlighted = (sameRow || sameCol || sameBox) && !isSelected;
                const cellNotes = notes[r][c];

                // Border classes for 3x3 box emphasis
                const borderR = c === 2 || c === 5 ? "border-r-2 border-r-gray-500" : "";
                const borderB = r === 2 || r === 5 ? "border-b-2 border-b-gray-500" : "";

                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      relative flex items-center justify-center aspect-square text-lg sm:text-xl font-bold transition-all duration-100
                      ${borderR} ${borderB}
                      ${
                        isSelected
                          ? "bg-blue-600/50 ring-2 ring-blue-400"
                          : highlighted
                          ? "bg-blue-900/30"
                          : sameValue
                          ? "bg-blue-800/20"
                          : "bg-gray-850"
                      }
                      ${conflict ? "text-red-400" : isInitial ? "text-gray-200" : "text-blue-400"}
                      ${won && !conflict ? "text-green-400" : ""}
                      hover:bg-blue-700/30
                    `}
                    style={{ backgroundColor: isSelected ? undefined : highlighted ? undefined : sameValue && !isSelected ? "rgba(59,130,246,0.1)" : "#1e1e2e" }}
                  >
                    {val !== null ? (
                      val
                    ) : cellNotes.size > 0 ? (
                      <div className="grid grid-cols-3 gap-0 w-full h-full p-0.5 text-[8px] sm:text-[10px] text-gray-500 font-normal">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <span
                            key={n}
                            className="flex items-center justify-center leading-none"
                          >
                            {cellNotes.has(n) ? n : ""}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setNoteMode(!noteMode)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              noteMode
                ? "bg-cyan-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            ✏️ Notizen {noteMode ? "AN" : "AUS"}
          </button>
          <button
            onClick={handleErase}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
          >
            🗑️ Löschen
          </button>
          <button
            onClick={handleHint}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
          >
            💡 Hinweis
          </button>
          <button
            onClick={() => startNewGame()}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
          >
            🔄 Neu
          </button>
        </div>

        {/* Number Pad */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            // Count how many of this number are placed
            let count = 0;
            for (let r = 0; r < 9; r++) {
              for (let c = 0; c < 9; c++) {
                if (board[r][c] === num) count++;
              }
            }
            const complete = count >= 9;

            return (
              <button
                key={num}
                onClick={() => handleNumberInput(num)}
                className={`w-10 h-12 sm:w-12 sm:h-14 rounded-lg font-bold text-lg transition-all ${
                  complete
                    ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                    : selectedValue === num
                    ? "bg-blue-600 text-white scale-105"
                    : "bg-gray-800 text-white hover:bg-gray-700 hover:scale-105"
                }`}
                disabled={complete}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Keyboard hints */}
        <div className="text-center text-xs text-gray-600 mb-4">
          Tastatur: 1-9 Zahl eingeben · Pfeiltasten navigieren · N = Notizen · Entf = Löschen
        </div>

        {/* Win Overlay */}
        {won && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Gelöst!</h2>
            <p className="text-gray-400 mb-4">
              Zeit: {formatTime(timer)} · Fehler: {mistakes} · Hinweise: {hintsUsed}
            </p>
            <button
              onClick={() => startNewGame()}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              🔄 Neues Spiel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
