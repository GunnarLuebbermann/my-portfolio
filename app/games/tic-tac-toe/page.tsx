"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

type Player = "X" | "O" | null;

export default function TicTacToePage() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | "Draw" | null>(null);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(Boolean)) return "Draw";
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setCurrentPlayer("X");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-8 text-slate-200 drop-shadow-2xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Tic Tac Toe
      </motion.h1>

      <motion.div 
        className="grid grid-cols-3 gap-3 p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            className="w-24 h-24 bg-slate-700/80 border-2 border-slate-600 text-4xl font-bold rounded-xl 
                     hover:bg-slate-600/80 hover:border-slate-500 transition-all duration-200 
                     shadow-lg hover:shadow-xl active:scale-95"
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
          >
            {cell === "X" ? (
              <span className="text-red-400 drop-shadow-lg">X</span>
            ) : cell === "O" ? (
              <span className="text-emerald-400 drop-shadow-lg">O</span>
            ) : null}
          </motion.button>
        ))}
      </motion.div>

      <div className="mt-8 text-lg">
        {winner ? (
          <motion.div
            className="text-center bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {winner === "Draw" ? (
              <p className="text-yellow-400 text-2xl font-bold mb-4">🤝 Unentschieden!</p>
            ) : (
              <p className="text-emerald-400 text-2xl font-bold mb-4">
                🎉 {winner} hat gewonnen! 🎉
              </p>
            )}
            <motion.button
              onClick={restartGame}
              className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600/80 border border-slate-600 hover:border-slate-500
                   text-slate-200 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Neues Spiel
            </motion.button>
          </motion.div>
        ) : (
          <motion.p 
            className="text-slate-300 text-xl font-medium bg-slate-800/30 px-4 py-2 rounded-lg backdrop-blur-sm"
          >
            Am Zug: <span className={currentPlayer === "X" ? "text-red-400" : "text-emerald-400"}>{currentPlayer}</span>
          </motion.p>
        )}
      </div>
    </div>
  );
}