import React from "react";
import { Box, Text } from "ink";

const e = React.createElement;

// Simple width-aware padding/truncation with ellipsis
const fit = (val, width, align = "left") => {
    // Normalize to string
    let s = val == null ? "" : String(val);
    if (s.length > width) {
        if (width <= 1) return "…".slice(0, width);
        return s.slice(0, Math.max(0, width - 1)) + "…";
    }
    const pad = " ".repeat(width - s.length);
    if (align === "right") return pad + s;
    if (align === "center") {
        const left = Math.floor((width - s.length) / 2);
        const right = width - s.length - left;
        return " ".repeat(left) + s + " ".repeat(right);
    }
    return s + pad; // left
};

const buildLine = (cols, row) => {
    return cols.map((c) => fit(row[c.key], c.width, c.align || "left")).join("  "); // 2-space gap
};

const calcWidths = (columns, data) => {
    return columns.map((c) => {
        if (typeof c.width === "number") return c;
        // Fallback: width from header and sample of data
        const headerLen = String(c.header ?? c.key).length;
        const sampleMax = Math.max(
            headerLen,
            ...data.slice(0, 200).map((r) => String(r?.[c.key] ?? "").length),
            3
        );
        // Put a soft cap so lines don't explode; can be overridden by passing width
        const width = Math.min(sampleMax, c.maxWidth || (c.align === "right" ? 8 : 30));
        return { ...c, width };
    });
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const InkTable = ({
    columns,
    data,
    selectedIndex = -1,
    pageSize = 12,
    highlightColor = "cyan",
    headerColor = "gray",
    showDivider = true,
    padding = 0
}) => {
    const cols = calcWidths(columns, data);
    const headerText = buildLine(
        cols,
        Object.fromEntries(cols.map((c) => [c.key, c.header ?? c.key]))
    );
    const divider = "─".repeat(headerText.length);

    const total = data.length;
    const hasSelection = selectedIndex >= 0 && selectedIndex < total;

    // Scroll window around selection when present
    let start = 0;
    if (pageSize > 0 && hasSelection) {
        start = clamp(selectedIndex - Math.floor(pageSize / 2), 0, Math.max(0, total - pageSize));
    }
    const end = pageSize > 0 ? Math.min(total, start + pageSize) : total;
    const slice = data.slice(start, end);

    const children = [
        e(Text, { key: "hdr", color: headerColor }, headerText),
        showDivider ? e(Text, { key: "div", color: headerColor }, divider) : null,
        ...slice.map((row, idx) => {
            const absoluteIndex = start + idx;
            const isSelected = absoluteIndex === selectedIndex;
            const line = buildLine(cols, row);
            return e(
                Text,
                {
                    key: row.id ?? absoluteIndex,
                    color: isSelected ? "black" : "white",
                    backgroundColor: isSelected ? highlightColor : undefined,
                    bold: isSelected
                },
                line
            );
        })
    ].filter(Boolean);

    return e(Box, { flexDirection: "column", padding }, children);
};

export default InkTable;
