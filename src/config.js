import fs from "fs";
import path from "path";

// Configuration file path
const CONFIG_FILE = path.join(process.cwd(), "config.json");

// Default configuration
const DEFAULT_CONFIG = {
    // Language settings
    language: "en", // Default language, can be 'en', 'es', 'fr'

    // UI settings
    ui: {
        fullscreen: true,
        exitOnCtrlC: true,
        // Input mode: 'arrows' | 'vim' | 'wasd'
        inputMode: "arrows"
    },

    // Game settings
    game: {
        difficulty: "normal",
        soundEnabled: true
    }
};

// Load configuration from file or use defaults
let CONFIG = { ...DEFAULT_CONFIG };

// Load config from file if it exists
try {
    if (fs.existsSync(CONFIG_FILE)) {
        const configData = fs.readFileSync(CONFIG_FILE, "utf8");
        const savedConfig = JSON.parse(configData);
        CONFIG = { ...DEFAULT_CONFIG, ...savedConfig };
    }
} catch (error) {
    console.warn("Failed to load config file, using defaults:", error.message);
}

// Function to get config value with dot notation
export const getConfig = (keyPath, defaultValue = null) => {
    const keys = keyPath.split(".");
    let value = CONFIG;

    for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }

    return value;
};

// Function to set config value
export const setConfig = (keyPath, newValue) => {
    const keys = keyPath.split(".");
    let current = CONFIG;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== "object") {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = newValue;

    // Save config to file
    saveConfig();
};

// Save configuration to file
const saveConfig = () => {
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(CONFIG, null, 2), "utf8");
    } catch (error) {
        console.error("Failed to save config file:", error.message);
    }
};
