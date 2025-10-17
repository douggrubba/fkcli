import { render, Text, Box, useInput } from "ink";
import React, { useState, useEffect } from "react";
import { cleanupAndExit, enterFullscreen, exitFullscreen, exit } from "./util/ui.js";
import { initLanguageSystem, t, onLanguageChange } from "./lang/index.js";
import { getConfig } from "./config.js";
import { displayLogo } from "./util/logo.js";
import Menu from "./components/Menu.js";
import TeamsScreen from "./components/TeamsScreen.js";
import TeamSelectionScreen from "./components/TeamSelectionScreen.js";
import GameScreen from "./components/GameScreen.js";
import SettingsScreen from "./components/SettingsScreen.js";
import PlayerPoolScreen from "./components/PlayerPoolScreen.js";
import { initializeGameData, closeGameData } from "./data/index.js";
import { getGameState, initializeGameState } from "./data/gameState.js";

const App = () => {
    const [currentScreen, setCurrentScreen] = useState("welcome");
    const [showLogo, setShowLogo] = useState(true);

    // Initialize game data on app start
    useEffect(() => {
        try {
            initializeGameData();

            // Initialize game state and check for existing save
            const existingGame = initializeGameState();
            if (existingGame) {
                // Resume from where the player left off
                setCurrentScreen(existingGame.current_screen);
                setShowLogo(existingGame.current_screen === "welcome");
            }
        } catch (error) {
            console.error("Failed to initialize game data:", error);
        }

        // Cleanup on unmount
        return () => {
            closeGameData();
        };
    }, []);

    // Re-render the app when language changes
    useEffect(() => {
        const unsubscribe = onLanguageChange(() => {
            // Force re-render by toggling state
            setCurrentScreen((prev) => prev);
        });
        return unsubscribe;
    }, []);

    useInput((input, key) => {
        if (key.ctrl && input === "c") {
            exit();
        }

        // On welcome screen, any key shows menu
        if (currentScreen === "welcome" && (input || key.return || key.space)) {
            setCurrentScreen("menu");
            setShowLogo(false);
        }
    });

    const handleMenuSelect = (menuKey) => {
        const gameState = getGameState();

        switch (menuKey) {
            case "newGame":
                // If there's an active game, delete it before starting new one
                if (gameState.hasActiveGame()) {
                    gameState.deleteGame();
                }
                setCurrentScreen("teamSelection");
                break;
            case "continue":
                if (gameState.hasActiveGame()) {
                    setCurrentScreen(gameState.getCurrentScreen());
                } else {
                    // No saved game found
                    setCurrentScreen("noSavedGame");
                }
                break;
            case "settings":
                setCurrentScreen("settings");
                break;
            case "teams":
                setCurrentScreen("teams");
                break;
            case "playerPool":
                setCurrentScreen("playerPool");
                break;
            case "quit":
                exit();
                break;
        }
    };

    const handleTeamSelection = (selectedTeam) => {
        const gameState = getGameState();

        // Create new game with selected team
        gameState.createNewGame(
            selectedTeam.id,
            `${selectedTeam.city} ${selectedTeam.name} Manager`
        );

        // Set screen to game and update state
        gameState.setCurrentScreen("game");
        setCurrentScreen("game");
    };

    const renderWelcomeScreen = () => {
        return React.createElement(
            Box,
            {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            },
            [
                React.createElement(Box, { key: "spacer0", height: 20 }),
                React.createElement(Text, { key: "logo" }, displayLogo()),
                React.createElement(Box, { key: "spacer1", height: 1 }),
                React.createElement(
                    Text,
                    { key: "welcome", color: "green", bold: true },
                    t("ui.welcome")
                ),
                React.createElement(Text, { key: "subtitle", color: "gray" }, t("ui.subtitle")),
                React.createElement(Box, { key: "spacer2", height: 2 }),
                React.createElement(
                    Text,
                    { key: "continue", color: "yellow" },
                    t("ui.pressAnyKey")
                ),
                React.createElement(Box, { key: "spacer3", height: 1 }),
                React.createElement(
                    Text,
                    { key: "exit", color: "gray", dimColor: true },
                    t("ui.exit")
                )
            ]
        );
    };

    const renderMenuScreen = () => {
        return React.createElement(
            Box,
            {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            },
            [
                React.createElement(Box, { key: "spacer0", height: 20 }),
                showLogo && React.createElement(Text, { key: "logo" }, displayLogo()),
                showLogo && React.createElement(Box, { key: "spacer1", height: 1 }),
                React.createElement(
                    Text,
                    { key: "welcome", color: "green", bold: true },
                    t("ui.welcome")
                ),
                React.createElement(Menu, { key: "menu", onSelect: handleMenuSelect }),
                React.createElement(Box, { key: "spacer2", height: 1 }),
                React.createElement(
                    Text,
                    { key: "exit", color: "gray", dimColor: true },
                    t("ui.exit")
                )
            ]
        );
    };

    const renderGameScreen = (type) => {
        const messages = {
            settings: "Settings menu (coming soon...)",
            noSavedGame: "No saved game found. Please start a new game."
        };

        return React.createElement(
            Box,
            {
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            },
            [
                React.createElement(Box, { key: "spacer0", height: 20 }),
                React.createElement(
                    Text,
                    { key: "message", color: "cyan" },
                    messages[type] || "Game screen"
                ),
                React.createElement(Box, { key: "spacer", height: 2 }),
                React.createElement(Text, { key: "exit", color: "gray" }, t("ui.exit"))
            ]
        );
    };

    switch (currentScreen) {
        case "welcome":
            return renderWelcomeScreen();
        case "menu":
            return renderMenuScreen();
        case "teams":
            return React.createElement(TeamsScreen, {
                onBack: () => setCurrentScreen("menu")
            });
        case "teamSelection":
            return React.createElement(TeamSelectionScreen, {
                onTeamSelect: handleTeamSelection,
                onBack: () => setCurrentScreen("menu")
            });
        case "game":
            return React.createElement(GameScreen, {
                onBack: () => setCurrentScreen("menu")
            });
        case "settings":
            return React.createElement(SettingsScreen, {
                onBack: () => setCurrentScreen("menu")
            });
        case "playerPool":
            return React.createElement(PlayerPoolScreen, {
                onBack: () => setCurrentScreen("menu")
            });
        case "noSavedGame":
            return renderGameScreen(currentScreen);
        default:
            return renderWelcomeScreen();
    }
};

const main = () => {
    // Initialize language system with configured language
    const preferredLanguage = getConfig("language");
    initLanguageSystem(preferredLanguage);

    enterFullscreen();

    const { unmount } = render(React.createElement(App), { exitOnCtrlC: false });

    process.on("SIGINT", () => cleanupAndExit(unmount));
    process.on("SIGTERM", () => cleanupAndExit(unmount));
    process.on("exit", () => exitFullscreen());
};

main();
