"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

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

  const width = 480;
  const height = 640;
  const birdRadius = 14;
  const gravity = 0.6;
  const flapVelocity = -9.5;
  const pipeSpeed = 2.4;
  const pipeWidth = 60;
  const pipeGap = 150;
  const pipeInterval = 1.5; // Sekunden
  const pipeTimer = useRef(0);

  const resetGame = (start = true) => {
    birdY.current = height / 2;
    birdV.current = 0;
    pipes.current = [];
    gameOverRef.current = false;
    setScore(0);
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

  // Supabase Highscores
  const fetchHighscores = async () => {
    const { data, error } = await supabase
      .from("flappy-bird-highscores")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (!error && data) setHighscores(data);
  };

  const submitHighscore = async () => {
    if (!playerName) return;
    await supabase.from("flappy-bird-highscores").insert([{ name: playerName, score }]);
    setPlayerName("");
    fetchHighscores();
  };

  useEffect(() => {
    const load = async () => await fetchHighscores();
    load();
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const handleFrame = (t: number) => {
      const dt = (t - lastTime) / 1000; // Sekunden
      lastTime = t;

      if (running && !gameOverRef.current) {
        // FPS-unabhängig
        birdV.current += gravity * dt * 60;
        birdY.current += birdV.current * dt * 60;

        // Pipes bewegen
        pipes.current.forEach((p) => (p.x -= pipeSpeed));
        if (pipes.current.length && pipes.current[0].x + pipeWidth < 0) pipes.current.shift();

        // Pipes spawn
        pipeTimer.current += dt;
        if (pipeTimer.current > pipeInterval) {
          pipeTimer.current = 0;
          const gapY = 80 + Math.random() * (height - 160 - pipeGap);
          pipes.current.push({ x: width + 20, width: pipeWidth, gapY, gapHeight: pipeGap });
        }

        // Score
        pipes.current.forEach((p) => {
          if (!p.scored && p.x + p.width < 120) {
            p.scored = true;
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
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running]);

  const draw = (ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1;
    const cw = width,
      ch = height;
    const canvas = ctx.canvas;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, "#70c5ce");
    grad.addColorStop(1, "#a0e0f0");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Boden
    ctx.fillStyle = "#ded895";
    ctx.fillRect(0, ch - 90, cw, 90);

    // Pipes
    ctx.fillStyle = "#2fa04a";
    for (const p of pipes.current) {
      ctx.fillRect(p.x, 0, p.width, p.gapY);
      ctx.fillRect(p.x, p.gapY + p.gapHeight, p.width, ch - (p.gapY + p.gapHeight) - 90);
    }

    // Bird
    const birdX = 120;
    ctx.save();
    ctx.translate(birdX, birdY.current);
    ctx.rotate(Math.max(-0.6, Math.min(0.8, birdV.current / 12)));
    ctx.beginPath();
    ctx.fillStyle = "#FFD33D";
    ctx.arc(0, 0, birdRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "22px Inter, Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, cw / 2, 30);
  };

  // Steuerung: Space / Click / Tap
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOverRef.current) resetGame(true);
        else { if (!running) setRunning(true); flap(); }
      }
    };
    window.addEventListener("keydown", onKey);

    const canvas = canvasRef.current!;
    const onClick = () => {
      if (gameOverRef.current) resetGame(true);
      else { if (!running) setRunning(true); flap(); }
    };
    const onTouch = (e: TouchEvent) => { e.preventDefault(); onClick(); };

    canvas.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouch, { passive: false });

    return () => {
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouch);
    };
  }, [running]);

  useEffect(() => resetGame(false), []);

  return (
    <div className="flex flex-col items-center justify-start p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Flappy Bird</h1>

      <div className="flex flex-row items-start gap-6">
        <canvas ref={canvasRef} width={width} height={height} className="rounded-xl shadow-lg" />

        <div className="flex flex-col gap-4 w-64">
          <h2 className="text-xl font-bold">Highscores</h2>
          <ol className="list-decimal ml-4">
            {highscores.map((h, idx) => (
              <li key={idx} className="text-gray-200">{h.name}: {h.score}</li>
            ))}
          </ol>
        </div>
      </div>

      {gameOverRef.current && (
        <div className="mt-4 flex flex-col items-center gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Dein Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 rounded bg-white text-gray-700 placeholder-gray-400"
          />
          <button onClick={submitHighscore} className="px-4 py-2 bg-green-500 rounded text-white font-bold">
            Highscore speichern
          </button>
        </div>
      )}

      <p className="text-sm text-gray-300 mt-4 text-center">
        Steuerung: Klick / Tap / Space. Bei Game Over: Klick oder Tap, um neu zu starten.
      </p>
    </div>
  );
}
