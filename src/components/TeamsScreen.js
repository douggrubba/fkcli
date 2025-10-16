import React, { useState, useEffect } from "react";
import { Text, Box, useInput } from "ink";
import {
    isKey,
    KEYS,
    getNavigateKeysLabel,
    getSelectKeysLabel,
    getBackKeysLabel
} from "../util/keys.js";
import { getGameData } from "../data/index.js";
import InkTable from "./ui/InkTable.js";

const e = React.createElement;

const TeamsScreen = ({ onBack }) => {
    const [teams, setTeams] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [viewMode, setViewMode] = useState("standings");
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        const db = getGameData();
        const standings = db.getStandings();
        const id = setTimeout(() => setTeams(standings), 0);
        return () => clearTimeout(id);
    }, []);

    useInput((input, key) => {
        if (isKey(input, key, KEYS.BACK) && viewMode === "standings") {
            onBack();
        } else if (viewMode === "standings") {
            if (isKey(input, key, KEYS.UP) && selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            } else if (isKey(input, key, KEYS.DOWN) && selectedIndex < teams.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            } else if (isKey(input, key, KEYS.SELECT) && teams[selectedIndex]) {
                const db = getGameData();
                const teamData = db.getCompleteTeamData(teams[selectedIndex].id);
                setSelectedTeam(teamData);
                setViewMode("profile");
            }
        } else if (viewMode === "profile") {
            if (
                isKey(input, key, KEYS.BACK) ||
                (typeof input === "string" && input.toLowerCase() === "b")
            ) {
                setViewMode("standings");
                setSelectedTeam(null);
            }
        }
    });

    const renderStandings = () => {
        const rows = teams.map((team, index) => ({
            id: team.id,
            rank: index + 1,
            team: `${team.city} ${team.name}`,
            w: team.wins,
            l: team.losses,
            pct: `${((team.win_percentage || 0) * 100).toFixed(1)}%`
        }));

        const nameWidth = Math.max(20, ...rows.map((r) => r.team.length));

        return e(Box, { flexDirection: "column", padding: 1 }, [
            e(Text, { key: "title", bold: true, color: "cyan" }, "🏆 Team Standings"),
            e(Box, { key: "sp1", height: 1 }),
            e(InkTable, {
                key: "table",
                columns: [
                    { key: "rank", header: "Rank", width: 4, align: "right" },
                    { key: "team", header: "Team", width: nameWidth, align: "left" },
                    { key: "w", header: "W", width: 3, align: "right" },
                    { key: "l", header: "L", width: 3, align: "right" },
                    { key: "pct", header: "PCT", width: 6, align: "right" }
                ],
                data: rows,
                selectedIndex,
                pageSize: 14,
                highlightColor: "cyan"
            }),
            e(Box, { key: "sp2", height: 2 }),
            e(
                Text,
                { key: "footer", color: "yellow" },
                `${getNavigateKeysLabel()} Navigate • ${getSelectKeysLabel()}: View Team • ${getBackKeysLabel()}: Back to Menu`
            )
        ]);
    };

    const renderTeamProfile = () => {
        if (!selectedTeam) return null;

        const { record, profile } = selectedTeam;
        const winPct = ((record.win_percentage || 0) * 100).toFixed(1);

        const children = [
            e(
                Text,
                { key: "hdr", bold: true, color: "cyan" },
                `🏟️  ${profile.fullName || `${record.city} ${record.name}`}`
            ),
            e(Box, { key: "sp1", height: 1 }),
            e(
                Text,
                { key: "rec", color: "green" },
                `📊 Current Record: ${record.wins}-${record.losses} (${winPct}%)`
            ),
            e(Box, { key: "sp2", height: 1 })
        ];

        if (profile.stadium) {
            children.push(
                e(
                    Text,
                    { key: "stad", color: "white" },
                    `🏟️  Stadium: ${profile.stadium.name} (${profile.stadium.capacity?.toLocaleString()} capacity)`
                ),
                e(Text, { key: "opened", color: "gray" }, `   Opened: ${profile.stadium.opened}`)
            );
        }

        if (profile.stadium?.features) {
            children.push(
                e(
                    Text,
                    { key: "feat", color: "gray" },
                    `   Features: ${profile.stadium.features.join(", ")}`
                )
            );
        }

        children.push(e(Box, { key: "sp3", height: 1 }));

        if (profile.history) {
            const latest = Math.max(...(profile.history.championships || [0]));
            children.push(
                e(
                    Text,
                    { key: "hist", color: "yellow" },
                    `🏆 Championships: ${profile.history.championships?.length || 0} (Latest: ${latest})`
                )
            );
        }

        if (profile.founded) {
            children.push(
                e(Text, { key: "found", color: "gray" }, `📅 Founded: ${profile.founded}`)
            );
        }

        if (profile.management) {
            children.push(
                e(Box, { key: "mgmt", flexDirection: "column", marginTop: 1 }, [
                    e(Text, { key: "mgmt-h", color: "cyan", bold: true }, "Management:"),
                    e(
                        Text,
                        { key: "mgr", color: "white" },
                        `  Manager: ${profile.management.manager}`
                    ),
                    e(
                        Text,
                        { key: "gm", color: "white" },
                        `  GM: ${profile.management.generalManager}`
                    )
                ])
            );
        }

        children.push(
            e(Box, { key: "sp4", height: 2 }),
            e(Text, { key: "btm", color: "yellow" }, "B: Back to Standings • Esc: Back to Menu")
        );

        return e(Box, { flexDirection: "column", padding: 1 }, children);
    };

    if (viewMode === "profile") {
        return renderTeamProfile();
    }

    return renderStandings();
};

export default TeamsScreen;
