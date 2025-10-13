// Language system for internationalization
import { en } from "./en.js";
import { es } from "./es.js";
import { fr } from "./fr.js";

// Available languages
export const LANGUAGES = {
    en: "English",
    es: "Español",
    fr: "Français"
};

// Language data store
const languages = {
    en,
    es,
    fr
};

// Current language (default to English)
let currentLanguage = "en";

// Get current language code
export const getCurrentLanguage = () => currentLanguage;

// Set current language
export const setLanguage = (langCode) => {
    if (languages[langCode]) {
        currentLanguage = langCode;
        return true;
    }
    console.warn(`Language '${langCode}' not available. Using default (${currentLanguage})`);
    return false;
};

// Get translation for a given key path (e.g., 'ui.helloWorld')
export const t = (keyPath, fallback = "Translation missing") => {
    const lang = languages[currentLanguage];
    if (!lang) {
        return fallback;
    }

    // Navigate through nested object using dot notation
    const keys = keyPath.split(".");
    let value = lang;

    for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
            value = value[key];
        } else {
            // Key not found, try English as fallback if we're not already using English
            if (currentLanguage !== "en" && languages.en) {
                const englishLang = languages.en;
                let englishValue = englishLang;

                for (const englishKey of keys) {
                    if (
                        englishValue &&
                        typeof englishValue === "object" &&
                        englishKey in englishValue
                    ) {
                        englishValue = englishValue[englishKey];
                    } else {
                        return fallback; // Not found in English either
                    }
                }

                return typeof englishValue === "string" ? englishValue : fallback;
            }
            return fallback;
        }
    }

    return typeof value === "string" ? value : fallback;
};

// Get all available language codes
export const getAvailableLanguages = () => Object.keys(languages);

// Get language display name
export const getLanguageName = (langCode) => LANGUAGES[langCode] || langCode;

// Auto-detect system language (basic implementation)
export const detectSystemLanguage = () => {
    const envLang = process.env.LANG || process.env.LANGUAGE || "en";
    const langCode = envLang.split("_")[0].toLowerCase();

    if (languages[langCode]) {
        return langCode;
    }

    return "en"; // Default to English
};

// Initialize language system
export const initLanguageSystem = (preferredLang = null) => {
    const lang = preferredLang || detectSystemLanguage();
    setLanguage(lang);
    return getCurrentLanguage();
};
