// Sample data for testing the hybrid database system

import { ASCII_TEAM_LOGO } from "./team-logo.js";

export const sampleTeams = [
    {
        // Database data (relational)
        database: {
            id: 1,
            name: "Red Sox",
            city: "Boston",
            league: "American",
            division: "East",
            season: 2025,
            emoji: "🧦"
        },
        // Profile data (JSON document)
        profile: {
            fullName: "Boston Red Sox",
            founded: 1901,
            colors: {
                primary: "#BD3039",
                secondary: "#0C2340",
                accent: "#FFFFFF"
            },
            stadium: {
                name: "Fenway Park",
                capacity: 37755,
                opened: 1912,
                dimensions: {
                    leftField: 310,
                    centerField: 420,
                    rightField: 302
                },
                features: ["Green Monster", "Pesky's Pole", "Manual Scoreboard"]
            },
            history: {
                championships: [1903, 1912, 1915, 1916, 1918, 2004, 2007, 2013, 2018],
                retiredNumbers: [1, 4, 6, 8, 9, 14, 26, 27, 34, 42],
                rivalries: ["New York Yankees", "Tampa Bay Rays"]
            },
            management: {
                generalManager: "Chaim Bloom",
                manager: "Alex Cora",
                owner: "John Henry"
            },
            facilities: {
                springTraining: {
                    location: "Fort Myers, FL",
                    facility: "JetBlue Park"
                },
                academy: "Dominican Republic Baseball Academy"
            },
            fanbase: {
                nickname: "Red Sox Nation",
                attendance2024: 2863914,
                socialMedia: {
                    twitter: "@RedSox",
                    instagram: "@redsox"
                }
            }
        }
    },
    {
        database: {
            id: 2,
            name: "Yankees",
            city: "New York",
            league: "American",
            division: "East",
            season: 2025,
            emoji: "🎩"
        },
        profile: {
            fullName: "New York Yankees",
            founded: 1903,
            colors: {
                primary: "#132448",
                secondary: "#FFFFFF",
                accent: "#C4CED4"
            },
            stadium: {
                name: "Yankee Stadium",
                capacity: 47309,
                opened: 2009,
                dimensions: {
                    leftField: 318,
                    centerField: 408,
                    rightField: 314
                },
                features: ["Monument Park", "Frieze", "Great Hall"]
            },
            history: {
                championships: [
                    1923, 1927, 1928, 1932, 1936, 1937, 1938, 1939, 1941, 1943, 1947, 1949, 1950,
                    1951, 1952, 1953, 1956, 1958, 1961, 1962, 1977, 1978, 1996, 1998, 1999, 2000,
                    2009
                ],
                retiredNumbers: [1, 3, 4, 5, 7, 8, 10, 15, 16, 20, 23, 32, 37, 42, 44, 46, 49, 51],
                rivalries: ["Boston Red Sox", "New York Mets"]
            },
            management: {
                generalManager: "Brian Cashman",
                manager: "Aaron Boone",
                owner: "Hal Steinbrenner"
            },
            facilities: {
                springTraining: {
                    location: "Tampa, FL",
                    facility: "George M. Steinbrenner Field"
                },
                academy: "Yankees Dominican Academy"
            },
            fanbase: {
                nickname: "Yankee Universe",
                attendance2024: 3204286,
                socialMedia: {
                    twitter: "@Yankees",
                    instagram: "@yankees"
                }
            }
        }
    },
    {
        database: {
            id: 3,
            name: "Dodgers",
            city: "Los Angeles",
            league: "National",
            division: "West",
            season: 2025,
            emoji: "💙"
        },
        profile: {
            fullName: "Los Angeles Dodgers",
            founded: 1883,
            colors: {
                primary: "#005A9C",
                secondary: "#FFFFFF",
                accent: "#EF3E42"
            },
            stadium: {
                name: "Dodger Stadium",
                capacity: 56000,
                opened: 1962,
                dimensions: {
                    leftField: 330,
                    centerField: 395,
                    rightField: 330
                },
                features: ["Think Blue", "Chavez Ravine", "Stadium Way"]
            },
            history: {
                championships: [1955, 1959, 1963, 1965, 1981, 1988, 2020],
                retiredNumbers: [1, 2, 4, 19, 20, 24, 25, 32, 34, 39, 42, 53],
                rivalries: ["San Francisco Giants", "San Diego Padres"]
            },
            management: {
                generalManager: "Brandon Gomes",
                manager: "Dave Roberts",
                owner: "Guggenheim Baseball Management"
            },
            facilities: {
                springTraining: {
                    location: "Phoenix, AZ",
                    facility: "Camelback Ranch"
                },
                academy: "Dominican Republic Complex"
            },
            fanbase: {
                nickname: "Dodger Blue Faithful",
                attendance2024: 3862408,
                socialMedia: {
                    twitter: "@Dodgers",
                    instagram: "@dodgers"
                }
            }
        }
    }
];

export const initializeSampleData = (db) => {
    console.log("Initializing sample team data...");

    sampleTeams.forEach(({ database, profile }) => {
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

    console.log("Sample data initialization complete!");
};
