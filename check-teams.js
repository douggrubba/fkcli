// Check teams data
import GameDatabase from './src/data/database.js';

const db = new GameDatabase();
const teams = db.getStandings();
console.log('Teams in database:');
teams.forEach(team => {
  console.log(`${team.city} ${team.name} - ${team.league} League, ${team.division} Division`);
});
db.close();