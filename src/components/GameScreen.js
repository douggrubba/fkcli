import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { t } from '../lang/index.js';
import { getGameState } from '../data/gameState.js';

const GameScreen = ({ onBack }) => {
    const [playerTeam, setPlayerTeam] = useState(null);
    const [gameData, setGameData] = useState({});

    useEffect(() => {
        const gameState = getGameState();
        const teamData = gameState.getPlayerTeamData();
        const currentGameData = gameState.getGameData();
        
        setPlayerTeam(teamData);
        setGameData(currentGameData);
    }, []);

    useInput((input, key) => {
        if (key.escape || input === 'q') {
            // Update game state before going back to menu
            const gameState = getGameState();
            gameState.setCurrentScreen('menu');
            onBack();
        }
    });

    if (!playerTeam) {
        return React.createElement(Box, {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: 10
        }, [
            React.createElement(Text, {
                key: 'loading',
                color: 'yellow'
            }, 'Loading game...')
        ]);
    }

    const { record, profile } = playerTeam;
    const teamName = `${record.city} ${record.name}`;

    return React.createElement(Box, {
        flexDirection: 'column',
        padding: 1
    }, [
        React.createElement(Text, {
            key: 'title',
            bold: true,
            color: 'green'
        }, `🎮 Managing: ${teamName}`),
        
        React.createElement(Box, { key: 'spacer1', height: 1 }),
        
        React.createElement(Text, {
            key: 'season',
            color: 'cyan'
        }, `📅 Season: ${gameData.season || new Date().getFullYear()}`),
        
        React.createElement(Text, {
            key: 'record',
            color: 'white'
        }, `📊 Current Record: ${record.wins}-${record.losses}`),
        
        React.createElement(Box, { key: 'spacer2', height: 1 }),
        
        profile?.stadium && React.createElement(Text, {
            key: 'stadium',
            color: 'gray'
        }, `🏟️  Home Stadium: ${profile.stadium.name}`),
        
        React.createElement(Box, { key: 'spacer3', height: 2 }),
        
        React.createElement(Text, {
            key: 'welcome',
            color: 'yellow'
        }, `Welcome to your first season managing the ${teamName}!`),
        
        React.createElement(Text, {
            key: 'coming-soon',
            color: 'gray'
        }, 'Game features coming soon...'),
        
        React.createElement(Box, { key: 'spacer4', height: 2 }),
        
        React.createElement(Text, {
            key: 'day',
            color: 'cyan'
        }, `Day ${gameData.currentDay || 1} of the season`),
        
        React.createElement(Text, {
            key: 'started',
            color: 'gray'
        }, `Game started: ${gameData.gameStarted ? new Date(gameData.gameStarted).toLocaleDateString() : 'Today'}`),
        
        React.createElement(Box, { key: 'spacer5', height: 2 }),
        
        React.createElement(Text, {
            key: 'instructions',
            color: 'yellow'
        }, 'Q/Esc: Back to Menu')
    ]);
};

export default GameScreen;