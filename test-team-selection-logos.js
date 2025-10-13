// Test team selection with logos
import { render } from "ink";
import React from "react";
import { initializeGameData } from "./src/data/index.js";
import { initializeSampleData } from "./src/data/sample-data.js";
import TeamSelectionScreen from "./src/components/TeamSelectionScreen.js";

// Initialize data with logos
const db = initializeGameData();
initializeSampleData(db);

const TestApp = () => {
    return React.createElement(TeamSelectionScreen, {
        onTeamSelect: (team) => {
            console.log("Selected team:", team.city, team.name);
            process.exit(0);
        },
        onBack: () => {
            console.log("Back pressed");
            process.exit(0);
        }
    });
};

render(React.createElement(TestApp));
