// Team data loader that reads from JSON files instead of hardcoded data

import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getTeamEmoji } from "../util/team-emojis.js";

/**
 * Load all team data from JSON files in the data/teams directory
 * @param {string} dataDir - Path to the data directory
 * @returns {Array} Array of team objects with database and profile data
 */
export function loadTeamsFromFiles(dataDir = "./data") {
    const teamsDir = join(dataDir, "teams");
    const teamFiles = readdirSync(teamsDir).filter(file => file.endsWith('.json'));
    
    console.log(`Loading teams from ${teamFiles.length} JSON files...`);
    
    const teams = [];
    
    for (const file of teamFiles) {
        try {
            const filePath = join(teamsDir, file);
            const teamData = JSON.parse(readFileSync(filePath, 'utf8'));
            
            // Transform the JSON data into the expected database format
            const transformedTeam = transformTeamData(teamData);
            teams.push(transformedTeam);
            
            console.log(`✅ Loaded ${transformedTeam.database.city} ${transformedTeam.database.name}`);
        } catch (error) {
            console.error(`❌ Failed to load team from ${file}:`, error.message);
        }
    }
    
    return teams;
}

/**
 * Transform team JSON data into the expected database and profile format
 * @param {Object} teamData - Raw team data from JSON file
 * @returns {Object} Transformed team data with database and profile properties
 */
function transformTeamData(teamData) {
    // Extract basic info - handle different JSON formats
    const id = teamData.teamId || teamData.id || 1;
    const fullName = teamData.fullName || teamData.full_name || "Unknown Team";
    
    // Extract city and name from fullName if not provided separately
    let city, name;
    if (teamData.city && teamData.name) {
        city = teamData.city;
        name = teamData.name;
    } else {
        const parts = fullName.split(' ');
        if (parts.length >= 2) {
            city = parts[0];
            name = parts.slice(1).join(' ');
        } else {
            city = "Unknown City";
            name = fullName;
        }
    }
    
    const league = teamData.league || "Unknown";
    const division = teamData.division || "Unknown";
    const founded = teamData.founded || teamData.established || new Date().getFullYear();
    
    // Handle the case where we have a string ID that needs to be converted to number
    const numericId = typeof id === 'string' ? parseInt(id.replace(/\D/g, '')) || 1 : id;
    
    // Get emoji for the team
    const emoji = getTeamEmoji(city, name);
    
    // Database record (relational data)
    const database = {
        id: numericId,
        name: name,
        city: city,
        league: league,
        division: division,
        season: new Date().getFullYear(),
        emoji: emoji
    };
    
    // Profile data (JSON document)
    const profile = {
        fullName: fullName,
        founded: founded,
        colors: teamData.colors || teamData.colors_hex || {
            primary: "#000000",
            secondary: "#FFFFFF",
            accent: "#CCCCCC"
        },
        stadium: teamData.stadium || teamData.home_field ? {
            name: (teamData.stadium?.name || teamData.home_field?.name) || "Unknown Stadium",
            capacity: (teamData.stadium?.capacity || teamData.home_field?.capacity) || 30000,
            opened: (teamData.stadium?.opened || teamData.home_field?.opened) || new Date().getFullYear(),
            dimensions: (teamData.stadium?.dimensions || teamData.home_field?.dimensions_ft) || {
                leftField: 330,
                centerField: 400,
                rightField: 330
            },
            features: (teamData.stadium?.features || teamData.home_field?.features) || []
        } : {
            name: "Unknown Stadium",
            capacity: 30000,
            opened: new Date().getFullYear(),
            dimensions: { leftField: 330, centerField: 400, rightField: 330 },
            features: []
        },
        history: teamData.history || {
            championships: [],
            retiredNumbers: [],
            rivalries: []
        },
        management: teamData.management || teamData.front_office ? {
            generalManager: (teamData.management?.generalManager || teamData.front_office?.general_manager) || "Unknown",
            manager: (teamData.management?.manager || teamData.front_office?.manager) || "Unknown",
            owner: (teamData.management?.owner || teamData.front_office?.owner) || "Unknown"
        } : {
            generalManager: "Unknown",
            manager: "Unknown",
            owner: "Unknown"
        },
        facilities: teamData.facilities || {
            springTraining: {
                location: "Unknown",
                facility: "Unknown"
            },
            academy: "Unknown"
        },
        fanbase: teamData.fanbase || teamData.social ? {
            nickname: (teamData.fanbase?.nickname || teamData.social?.hashtag) || "Unknown",
            attendance2024: teamData.fanbase?.attendance2024 || 0,
            socialMedia: teamData.fanbase?.socialMedia || teamData.social ? {
                twitter: teamData.social?.twitter || "@unknown",
                instagram: teamData.social?.threads || "@unknown"
            } : {
                twitter: "@unknown",
                instagram: "@unknown"
            }
        } : {
            nickname: "Unknown",
            attendance2024: 0,
            socialMedia: {
                twitter: "@unknown",
                instagram: "@unknown"
            }
        }
    };
    
    return {
        database,
        profile
    };
}

/**
 * Extract team name from full name (e.g., "Boston Red Sox" -> "Red Sox")
 * @param {string} fullName - Full team name
 * @returns {string} Team name without city
 */
function extractNameFromFullName(fullName) {
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : fullName;
}

/**
 * Initialize team data from JSON files
 * @param {Object} db - Database instance
 * @param {string} dataDir - Path to the data directory
 */
export function initializeTeamsFromFiles(db, dataDir = "./data") {
    console.log("Initializing team data from JSON files...");
    
    const teams = loadTeamsFromFiles(dataDir);
    
    teams.forEach(({ database, profile }) => {
        // Create the complete team (both database record and profile)
        const result = db.createCompleteTeam(database, profile);
        
        if (result.success) {
            console.log(`✅ Created ${database.city} ${database.name}`);
            
            // Add some sample wins/losses
            const wins = Math.floor(Math.random() * 50) + 30; // 30-80 wins
            const losses = Math.floor(Math.random() * 50) + 30; // 30-80 losses
            db.updateTeamRecord(database.id, wins, losses);
            
            console.log(`   Record: ${wins}-${losses}`);
        } else {
            console.log(`❌ Failed to create ${database.city} ${database.name}`);
        }
    });
    
    console.log("Team data initialization complete!");
}
