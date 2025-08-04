// constants/colors.js
const coffeeTheme = {
    primary: "#8B593E",
    background: "#FFF8F3",
    text: "#4A3428",
    border: "#E5D3B7",
    white: "#FFFFFF",
    textLight: "#9A8478",
    expense: "#E74C3C",
    income: "#5C4434",
    card: "#FFFFFF",
    shadow: "#000000",
};

const forestTheme = {
    primary: "#2E7D32",
    background: "#E8F5E9",
    text: "#1B5E20",
    border: "#C8E6C9",
    white: "#FFFFFF",
    textLight: "#66BB6A",
    expense: "#C62828",
    income: "#3B5249",
    card: "#FFFFFF",
    shadow: "#000000",
};

const purpleTheme = {
    primary: "#6A1B9A",
    background: "#F3E5F5",
    text: "#4A148C",
    border: "#D1C4E9",
    white: "#FFFFFF",
    textLight: "#BA68C8",
    expense: "#D32F2F",
    income: "#5A66A3",
    card: "#FFFFFF",
    shadow: "#000000",
};

const oceanTheme = {
    primary: "#5a6daa",
    background: "#ffffffff",
    text: "#5a6daa",
    border: "#ffffffff",
    white: "#FFFFFF",
    textLight: "#cececeff",
    expense: "#EF5350",
    income: "#5a6daa",
    card: "#FFFFFF",
    shadow: "#000000",
};

export const THEMES = {
    coffee: coffeeTheme,
    forest: forestTheme,
    purple: purpleTheme,
    ocean: oceanTheme,
};

// change this to switch theme
export const COLORS = THEMES.ocean;