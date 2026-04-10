"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
interface Point {
  x: number;
  y: number;
}

interface Enemy {
  id: number;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  pathIndex: number;
  reward: number;
  type: "normal" | "fast" | "tank" | "boss";
  color: string;
  size: number;
  slow: number; // slow factor (0 = normal, 0.5 = 50% slower)
  slowTimer: number;
}

interface Tower {
  id: number;
  x: number;
  y: number;
  type: TowerType;
  range: number;
  damage: number;
  fireRate: number;
  cooldown: number;
  level: number;
  cost: number;
}

interface Projectile {
  x: number;
  y: number;
  targetId: number;
  damage: number;
  speed: number;
  color: string;
  type: "normal" | "splash" | "slow";
  splashRadius?: number;
}

interface TowerType {
  name: string;
  cost: number;
  range: number;
  damage: number;
  fireRate: number;
  color: string;
  emoji: string;
  description: string;
  projectileColor: string;
  projectileType: "normal" | "splash" | "slow";
  splashRadius?: number;
}

interface WaveConfig {
  enemies: { type: Enemy["type"]; count: number }[];
  spawnInterval: number;
}

// ── Constants ──────────────────────────────────────────
const CELL = 40;
const COLS = 20;
const ROWS = 14;
const W = COLS * CELL;
const H = ROWS * CELL;

// Path waypoints (grid coordinates)
const PATH_POINTS: Point[] = [
  { x: 0, y: 3 },
  { x: 4, y: 3 },
  { x: 4, y: 7 },
  { x: 8, y: 7 },
  { x: 8, y: 2 },
  { x: 13, y: 2 },
  { x: 13, y: 10 },
  { x: 17, y: 10 },
  { x: 17, y: 5 },
  { x: 20, y: 5 },
];

// Convert grid path to pixel path
const PATH: Point[] = PATH_POINTS.map((p) => ({
  x: p.x * CELL + CELL / 2,
  y: p.y * CELL + CELL / 2,
}));

// Build a set of path cells for blocking tower placement
function getPathCells(): Set<string> {
  const cells = new Set<string>();
  for (let i = 0; i < PATH_POINTS.length - 1; i++) {
    const a = PATH_POINTS[i];
    const b = PATH_POINTS[i + 1];
    if (a.x === b.x) {
      const minY = Math.min(a.y, b.y);
      const maxY = Math.max(a.y, b.y);
      for (let y = minY; y <= maxY; y++) {
        cells.add(`${a.x},${y}`);
      }
    } else {
      const minX = Math.min(a.x, b.x);
      const maxX = Math.max(a.x, b.x);
      for (let x = minX; x <= maxX; x++) {
        cells.add(`${x},${a.y}`);
      }
    }
  }
  return cells;
}

const PATH_CELLS = getPathCells();

const TOWER_TYPES: TowerType[] = [
  {
    name: "Blaster",
    cost: 50,
    range: 120,
    damage: 15,
    fireRate: 30,
    color: "#3b82f6",
    emoji: "🔫",
    description: "Schnell, mittlerer Schaden",
    projectileColor: "#60a5fa",
    projectileType: "normal",
  },
  {
    name: "Kanone",
    cost: 100,
    range: 100,
    damage: 40,
    fireRate: 60,
    color: "#ef4444",
    emoji: "💣",
    description: "Flächenschaden",
    projectileColor: "#f87171",
    projectileType: "splash",
    splashRadius: 60,
  },
  {
    name: "Frost",
    cost: 75,
    range: 130,
    damage: 8,
    fireRate: 25,
    color: "#06b6d4",
    emoji: "❄️",
    description: "Verlangsamt Gegner",
    projectileColor: "#67e8f9",
    projectileType: "slow",
  },
  {
    name: "Sniper",
    cost: 125,
    range: 200,
    damage: 60,
    fireRate: 90,
    color: "#a855f7",
    emoji: "🎯",
    description: "Hohe Reichweite & Schaden",
    projectileColor: "#c084fc",
    projectileType: "normal",
  },
];

function createWaves(): WaveConfig[] {
  return [
    { enemies: [{ type: "normal", count: 8 }], spawnInterval: 50 },
    { enemies: [{ type: "normal", count: 10 }, { type: "fast", count: 3 }], spawnInterval: 45 },
    { enemies: [{ type: "normal", count: 8 }, { type: "fast", count: 5 }], spawnInterval: 40 },
    { enemies: [{ type: "tank", count: 4 }, { type: "normal", count: 6 }], spawnInterval: 45 },
    { enemies: [{ type: "fast", count: 10 }, { type: "normal", count: 5 }], spawnInterval: 30 },
    { enemies: [{ type: "tank", count: 6 }, { type: "fast", count: 5 }], spawnInterval: 40 },
    { enemies: [{ type: "normal", count: 12 }, { type: "tank", count: 4 }, { type: "fast", count: 4 }], spawnInterval: 35 },
    { enemies: [{ type: "boss", count: 1 }, { type: "normal", count: 8 }], spawnInterval: 50 },
    { enemies: [{ type: "tank", count: 8 }, { type: "fast", count: 8 }], spawnInterval: 30 },
    { enemies: [{ type: "boss", count: 2 }, { type: "tank", count: 5 }, { type: "fast", count: 5 }], spawnInterval: 35 },
    { enemies: [{ type: "boss", count: 3 }, { type: "tank", count: 6 }, { type: "fast", count: 8 }], spawnInterval: 30 },
    { enemies: [{ type: "boss", count: 4 }, { type: "tank", count: 8 }, { type: "fast", count: 10 }, { type: "normal", count: 10 }], spawnInterval: 25 },
  ];
}

function createEnemy(type: Enemy["type"], id: number): Enemy {
  const base: Omit<Enemy, "id" | "type" | "color" | "size" | "reward"> = {
    x: PATH[0].x,
    y: PATH[0].y,
    hp: 0,
    maxHp: 0,
    speed: 0,
    pathIndex: 0,
    slow: 0,
    slowTimer: 0,
  };

  switch (type) {
    case "fast":
      return { ...base, id, type, hp: 50, maxHp: 50, speed: 2.5, reward: 15, color: "#facc15", size: 8 };
    case "tank":
      return { ...base, id, type, hp: 200, maxHp: 200, speed: 0.8, reward: 30, color: "#64748b", size: 14 };
    case "boss":
      return { ...base, id, type, hp: 600, maxHp: 600, speed: 0.6, reward: 100, color: "#dc2626", size: 18 };
    default:
      return { ...base, id, type, hp: 80, maxHp: 80, speed: 1.2, reward: 10, color: "#22c55e", size: 10 };
  }
}

// ── Component ──────────────────────────────────────────
export default function TowerDefensePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    enemies: Enemy[];
    towers: Tower[];
    projectiles: Projectile[];
    gold: number;
    lives: number;
    wave: number;
    score: number;
    spawnQueue: Enemy["type"][];
    spawnTimer: number;
    spawnInterval: number;
    waveActive: boolean;
    nextEnemyId: number;
    nextTowerId: number;
    gameOver: boolean;
    won: boolean;
    paused: boolean;
  }>({
    enemies: [],
    towers: [],
    projectiles: [],
    gold: 200,
    lives: 20,
    wave: 0,
    score: 0,
    spawnQueue: [],
    spawnTimer: 0,
    spawnInterval: 50,
    waveActive: false,
    nextEnemyId: 1,
    nextTowerId: 1,
    gameOver: false,
    won: false,
    paused: false,
  });

  const [selectedTower, setSelectedTower] = useState<number>(0);
  const [gold, setGold] = useState(200);
  const [lives, setLives] = useState(20);
  const [wave, setWave] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [waveActive, setWaveActive] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<Point | null>(null);
  const animRef = useRef<number>(0);
  const waves = useRef(createWaves());

  const resetGame = useCallback(() => {
    gameRef.current = {
      enemies: [],
      towers: [],
      projectiles: [],
      gold: 200,
      lives: 20,
      wave: 0,
      score: 0,
      spawnQueue: [],
      spawnTimer: 0,
      spawnInterval: 50,
      waveActive: false,
      nextEnemyId: 1,
      nextTowerId: 1,
      gameOver: false,
      won: false,
      paused: false,
    };
    waves.current = createWaves();
    setGold(200);
    setLives(20);
    setWave(0);
    setScore(0);
    setGameOver(false);
    setWon(false);
    setWaveActive(false);
  }, []);

  const startWave = useCallback(() => {
    const g = gameRef.current;
    if (g.waveActive || g.gameOver || g.won) return;
    if (g.wave >= waves.current.length) {
      g.won = true;
      setWon(true);
      return;
    }

    const waveConfig = waves.current[g.wave];
    const queue: Enemy["type"][] = [];
    for (const group of waveConfig.enemies) {
      for (let i = 0; i < group.count; i++) {
        queue.push(group.type);
      }
    }
    // Shuffle
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    g.spawnQueue = queue;
    g.spawnTimer = 0;
    g.spawnInterval = waveConfig.spawnInterval;
    g.waveActive = true;
    g.wave++;
    setWave(g.wave);
    setWaveActive(true);
  }, []);

  const placeTower = useCallback(
    (canvasX: number, canvasY: number) => {
      const g = gameRef.current;
      if (g.gameOver || g.won) return;

      const col = Math.floor(canvasX / CELL);
      const row = Math.floor(canvasY / CELL);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;

      // Can't place on path
      if (PATH_CELLS.has(`${col},${row}`)) return;

      // Can't place on existing tower
      if (g.towers.some((t) => t.x === col && t.y === row)) return;

      const towerType = TOWER_TYPES[selectedTower];
      if (g.gold < towerType.cost) return;

      g.gold -= towerType.cost;
      g.towers.push({
        id: g.nextTowerId++,
        x: col,
        y: row,
        type: towerType,
        range: towerType.range,
        damage: towerType.damage,
        fireRate: towerType.fireRate,
        cooldown: 0,
        level: 1,
        cost: towerType.cost,
      });
      setGold(g.gold);
    },
    [selectedTower]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = W / rect.width;
      const scaleY = H / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      placeTower(x, y);
    },
    [placeTower]
  );

  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const col = Math.floor(x / CELL);
    const row = Math.floor(y / CELL);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      setHoveredCell({ x: col, y: row });
    } else {
      setHoveredCell(null);
    }
  }, []);

  // ── Game Loop ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const tick = () => {
      const g = gameRef.current;
      if (g.gameOver || g.won) {
        animRef.current = requestAnimationFrame(tick);
        draw(ctx, g);
        return;
      }

      // Spawn enemies
      if (g.waveActive && g.spawnQueue.length > 0) {
        g.spawnTimer++;
        if (g.spawnTimer >= g.spawnInterval) {
          g.spawnTimer = 0;
          const type = g.spawnQueue.shift()!;
          g.enemies.push(createEnemy(type, g.nextEnemyId++));
        }
      }

      // Check wave complete
      if (g.waveActive && g.spawnQueue.length === 0 && g.enemies.length === 0) {
        g.waveActive = false;
        setWaveActive(false);
        // Bonus gold between waves
        g.gold += 25 + g.wave * 5;
        setGold(g.gold);
      }

      // Move enemies
      for (const enemy of g.enemies) {
        if (enemy.pathIndex >= PATH.length - 1) continue;
        const target = PATH[enemy.pathIndex + 1];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const slowFactor = enemy.slow > 0 ? 1 - enemy.slow : 1;
        const speed = enemy.speed * slowFactor;

        if (dist < speed) {
          enemy.x = target.x;
          enemy.y = target.y;
          enemy.pathIndex++;
        } else {
          enemy.x += (dx / dist) * speed;
          enemy.y += (dy / dist) * speed;
        }

        // Decrease slow timer
        if (enemy.slowTimer > 0) {
          enemy.slowTimer--;
          if (enemy.slowTimer <= 0) {
            enemy.slow = 0;
          }
        }
      }

      // Check enemies reaching end
      const reached = g.enemies.filter((e) => e.pathIndex >= PATH.length - 1);
      if (reached.length > 0) {
        g.lives -= reached.length;
        g.enemies = g.enemies.filter((e) => e.pathIndex < PATH.length - 1);
        setLives(Math.max(0, g.lives));
        if (g.lives <= 0) {
          g.gameOver = true;
          setGameOver(true);
        }
      }

      // Towers fire
      for (const tower of g.towers) {
        if (tower.cooldown > 0) {
          tower.cooldown--;
          continue;
        }

        // Find nearest enemy in range
        let closest: Enemy | null = null;
        let closestDist = Infinity;
        const tx = tower.x * CELL + CELL / 2;
        const ty = tower.y * CELL + CELL / 2;

        for (const enemy of g.enemies) {
          const dx = enemy.x - tx;
          const dy = enemy.y - ty;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d <= tower.range && d < closestDist) {
            closestDist = d;
            closest = enemy;
          }
        }

        if (closest) {
          tower.cooldown = tower.fireRate;
          g.projectiles.push({
            x: tx,
            y: ty,
            targetId: closest.id,
            damage: tower.damage,
            speed: 5,
            color: tower.type.projectileColor,
            type: tower.type.projectileType,
            splashRadius: tower.type.splashRadius,
          });
        }
      }

      // Move projectiles
      for (const proj of g.projectiles) {
        const target = g.enemies.find((e) => e.id === proj.targetId);
        if (!target) {
          proj.speed = -1; // mark for removal
          continue;
        }
        const dx = target.x - proj.x;
        const dy = target.y - proj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < proj.speed + target.size) {
          // Hit
          if (proj.type === "splash" && proj.splashRadius) {
            // Splash damage
            for (const enemy of g.enemies) {
              const ex = enemy.x - target.x;
              const ey = enemy.y - target.y;
              const ed = Math.sqrt(ex * ex + ey * ey);
              if (ed <= proj.splashRadius) {
                enemy.hp -= proj.damage * (1 - ed / proj.splashRadius * 0.5);
              }
            }
          } else if (proj.type === "slow") {
            target.hp -= proj.damage;
            target.slow = 0.5;
            target.slowTimer = 90;
          } else {
            target.hp -= proj.damage;
          }
          proj.speed = -1; // mark for removal
        } else {
          proj.x += (dx / dist) * proj.speed;
          proj.y += (dy / dist) * proj.speed;
        }
      }

      // Remove dead projectiles
      g.projectiles = g.projectiles.filter((p) => p.speed > 0);

      // Remove dead enemies, award gold
      const alive: Enemy[] = [];
      for (const enemy of g.enemies) {
        if (enemy.hp <= 0) {
          g.gold += enemy.reward;
          g.score += enemy.reward;
        } else {
          alive.push(enemy);
        }
      }
      g.enemies = alive;
      setGold(g.gold);
      setScore(g.score);

      draw(ctx, g);
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw(
    ctx: CanvasRenderingContext2D,
    g: typeof gameRef.current
  ) {
    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, W, H);

    // Grid (subtle)
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += CELL) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += CELL) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Path
    ctx.strokeStyle = "#4a3f35";
    ctx.lineWidth = CELL * 0.8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(PATH[0].x, PATH[0].y);
    for (let i = 1; i < PATH.length; i++) {
      ctx.lineTo(PATH[i].x, PATH[i].y);
    }
    ctx.stroke();

    // Path inner line
    ctx.strokeStyle = "#5c4f3d";
    ctx.lineWidth = CELL * 0.6;
    ctx.beginPath();
    ctx.moveTo(PATH[0].x, PATH[0].y);
    for (let i = 1; i < PATH.length; i++) {
      ctx.lineTo(PATH[i].x, PATH[i].y);
    }
    ctx.stroke();

    // Start / End markers
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(PATH[0].x, PATH[0].y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("S", PATH[0].x, PATH[0].y);

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(PATH[PATH.length - 1].x, PATH[PATH.length - 1].y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("E", PATH[PATH.length - 1].x, PATH[PATH.length - 1].y);

    // Hover cell
    if (hoveredCell) {
      const isPath = PATH_CELLS.has(`${hoveredCell.x},${hoveredCell.y}`);
      const hasTower = g.towers.some((t) => t.x === hoveredCell.x && t.y === hoveredCell.y);
      const canPlace = !isPath && !hasTower && g.gold >= TOWER_TYPES[selectedTower].cost;

      ctx.fillStyle = canPlace ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)";
      ctx.fillRect(hoveredCell.x * CELL, hoveredCell.y * CELL, CELL, CELL);
      ctx.strokeStyle = canPlace ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)";
      ctx.lineWidth = 2;
      ctx.strokeRect(hoveredCell.x * CELL, hoveredCell.y * CELL, CELL, CELL);

      // Range preview
      if (canPlace) {
        ctx.strokeStyle = "rgba(34,197,94,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(
          hoveredCell.x * CELL + CELL / 2,
          hoveredCell.y * CELL + CELL / 2,
          TOWER_TYPES[selectedTower].range,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
    }

    // Towers
    for (const tower of g.towers) {
      const tx = tower.x * CELL + CELL / 2;
      const ty = tower.y * CELL + CELL / 2;

      // Base
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(tower.x * CELL + 4, tower.y * CELL + 4, CELL - 8, CELL - 8);
      ctx.fillStyle = tower.type.color;
      ctx.fillRect(tower.x * CELL + 2, tower.y * CELL + 2, CELL - 4, CELL - 4);

      // Icon
      ctx.font = "20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tower.type.emoji, tx, ty);
    }

    // Enemies
    for (const enemy of g.enemies) {
      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.arc(enemy.x + 2, enemy.y + 2, enemy.size, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = enemy.slow > 0 ? "#67e8f9" : enemy.color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // HP bar
      const barW = enemy.size * 2.5;
      const barH = 3;
      const hpRatio = enemy.hp / enemy.maxHp;
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.size - 8, barW, barH);
      ctx.fillStyle = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.25 ? "#facc15" : "#ef4444";
      ctx.fillRect(enemy.x - barW / 2, enemy.y - enemy.size - 8, barW * hpRatio, barH);
    }

    // Projectiles
    for (const proj of g.projectiles) {
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.beginPath();
      ctx.arc(proj.x, proj.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Game Over / Won overlay
    if (g.gameOver || g.won) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = g.won ? "#22c55e" : "#ef4444";
      ctx.font = "bold 48px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(g.won ? "🏆 Gewonnen!" : "💀 Game Over", W / 2, H / 2 - 20);
      ctx.fillStyle = "#fff";
      ctx.font = "20px sans-serif";
      ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 + 25);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/games"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            ← Zurück
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
            🏰 Tower Defense
          </h1>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
          >
            Neustart
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 mb-4 justify-center text-sm">
          <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
            💰 <span className="font-bold text-yellow-400">{gold}</span> Gold
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
            ❤️ <span className="font-bold text-red-400">{lives}</span> Leben
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
            🌊 <span className="font-bold text-blue-400">{wave}</span> / {waves.current.length}
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg flex items-center gap-2">
            ⭐ <span className="font-bold text-purple-400">{score}</span>
          </div>
        </div>

        {/* Tower Selection */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {TOWER_TYPES.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setSelectedTower(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                selectedTower === i
                  ? "border-white bg-gray-700 scale-105"
                  : "border-gray-600 bg-gray-800 hover:border-gray-500"
              } ${gold < t.cost ? "opacity-50" : ""}`}
            >
              <span className="text-lg">{t.emoji}</span>
              <div className="text-left">
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-gray-400">{t.cost}g · {t.description}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Start Wave Button */}
        <div className="flex justify-center mb-4">
          {!waveActive && !gameOver && !won && wave < waves.current.length && (
            <button
              onClick={startWave}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-green-500/25"
            >
              {wave === 0 ? "🚀 Spiel starten" : `🌊 Welle ${wave + 1} starten`}
            </button>
          )}
          {waveActive && (
            <div className="px-6 py-3 bg-gray-800 rounded-xl text-yellow-400 font-bold animate-pulse">
              ⚔️ Welle {wave} läuft...
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMove}
            onMouseLeave={() => setHoveredCell(null)}
            className="rounded-xl border-2 border-gray-700 cursor-crosshair w-full max-w-[800px]"
            style={{ imageRendering: "pixelated" }}
          />
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-sm">
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mx-auto mb-1" />
            <div className="text-gray-400">Normal</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="w-4 h-4 rounded-full bg-yellow-400 mx-auto mb-1" />
            <div className="text-gray-400">Schnell</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="w-4 h-4 rounded-full bg-slate-500 mx-auto mb-1" />
            <div className="text-gray-400">Tank</div>
          </div>
          <div className="bg-gray-800/50 p-3 rounded-lg text-center">
            <div className="w-4 h-4 rounded-full bg-red-600 mx-auto mb-1" />
            <div className="text-gray-400">Boss</div>
          </div>
        </div>

        {/* Game Over / Won Overlay Buttons */}
        {(gameOver || won) && (
          <div className="flex justify-center mt-6">
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 rounded-xl font-bold text-lg transition-all hover:scale-105"
            >
              🔄 Nochmal spielen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
