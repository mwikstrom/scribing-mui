import { Extension } from "@codemirror/state";
import { alpha } from "@material-ui/core";
import { Palette, PaletteColor } from "@material-ui/core/styles/createPalette";
import { EditorView } from "codemirror";
import { DefaultFlowPalette } from "scribing-react";

/** @internal */
export const createCodeEditorViewTheme = (palette: Palette): Extension => EditorView.theme({
    "&": {
        color: palette.text.primary,
    },
    ".cm-content": {
        caretColor: palette.text.primary
    },
    "&.cm-focused .cm-cursor": {
        borderLeftColor: palette.text.primary
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
        backgroundColor: DefaultFlowPalette.selection,
        color: DefaultFlowPalette.selectionText,
    },
    ".cm-activeLine": {
        backgroundColor: "transparent",
    },
    ".cm-activeLineGutter": {
        backgroundColor: palette.action.hover,
    },
    ".cmd-linediff-insert": {
        backgroundColor: getDiffColor(palette, "insert", "line"),
        "&.cm-activeLine": {
            backgroundColor: getDiffColor(palette, "insert", "activeLine"),
        }
    },
    ".cmd-linediff-remove": {
        backgroundColor: getDiffColor(palette, "remove", "line"),
        "&.cm-activeLine": {
            backgroundColor: getDiffColor(palette, "remove", "activeLine"),
        }
    },
    ".cmd-linediff-change": {
        backgroundColor: getDiffColor(palette, "change", "line"),
        "&.cm-activeLine": {
            backgroundColor: getDiffColor(palette, "change", "activeLine"),
        }
    },
    ".cmd-textdiff-insert": {
        backgroundColor: getDiffColor(palette, "insert", "text"),
    },
    ".cmd-textdiff-remove": {
        backgroundColor: getDiffColor(palette, "remove", "text"),
    },
    ".cmd-textdiff-change": {
        backgroundColor: getDiffColor(palette, "change", "text"),
    },
    ".cm-gutters": {
        display: "none",
    },
    ".cm-tooltip.cm-completionInfo": {
        overflow: "auto",
        maxHeight: "calc(min(500px, 90vh))",
    },
    ".cm-tooltip.cm-paraminfo": {
        overflow: "auto",
        maxHeight: "calc(min(500px, 50vh))",
        zIndex: 1500,
    },
}, {dark: palette.type === "dark"});

const getDiffColor = (
    palette: Palette,
    op: "insert" | "remove" | "change",
    mode: "text" | "line" | "activeLine"
): string | null => {
    let baseColor: PaletteColor | undefined;

    if (op === "insert") {
        baseColor = palette.success;
    } else if (op === "remove") {
        baseColor = palette.error;
    } else if (op === "change") {
        baseColor = palette.warning;
    }

    if (baseColor) {
        if (mode === "text") {
            return alpha(baseColor.main, 0.3);
        } else if (mode === "line") {
            if (palette.type === "dark") {
                return alpha(baseColor.dark, 0.2);
            } else {
                return alpha(baseColor.light, 0.2);
            }
        } else if (mode === "activeLine") {
            if (palette.type === "dark") {
                return alpha(baseColor.light, 0.2);
            } else {
                return alpha(baseColor.dark, 0.2);
            }
        }
    }

    return null;
};
