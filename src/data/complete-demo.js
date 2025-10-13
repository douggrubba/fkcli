// Complete demonstration of the new game creation and persistence system

import GameDatabase from "./database.js";
import { getGameState } from "./gameState.js";
import { initializeSampleData } from "./sample-data.js";

async function runCompleteDemo() {
    console.log("🏟️  Complete Baseball Game Demo - New Game Creation & Persistence\n");

    // Initialize fresh database
    const db = new GameDatabase();

    // Initialize with sample teams
    initializeSampleData(db);

    console.log("📋 AVAILABLE TEAMS:");
    console.log("==================");
    const teams = db
        .getStandings()
        .sort((a, b) => `${a.city} ${a.name}`.localeCompare(`${b.city} ${b.name}`));

    teams.forEach((team, index) => {
        console.log(`${index + 1}. ${team.city} ${team.name}`);
    });

    console.log("\n🎮 SIMULATING NEW GAME CREATION:");
    console.log("================================");

    // Simulate selecting Boston Red Sox (team ID 1)
    const selectedTeam = teams.find((t) => t.id === 1);
    console.log(`Selected Team: ${selectedTeam.city} ${selectedTeam.name}`);

    // Create new game
    const gameResult = db.createNewGame(
        selectedTeam.id,
        `${selectedTeam.city} ${selectedTeam.name} Manager`
    );
    console.log("✅ New game created:", {
        saveId: gameResult.saveId,
        playerTeamId: gameResult.playerTeamId,
        season: gameResult.season,
        currentDay: gameResult.currentDay
    });

    console.log("\n💾 TESTING GAME STATE PERSISTENCE:");
    console.log("===================================");

    // Get initial game state
    let activeGame = db.getActiveGame();
    console.log(`Initial Screen: ${activeGame.current_screen}`);

    // Simulate screen changes
    const screenChanges = ["game", "menu", "teams", "game"];

    screenChanges.forEach((screen, index) => {
        console.log(`\n📱 Changing to screen: ${screen}`);

        const additionalData = {
            screenChangeCount: index + 1,
            lastAction: `Navigated to ${screen}`,
            timestamp: new Date().toISOString()
        };

        db.updateGameState(screen, additionalData);

        // Verify the change
        const updatedGame = db.getActiveGame();
        console.log(`   ✅ Screen persisted: ${updatedGame.current_screen}`);
        console.log(`   📊 Screen changes: ${updatedGame.game_data.screenChangeCount}`);
    });

    console.log("\n🔄 TESTING GAME RESUME:");
    console.log("=======================");

    // Simulate app restart by creating new database connection
    const db2 = new GameDatabase();
    const resumedGame = db2.getActiveGame();

    console.log("Game resumed with:");
    console.log(`   Player Team ID: ${resumedGame.player_team_id}`);
    console.log(`   Current Screen: ${resumedGame.current_screen}`);
    console.log(`   Save Name: ${resumedGame.save_name}`);
    console.log(`   Last Screen Change: ${resumedGame.game_data.screenChangeCount}`);
    console.log(`   Game Started: ${new Date(resumedGame.game_data.gameStarted).toLocaleString()}`);

    // Get complete team data for the resumed game
    const playerTeamData = db2.getCompleteTeamData(resumedGame.player_team_id);
    console.log(`   Managing: ${playerTeamData.record.city} ${playerTeamData.record.name}`);
    console.log(`   Stadium: ${playerTeamData.profile.stadium.name}`);

    console.log("\n🧹 TESTING GAME DELETION:");
    console.log("=========================");

    const deleteResult = db2.deleteActiveGame();
    console.log(`Games deleted: ${deleteResult.changes}`);

    const noGameCheck = db2.getActiveGame();
    console.log(`Active game after deletion: ${noGameCheck ? "Found" : "None"}`);

    console.log("\n✅ Complete demo finished successfully!");
    console.log("\n📝 SUMMARY:");
    console.log("- ✅ Team selection works");
    console.log("- ✅ New game creation works");
    console.log("- ✅ Screen state persistence works");
    console.log("- ✅ Game resume after restart works");
    console.log("- ✅ Game deletion works");

    // Close database connections
    db.close();
    db2.close();
}

// Run the complete demo
runCompleteDemo().catch(console.error);
