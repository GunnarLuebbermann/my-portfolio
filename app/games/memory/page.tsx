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
    <div className="flex flex-col items-center justify-center text-white p-4">
      <motion.h1
        className="text-4xl font-bold mb-6 text-pink-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧠 Memory
      </motion.h1>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <motion.button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-20 h-20 rounded-2xl text-3xl font-bold flex items-center justify-center shadow-lg transition-all ${
              card.flipped || card.matched
                ? "bg-pink-600"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            {card.flipped || card.matched ? card.emoji : "❓"}
          </motion.button>
        ))}
      </div>

      <div className="text-lg text-center">
        <p>Züge: {moves}</p>
        <p>
          Bester Score:{" "}
          {bestScore !== null ? bestScore : <span className="text-gray-400">–</span>}
        </p>
      </div>

      <button
        onClick={startNewGame}
        className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg"
      >
        Neues Spiel
      </button>
    </div>
  );
}
