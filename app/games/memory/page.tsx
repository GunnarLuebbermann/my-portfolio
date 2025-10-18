"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Card = {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
};

const EMOJIS = ["🍎", "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🥝"];

export default function MemoryPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  // Spiel initialisieren
  useEffect(() => {
    startNewGame();
    const saved = localStorage.getItem("memoryBestScore");
    if (saved) setBestScore(Number(saved));
  }, []);

  const startNewGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({
        id: i,
        emoji,
        flipped: false,
        matched: false,
      }));
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setIsLocked(false);
  };

  const handleCardClick = (index: number) => {
    if (isLocked) return;
    const clicked = cards[index];
    if (clicked.flipped || clicked.matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    const newFlipped = [...flippedCards, index];
    setCards(newCards);
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);

      const [first, second] = newFlipped.map((i) => newCards[i]);
      if (first.emoji === second.emoji) {
        newCards[first.id].matched = true;
        newCards[second.id].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        setIsLocked(false);

        // Prüfen, ob alle gefunden
        if (newCards.every((c) => c.matched)) {
          if (!bestScore || moves + 1 < bestScore) {
            localStorage.setItem("memoryBestScore", String(moves + 1));
            setBestScore(moves + 1);
          }
        }
      } else {
        setTimeout(() => {
          newCards[first.id].flipped = false;
          newCards[second.id].flipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

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
          🧠 Memory
        </motion.h1>

        <div className="grid grid-cols-4 gap-3 mb-8">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-xl text-2xl font-bold flex items-center justify-center shadow-lg transition-all duration-300 ${card.flipped || card.matched
                  ? "bg-gradient-to-br from-pink-500 to-purple-600 text-white scale-105"
                  : "bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-300 hover:scale-105"
                }`}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {card.flipped || card.matched ? card.emoji : "❓"}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-sm text-white/80 mb-1">Züge</p>
            <p className="text-3xl font-bold text-white">
              {moves}
            </p>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-white/80 mb-1">Bester Score</p>
            <p className="text-3xl font-bold text-white">
              {bestScore !== null ? bestScore : "–"}
            </p>
          </motion.div>
        </div>

        <motion.button
          onClick={startNewGame}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          whileTap={{ scale: 0.98 }}
        >
          Neues Spiel
        </motion.button>
      </motion.div>
    </div>
  );
}
