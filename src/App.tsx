import React, { useState, useEffect } from "react";
import CheckersBoard from "./CheckersBoard";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

function App() {
  const [gameId, setGameId] = useState<string | null>(() => {
    // Odczytuj gameId z localStorage (przy odświeżeniu strony)
    return localStorage.getItem("checkers-gameId");
  });

  const [players, setPlayers] = useState({
    playerOne: "",
    playerTwo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayers({
      ...players,
      [e.target.name]: e.target.value,
    });
  };

  const createGame = async () => {
    if (!players.playerOne || !players.playerTwo) return;

    try {
      const res = await api.post("/checkers/game", {
        playerOne: players.playerOne,
        playerTwo: players.playerTwo,
      });

      const newGameId = res.data.gameId;
      setGameId(newGameId);
      localStorage.setItem("checkers-gameId", newGameId);
    } catch (e) {
      console.error("Nie udało się utworzyć gry", e);
    }
  };

  const resetGame = () => {
    setGameId(null);
    localStorage.removeItem("checkers-gameId");
    setPlayers({ playerOne: "", playerTwo: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl text-center font-bold mb-6">Warcaby</h1>

      {!gameId ? (
        <div className="max-w-md mx-auto bg-white shadow p-4 rounded space-y-4">
          <h2 className="text-xl font-semibold text-center">Nowa gra</h2>

          <input
            type="text"
            name="playerOne"
            value={players.playerOne}
            onChange={handleInputChange}
            placeholder="Gracz 1"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            name="playerTwo"
            value={players.playerTwo}
            onChange={handleInputChange}
            placeholder="Gracz 2"
            className="w-full border p-2 rounded"
          />

          <button
            onClick={createGame}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Rozpocznij grę
          </button>
        </div>
      ) : (
        <div>
          <CheckersBoard gameId={gameId} />
          <div className="text-center mt-4">
            <button
              onClick={resetGame}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Zrestartuj grę
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
