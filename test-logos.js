// Test logo storage and retrieval
import GameDatabase from "./src/data/database.js";
import { sampleTeams } from "./src/data/sample-data.js";

const db = new GameDatabase();

console.log("Testing direct team creation with logos...");
const firstTeam = sampleTeams[0];
console.log("Sample team database data:", JSON.stringify(firstTeam.database, null, 2));

// Create team directly
const result = db.createTeam(firstTeam.database);
console.log("Create team result:", result);

// Check if logo was stored
const teams = db.getStandings();
console.log("\nTeam in database:", JSON.stringify(teams[0], null, 2));

db.close();
