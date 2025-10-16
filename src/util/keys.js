// Universal key handling utility with configurable input modes
import { getConfig } from "../config.js";

// Public constants for actions (include synonyms with _ARROW suffix)
export const KEYS = {
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP_ARROW: "UP",
    DOWN_ARROW: "DOWN",
    LEFT_ARROW: "LEFT",
    RIGHT_ARROW: "RIGHT",
    SELECT: "SELECT",
    BACK: "BACK"
};

// Normalizes comparisons for a given action and current input mode
// Flexible signature: isKey(keyObj, action) or isKey(inputChar, keyObj, action)
export const isKey = (...args) => {
    let input = "";
    let key;
    let action;
    if (args.length === 2) {
        // (keyObj, action)
        key = args[0];
        action = args[1];
    } else {
        // (input, keyObj, action)
        input = args[0];
        key = args[1];
        action = args[2];
    }
    const mode = (getConfig("ui.inputMode", "arrows") || "arrows").toLowerCase();
    const ch = typeof input === "string" ? input.toLowerCase() : "";

    // Basic guards for Ink key object
    const k = key || {};

    // Shared checks
    const common = {
        [KEYS.SELECT]: () => !!(k.return || k.enter || ch === "\r" || k.space),
        [KEYS.BACK]: () => !!(k.escape || ch === "q")
    };

    const arrows = {
        [KEYS.UP]: () => !!k.upArrow,
        [KEYS.DOWN]: () => !!k.downArrow,
        [KEYS.LEFT]: () => !!k.leftArrow,
        [KEYS.RIGHT]: () => !!k.rightArrow,
        ...common
    };

    const vim = {
        [KEYS.UP]: () => ch === "k",
        [KEYS.DOWN]: () => ch === "j",
        [KEYS.LEFT]: () => ch === "h",
        [KEYS.RIGHT]: () => ch === "l",
        ...common
    };

    const wasd = {
        [KEYS.UP]: () => ch === "w",
        [KEYS.DOWN]: () => ch === "s",
        [KEYS.LEFT]: () => ch === "a",
        [KEYS.RIGHT]: () => ch === "d",
        ...common
    };

    const maps = { arrows, vim, wasd };
    const active = maps[mode] || arrows;

    const fn = active[action];
    return typeof fn === "function" ? !!fn() : false;
};

// UI helpers for dynamic instruction labels
export const getNavigateKeysLabel = () => {
    const mode = (getConfig("ui.inputMode", "arrows") || "arrows").toLowerCase();
    if (mode === "vim") return "J/K";
    if (mode === "wasd") return "W/S";
    return "↑/↓";
};

export const getLeftRightKeysLabel = () => {
    const mode = (getConfig("ui.inputMode", "arrows") || "arrows").toLowerCase();
    if (mode === "vim") return "H/L";
    if (mode === "wasd") return "A/D";
    return "←/→";
};

export const getSelectKeysLabel = () => {
    // We accept Enter or Space, but show Enter for brevity
    return "Enter";
};

export const getBackKeysLabel = () => {
    // We accept Esc or Q universally
    return "Q/Esc";
};
