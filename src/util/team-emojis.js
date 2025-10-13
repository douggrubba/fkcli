// Team emoji mappings for consistent display across the application

export const TEAM_EMOJIS = {
    // American League East
    "Boston Red Sox": "🧦",
    "New York Yankees": "🎩",
    "Tampa Bay Rays": "⚡",
    "Toronto Blue Jays": "🔵",
    "Baltimore Orioles": "🐦",

    // American League Central
    "Chicago White Sox": "🤍",
    "Cleveland Guardians": "🛡️",
    "Detroit Tigers": "🐅",
    "Kansas City Royals": "👑",
    "Minnesota Twins": "👯",

    // American League West
    "Houston Astros": "🚀",
    "Los Angeles Angels": "😇",
    "Oakland Athletics": "🟢",
    "Seattle Mariners": "⚓",
    "Texas Rangers": "🤠",

    // National League East
    "Atlanta Braves": "🪓",
    "Miami Marlins": "🐠",
    "New York Mets": "🗽",
    "Philadelphia Phillies": "🔔",
    "Washington Nationals": "🏛️",

    // National League Central
    "Chicago Cubs": "🐻",
    "Cincinnati Reds": "🔴",
    "Milwaukee Brewers": "🍺",
    "Pittsburgh Pirates": "🏴‍☠️",
    "St. Louis Cardinals": "🐦",

    // National League West
    "Arizona Diamondbacks": "🐍",
    "Colorado Rockies": "🗻",
    "Los Angeles Dodgers": "💙",
    "San Diego Padres": "🏛️",
    "San Francisco Giants": "🗻"
};

/**
 * Get emoji for a team by city and name
 * @param {string} city - Team city
 * @param {string} name - Team name
 * @returns {string} Team emoji or default baseball emoji
 */
export function getTeamEmoji(city, name) {
    const teamKey = `${city} ${name}`;
    return TEAM_EMOJIS[teamKey] || "⚾";
}

/**
 * Get all teams with their emojis
 * @returns {Object} Object mapping team names to emojis
 */
export function getAllTeamEmojis() {
    return { ...TEAM_EMOJIS };
}

/**
 * Add or update a team emoji
 * @param {string} city - Team city
 * @param {string} name - Team name
 * @param {string} emoji - Team emoji
 */
export function setTeamEmoji(city, name, emoji) {
    const teamKey = `${city} ${name}`;
    TEAM_EMOJIS[teamKey] = emoji;
}
