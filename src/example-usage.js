// Example of how to use the language system

import { setLanguage, t, getAvailableLanguages, getLanguageName } from "./lang/index.js";

// Example usage:

console.log("Available languages:", getAvailableLanguages());

// Test English (default)
console.log("English:", t("ui.helloWorld"));

// Switch to Spanish
setLanguage("es");
console.log("Spanish:", t("ui.helloWorld"));

// Switch to French
setLanguage("fr");
console.log("French:", t("ui.helloWorld"));

// Test other translations
console.log("Game start (French):", t("game.start"));
console.log("Error message (French):", t("errors.generic"));

// Test missing key (will return fallback)
console.log("Missing key:", t("missing.key", "Default text"));

// Get language names
console.log("Language names:");
getAvailableLanguages().forEach((code) => {
    console.log(`${code}: ${getLanguageName(code)}`);
});
