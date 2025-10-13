import React from "react";
import { Text, Box, useInput } from "ink";
import { t } from "../lang/index.js";
import { getGameState } from "../data/gameState.js";

const SettingsScreen = ({ onBack }) => {
    useInput((input, key) => {
        if (key.escape || input === "q") {
            // Update game state before going back to menu
            const gameState = getGameState();
            gameState.setCurrentScreen("menu");
            onBack();
        }
    });

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
                    color: "green"
                },
                `🎮 ${t("settings.title")}`
            ),
            React.createElement(Box, { key: "spacer1", height: 1 }),
            React.createElement(Text, { key: "instruction" }, t("settings.instruction")),
            React.createElement(Box, { key: "spacer2", height: 1 }),
            React.createElement(Text, { key: "option1" }, `1. ${t("settings.option1")}`),
            React.createElement(Text, { key: "option2" }, `2. ${t("settings.option2")}`),
            React.createElement(Text, { key: "option3" }, `3. ${t("settings.option3")}`),
            React.createElement(Box, { key: "spacer3", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            )
        ]
    );
};

export default SettingsScreen;
