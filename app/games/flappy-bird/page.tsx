"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

type Pipe = { x: number; width: number; gapY: number; gapHeight: number; scored?: boolean };

export default function FlappyBirdPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const birdY = useRef<number>(200);
  const birdV = useRef<number>(0);
  const pipes = useRef<Pipe[]>([]);
  const gameOverRef = useRef<boolean>(false);

  const [, setTick] = useState(0);
  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [highscores, setHighscores] = useState<{ name: string; score: number }[]>([]);
  const [showAll, setShowAll] = useState(false);

  const width = 480;
  const height = 640;
  const birdRadius = 14;
  const gravity = 1600;
  const flapVelocity = -400;
  const pipeSpeed = 400;
  const pipeWidth = 60;
  const pipeGap = 150;
  const pipeInterval = 1.5;
  const pipeTimer = useRef(0);
  const scoreRef = useRef(0);

  const resetGame = (start = true) => {
    birdY.current = height / 2;
    birdV.current = 0;
    pipes.current = [];
    gameOverRef.current = false;
    setScore(0);
    scoreRef.current = 0;
    setRunning(start);
    pipeTimer.current = 0;
  };

  const flap = () => {
    if (gameOverRef.current) return;
    birdV.current = flapVelocity;
    setTick((t) => t + 1);
  };

  const checkCollision = (): boolean => {
    const y = birdY.current;
    if (y - birdRadius <= 0 || y + birdRadius >= height) return true;
    return pipes.current.some((p) => {
      const cx = 120;
      const cy = birdY.current;
      const topRect = { x: p.x, y: 0, w: p.width, h: p.gapY };
      const bottomRect = { x: p.x, y: p.gapY + p.gapHeight, w: p.width, h: height - (p.gapY + p.gapHeight) };
      const intersects = (rect: { x: number; y: number; w: number; h: number }) => {
        const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.w));
        const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.h));
        const dx = cx - closestX;
        const dy = cy - closestY;
        return dx * dx + dy * dy <= birdRadius * birdRadius;
      };
      return intersects(topRect) || intersects(bottomRect);
    });
  };

  // 🏆 Supabase Highscores
  const fetchHighscores = async () => {
    const { data, error } = await supabase
      .from("flappy-bird-highscores")
      .select("*")
      .order("score", { ascending: false });
    if (!error && data) setHighscores(data);
  };

  const submitHighscore = async () => {
    if (!playerName) return;
    await supabase.from("flappy-bird-highscores").insert([{ name: playerName, score }]);
    setPlayerName("");
    setScore(0);
    scoreRef.current = 0;
    fetchHighscores();
  };

  useEffect(() => { fetchHighscores(); }, []);

  // 🎮 Game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const handleFrame = (t: number) => {
      const dt = (t - lastTime) / 1000;
      lastTime = t;

      if (running && !gameOverRef.current) {
        birdV.current += gravity * dt;
        birdY.current += birdV.current * dt;

        pipes.current.forEach((p) => (p.x -= pipeSpeed * dt));
        if (pipes.current.length && pipes.current[0].x + pipeWidth < 0) pipes.current.shift();

        pipeTimer.current += dt;
        if (pipeTimer.current > pipeInterval) {
          pipeTimer.current = 0;
          const gapY = 80 + Math.random() * (height - 160 - pipeGap);
          pipes.current.push({ x: width + 20, width: pipeWidth, gapY, gapHeight: pipeGap });
        }

        pipes.current.forEach((p) => {
          if (!p.scored && p.x + p.width < 120) {
            p.scored = true;
            scoreRef.current += 1;
            setScore((prev) => prev + 1);
          }
        });

        if (checkCollision()) {
          gameOverRef.current = true;
          setRunning(false);
        }
      }

      draw(ctx);
      rafRef.current = requestAnimationFrame(handleFrame);
    };

    rafRef.current = requestAnimationFrame(handleFrame);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [running]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const cw = width, ch = height;
    const canvas = ctx.canvas;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, "#70c5ce");
    grad.addColorStop(1, "#a0e0f0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, ch - 90, cw, 90);

    ctx.fillStyle = "#2fa04a";
    for (const p of pipes.current) {
      ctx.fillRect(p.x, 0, p.width, p.gapY);
      ctx.fillRect(p.x, p.gapY + p.gapHeight, p.width, ch - (p.gapY + p.gapHeight) - 90);
    }

    const birdX = 120;
    ctx.save();
    ctx.translate(birdX, birdY.current);
    ctx.rotate(Math.max(-0.6, Math.min(0.8, birdV.current / 500)));
    ctx.beginPath();
    ctx.fillStyle = "#FFD33D";
    ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // 🎮 Controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (!running) setRunning(true);
        flap();
      }
      if (e.code === "Comma" && gameOverRef.current) {
        e.preventDefault();
        resetGame(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  useEffect(() => resetGame(false), []);

  const displayedScores = showAll ? highscores : highscores.slice(0, 3);

  return (    
  <div className="flex flex-col items-center justify-center p-6">
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
            transition={{ duration: 0.6 }}
          >
            🐦 Flappy Bird
          </motion.h1>

        <div className="relative flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={() => { if (gameOverRef.current) resetGame(true); else { if (!running) setRunning(true); flap(); } }}
            onTouchStart={(e) => { e.preventDefault(); if (gameOverRef.current) resetGame(true); else { if (!running) setRunning(true); flap(); } }}
            className="rounded-xl shadow-2xl border-2 border-white/20 bg-sky-400 touch-none select-none"
            style={{ touchAction: "none" }}
          />

          {gameOverRef.current && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-center border border-white/30">
                <h3 className="text-2xl font-bold text-white mb-4">Game Over!</h3>
                <p className="text-white/80 mb-4">Final Score: {score}</p>
              </div>
            </div>
          )}
        </div>

        {/* SCORE + HIGHSCORES */}
        <div className="mt-6 text-center">
          <h2 className="text-white text-2xl font-bold mb-4">🏆 Dein Score: {score}</h2>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-3">Top Highscores</h3>
            {displayedScores.length > 0 ? (
              displayedScores.map((h, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-white/10 rounded-lg border border-white/10 mb-1">
                  <span className="text-white font-medium">#{idx + 1} {h.name}</span>
                  <span className="text-yellow-400 font-bold">{h.score}</span>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">No scores yet</p>
            )}

            {highscores.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-3 w-full text-sm text-white/80 hover:text-white transition-all underline"
              >
                {showAll ? "Weniger anzeigen" : "Mehr anzeigen"}
              </button>
            )}
          </div>

          {gameOverRef.current && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <button
                onClick={submitHighscore}
                disabled={!playerName.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
              >
                Save Score
              </button>
            </div>
          )}
        </div>

        {/* CONTROLS */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-white/70"><span className="font-semibold">Controls:</span> Tap / Space to flap</p>
          <p className="text-white/70"><span className="font-semibold">Restart:</span> Tap / Comma</p>
          {!running && !gameOverRef.current && (
            <button
              onClick={() => setRunning(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-bold transition-all duration-200 shadow-lg"
            >
              Start Game
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
``
