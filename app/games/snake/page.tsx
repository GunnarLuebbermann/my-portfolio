"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SPEED = 100; // Millisekunden pro Frame

type Position = { x: number; y: number };

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 8, y: 8 }]);
  const [food, setFood] = useState<Position>({ x: 12, y: 8 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">(
    "RIGHT"
  );
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // --- Highscore laden ---
  useEffect(() => {
    const saved = localStorage.getItem("snakeHighscore");
    if (saved) setHighScore(Number(saved));
  }, []);

  // --- Zeichnen des Spielfelds ---
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Snake
    ctx.fillStyle = "lime";
    snake.forEach((s) =>
      ctx.fillRect(s.x * CELL_SIZE, s.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    );
  }, [snake, food]);

  // --- Steuerung ---
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isGameOver || !isGameStarted) return;
      const key = e.key.toLowerCase();
      if (key === "w" && direction !== "DOWN") setDirection("UP");
      if (key === "s" && direction !== "UP") setDirection("DOWN");
      if (key === "a" && direction !== "RIGHT") setDirection("LEFT");
      if (key === "d" && direction !== "LEFT") setDirection("RIGHT");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction, isGameOver, isGameStarted]);

  // --- Spiel-Loop ---
  useEffect(() => {
    if (isGameOver || !isGameStarted) return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        if (direction === "UP") head.y -= 1;
        if (direction === "DOWN") head.y += 1;
        if (direction === "LEFT") head.x -= 1;
        if (direction === "RIGHT") head.x += 1;

        // Kollisionen prüfen
        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE ||
          prev.some((p) => p.x === head.x && p.y === head.y)
        ) {
          setIsGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, SPEED);

    return () => clearInterval(interval);
  }, [direction, food, isGameOver, isGameStarted]);

  const startGame = () => {
    setIsGameStarted(true);
  };

  const restart = () => {
    setSnake([{ x: 8, y: 8 }]);
    setFood({ x: 12, y: 8 });
    setDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
    setIsGameStarted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.div
        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-8 text-center text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          🐍 Snake
        </motion.h1>

        <div className="flex flex-col items-center space-y-6">
          <canvas
            ref={canvasRef}
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="border-2 border-emerald-500/30 rounded-xl shadow-lg bg-gray-900/80"
          />

          <div className="flex gap-8 text-lg font-semibold">
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wide">Score</p>
              <p className="text-2xl text-green-400">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-wide">Best</p>
              <p className="text-2xl text-yellow-400">{highScore}</p>
            </div>
          </div>

          {!isGameStarted && !isGameOver && (
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-gray-300 mb-4">Use arrow keys to control the snake</p>
              <button
                onClick={startGame}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Start Game
              </button>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-2xl font-bold mb-2">Game Over!</p>
                <p className="text-gray-300">Final Score: {score}</p>
              </div>
              <button
                onClick={restart}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
