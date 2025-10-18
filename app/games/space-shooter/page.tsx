"use client";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

type Bullet = { x: number; y: number };
type Enemy = { x: number; y: number; size: number };

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const shipX = useRef(240);
  const shipY = useRef(560);
  const bullets = useRef<Bullet[]>([]);
  const enemies = useRef<Enemy[]>([]);
  const enemyTimer = useRef(0);
  const gameOverRef = useRef(false);

  const [score, setScore] = useState(0);
  const [running, setRunning] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [highscores, setHighscores] = useState<{ name: string; score: number }[]>([]);

  const width = 480;
  const height = 640;
  const shipWidth = 40;
  const shipHeight = 20;
  const bulletSpeed = 400; // px/s
  const enemySpeed = 150; // px/s
  const enemySize = 30;
  const enemyInterval = 1.0; // Sekunden

  // Supabase Highscores
  const fetchHighscores = async () => {
    const { data, error } = await supabase
      .from("space-shooter-highscores")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);
    if (!error && data) setHighscores(data);
  };

  const submitHighscore = async () => {
    if (!playerName) return;
    await supabase.from("space-shooter-highscores").insert([{ name: playerName, score }]);
    setPlayerName("");
    fetchHighscores();
  };

  const resetGame = () => {
    shipX.current = width / 2;
    shipY.current = height - 80;
    bullets.current = [];
    enemies.current = [];
    enemyTimer.current = 0;
    gameOverRef.current = false;
    setScore(0);
    setRunning(true);
  };

  const fireBullet = () => {
    if (!running || gameOverRef.current) return;
    bullets.current.push({ x: shipX.current, y: shipY.current - shipHeight });
  };

  const checkCollision = (b: Bullet, e: Enemy) => {
    return b.x >= e.x && b.x <= e.x + e.size && b.y >= e.y && b.y <= e.y + e.size;
  };

  useEffect(() => { fetchHighscores(); }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const handleFrame = (t: number) => {
      const dt = (t - lastTime) / 1000;
      lastTime = t;

      if (running && !gameOverRef.current) {
        // Move bullets
        bullets.current.forEach((b) => b.y -= bulletSpeed * dt);
        bullets.current = bullets.current.filter((b) => b.y > 0);

        // Move enemies
        enemies.current.forEach((e) => e.y += enemySpeed * dt);

        // Spawn enemies
        enemyTimer.current += dt;
        if (enemyTimer.current > enemyInterval) {
          enemyTimer.current = 0;
          const x = Math.random() * (width - enemySize);
          enemies.current.push({ x, y: -enemySize, size: enemySize });
        }

        // Check collisions
        bullets.current.forEach((b) => {
          enemies.current.forEach((e) => {
            if (checkCollision(b, e)) {
              setScore((prev) => prev + 1);
              e.y = height + 100; // mark enemy as "dead"
              b.y = -100; // mark bullet as "used"
            }
          });
        });
        enemies.current = enemies.current.filter((e) => e.y < height + 50);

        // Check if enemy hits ship
        if (enemies.current.some((e) => e.y + e.size >= shipY.current && e.x + e.size >= shipX.current - shipWidth/2 && e.x <= shipX.current + shipWidth/2)) {
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
    if (canvas.width !== cw*dpr || canvas.height !== ch*dpr) {
      canvas.width = cw*dpr;
      canvas.height = ch*dpr;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }

    // Background
    const grad = ctx.createLinearGradient(0,0,0,ch);
    grad.addColorStop(0,"#000");
    grad.addColorStop(1,"#111");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,cw,ch);

    // Ship
    ctx.fillStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(shipX.current, shipY.current - shipHeight/2);
    ctx.lineTo(shipX.current - shipWidth/2, shipY.current + shipHeight/2);
    ctx.lineTo(shipX.current + shipWidth/2, shipY.current + shipHeight/2);
    ctx.closePath();
    ctx.fill();

    // Bullets
    ctx.fillStyle = "#ff0";
    bullets.current.forEach((b) => ctx.fillRect(b.x-2,b.y-10,4,10));

    // Enemies
    ctx.fillStyle = "#f00";
    enemies.current.forEach((e) => ctx.fillRect(e.x,e.y,e.size,e.size));

    // Score
    ctx.fillStyle = "#fff";
    ctx.font = "22px Inter, Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${score}`, cw/2, 30);

    // Game Over
    if (gameOverRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0,0,cw,ch);
      ctx.fillStyle = "#fff";
      ctx.font = "28px Inter, Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", cw/2, ch/2 - 20);
    }
  };

  // Controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") shipX.current -= 10;
      if (e.code === "ArrowRight") shipX.current += 10;
      if (e.code === "Space") fireBullet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex flex-col items-center justify-start p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Space Shooter</h1>
      <canvas ref={canvasRef} width={width} height={height} className="rounded-xl shadow-lg" />

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
          <button onClick={resetGame} className="px-4 py-2 bg-blue-500 rounded text-white font-bold mt-2">
            Neustart
          </button>

          <h2 className="text-xl font-bold mt-4">Highscores</h2>
          <ol className="list-decimal ml-4">
            {highscores.map((h,idx) => (<li key={idx} className="text-gray-200">{h.name}: {h.score}</li>))}
          </ol>
        </div>
      )}

      <p className="text-sm text-gray-300 mt-4 text-center">
        Steuerung: Pfeil links/rechts bewegen, Space schießen.
      </p>
    </div>
  );
}
