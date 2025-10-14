import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { t, setLanguage, getCurrentLanguage, LANGUAGES, getLanguageName } from "../lang/index.js";
import { getGameState } from "../data/gameState.js";
import { setConfig } from "../config.js";

const SettingsScreen = ({ onBack }) => {
    const [currentView, setCurrentView] = useState("main");
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(0);
    const [showMessage, setShowMessage] = useState("");
    const [languageChanged, setLanguageChanged] = useState(0); // Force re-render when language changes

    const availableLanguages = Object.keys(LANGUAGES);

    useInput((input, key) => {
        if (key.escape || input === "q") {
            if (currentView === "main") {
                // Update game state before going back to menu
                const gameState = getGameState();
                gameState.setCurrentScreen("menu");
                onBack();
            } else {
                // Go back to main settings
                setCurrentView("main");
                setSelectedOption(0);
                setShowMessage("");
            }
        }

        if (currentView === "main") {
            // Main settings navigation
            if (key.upArrow) {
                setSelectedOption(Math.max(0, selectedOption - 1));
            } else if (key.downArrow) {
                setSelectedOption(Math.min(2, selectedOption + 1));
            } else if (key.return || input === "1" || input === "2" || input === "3") {
                const option = input ? parseInt(input) - 1 : selectedOption;
                if (option === 0) {
                    // Change Language
                    setCurrentView("language");
                    setSelectedLanguage(availableLanguages.indexOf(getCurrentLanguage()));
                } else if (option === 1) {
                    // Game Difficulty (placeholder)
                    setShowMessage("Game difficulty settings coming soon!");
                } else if (option === 2) {
                    // Audio Settings (placeholder)
                    setShowMessage("Audio settings coming soon!");
                }
            }
        } else if (currentView === "language") {
            // Language selection navigation
            if (key.upArrow) {
                setSelectedLanguage(Math.max(0, selectedLanguage - 1));
            } else if (key.downArrow) {
                setSelectedLanguage(Math.min(availableLanguages.length - 1, selectedLanguage + 1));
            } else if (key.return) {
                // Change language
                const newLang = availableLanguages[selectedLanguage];
                const success = setLanguage(newLang);
                if (success) {
                    // Save to config
                    setConfig("language", newLang);
                    // Force re-render to show new language
                    setLanguageChanged(prev => prev + 1);
                    setShowMessage(`${t("settings.language.changed")} ${getLanguageName(newLang)}!`);
                    setTimeout(() => setShowMessage(""), 2000);
                }
            }
        }
    });

    const renderMainSettings = () => {
        return [
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
            React.createElement(
                Text,
                {
                    key: "option1",
                    color: selectedOption === 0 ? "yellow" : "white",
                    backgroundColor: selectedOption === 0 ? "blue" : undefined
                },
                `1. ${t("settings.option1")}`
            ),
            React.createElement(
                Text,
                {
                    key: "option2",
                    color: selectedOption === 1 ? "yellow" : "white",
                    backgroundColor: selectedOption === 1 ? "blue" : undefined
                },
                `2. ${t("settings.option2")}`
            ),
            React.createElement(
                Text,
                {
                    key: "option3",
                    color: selectedOption === 2 ? "yellow" : "white",
                    backgroundColor: selectedOption === 2 ? "blue" : undefined
                },
                `3. ${t("settings.option3")}`
            ),
            React.createElement(Box, { key: "spacer3", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            ),
            showMessage && React.createElement(
                Text,
                { key: "message", color: "green" },
                showMessage
            )
        ];
    };

    const renderLanguageSelection = () => {
        return [
            React.createElement(
                Text,
                {
                    key: "title",
                    bold: true,
                    color: "green"
                },
                `🌐 ${t("settings.language.title")}`
            ),
            React.createElement(Box, { key: "spacer1", height: 1 }),
            React.createElement(
                Text,
                { key: "current", color: "cyan" },
                `${t("settings.language.current")}: ${getLanguageName(getCurrentLanguage())}`
            ),
            React.createElement(Box, { key: "spacer2", height: 1 }),
            React.createElement(Text, { key: "instruction" }, t("settings.language.select")),
            React.createElement(Box, { key: "spacer3", height: 1 }),
            ...availableLanguages.map((lang, index) => 
                React.createElement(
                    Text,
                    {
                        key: `lang-${lang}`,
                        color: selectedLanguage === index ? "yellow" : "white",
                        backgroundColor: selectedLanguage === index ? "blue" : undefined
                    },
                    `${index + 1}. ${getLanguageName(lang)}`
                )
            ),
            React.createElement(Box, { key: "spacer4", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            ),
            showMessage && React.createElement(
                Text,
                { key: "message", color: "green" },
                showMessage
            )
        ];
    };

    return React.createElement(
        Box,
        {
            flexDirection: "column",
            padding: 1
        },
        currentView === "main" ? renderMainSettings() : renderLanguageSelection()
    );
};

export default SettingsScreen;
