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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.slug}
              className={`group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                game.disabled ? "opacity-70" : "hover:scale-105"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90`} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300" />
              
              {game.disabled ? (
                <div className="relative p-8 flex flex-col items-center text-center text-white h-full min-h-[240px] justify-center">
                  <div className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm">
                    {game.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{game.name}</h3>
                  <p className="text-white/90 mb-6 leading-relaxed">{game.description}</p>
                  <div className="mt-auto">
                    <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      🚀 Bald verfügbar
                    </span>
                  </div>
                </div>
              ) : (
                <Link href={`/games/${game.slug}`} className="block">
                  <div className="relative p-8 flex flex-col items-center text-center text-white h-full min-h-[240px] justify-center group-hover:transform group-hover:scale-105 transition-transform duration-300">
                    <div className="mb-6 p-4 bg-white/20 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                      {game.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-white/90 transition-colors duration-300">
                      {game.name}
                    </h3>
                    <p className="text-white/90 group-hover:text-white/80 leading-relaxed transition-colors duration-300">
                      {game.description}
                    </p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>
    </section>
  );
}
