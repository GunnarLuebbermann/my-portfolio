"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// Deutsche 5-Buchstaben-Wörter
const WORD_LIST = [
  "ADLER", "AFFEN", "ALIEN", "ALPEN", "AMPEL", "ANGEL", "APFEL", "ARCHE", "ASCHE",
  "BÄREN", "BALKE", "BIRNE", "BLATT", "BLICK", "BLITZ", "BLUME", "BOHNE", "BRAND",
  "BREIT", "BRIEF", "BROTE", "BUCHT", "BUSCH", "CHAOS", "COUCH",
  "DAMPF", "DANKE", "DECKE", "DICHT", "DOSEN", "DRAHT", "DRINK", "DUNST", "DURCH",
  "ECHSE", "ENGEL", "ERNTE", "ESSEN", "EULER", "EULEN",
  "FABEL", "FARBE", "FAUNA", "FEIER", "FEIGE", "FEIND", "FESTE", "FIRMA", "FLECK",
  "FLORA", "FLUGS", "FLUSS", "FOLGE", "FORUM", "FROST", "FUCHS", "FURCHT",
  "GABEL", "GARTEN", "GASSE", "GEIST", "GENIE", "GILDE", "GIPFEL", "GLANZ", "GNADE",
  "GRIFF", "GRUND", "GULAG", "GURKE",
  "HAFEN", "HAKEN", "HALTE", "HANDY", "HARFE", "HAUPT", "HECKE", "HEIDE", "HEIZE",
  "HERDE", "HILFE", "HITZE", "HONIG", "HUPEN", "HÜTTE",
  "INSEL", "IRREN",
  "JACKE", "JÄGER", "JUBEL", "JUIST", "JUNGE",
  "KABEL", "KÄLTE", "KARTE", "KERZE", "KETTE", "KISTE", "KLANG", "KLUFT", "KNALL",
  "KNOTE", "KOHLE", "KRAFT", "KREBS", "KRISE", "KRONE", "KÜCHE", "KUNST", "KURVE",
  "LADEN", "LAMPE", "LANZE", "LAUNE", "LEDER", "LEISE", "LICHT", "LIEBE", "LILIE",
  "LINDE", "LINIE", "LÖFFEL", "LÜCKE", "LUNTE",
  "MACHT", "MAGEN", "MAGIE", "MALER", "MARKE", "MASKE", "MATTE", "MAUER", "MEILE",
  "MILCH", "MÖBEL", "MORAL", "MÜHLE", "MUMIE", "MÜTZE",
  "NABEL", "NACHT", "NADEL", "NÄHTE", "NATUR", "NEBEL", "NELKE", "NERVE", "NIERE",
  "NOTEN", "NUDEL",
  "OCKER", "OLIVE", "OPFER", "ORBIT", "ORDEN", "ORGEL", "OTTER",
  "PAKET", "PALME", "PANNE", "PASTE", "PFEIL", "PISTE", "PLATZ", "PRACHT", "PREIS",
  "PROBE", "PUNKT",
  "QUALM", "QUARK", "QUEEN", "QUELL",
  "RACHE", "RAMPE", "RASEN", "RAUCH", "REGAL", "REGEN", "REISE", "RENTE", "RINDE",
  "RINGE", "ROBBE", "ROSEN", "RUNDE",
  "SACHE", "SALAT", "SALBE", "SAMEN", "SCHAR", "SCHUH", "SEELE", "SEGEL", "SEIDE",
  "SENSE", "SICHT", "SOCKE", "SONNE", "SORGE", "SPIEL", "STAMM", "STAUB", "STERN",
  "STILL", "STIRN", "STOLZ", "STROM", "STUCK", "STURM", "SUCHE",
  "TAFEL", "TALER", "TASSE", "TIGER", "TINTE", "TONNE", "TRAUM", "TREUE", "TULPE",
  "TURBO", "TÜRME",
  "ÜBUNG", "ULMEN",
  "VASEN", "VOGEL", "VOLKS",
  "WACHE", "WAFFE", "WAGEN", "WALDE", "WANGE", "WELLE", "WENDE", "WIESE", "WILLE",
  "WOLKE", "WONNE", "WUNDE", "WÜRDE",
  "ZANGE", "ZEBRA", "ZELLE", "ZIEGE", "ZITAT", "ZUCHT", "ZWECK",
].filter(w => w.length === 5);

type LetterState = "correct" | "present" | "absent" | "empty";

interface GuessLetter {
  letter: string;
  state: LetterState;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "P", "Ü"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ö", "Ä"],
  ["ENTER", "Y", "X", "C", "V", "B", "N", "M", "⌫"],
];

function evaluateGuess(guess: string, solution: string): GuessLetter[] {
  const result: GuessLetter[] = guess.split("").map((l) => ({ letter: l, state: "absent" as LetterState }));
  const solutionArr = solution.split("");
  const used = Array(5).fill(false);

  // Erste Runde: Exakte Treffer
  for (let i = 0; i < 5; i++) {
    if (guess[i] === solution[i]) {
      result[i].state = "correct";
      used[i] = true;
    }
  }

  // Zweite Runde: Falsche Position
  for (let i = 0; i < 5; i++) {
    if (result[i].state === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guess[i] === solutionArr[j]) {
        result[i].state = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

const STATE_COLORS: Record<LetterState, string> = {
  correct: "bg-green-500 border-green-500 text-white",
  present: "bg-yellow-500 border-yellow-500 text-white",
  absent: "bg-gray-500 border-gray-500 text-white",
  empty: "bg-transparent border-gray-300 dark:border-gray-600",
};

const KEY_COLORS: Record<LetterState | "unused", string> = {
  correct: "bg-green-500 text-white hover:bg-green-600",
  present: "bg-yellow-500 text-white hover:bg-yellow-600",
  absent: "bg-gray-500 text-white",
  unused: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
  empty: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600",
};

export default function WordleGame() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState<GuessLetter[][]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ played: 0, won: 0, streak: 0 });
  const maxGuesses = 6;

  // Initialisierung
  useEffect(() => {
    const saved = localStorage.getItem("wordle-stats");
    if (saved) setStats(JSON.parse(saved));
    pickNewWord();
  }, []);

  const pickNewWord = () => {
    const word = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
    setSolution(word);
    setGuesses([]);
    setCurrentGuess("");
    setGameState("playing");
    setMessage("");
  };

  // Tastatur-Status
  const getKeyState = useCallback(
    (key: string): LetterState | "unused" => {
      let best: LetterState | "unused" = "unused";
      for (const guess of guesses) {
        for (const g of guess) {
          if (g.letter === key) {
            if (g.state === "correct") return "correct";
            if (g.state === "present" && best !== "present") best = "present";
            if (g.state === "absent" && best === "unused") best = "absent";
          }
        }
      }
      return best;
    },
    [guesses]
  );

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 2000);
  };

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== 5) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      showMessage("Wort muss 5 Buchstaben haben!");
      return;
    }

    const evaluated = evaluateGuess(currentGuess, solution);
    const newGuesses = [...guesses, evaluated];
    setGuesses(newGuesses);
    setCurrentGuess("");

    if (currentGuess === solution) {
      setGameState("won");
      const newStats = { played: stats.played + 1, won: stats.won + 1, streak: stats.streak + 1 };
      setStats(newStats);
      localStorage.setItem("wordle-stats", JSON.stringify(newStats));
      showMessage("🎉 Richtig!");
    } else if (newGuesses.length >= maxGuesses) {
      setGameState("lost");
      const newStats = { played: stats.played + 1, won: stats.won, streak: 0 };
      setStats(newStats);
      localStorage.setItem("wordle-stats", JSON.stringify(newStats));
      showMessage(`Das Wort war: ${solution}`);
    }
  }, [currentGuess, solution, guesses, stats]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameState !== "playing") return;

      if (key === "ENTER") {
        submitGuess();
      } else if (key === "⌫" || key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-ZÄÖÜß]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [gameState, currentGuess, submitGuess]
  );

  // Tastatur-Events
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-ZÄÖÜß]$/.test(key)) {
        e.preventDefault();
        handleKey(key);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  // Render Grid-Zeile
  const renderRow = (guess: GuessLetter[] | null, rowIndex: number) => {
    const isCurrentRow = rowIndex === guesses.length && gameState === "playing";
    return (
      <div key={rowIndex} className={`flex gap-1.5 ${shake && isCurrentRow ? "animate-shake" : ""}`}>
        {Array.from({ length: 5 }).map((_, i) => {
          let letter = "";
          let state: LetterState = "empty";

          if (guess) {
            letter = guess[i].letter;
            state = guess[i].state;
          } else if (isCurrentRow && i < currentGuess.length) {
            letter = currentGuess[i];
          }

          return (
            <div
              key={i}
              className={`w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-lg flex items-center justify-center text-2xl font-black transition-all duration-300 ${
                STATE_COLORS[state]
              } ${letter && state === "empty" ? "border-gray-500 dark:border-gray-400 scale-105" : ""}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-[80vh] px-4 py-8">
      <Link
        href="/games"
        className="self-start mb-6 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
      >
        ← Zurück zu Spiele
      </Link>

      <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
        Wordle
      </h1>

      {/* Statistiken */}
      <div className="flex gap-4 mb-4 text-center">
        <div>
          <p className="text-xl font-black text-gray-800 dark:text-white">{stats.played}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gespielt</p>
        </div>
        <div>
          <p className="text-xl font-black text-green-500">{stats.won}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Gewonnen</p>
        </div>
        <div>
          <p className="text-xl font-black text-amber-500">🔥 {stats.streak}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Streak</p>
        </div>
      </div>

      {/* Nachricht */}
      {message && (
        <div className="mb-4 px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-lg font-bold text-sm animate-bounce">
          {message}
        </div>
      )}

      {/* Grid */}
      <div className="flex flex-col gap-1.5 mb-6">
        {Array.from({ length: maxGuesses }).map((_, i) => renderRow(guesses[i] || null, i))}
      </div>

      {/* Tastatur */}
      <div className="flex flex-col gap-1.5 w-full max-w-lg">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {row.map((key) => {
              const isWide = key === "ENTER" || key === "⌫";
              const keyState = key.length === 1 ? getKeyState(key) : "unused";
              return (
                <button
                  key={key}
                  onClick={() => handleKey(key)}
                  className={`${
                    isWide ? "px-3 sm:px-4 text-xs" : "w-8 sm:w-10"
                  } h-12 sm:h-14 rounded-lg font-bold transition-all duration-200 active:scale-95 ${
                    KEY_COLORS[keyState]
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Neues Spiel bei Game Over */}
      {gameState !== "playing" && (
        <button
          onClick={pickNewWord}
          className="mt-6 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors shadow-lg"
        >
          Nächstes Wort
        </button>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
