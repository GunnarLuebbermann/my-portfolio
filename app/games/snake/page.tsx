"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const SPEED = 150; // Millisekunden pro Frame

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
      if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
      if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
      if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
      if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
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
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snakeHighscore", String(score));
          }
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
  }, [direction, food, isGameOver, isGameStarted, score, highScore]);

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
    <div className="flex flex-col items-center justify-center min-h-screen text-white pt-8">
      <motion.h1
      className="text-3xl font-bold mb-8 text-green-400"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      >
      🐍 Snake
      </motion.h1>

      <canvas
      ref={canvasRef}
      width={GRID_SIZE * CELL_SIZE}
      height={GRID_SIZE * CELL_SIZE}
      className="border border-green-400 rounded-lg shadow-lg"
      />

      <div className="mt-4 text-lg">
      <p>Score: {score}</p>
      <p>Highscore: {highScore}</p>
      </div>

      {!isGameStarted && !isGameOver && (
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Start Game
          </button>
        </motion.div>
      )}

      {isGameOver && (
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-red-400 text-xl font-semibold mb-2">Game Over!</p>
        <button
        onClick={restart}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
        >
        Neu starten
        </button>
      </motion.div>
      )}
    </div>
  );
}
