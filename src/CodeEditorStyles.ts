import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

/** @internal */
export const useCodeEditorStyles = makeStyles((theme: Theme) => {
    const borderColor = theme.palette.type === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";    
    return {
        root: {
            display: "flex",
            flexDirection: "row",
        },
        view: {
            display: "flex",
            flex: 1,
            minWidth: "auto",
            maxWidth: "100%",
            flexDirection: "column",
            borderRadius: theme.shape.borderRadius,
            borderStyle: "solid",
            borderWidth: 1,            
            margin: 0,
            borderColor,
            padding: 1,
            cursor: "text",
            "&$diff": {
                maxWidth: "50%",
            },
            "&$diffEditor": {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
            },
            "&$diffTheirs": {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
            },
            "&$hasLabel": {
                paddingTop: 0,
            },
            "&:hover": {
                borderColor: theme.palette.text.primary,
            },
            "&:focus-within": {
                borderColor: theme.palette.primary.main,
                borderWidth: 2,
                padding: 0,
                "&>$label": {
                    color: theme.palette.primary.main,
                },
            },
            "&$error, &$error:focus-within": {
                borderColor: theme.palette.error.main,
                "&>$label": {
                    color: theme.palette.error.main,
                },
            },
            "& $input .cm-editor": {
                outline: "none",
            },
            "& $input .cm-scroller": {
                overflow: "visible",
            },
            "&$multiline $input": {
                padding: 0,
                "& .cm-activeLine:not(.cmd-linediff)": {
                    backgroundColor: theme.palette.action.hover,
                },
                "& .cm-gutters": {
                    display: "flex",
                    color: theme.palette.text.secondary,
                    border: "none"
                },        
            },
            "& .cm-completionIcon": {
                boxSizing: "content-box",
            },
        },
        diff: {},
        diffEditor: {},
        diffTheirs: {},
        hasLabel: {},
        label: {
            marginLeft: theme.spacing(1),
            paddingLeft: theme.spacing(0.75),
            paddingRight: theme.spacing(0.75),
            color: theme.palette.text.secondary,
            userSelect: "none",
            ...theme.typography.caption,
        },
        error: {},
        input: {
            paddingTop: theme.spacing(0.5),
            paddingBottom: theme.spacing(0.5),
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            flex: 1,
            overflow: "auto",
        },
        multiline: {},
    };
});
