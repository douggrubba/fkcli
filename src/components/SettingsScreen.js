import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { t, setLanguage, getCurrentLanguage, LANGUAGES, getLanguageName } from "../lang/index.js";
import { getGameState } from "../data/gameState.js";
import { getConfig, setConfig } from "../config.js";
import { isKey, KEYS } from "../util/keys.js";

const SettingsScreen = ({ onBack }) => {
    const [currentView, setCurrentView] = useState("main");
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState(0);
    const [selectedControl, setSelectedControl] = useState(0);
    const [showMessage, setShowMessage] = useState("");
    // Note: we rely on local state updates (selectedLanguage/showMessage) to re-render

    const availableLanguages = Object.keys(LANGUAGES);

    useInput((input, key) => {
        if (isKey(input, key, KEYS.BACK)) {
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
            if (isKey(input, key, KEYS.UP)) {
                setSelectedOption(Math.max(0, selectedOption - 1));
            } else if (isKey(input, key, KEYS.DOWN)) {
                setSelectedOption(Math.min(3, selectedOption + 1));
            } else if (
                isKey(input, key, KEYS.SELECT) ||
                input === "1" ||
                input === "2" ||
                input === "3" ||
                input === "4"
            ) {
                const numeric = ["1", "2", "3", "4"].includes(input)
                    ? parseInt(input, 10) - 1
                    : null;
                const option = numeric !== null ? numeric : selectedOption;
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
                } else if (option === 3) {
                    // Controls setting
                    setCurrentView("controls");
                    const modes = ["arrows", "vim", "wasd"];
                    const current = getConfig("ui.inputMode", "arrows");
                    setSelectedControl(Math.max(0, modes.indexOf(current)));
                }
            }
        } else if (currentView === "language") {
            // Language selection navigation
            if (isKey(input, key, KEYS.UP)) {
                setSelectedLanguage(Math.max(0, selectedLanguage - 1));
            } else if (isKey(input, key, KEYS.DOWN)) {
                setSelectedLanguage(Math.min(availableLanguages.length - 1, selectedLanguage + 1));
            } else if (input && /[1-9]/.test(input)) {
                // Direct numeric selection
                const idx = parseInt(input, 10) - 1;
                if (idx >= 0 && idx < availableLanguages.length) {
                    setSelectedLanguage(idx);
                }
            } else if (isKey(input, key, KEYS.SELECT)) {
                // Apply selected language
                const newLang = availableLanguages[selectedLanguage];
                const success = setLanguage(newLang);
                if (success) {
                    setConfig("language", newLang);
                    setSelectedLanguage(availableLanguages.indexOf(newLang));
                    setShowMessage(
                        `${t("settings.language.changed")} ${getLanguageName(newLang)}!`
                    );
                    setTimeout(() => setShowMessage(""), 2000);
                }
            }
        } else if (currentView === "controls") {
            // Controls selection navigation
            const modes = ["arrows", "vim", "wasd"];
            if (isKey(input, key, KEYS.UP)) {
                setSelectedControl(Math.max(0, selectedControl - 1));
            } else if (isKey(input, key, KEYS.DOWN)) {
                setSelectedControl(Math.min(modes.length - 1, selectedControl + 1));
            } else if (input && /[1-3]/.test(input)) {
                const idx = parseInt(input, 10) - 1;
                if (idx >= 0 && idx < modes.length) setSelectedControl(idx);
            } else if (isKey(input, key, KEYS.SELECT)) {
                const newMode = modes[selectedControl];
                setConfig("ui.inputMode", newMode);
                setShowMessage(
                    `${t("settings.controls.changed", "Controls changed to")} ${newMode.toUpperCase()}`
                );
                setTimeout(() => setShowMessage(""), 2000);
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
            React.createElement(
                Text,
                {
                    key: "option4",
                    color: selectedOption === 3 ? "yellow" : "white",
                    backgroundColor: selectedOption === 3 ? "blue" : undefined
                },
                `4. ${t("settings.option4", "Controls")}`
            ),
            React.createElement(Box, { key: "spacer3", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            ),
            showMessage &&
                React.createElement(Text, { key: "message", color: "green" }, showMessage)
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
            ...availableLanguages.map((lang, index) => {
                const isSelected = selectedLanguage === index;
                const isCurrent = getCurrentLanguage() === lang;
                const label = `${index + 1}. ${getLanguageName(lang)}${
                    isCurrent ? " (current)" : ""
                }`;
                return React.createElement(
                    Text,
                    {
                        key: `lang-${lang}`,
                        color: isSelected ? "yellow" : "white",
                        backgroundColor: isSelected ? "blue" : undefined
                    },
                    label
                );
            }),
            React.createElement(Box, { key: "spacer4", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            ),
            showMessage &&
                React.createElement(Text, { key: "message", color: "green" }, showMessage)
        ];
    };

    const renderControlsSelection = () => {
        const modes = ["arrows", "vim", "wasd"];
        const modeLabels = {
            arrows: `${t("settings.controls.modes.arrows", "Arrows")} — ↑ ↓ ← →`,
            vim: `${t("settings.controls.modes.vim", "Vim (HJKL)")} — H J K L`,
            wasd: `${t("settings.controls.modes.wasd", "WASD")} — W A S D`
        };
        const current = getConfig("ui.inputMode", "arrows");

        return [
            React.createElement(
                Text,
                { key: "title", bold: true, color: "green" },
                `⌨️  ${t("settings.controls.title", "Controls")}`
            ),
            React.createElement(Box, { key: "spacer1", height: 1 }),
            React.createElement(
                Text,
                { key: "current", color: "cyan" },
                `${t("settings.controls.current", "Current")}: ${current.toUpperCase()}`
            ),
            React.createElement(Box, { key: "spacer2", height: 1 }),
            React.createElement(
                Text,
                { key: "instruction" },
                t("settings.controls.select", "Select a control scheme:")
            ),
            React.createElement(Box, { key: "spacer3", height: 1 }),
            ...modes.map((m, idx) =>
                React.createElement(
                    Text,
                    {
                        key: `mode-${m}`,
                        color: selectedControl === idx ? "yellow" : "white",
                        backgroundColor: selectedControl === idx ? "blue" : undefined
                    },
                    `${idx + 1}. ${modeLabels[m]}`
                )
            ),
            React.createElement(Box, { key: "spacer4", height: 1 }),
            React.createElement(
                Text,
                { key: "exit", color: "gray", dimColor: true },
                t("settings.exit")
            ),
            showMessage &&
                React.createElement(Text, { key: "message", color: "green" }, showMessage)
        ];
    };

    return React.createElement(
        Box,
        {
            flexDirection: "column",
            padding: 1
        },
        currentView === "main"
            ? renderMainSettings()
            : currentView === "language"
              ? renderLanguageSelection()
              : renderControlsSelection()
    );
};

export default SettingsScreen;
