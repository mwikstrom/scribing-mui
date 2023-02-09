import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { Compartment, EditorState, Extension } from "@codemirror/state";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { makeStyles, useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { DefaultFlowPalette } from "scribing-react";
import { LanguageSupport } from "@codemirror/language";
import clsx from "clsx";
import { Diagnostic, linter, LintSource } from "@codemirror/lint";
import { diff_match_patch } from "diff-match-patch";

/** @public */
export interface CodeEditorProps {
    className?: string;
    initialValue?: string;
    theirValue?: string;
    autoFocus?: boolean;
    onValueChange?: (value: string) => void;
    label?: string;
    theirLabel?: string;
    minHeight?: string | number;
    maxHeight?: string | number;
    readOnly?: boolean;
    parse?: (value: string, report: (diagnostic: Diagnostic) => void) => Error | unknown;
    parseDelay?: number;
    language?: LanguageSupport;
}

/** @public */
export const CodeEditor: FC<CodeEditorProps> = props => {
    const {
        className,
        initialValue,
        theirValue,
        autoFocus,
        onValueChange,
        label,
        theirLabel,
        minHeight,
        maxHeight,
        readOnly,
        parse,
        parseDelay = 300,
        language,
    } = props;
    const [value, setValue] = useState(initialValue || "");
    const [editorElem, setEditorElem] = useState<HTMLElement | null>(null);
    const [diffElem, setDiffElem] = useState<HTMLElement | null>(null);
    const { palette } = useTheme<Theme>();
    const classes = useStyles();
    const [parseFailed, setParseFailed] = useState(false);

    const lintSource = useCallback<LintSource>(view => {
        const text = view.state.doc.sliceString(0);
        const diagnostics: Diagnostic[] = [];

        if (/^\s*$/.test(text) || !parse) {
            setParseFailed(false);
        } else {
            try {
                const output = parse(text, item => diagnostics.push(item));
                setParseFailed(output instanceof Error);
            } catch (caught) {
                setParseFailed(true);
            }
        }

        return diagnostics;
    }, [parse]);

    const diffEngine = useMemo(() => new diff_match_patch(), []);
    const diffArray = useMemo(() => {
        if (theirValue !== undefined) {
            return diffEngine.diff_main(value, theirValue);
        }
    },[diffEngine, value, theirValue]);

    const multiline = useMemo(() => value.indexOf("\n") >= 0, [value]);
    const editorTheme = useMemo(() => EditorView.theme({
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
        ".cm-gutters": {
            display: "none",
        },
    }, {dark: palette.type === "dark"}), [palette]);

    const highlightStyle = useMemo(() => HighlightStyle.define([
        {
            tag: [
                t.modifier,
                t.controlKeyword, 
                t.operatorKeyword, 
                t.definitionKeyword, 
                t.keyword, 
                t.atom, 
                t.self
            ],
            color: palette.info.main,
            fontWeight: "bold",
        },
        {
            tag: [
                t.special(t.string), 
                t.string, 
                t.regexp
            ],
            color: palette.warning.dark,
        },
        {
            tag: [
                t.bool, 
                t.null, 
                t.number, 
            ],
            color: palette.secondary.main,
        },
        {
            tag: [
                t.modifier,
                t.updateOperator,
                t.arithmeticOperator,
                t.logicOperator,
                t.bitwiseOperator,
                t.compareOperator,
                t.definitionOperator,
                t.punctuation,
                t.paren,
                t.squareBracket,
                t.brace,
                t.derefOperator,
                t.separator, 
            ],
            color: palette.text.secondary,
            fontWeight: "bold",
        },
        {
            tag: [
                t.labelName, 
                t.function(t.propertyName), 
                t.function(t.definition(t.variableName)),
                t.definition(t.className),
                t.definition(t.propertyName),
                t.definition(t.special(t.propertyName)),
            ],
            color: palette.info.main,
        },
        {
            tag: [
                t.lineComment, 
                t.blockComment
            ],
            color: palette.success.dark,
        },
    ]), [palette]);

    const editorView = useMemo(() => {
        if (!editorElem) {
            return null;
        }
        const extensions: Extension[] = [
            basicSetup,
            keymap.of([indentWithTab]),
            editorTheme,
            syntaxHighlighting(highlightStyle),
            ReadOnlyCompartment.of(EditorState.readOnly.of(false)),
            linter(lintSource, { delay: parseDelay }),
        ];

        if (language) {
            extensions.push(language);
        }

        const view = new EditorView({
            state: EditorState.create({
                doc: value,
                extensions,
            }),
            dispatch: transaction => {
                if (transaction.docChanged) {
                    setValue(transaction.newDoc.sliceString(0));
                }
                view.update([transaction]);
            },
            parent: editorElem,
        });
        return view;
    }, [editorElem, editorTheme, highlightStyle, language, lintSource, parseDelay]);

    const diffView = useMemo(() => {
        if (!diffElem) {
            return null;
        }
        const extensions: Extension[] = [
            basicSetup,
            editorTheme,
            syntaxHighlighting(highlightStyle),
            ReadOnlyCompartment.of(EditorState.readOnly.of(true)),
        ];

        if (language) {
            extensions.push(language);
        }

        const view = new EditorView({
            state: EditorState.create({
                doc: theirValue,
                extensions,
            }),
            dispatch: transaction => {
                if (transaction.docChanged) {
                    setValue(transaction.newDoc.sliceString(0));
                }
                view.update([transaction]);
            },
            parent: diffElem,
        });
        return view;
    }, [diffElem, editorTheme, highlightStyle, language]);

    const onClickEditor = useCallback(() => {
        editorView?.focus();
    }, [editorView]);

    const onClickDiff = useCallback(() => {
        diffView?.focus();
    }, [diffView]);

    useEffect(() => {
        if (onValueChange) {
            onValueChange(value);
        }
    }, [onValueChange, value]);

    useEffect(() => {
        if (editorView) {
            return editorView.destroy.bind(editorView);
        }
    }, [editorView]);

    useEffect(() => {
        if (diffView) {
            return diffView.destroy.bind(diffView);
        }
    }, [diffView]);
    
    useEffect(() => {
        if (editorView && autoFocus && !readOnly) {
            editorView.focus();
        }
    }, [editorView, autoFocus, readOnly]);

    useEffect(() => {
        if (editorView) {
            editorView.dispatch({
                effects: [
                    ReadOnlyCompartment.reconfigure(EditorState.readOnly.of(Boolean(readOnly))),
                ],
            });            
        }
    }, [readOnly, editorView]);

    const hasDiff = !!diffArray;

    const rootClass = clsx(
        className,
        classes.root,
        parseFailed && classes.error,
    );
        
    const editorClass = clsx(
        classes.view,
        hasDiff && classes.diffMine,
        label && classes.hasLabel,
        multiline && classes.multiline,
    );

    const diffClass = clsx(
        classes.view,
        hasDiff && classes.diffTheirs,
        theirLabel && classes.hasLabel,
        multiline && classes.multiline,
    );

    return (
        <div className={rootClass}>
            <fieldset className={editorClass} onClick={onClickEditor}>
                {label && <legend className={classes.label}>{label}</legend>}
                <div ref={setEditorElem} className={classes.input} style={{minHeight, maxHeight}} />
            </fieldset>
            {hasDiff && (
                <fieldset className={diffClass} onClick={onClickDiff}>
                    {theirLabel && <legend className={classes.label}>{theirLabel}</legend>}
                    <div ref={setDiffElem} className={classes.input} style={{minHeight, maxHeight}} />
                </fieldset>
            )}
        </div>
    );
};

const ReadOnlyCompartment = new Compartment();

const useStyles = makeStyles((theme: Theme) => {
    const borderColor = theme.palette.type === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";    
    return {
        root: {
            display: "flex",
            flexDirection: "row",
        },
        view: {
            display: "flex",
            flex: 1,
            minInlineSize: "auto",
            flexDirection: "column",
            borderRadius: theme.shape.borderRadius,
            borderStyle: "solid",
            borderWidth: 1,            
            margin: 0,
            borderColor,
            padding: 1,
            cursor: "text",
            "&$diffMine": {
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                "&:not(:hover)": {
                    borderRightColor: "transparent",
                },
            },
            "&$diffTheirs": {
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                "&:not(:hover)": {
                    borderLeftColor: "transparent",
                },
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
            "&$multiline $input": {
                padding: 0,
                overflowY: "auto",
                "& .cm-activeLine": {
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
        diffMine: {},
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
            overflow: "hidden",
        },
        multiline: {},
    };
});
