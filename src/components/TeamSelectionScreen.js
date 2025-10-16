import React, { useState, useMemo } from "react";
import { Text, Box, useInput } from "ink";
import { getGameData } from "../data/index.js";
import { isKey, KEYS } from "../util/keys.js";

const TeamSelectionScreen = ({ onTeamSelect, onBack }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const teams = useMemo(() => {
        const db = getGameData();
        const standings = db.getStandings();

        return [...standings].sort((a, b) =>
            `${a.city} ${a.name}`.localeCompare(`${b.city} ${b.name}`)
        );
    }, []);

    // Load detailed data for the currently selected team (derived)
    const selectedTeamData = useMemo(() => {
        if (teams.length > 0 && teams[selectedIndex]) {
            const db = getGameData();
            const teamData = db.getCompleteTeamData(teams[selectedIndex].id);
            return {
                ...teamData,
                record: {
                    ...teamData.record,
                    league: teams[selectedIndex].league,
                    division: teams[selectedIndex].division
                }
            };
        }
        return null;
    }, [selectedIndex, teams]);

    useInput((input, key) => {
        if (isKey(input, key, KEYS.BACK)) {
            onBack();
        } else if (isKey(input, key, KEYS.UP)) {
            if (selectedIndex === 0) {
                setSelectedIndex(teams.length - 1);
            } else {
                setSelectedIndex(selectedIndex - 1);
            }
        } else if (isKey(input, key, KEYS.DOWN)) {
            if (selectedIndex === teams.length - 1) {
                setSelectedIndex(0);
            } else {
                setSelectedIndex(selectedIndex + 1);
            }
        } else if (isKey(input, key, KEYS.SELECT) && teams[selectedIndex]) {
            onTeamSelect(teams[selectedIndex]);
        }
    });

    const getTeamName = (team) => {
        return team ? `${team.city} ${team?.name}` : "Unknown Team";
    };

    const renderTeamDetails = () => {
        if (!selectedTeamData) {
            return React.createElement(
                Box,
                {
                    key: "loading-details",
                    flexDirection: "column",
                    padding: 1
                },
                [
                    React.createElement(
                        Text,
                        {
                            key: "loading",
                            color: "yellow"
                        },
                        "Loading team details..."
                    )
                ]
            );
        }

        const { record, profile } = selectedTeamData;
        const winPct = record.win_percentage ? (record.win_percentage * 100).toFixed(1) : "0.0";

        const logoElement = React.createElement(
            Text,
            {
                key: "logo",
                color: "yellow",
                bold: true
            },
            teams[selectedIndex]?.emoji || "⚾"
        );

        // Prepare consistent details to avoid layout jumping between selections
        const champs = Array.isArray(profile?.history?.championships)
            ? profile.history.championships
            : [];
        const latestChamp = champs.length > 0 ? Math.max(...champs) : "—";
        const stadium = profile?.stadium || {};
        const dims = stadium?.dimensions || {};
        const features = Array.isArray(stadium?.features) ? stadium.features.slice(0, 3) : [];
        const paddedFeatures = [...features];
        while (paddedFeatures.length < 3) paddedFeatures.push("");

        return React.createElement(
            Box,
            {
                key: "team-details",
                flexDirection: "column",
                padding: 1,
                borderStyle: "single",
                borderColor: "cyan"
            },
            [
                logoElement,

                React.createElement(
                    Text,
                    {
                        key: "detail-title",
                        bold: true,
                        color: "cyan"
                    },
                    `📊 ${profile?.fullName || `${record.city} ${record.name}`}`
                ),

                React.createElement(Box, { key: "detail-spacer1", height: 1 }),

                React.createElement(
                    Text,
                    {
                        key: "record",
                        color: "white"
                    },
                    `Record: ${record.wins || 0}-${record.losses || 0} (${winPct}%)`
                ),

                React.createElement(
                    Text,
                    { key: "league-division", color: "gray" },
                    `${record.league || "Unknown"} • ${record.division || "Unknown"}`
                ),

                React.createElement(Box, { key: "detail-spacer2", height: 1 }),

                React.createElement(
                    Text,
                    { key: "stadium", color: "green" },
                    `🏟️  ${stadium?.name || "Unknown Stadium"}`
                ),

                React.createElement(
                    Text,
                    { key: "stadium-details", color: "gray" },
                    `   Capacity: ${stadium?.capacity?.toLocaleString?.() || "—"} • Opened: ${stadium?.opened || "—"}`
                ),

                React.createElement(
                    Text,
                    { key: "dimensions", color: "gray" },
                    `   Dimensions: ${dims.leftField || "—"}' - ${dims.centerField || "—"}' - ${dims.rightField || "—"}'`
                ),

                React.createElement(Box, { key: "detail-spacer3", height: 1 }),

                React.createElement(
                    Text,
                    { key: "championships", color: "yellow" },
                    `🏆 Championships: ${champs.length} (Latest: ${latestChamp})`
                ),

                React.createElement(
                    Text,
                    { key: "founded", color: "gray" },
                    `📅 Founded: ${profile?.founded || "—"}`
                ),

                React.createElement(Box, { key: "detail-spacer4", height: 1 }),

                React.createElement(
                    Text,
                    { key: "manager", color: "white" },
                    `👔 Manager: ${profile?.management?.manager || "—"}`
                ),

                React.createElement(
                    Text,
                    { key: "gm", color: "gray" },
                    `   GM: ${profile?.management?.generalManager || "—"}`
                ),

                React.createElement(Box, { key: "detail-spacer5", height: 1 }),

                React.createElement(
                    Text,
                    { key: "features-title", color: "cyan" },
                    "Notable Features:"
                ),

                ...paddedFeatures.map((feature, index) =>
                    React.createElement(
                        Text,
                        { key: `feature-${index}`, color: "gray" },
                        `   • ${feature}`
                    )
                )
            ]
        );
    };

    // Compute scroll window for the team list
    const total = teams.length;

    return React.createElement(
        Box,
        {
            flexDirection: "row",
            padding: 1,
            height: 25
        },
        [
            // Left column - Team list
            React.createElement(
                Box,
                {
                    key: "team-list",
                    flexDirection: "column",
                    flexGrow: 1,
                    paddingRight: 2
                },
                [
                    React.createElement(
                        Text,
                        {
                            key: "title",
                            bold: true,
                            color: "cyan"
                        },
                        "⚾ Select Your Team"
                    ),

                    React.createElement(Box, { key: "spacer1", height: 1 }),

                    React.createElement(
                        Text,
                        {
                            key: "subtitle",
                            color: "yellow"
                        },
                        "Choose the team you want to manage:"
                    ),

                    React.createElement(Box, { key: "spacer2", height: 1 }),

                    React.createElement(
                        Text,
                        { key: "prevTeam", color: "gray" },
                        getTeamName(teams[selectedIndex - 1 > -1 ? selectedIndex - 1 : total - 1])
                    ),

                    React.createElement(
                        Text,
                        { key: "selectedTeam", color: "cyan" },
                        getTeamName(teams[selectedIndex])
                    ),

                    React.createElement(
                        Text,
                        { key: "nextTeam", color: "gray" },
                        getTeamName(teams[selectedIndex + 1 < total - 1 ? selectedIndex + 1 : 0])
                    ),

                    React.createElement(Box, { key: "spacer3", height: 2 }),

                    React.createElement(
                        Text,
                        {
                            key: "instructions",
                            color: "gray"
                        },
                        "↑↓ Navigate • Enter: Select • Q/Esc: Back"
                    )
                ]
            ),

            // Right column - Team details
            React.createElement(
                Box,
                {
                    key: "team-details-container",
                    flexDirection: "column",
                    flexGrow: 1,
                    paddingLeft: 1
                },
                [renderTeamDetails()]
            )
        ]
    );
};

export default TeamSelectionScreen;
