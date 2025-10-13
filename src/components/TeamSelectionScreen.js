import React, { useState, useEffect } from 'react';
import { Text, Box, useInput } from 'ink';
import { t } from '../lang/index.js';
import { getGameData } from '../data/index.js';

const TeamSelectionScreen = ({ onTeamSelect, onBack }) => {
    const [teams, setTeams] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedTeamData, setSelectedTeamData] = useState(null);

    useEffect(() => {
        const db = getGameData();
        const standings = db.getStandings();
        // Sort teams alphabetically by city for consistent selection
        const sortedTeams = standings.sort((a, b) => 
            `${a.city} ${a.name}`.localeCompare(`${b.city} ${b.name}`)
        );
        setTeams(sortedTeams);
    }, []);

    // Load detailed data for the currently selected team
    useEffect(() => {
        if (teams.length > 0 && teams[selectedIndex]) {
            const db = getGameData();
            const teamData = db.getCompleteTeamData(teams[selectedIndex].id);
            // Merge the basic team data with the complete data for league/division info
            const enhancedData = {
                ...teamData,
                record: {
                    ...teamData.record,
                    league: teams[selectedIndex].league,
                    division: teams[selectedIndex].division
                }
            };
            setSelectedTeamData(enhancedData);
        }
    }, [selectedIndex, teams]);

    useInput((input, key) => {
        if (key.escape || input === 'q') {
            onBack();
        } else if (key.upArrow && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        } else if (key.downArrow && selectedIndex < teams.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        } else if (key.return && teams[selectedIndex]) {
            onTeamSelect(teams[selectedIndex]);
        }
    });

    const renderTeamDetails = () => {
        if (!selectedTeamData) {
            return React.createElement(Box, {
                key: 'loading-details',
                flexDirection: 'column',
                padding: 1
            }, [
                React.createElement(Text, {
                    key: 'loading',
                    color: 'yellow'
                }, 'Loading team details...')
            ]);
        }

        const { record, profile } = selectedTeamData;
        const winPct = record.win_percentage ? (record.win_percentage * 100).toFixed(1) : '0.0';
        const gamesPlayed = (record.wins || 0) + (record.losses || 0);

        const logoElement = teams[selectedIndex]?.logo_base64 
            ? React.createElement(Text, {
                key: 'logo',
                color: 'yellow'
            }, teams[selectedIndex].logo_base64)
            : React.createElement(Text, {
                key: 'logo-placeholder',
                color: 'gray'
            }, '🏟️ ⚾ 🦅');

        return React.createElement(Box, {
            key: 'team-details',
            flexDirection: 'column',
            padding: 1,
            borderStyle: 'single',
            borderColor: 'cyan'
        }, [
            logoElement,
            
            React.createElement(Text, {
                key: 'detail-title',
                bold: true,
                color: 'cyan'
            }, `📊 ${profile?.fullName || `${record.city} ${record.name}`}`),
            
            React.createElement(Box, { key: 'detail-spacer1', height: 1 }),
            
            React.createElement(Text, {
                key: 'record',
                color: 'white'
            }, `Record: ${record.wins || 0}-${record.losses || 0} (${winPct}%)`),
            
            React.createElement(Text, {
                key: 'league-division',
                color: 'gray'
            }, `${record.league || 'Unknown'} League, ${record.division || 'Unknown'} Division`),
            
            React.createElement(Box, { key: 'detail-spacer2', height: 1 }),
            
            profile?.stadium && React.createElement(Text, {
                key: 'stadium',
                color: 'green'
            }, `🏟️  ${profile.stadium.name}`),
            
            profile?.stadium && React.createElement(Text, {
                key: 'stadium-details',
                color: 'gray'
            }, `   Capacity: ${profile.stadium.capacity?.toLocaleString()} • Opened: ${profile.stadium.opened}`),
            
            profile?.stadium?.dimensions && React.createElement(Text, {
                key: 'dimensions',
                color: 'gray'
            }, `   Dimensions: ${profile.stadium.dimensions.leftField}' - ${profile.stadium.dimensions.centerField}' - ${profile.stadium.dimensions.rightField}'`),
            
            React.createElement(Box, { key: 'detail-spacer3', height: 1 }),
            
            profile?.history?.championships && React.createElement(Text, {
                key: 'championships',
                color: 'yellow'
            }, `🏆 Championships: ${profile.history.championships.length} (Latest: ${Math.max(...profile.history.championships)})`),
            
            profile?.founded && React.createElement(Text, {
                key: 'founded',
                color: 'gray'
            }, `📅 Founded: ${profile.founded}`),
            
            React.createElement(Box, { key: 'detail-spacer4', height: 1 }),
            
            profile?.management && React.createElement(Text, {
                key: 'manager',
                color: 'white'
            }, `👔 Manager: ${profile.management.manager}`),
            
            profile?.management && React.createElement(Text, {
                key: 'gm',
                color: 'gray'
            }, `   GM: ${profile.management.generalManager}`),
            
            React.createElement(Box, { key: 'detail-spacer5', height: 1 }),
            
            profile?.stadium?.features && React.createElement(Text, {
                key: 'features-title',
                color: 'cyan'
            }, 'Notable Features:'),
            
            ...(profile?.stadium?.features || []).slice(0, 3).map((feature, index) => 
                React.createElement(Text, {
                    key: `feature-${index}`,
                    color: 'gray'
                }, `   • ${feature}`)
            )
        ]);
    };

    return React.createElement(Box, {
        flexDirection: 'row',
        padding: 1,
        height: 25
    }, [
        // Left column - Team list
        React.createElement(Box, {
            key: 'team-list',
            flexDirection: 'column',
            width: '50%',
            paddingRight: 2
        }, [
            React.createElement(Text, {
                key: 'title',
                bold: true,
                color: 'cyan'
            }, '⚾ Select Your Team'),
            
            React.createElement(Box, { key: 'spacer1', height: 1 }),
            
            React.createElement(Text, {
                key: 'subtitle',
                color: 'yellow'
            }, 'Choose the team you want to manage:'),
            
            React.createElement(Box, { key: 'spacer2', height: 1 }),
            
            ...teams.map((team, index) => {
                const isSelected = index === selectedIndex;
                const teamName = `${team.city} ${team.name}`;
                
                return React.createElement(Text, {
                    key: team.id,
                    color: isSelected ? 'black' : 'white',
                    backgroundColor: isSelected ? 'cyan' : undefined,
                    bold: isSelected
                }, ` ${isSelected ? '►' : ' '} ${teamName}`);
            }),
            
            React.createElement(Box, { key: 'spacer3', height: 2 }),
            
            React.createElement(Text, {
                key: 'instructions',
                color: 'gray'
            }, '↑↓ Navigate • Enter: Select • Q/Esc: Back')
        ]),
        
        // Right column - Team details
        React.createElement(Box, {
            key: 'team-details-container',
            flexDirection: 'column',
            width: '50%',
            paddingLeft: 1
        }, [
            renderTeamDetails()
        ])
    ]);
};

export default TeamSelectionScreen;