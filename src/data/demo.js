// Demo script to test the hybrid database system

import GameDatabase from './database.js';
import { initializeSampleData } from './sample-data.js';

async function runDemo() {
    console.log('🏟️  Baseball Game Database Demo\n');
    
    // Initialize database
    const db = new GameDatabase();
    
    // Initialize with sample data
    initializeSampleData(db);
    
    console.log('\n📊 TESTING RELATIONAL QUERIES (SQLite)');
    console.log('=====================================');
    
    // Test standings
    const standings = db.getStandings();
    console.log('\n🏆 Current Standings:');
    standings.forEach((team, index) => {
        const winPct = (team.win_percentage * 100).toFixed(1);
        console.log(`${index + 1}. ${team.city} ${team.name}: ${team.wins}-${team.losses} (${winPct}%)`);
    });
    
    // Test American League East
    console.log('\n🏟️  AL East Division:');
    const alEast = db.getStandings('American', 'East');
    alEast.forEach((team, index) => {
        const winPct = (team.win_percentage * 100).toFixed(1);
        console.log(`${index + 1}. ${team.city} ${team.name}: ${team.wins}-${team.losses} (${winPct}%)`);
    });
    
    console.log('\n📋 TESTING DOCUMENT QUERIES (JSON)');
    console.log('===================================');
    
    // Test team profiles
    console.log('\n🏟️  Stadium Information:');
    standings.slice(0, 3).forEach(team => {
        const profile = db.getTeamProfile(team.id);
        if (profile && profile.stadium) {
            console.log(`${team.city} ${team.name}:`);
            console.log(`  Stadium: ${profile.stadium.name} (${profile.stadium.capacity.toLocaleString()} capacity)`);
            console.log(`  Opened: ${profile.stadium.opened}`);
            console.log(`  Features: ${profile.stadium.features.join(', ')}`);
        }
    });
    
    console.log('\n🏆 Championship History:');
    standings.slice(0, 3).forEach(team => {
        const profile = db.getTeamProfile(team.id);
        if (profile && profile.history) {
            const totalChampionships = profile.history.championships.length;
            const latestChampionship = Math.max(...profile.history.championships);
            console.log(`${team.city} ${team.name}: ${totalChampionships} championships (latest: ${latestChampionship})`);
        }
    });
    
    console.log('\n🔄 TESTING COMBINED OPERATIONS');
    console.log('==============================');
    
    // Get complete team data
    const completeData = db.getCompleteTeamData(1); // Red Sox
    console.log('\n📊 Complete Boston Red Sox Data:');
    console.log('Record:', completeData.record);
    console.log('Stadium:', completeData.profile.stadium.name);
    console.log('Championships:', completeData.profile.history.championships.length);
    
    // Test updating team record
    console.log('\n📈 Updating team record...');
    db.updateTeamRecord(1, 95, 67); // Give Red Sox a good season
    const updatedRecord = db.getTeamRecord(1);
    console.log(`Updated Red Sox record: ${updatedRecord.wins}-${updatedRecord.losses} (${(updatedRecord.win_percentage * 100).toFixed(1)}%)`);
    
    // Test updating team profile
    console.log('\n📝 Updating team profile...');
    const profileUpdate = {
        fanbase: {
            ...completeData.profile.fanbase,
            attendance2025: 2950000 // New attendance figure
        }
    };
    db.updateTeamProfile(1, profileUpdate);
    const updatedProfile = db.getTeamProfile(1);
    console.log(`Updated Red Sox 2025 attendance: ${updatedProfile.fanbase.attendance2025.toLocaleString()}`);
    
    console.log('\n✅ Demo completed successfully!');
    
    // Close database connection
    db.close();
}

// Run the demo
runDemo().catch(console.error);