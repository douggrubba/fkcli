// Seed script to load all team JSON files into the SQLite database
// Usage:
//   node scripts/seed-teams.js [--reset]
// Env overrides:
//   DATA_DIR=./data DB_PATH=game.db node scripts/seed-teams.js

import GameDatabase from "../src/data/database.js";
import { loadTeamsFromFiles } from "../src/data/team-loader.js";

const dbPath = process.env.DB_PATH || "game.db";
const dataDir = process.env.DATA_DIR || "./data";
const shouldReset = process.argv.includes("--reset");
const verbose =
    process.argv.includes("--verbose") ||
    process.env.VERBOSE === "1" ||
    (process.env.VERBOSE || "").toLowerCase() === "true";

const year = new Date().getFullYear();

async function main() {
    console.log(`Seeding teams into ${dbPath} from ${dataDir}/teams (season ${year})...`);
    if (verbose) {
        console.log("Verbose mode ON");
    }
    const db = new GameDatabase(dbPath, dataDir);

    try {
        if (shouldReset) {
            console.log(`--reset supplied: clearing existing teams for season ${year}...`);
            // Wipe team records for the current season only
            if (verbose) {
                const countBeforeReset = db.getStandings().filter((t) => t.season === year).length;
                console.log(`Teams for ${year} before reset: ${countBeforeReset}`);
            }
            db.db.prepare("DELETE FROM teams WHERE season = ?").run(year);
            if (verbose) {
                const countAfterReset = db.getStandings().filter((t) => t.season === year).length;
                console.log(`Teams for ${year} after reset: ${countAfterReset}`);
            }
        }

        const before = db.getStandings().length;

        // Read all JSON files from data/teams and transform them
        const teams = loadTeamsFromFiles(dataDir);
        console.log(
            `Creating ${teams.length} teams (relational records only; JSON files left intact)...`
        );

        let created = 0;
        for (const { database } of teams) {
            if (verbose) {
                console.log(
                    `[seed] Upserting team #${database.id} ${database.city} ${database.name} (${database.league} • ${database.division})`
                );
            }
            try {
                const res = db.createTeam(database);
                if (res.changes > 0) {
                    created += 1;
                    if (verbose) console.log(`[seed] ✔ upserted id=${database.id}`);
                } else if (verbose) {
                    console.log(`[seed] ↻ no change id=${database.id}`);
                }
            } catch (e) {
                console.error(`[seed] ❌ failed for id=${database.id}:`, e?.stack || e);
                throw e;
            }
        }

        const after = db.getStandings().length;
        console.log(
            `Done. Inserted/updated: ${created}. Teams before: ${before}, after: ${after}.`
        );
        console.log("You can now start the game and use Team Selection to pick a team.");
    } catch (err) {
        console.error("Seeding failed:", err?.stack || err);
        process.exitCode = 1;
    } finally {
        db.close();
    }
}

main();
