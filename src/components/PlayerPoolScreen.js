import React from "react";
import { Text, Box, useInput } from "ink";
import { isKey, KEYS, getBackKeysLabel } from "../util/keys.js";

const e = React.createElement;

const PlayerPoolScreen = ({ onBack }) => {
    useInput((input, key) => {
        if (isKey(input, key, KEYS.BACK)) {
            onBack();
        }
    });

    return e(Box, { flexDirection: "column", padding: 1 }, [
        e(Text, { key: "title", bold: true, color: "cyan" }, "👥 Player Pool"),
        e(Box, { key: "sp1", height: 2 }),
        e(Text, { key: "placeholder", color: "gray" }, "Player pool management coming soon..."),
        e(Box, { key: "sp2", height: 2 }),
        e(Text, { key: "footer", color: "yellow" }, `${getBackKeysLabel()}: Back to Menu`)
    ]);
};

export default PlayerPoolScreen;
