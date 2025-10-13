// Game state management for persistent saves

import { getGameData } from './index.js';

class GameState {
    constructor() {
        this.currentGame = null;
        this.listeners = [];
    }

    // Initialize game state from database
    initialize() {
        const db = getGameData();
        this.currentGame = db.getActiveGame();
        this.notifyListeners();
        return this.currentGame;
    }

    // Create a new game with selected team
    createNewGame(playerTeamId, saveName = 'Default Save') {
        const db = getGameData();
        this.currentGame = db.createNewGame(playerTeamId, saveName);
        this.notifyListeners();
        return this.currentGame;
    }

    // Update current screen and persist to database
    setCurrentScreen(screenName, additionalData = {}) {
        if (!this.currentGame) return false;

        const db = getGameData();
        const result = db.updateGameState(screenName, additionalData);
        
        if (result.changes > 0) {
            // Update local state
            this.currentGame.current_screen = screenName;
            this.currentGame.game_data = {
                ...this.currentGame.game_data,
                ...additionalData
            };
            this.notifyListeners();
            return true;
        }
        
        return false;
    }

    // Get current screen name
    getCurrentScreen() {
        return this.currentGame?.current_screen || 'menu';
    }

    // Get player's selected team
    getPlayerTeam() {
        return this.currentGame?.player_team_id || null;
    }

    // Get complete game data
    getGameData() {
        return this.currentGame?.game_data || {};
    }

    // Check if there's an active game
    hasActiveGame() {
        return this.currentGame !== null;
    }

    // Delete current game
    deleteGame() {
        const db = getGameData();
        const result = db.deleteActiveGame();
        this.currentGame = null;
        this.notifyListeners();
        return result;
    }

    // Add listener for state changes
    addListener(callback) {
        this.listeners.push(callback);
    }

    // Remove listener
    removeListener(callback) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    // Notify all listeners of state changes
    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentGame));
    }

    // Get player team details
    getPlayerTeamData() {
        if (!this.currentGame?.player_team_id) return null;
        
        const db = getGameData();
        return db.getCompleteTeamData(this.currentGame.player_team_id);
    }
}

// Singleton instance
let gameStateInstance = null;

export const getGameState = () => {
    if (!gameStateInstance) {
        gameStateInstance = new GameState();
    }
    return gameStateInstance;
};

export const initializeGameState = () => {
    const gameState = getGameState();
    return gameState.initialize();
};