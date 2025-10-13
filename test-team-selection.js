// Simple test to verify the team selection screen works
import { render } from 'ink';
import React from 'react';
import { initializeGameData } from './src/data/index.js';
import TeamSelectionScreen from './src/components/TeamSelectionScreen.js';

// Initialize data
initializeGameData();

const TestApp = () => {
    return React.createElement(TeamSelectionScreen, {
        onTeamSelect: (team) => {
            console.log('Selected team:', team.city, team.name);
            process.exit(0);
        },
        onBack: () => {
            console.log('Back pressed');
            process.exit(0);
        }
    });
};

render(React.createElement(TestApp));