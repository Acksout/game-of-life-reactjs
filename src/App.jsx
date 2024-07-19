// Create a 2D array of size 30 x 30.
// Write a function to take an initial state and calculate the next state based on the following rules:
//   - Each cell has 8 neighbors (except for the ones at the edge of the grid).
//   - A dead cell will come alive if exactly 3 neighbors are living.
//   - A living cell will stay alive if 2 or 3 neighbors are living.
//   - Cells with less than 2 neighbors will die of underpopulation.
//   - Cells with 4 or more neighbors will die of overpopulation.

import React, { useState, useCallback, useRef } from "react";
import "./App.css";

// Define grid dimensions
const numRows = 30;
const numCols = 30;

// Function to create an empty grid
const createEmptyGrid = () => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

const App = () => {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(500); // Default speed: 500ms
  const runningRef = useRef(running);
  runningRef.current = running;

  // Function to run the simulation
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((g) => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          let neighbors = 0;
          // Count neighbors
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              if (x === 0 && y === 0) continue;
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            }
          }
          // Apply the rules of the Game of Life
          // - A dead cell will come alive if exactly 3 neighbours are living.
          // - A living cell will stay alive if 2 or 3 neighbours are living.
          // - Cells with less than 2 neighbours will die of underpopulation, cells with 4 or more neighbours will die of overpopulation.
          if (neighbors < 2 || neighbors > 3) {
            return 0;
          } else if (cell === 0 && neighbors === 3) {
            return 1;
          } else {
            return cell;
          }
        })
      );
      return newGrid;
    });
    setTimeout(runSimulation, speed); // Use the speed state for the delay
  }, [speed]);

  // Handle cell click to toggle state
  const handleCellClick = (i, j) => {
    setGrid((g) => {
      const newGrid = [...g];
      newGrid[i][j] = g[i][j] ? 0 : 1;
      return newGrid;
    });
  };

  // Randomize the grid
  const handleRandomize = () => {
    setGrid(() => {
      const newGrid = createEmptyGrid();
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          newGrid[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
      }
      return newGrid;
    });
  };

  // Handle speed change
  const handleSpeedChange = (event) => {
    setSpeed(parseInt(event.target.value));
  };

  return (
    <div className="game-container">
      <h1>Conway's Game of Life</h1>
      <div className="controls">
        {/* Button to start/stop the game */}
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button onClick={() => setGrid(createEmptyGrid())}>Clear</button>
        {/* Button to create a random start state */}
        <button onClick={handleRandomize}>Randomize</button>
        {/* Speed control slider */}
        <div className="speed-control">
          <label htmlFor="speed">Speed: </label>
          <input
            type="range"
            id="speed"
            min="100"
            max="1000"
            step="100"
            value={speed}
            onChange={handleSpeedChange}
          />
          <span>{speed}ms</span>
        </div>
      </div>
      <div className="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => handleCellClick(i, j)}
              className={`cell ${cell ? "cell-alive" : ""}`}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
