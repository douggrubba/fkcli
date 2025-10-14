// Main export for the data system

import GameDatabase from "./database.js";
import { initializeTeamsFromFiles } from "./team-loader.js";

// Singleton instance for the game
let gameDb = null;

export const initializeGameData = (dbPath = "game.db", dataDir = "./data") => {
    if (!gameDb) {
        gameDb = new GameDatabase(dbPath, dataDir);

        // Check if we need to initialize with team data
        const standings = gameDb.getStandings();
        if (standings.length === 0) {
            console.log("No teams found. Initializing with team data from JSON files...");
            initializeTeamsFromFiles(gameDb, dataDir);
        }
    }

    return gameDb;
};

export const getGameData = () => {
    if (!gameDb) {
        throw new Error("Game data not initialized. Call initializeGameData() first.");
    }
    return gameDb;
};

export const closeGameData = () => {
    if (gameDb) {
        gameDb.close();
        gameDb = null;
    }
};

// Re-export the database class and game state for advanced usage
export { GameDatabase };
export { getGameState, initializeGameState } from "./gameState.js";
