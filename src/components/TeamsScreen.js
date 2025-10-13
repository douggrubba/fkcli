import React, { useState, useEffect } from "react";
import { Text, Box, useInput } from "ink";
import { t } from "../lang/index.js";
import { getGameData } from "../data/index.js";

const TeamsScreen = ({ onBack }) => {
    const [teams, setTeams] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [viewMode, setViewMode] = useState("standings"); // 'standings' or 'profile'
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        const db = getGameData();
        const standings = db.getStandings();
        setTeams(standings);
    }, []);

    useInput((input, key) => {
        if (key.escape || (input === "q" && viewMode === "standings")) {
            onBack();
        } else if (viewMode === "standings") {
            if (key.upArrow && selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            } else if (key.downArrow && selectedIndex < teams.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            } else if (key.return && teams[selectedIndex]) {
                const db = getGameData();
                const teamData = db.getCompleteTeamData(teams[selectedIndex].id);
                setSelectedTeam(teamData);
                setViewMode("profile");
            }
        } else if (viewMode === "profile") {
            if (key.escape || input === "b") {
                setViewMode("standings");
                setSelectedTeam(null);
            }
        }
    });

    const renderStandings = () => {
        return React.createElement(
            Box,
            {
                flexDirection: "column",
                padding: 1
            },
            [
                React.createElement(
                    Text,
                    {
                        key: "title",
                        bold: true,
                        color: "cyan"
                    },
                    "🏆 Team Standings"
                ),

                React.createElement(Box, { key: "spacer1", height: 1 }),

                React.createElement(
                    Text,
                    {
                        key: "header",
                        color: "gray"
                    },
                    "Rank  Team                     W    L    PCT"
                ),

                React.createElement(
                    Text,
                    {
                        key: "divider",
                        color: "gray"
                    },
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
                ),

                ...teams.map((team, index) => {
                    const isSelected = index === selectedIndex;
                    const winPct = ((team.win_percentage || 0) * 100).toFixed(1);
                    const teamName = `${team.city} ${team.name}`;
                    const paddedName = teamName.padEnd(20);
                    const paddedWins = team.wins.toString().padStart(3);
                    const paddedLosses = team.losses.toString().padStart(3);
                    const paddedPct = winPct.padStart(5);

                    return React.createElement(
                        Text,
                        {
                            key: team.id,
                            color: isSelected ? "black" : "white",
                            backgroundColor: isSelected ? "cyan" : undefined,
                            bold: isSelected
                        },
                        ` ${(index + 1).toString().padStart(2)}   ${paddedName} ${paddedWins}  ${paddedLosses}  ${paddedPct}%`
                    );
                }),

                React.createElement(Box, { key: "spacer2", height: 2 }),

                React.createElement(
                    Text,
                    {
                        key: "instructions",
                        color: "yellow"
                    },
                    "↑↓ Navigate • Enter: View Team • Q: Back to Menu"
                )
            ]
        );
    };

    const renderTeamProfile = () => {
        if (!selectedTeam) return null;

        const { record, profile } = selectedTeam;
        const winPct = ((record.win_percentage || 0) * 100).toFixed(1);

        return React.createElement(
            Box,
            {
                flexDirection: "column",
                padding: 1
            },
            [
                React.createElement(
                    Text,
                    {
                        key: "title",
                        bold: true,
                        color: "cyan"
                    },
                    `🏟️  ${profile.fullName || `${record.city} ${record.name}`}`
                ),

                React.createElement(Box, { key: "spacer1", height: 1 }),

                React.createElement(
                    Text,
                    {
                        key: "record",
                        color: "green"
                    },
                    `📊 Current Record: ${record.wins}-${record.losses} (${winPct}%)`
                ),

                React.createElement(Box, { key: "spacer2", height: 1 }),

                profile.stadium &&
                    React.createElement(
                        Text,
                        {
                            key: "stadium",
                            color: "white"
                        },
                        `🏟️  Stadium: ${profile.stadium.name} (${profile.stadium.capacity?.toLocaleString()} capacity)`
                    ),

                profile.stadium &&
                    React.createElement(
                        Text,
                        {
                            key: "opened",
                            color: "gray"
                        },
                        `   Opened: ${profile.stadium.opened}`
                    ),

                profile.stadium?.features &&
                    React.createElement(
                        Text,
                        {
                            key: "features",
                            color: "gray"
                        },
                        `   Features: ${profile.stadium.features.join(", ")}`
                    ),

                React.createElement(Box, { key: "spacer3", height: 1 }),

                profile.history &&
                    React.createElement(
                        Text,
                        {
                            key: "championships",
                            color: "yellow"
                        },
                        `🏆 Championships: ${profile.history.championships?.length || 0} (Latest: ${Math.max(...(profile.history.championships || [0]))})`
                    ),

                profile.founded &&
                    React.createElement(
                        Text,
                        {
                            key: "founded",
                            color: "gray"
                        },
                        `📅 Founded: ${profile.founded}`
                    ),

                profile.management &&
                    React.createElement(
                        Box,
                        {
                            key: "management",
                            flexDirection: "column",
                            marginTop: 1
                        },
                        [
                            React.createElement(
                                Text,
                                {
                                    key: "mgmt-title",
                                    color: "cyan",
                                    bold: true
                                },
                                "Management:"
                            ),
                            React.createElement(
                                Text,
                                {
                                    key: "manager",
                                    color: "white"
                                },
                                `  Manager: ${profile.management.manager}`
                            ),
                            React.createElement(
                                Text,
                                {
                                    key: "gm",
                                    color: "white"
                                },
                                `  GM: ${profile.management.generalManager}`
                            )
                        ]
                    ),

                React.createElement(Box, { key: "spacer4", height: 2 }),

                React.createElement(
                    Text,
                    {
                        key: "instructions",
                        color: "yellow"
                    },
                    "B: Back to Standings • Esc: Back to Menu"
                )
            ]
        );
    };

    if (viewMode === "profile") {
        return renderTeamProfile();
    }

    return renderStandings();
};

export default TeamsScreen;
