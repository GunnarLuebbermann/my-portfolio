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
    <div className="flex flex-col items-center justify-center text-white p-4">
      <motion.h1
        className="text-4xl font-bold mb-6 text-blue-400"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        ❌ Tic Tac Toe ⭕

      </motion.h1>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <motion.button
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-gray-800 border-2 border-gray-600 text-3xl font-bold rounded-xl hover:bg-gray-700 transition"
            whileTap={{ scale: 0.9 }}
          >
            {cell === "X" ? (
              <span className="text-red-400">X</span>
            ) : cell === "O" ? (
              <span className="text-green-400">O</span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <div className="mt-6 text-lg">
        {winner ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {winner === "Draw" ? (
              <p className="text-yellow-400 text-xl font-semibold">Unentschieden!</p>
            ) : (
              <p className="text-green-400 text-xl font-semibold">
                {winner} hat gewonnen! 🎉
              </p>
            )}
            <button
              onClick={restartGame}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Neues Spiel
            </button>
          </motion.div>
        ) : (
          <p className="text-gray-300">Am Zug: {currentPlayer}</p>
        )}
      </div>
    </div>
  );
}