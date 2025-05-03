import React, { useState, useEffect } from "react";
import axios from "axios";

type PieceType = "PAWN" | "QUEEN" | "NONE";
type Color = "WHITE" | "BLACK" | null;

interface Cell {
  type: PieceType;
  color: Color;
}

interface Row {
  cols: Cell[];
}

interface GameState {
  gameId: string;
  rows: Row[];
  playerOne: string;
  playerTwo: string;
  currentPlayer: string;
}

interface Props {
  gameId: string;
}

interface MoveDto {
  move: string;
}

const CheckersBoard: React.FC<Props> = ({ gameId }) => {
  const [game, setGame] = useState<GameState | null>(null);
  const [selected, setSelected] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    const res = await axios.get(`/api/checkers/game/${gameId}`);
    setGame(res.data);
  };

  const getCellNotation = (row: number, col: number) => {
    const letters = "ABCDEFGH";
    return `${letters[col]}${row + 1}`; // Changed from 8-row to row+1
  };

  const handleClick = async (row: number, col: number) => {
    if (!game) return;

    const clickedCell = game.rows[row].cols[col];

    if (selected) {
      const [fromRow, fromCol] = selected;
      const move: MoveDto = {
        move: `${getCellNotation(fromRow, fromCol)}${getCellNotation(row, col)}`
      };
      
      console.log("Move:", move);

      try {
        const res = await axios.post(`/api/checkers/game/${gameId}/move`, move);
        setGame(res.data);
        setSelected(null);
      } catch (error) {
        console.error("Invalid move", error);
        setSelected(null);
      }
    } else {
      if (clickedCell.type !== "NONE") {
        setSelected([row, col]);
      }
    }
  };

  if (!game) return <div className="text-center mt-4">Loading...</div>;

  const cells = game.rows.flatMap((row, rowIndex) =>
    row.cols.map((cell, colIndex) => {
      const isDark = (rowIndex + colIndex) % 2 === 1;
      const isSelected =
        selected && selected[0] === rowIndex && selected[1] === colIndex;
      const baseClass = isDark ? "bg-gray-800" : "bg-gray-200";
      const selectedClass = isSelected ? "ring-2 ring-yellow-400 ring-inset" : "";
  
      let piece = "";
      if (cell.type === "PAWN") {
        piece = cell.color === "WHITE" ? "●" : "○";
      } else if (cell.type === "QUEEN") {
        piece = cell.color === "WHITE" ? "♚" : "♔";
      }
  
      return (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`checkers-cell ${baseClass} ${selectedClass}`}
          onClick={() => handleClick(rowIndex, colIndex)}
        >
          {piece}
        </div>
      );
    })
  );

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];

  return (
    <div className="p-4 space-y-4">
      <div className="text-xl font-semibold text-center">
        <p>Gracz 1: {game.playerOne}</p>
        <p>Gracz 2: {game.playerTwo}</p>
        <p className="mt-2 text-green-600">Ruch: {game.currentPlayer}</p>
      </div>
  
      <div className="board-wrapper">
        {/* Top coordinates (A-H) */}
        <div className="coordinates-top">
          {letters.map(letter => (
            <div key={letter} className="coordinate-label">{letter}</div>
          ))}
        </div>
  
        {/* Left coordinates (1-8) */}
        <div className="coordinates-left">
          {numbers.map(number => (
            <div key={number} className="coordinate-label">{number}</div>
          ))}
        </div>
  
        {/* Checkers board */}
        <div className="checkers-board">
          {cells}
        </div>
  
        {/* Right coordinates (1-8) */}
        <div className="coordinates-right">
          {numbers.map(number => (
            <div key={number} className="coordinate-label">{number}</div>
          ))}
        </div>
  
        {/* Bottom coordinates (A-H) */}
        <div className="coordinates-bottom">
          {letters.map(letter => (
            <div key={letter} className="coordinate-label">{letter}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckersBoard;
