"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Puzzle, CircleDot, Square, Layout, Bird, Bomb, Hash } from "lucide-react";

export default function GamesPage() {
  const games = [
    {
      name: "Snake",
      slug: "snake",
      description: "Klassisches Snake-Spiel mit Highscore.",
      icon: <Zap className="w-8 h-8 text-green-400" />,
      color: "from-green-500 to-emerald-700",
    },
    {
      name: "Tic Tac Toe",
      slug: "tic-tac-toe",
      description: "Fordere deine Freunde heraus!",
      icon: <CircleDot className="w-8 h-8 text-blue-400" />,
      color: "from-blue-500 to-indigo-700",
    },
    {
      name: "Memory",
      slug: "memory",
      description: "Finde die passenden Paare!",
      icon: <Puzzle className="w-8 h-8 text-pink-400" />,
      color: "from-pink-500 to-rose-700",
    },
    {
      name: "Flappy Bird",
      slug: "flappy-bird",
      description: "Flieg durch die Röhren.",
      icon: <Bird className="w-8 h-8 text-sky-400" />,
      color: "from-sky-500 to-cyan-700",
    },
    {
      name: "Minesweeper",
      slug: "minesweeper",
      description: "Finde alle Minen.",
      icon: <Bomb className="w-8 h-8 text-gray-300" />,
      color: "from-gray-500 to-slate-700",
    },
    {
      name: "Space Shooter",
      slug: "space-shooter",
      description: "Schieße auf die feindlichen Raumschiffe.",
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      color: "from-purple-600 to-violet-800",
      disabled: true,
    },
    {
      name: "2048",
      slug: "2048",
      description: "Kombiniere Zahlen bis 2048.",
      icon: <Hash className="w-8 h-8 text-amber-400" />,
      color: "from-amber-500 to-yellow-700",
      disabled: true,
    },
    {
      name: "Pong",
      slug: "pong",
      description: "Klassisches Paddle-Duell.",
      icon: <Square className="w-8 h-8 text-yellow-400" />,
      color: "from-yellow-500 to-orange-600",
      disabled: true,
    },
    {
      name: "Tetris",
      slug: "tetris",
      description: "Staple Blöcke und lösche Reihen.",
      icon: <Layout className="w-8 h-8 text-indigo-400" />,
      color: "from-indigo-500 to-purple-700",
      disabled: true,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Spiele
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Spiele direkt im Browser! Fordere dich selbst heraus, knacke deinen Highscore und entdecke neue Spiele, die laufend hinzukommen.
        </p>
      </div>
    
    <div className="flex flex-col items-center text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {games.map((game, index) => (
          <motion.div
            key={game.slug}
            className={`p-6 rounded-2xl bg-gradient-to-br ${game.color} shadow-lg hover:scale-105 transition-all duration-200 ${game.disabled ? "opacity-60 cursor-not-allowed" : ""
              }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {game.disabled ? (
              <div className="flex flex-col h-full">
                <div className="flex justify-center mb-4">{game.icon}</div>
                <h2 className="text-2xl font-semibold mb-2 text-center">
                  {game.name}
                </h2>
                <p className="text-sm text-gray-200 text-center mb-4">
                  {game.description}
                </p>
                <p className="text-center italic text-gray-300">
                  Bald verfügbar
                </p>
              </div>
            ) : (
              <Link href={`/games/${game.slug}`}>
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">{game.icon}</div>
                  <h2 className="text-2xl font-semibold mb-2">{game.name}</h2>
                  <p className="text-sm text-gray-200">{game.description}</p>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
    </section>
  );
}
