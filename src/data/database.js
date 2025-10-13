import Database from "better-sqlite3";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";

class GameDatabase {
    constructor(dbPath = "game.db", dataDir = "./data") {
        this.db = new Database(dbPath);
        this.dataDir = dataDir;

        // Ensure data directory exists
        if (!existsSync(this.dataDir)) {
            mkdirSync(this.dataDir, { recursive: true });
        }

        this.initializeTables();
    }

    initializeTables() {
        // Teams table for relational data (wins/losses, season stats)
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS teams (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                city TEXT NOT NULL,
                league TEXT NOT NULL,
                division TEXT NOT NULL,
                season INTEGER NOT NULL,
                wins INTEGER DEFAULT 0,
                losses INTEGER DEFAULT 0,
                emoji TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(id, season)
            );
            
            CREATE TABLE IF NOT EXISTS game_saves (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                save_name TEXT NOT NULL,
                player_team_id INTEGER,
                current_screen TEXT DEFAULT 'menu',
                game_data TEXT, -- JSON data for flexible game state
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 0 -- Only one active save at a time
            );
            
            CREATE INDEX IF NOT EXISTS idx_teams_season ON teams(season);
            CREATE INDEX IF NOT EXISTS idx_teams_league_division ON teams(league, division);
            CREATE INDEX IF NOT EXISTS idx_game_saves_active ON game_saves(is_active);
        `);
    }

    // ===============================
    // SQLITE OPERATIONS (Relational)
    // ===============================

    createTeam(teamData) {
        const {
            id,
            name,
            city,
            league,
            division,
            season = new Date().getFullYear(),
            emoji = "⚾"
        } = teamData;

        const stmt = this.db.prepare(`
            INSERT OR REPLACE INTO teams (id, name, city, league, division, season, wins, losses, emoji)
            VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?)
        `);

        return stmt.run(id, name, city, league, division, season, emoji);
    }

    updateTeamEmoji(teamId, emoji, season = new Date().getFullYear()) {
        const stmt = this.db.prepare(`
            UPDATE teams 
            SET emoji = ? 
            WHERE id = ? AND season = ?
        `);
        return stmt.run(emoji, teamId, season);
    }

    getTeamRecord(teamId, season = new Date().getFullYear()) {
        const stmt = this.db.prepare(`
            SELECT id, name, city, league, division, wins, losses, emoji,
                   CAST(wins AS FLOAT) / NULLIF(wins + losses, 0) as win_percentage
            FROM teams 
            WHERE id = ? AND season = ?
        `);
        return stmt.get(teamId, season);
    }

    updateTeamRecord(teamId, wins, losses, season = new Date().getFullYear()) {
        const stmt = this.db.prepare(`
            UPDATE teams 
            SET wins = ?, losses = ? 
            WHERE id = ? AND season = ?
        `);
        return stmt.run(wins, losses, teamId, season);
    }

    getStandings(league = null, division = null, season = new Date().getFullYear()) {
        let query = `
            SELECT id, name, city, league, division, wins, losses, emoji,
                   CAST(wins AS FLOAT) / NULLIF(wins + losses, 0) as win_percentage,
                   (wins + losses) as games_played
            FROM teams 
            WHERE season = ?
        `;
        const params = [season];

        if (league) {
            query += ` AND league = ?`;
            params.push(league);
        }

        if (division) {
            query += ` AND division = ?`;
            params.push(division);
        }

        query += ` ORDER BY win_percentage DESC, wins DESC`;

        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    // ===============================
    // JSON OPERATIONS (Document)
    // ===============================

    getTeamProfile(teamId) {
        const path = join(this.dataDir, "teams", `${teamId}.json`);
        if (!existsSync(path)) return null;

        try {
            return JSON.parse(readFileSync(path, "utf8"));
        } catch (error) {
            console.error(`Error reading team profile ${teamId}:`, error);
            return null;
        }
    }

    saveTeamProfile(teamId, profile) {
        const teamDir = join(this.dataDir, "teams");
        if (!existsSync(teamDir)) {
            mkdirSync(teamDir, { recursive: true });
        }

        const path = join(teamDir, `${teamId}.json`);

        try {
            writeFileSync(path, JSON.stringify(profile, null, 2));
            return true;
        } catch (error) {
            console.error(`Error saving team profile ${teamId}:`, error);
            return false;
        }
    }

    updateTeamProfile(teamId, updates) {
        const profile = this.getTeamProfile(teamId);
        if (!profile) return false;

        const updatedProfile = { ...profile, ...updates };
        return this.saveTeamProfile(teamId, updatedProfile);
    }

    // ===============================
    // COMBINED OPERATIONS
    // ===============================

    getCompleteTeamData(teamId, season = new Date().getFullYear()) {
        const record = this.getTeamRecord(teamId, season);
        const profile = this.getTeamProfile(teamId);

        if (!record && !profile) return null;

        return {
            record: record || {},
            profile: profile || {},
            // Add some calculated fields
            hasRecord: !!record,
            hasProfile: !!profile
        };
    }

    createCompleteTeam(teamData, profileData) {
        // Create the relational record
        const result = this.createTeam(teamData);

        // Save the profile data
        const profileSaved = this.saveTeamProfile(teamData.id, {
            teamId: teamData.id,
            ...profileData,
            createdAt: new Date().toISOString()
        });

        return {
            databaseResult: result,
            profileSaved,
            success: result.changes > 0 && profileSaved
        };
    }

    // ===============================
    // GAME SAVE OPERATIONS
    // ===============================

    createNewGame(playerTeamId, saveName = "Default Save") {
        const db = this.db;

        // Deactivate any existing saves
        db.prepare("UPDATE game_saves SET is_active = 0").run();

        // Create new game save
        const gameData = {
            playerTeamId: playerTeamId,
            season: new Date().getFullYear(),
            gameStarted: new Date().toISOString(),
            currentDay: 1,
            gameProgress: {
                tutorialCompleted: false,
                seasonsPlayed: 0
            }
        };

        const stmt = db.prepare(`
            INSERT INTO game_saves (save_name, player_team_id, current_screen, game_data, is_active)
            VALUES (?, ?, 'game', ?, 1)
        `);

        const result = stmt.run(saveName, playerTeamId, JSON.stringify(gameData));
        return { saveId: result.lastInsertRowid, ...gameData };
    }

    getActiveGame() {
        const stmt = this.db.prepare(`
            SELECT * FROM game_saves WHERE is_active = 1 LIMIT 1
        `);

        const save = stmt.get();
        if (!save) return null;

        return {
            ...save,
            game_data: JSON.parse(save.game_data || "{}")
        };
    }

    updateGameState(currentScreen, additionalData = {}) {
        const activeGame = this.getActiveGame();
        if (!activeGame) return false;

        // Merge new data with existing game data
        const updatedGameData = {
            ...activeGame.game_data,
            ...additionalData,
            lastUpdated: new Date().toISOString()
        };

        const stmt = this.db.prepare(`
            UPDATE game_saves 
            SET current_screen = ?, 
                game_data = ?, 
                updated_at = CURRENT_TIMESTAMP 
            WHERE is_active = 1
        `);

        return stmt.run(currentScreen, JSON.stringify(updatedGameData));
    }

    hasActiveGame() {
        const activeGame = this.getActiveGame();
        return activeGame !== null;
    }

    deleteActiveGame() {
        const stmt = this.db.prepare("DELETE FROM game_saves WHERE is_active = 1");
        return stmt.run();
    }

    // Utility method to close the database
    close() {
        this.db.close();
    }
}

export default GameDatabase;
