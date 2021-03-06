import { createTheme, Theme, ThemeOptions } from "@material-ui/core";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import { useMemo } from "react";

export const useStoryTheme = (dark = false): Theme => useMemo(() => {
    let palette: PaletteOptions = { type: dark ? "dark" : "light" };

    if (dark) {
        palette = {
            ...palette,
            background: {
                default: "#12191F",
                paper: "#27303D",
            },
            primary: {
                main: "#00C1F8",
            },
            secondary: {
                main: "#DD78F5",
            },
        };
    }

    const options: ThemeOptions = { 
        palette,
        typography: {
            fontFamily: CROSS_PLATFORM_SYSTEM_FONT_FAMILY,
        },
    };
    return createTheme(options);
}, [dark]);

const CROSS_PLATFORM_SYSTEM_FONT_FAMILY = [
    "-apple-system",
    "BlinkMacSystemFont",
    "\"Segoe UI\"",
    "Roboto",
    "\"Helvetica Neue\"",
    "Arial",
    "sans-serif",
    "\"Apple Color Emoji\"",
    "\"Segoe UI Emoji\"",
    "\"Segoe UI Symbol\"",
].join(",");
