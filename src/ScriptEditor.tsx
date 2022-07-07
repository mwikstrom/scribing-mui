import React, { FC, ReactPortal, useCallback, useEffect, useMemo, useState } from "react";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { Compartment } from "@codemirror/state";
import { HighlightStyle, tags as t } from "@codemirror/highlight";
import { makeStyles, useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { DefaultFlowPalette } from "scribing-react";
import clsx from "clsx";
import { scriptLanguage } from "./script/language";
import { TypeInfo } from "./TypeInfo";

/** @public */
export interface ScriptEditorProps {
    className?: string;
    initialValue?: string;
    autoFocus?: boolean;
    onValueChange?: (value: string) => void;
    label?: string;
    maxHeight?: string | number;
    globals?: Iterable<[string, TypeInfo]>;
    readOnly?: boolean;
}

const EMPTY_GLOBALS: Iterable<[string, TypeInfo]> = Object.freeze([]);

/** @public */
export const ScriptEditor: FC<ScriptEditorProps> = props => {
    const {
        className,
        initialValue,
        autoFocus,
        onValueChange,
        label,
        maxHeight,
        globals = EMPTY_GLOBALS,
        readOnly,
    } = props;
    const [value, setValue] = useState(initialValue || "");
    const [editorElem, setEditorElem] = useState<HTMLElement | null>(null);
    const { palette } = useTheme<Theme>();
    const classes = useStyles();

    const error = useMemo(() => {
        if (/^\s*$/.test(value)) {
            return null;
        }
        try {
            new Function(`"use strict"; async () => ${value};`);
            return null;
        } catch (err) {
            return err instanceof Error ? err : new Error(String(err));
        }
    }, [value]);

    useEffect(() => {
        if (onValueChange) {
            onValueChange(value);
        }
    }, [onValueChange, value]);

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

    const [portalArray, setPortalArray] = useState<ReactPortal[]>([]);
    const [portalArrayChanges, setPortalArrayChanges] = useState<[ReactPortal, boolean][]>([]);
    const mountPortal = (portal: ReactPortal) => {
        setPortalArrayChanges(before => [...before, [portal, true]]);
        return () => setPortalArrayChanges(before => [...before, [portal, false]]);
    };

    const editor = useMemo(() => {
        if (!editorElem) {
            return null;
        }
        const editor = new EditorView({
            state: EditorState.create({
                doc: value,
                extensions: [
                    basicSetup,
                    keymap.of([indentWithTab]),
                    scriptLanguage(globals, mountPortal),
                    editorTheme,
                    highlightStyle,
                    ReadOnlyCompartment.of(EditorState.readOnly.of(false)),
                ],
            }),
            dispatch: transaction => {
                if (transaction.docChanged) {
                    setValue(transaction.newDoc.sliceString(0));
                }
                editor.update([transaction]);
            },
            parent: editorElem,
        });
        return editor;
    }, [editorElem, editorTheme, highlightStyle, globals]);

    const onClick = useCallback(() => {
        editor?.focus();
    }, [editor]);

    useEffect(() => {
        if (editor) {
            return editor.destroy.bind(editor);
        }
    }, [editor]);
    
    useEffect(() => {
        if (editor && autoFocus && !readOnly) {
            editor.focus();
        }
    }, [editor, autoFocus, readOnly]);

    useEffect(() => {
        if (editor) {
            editor.dispatch({
                effects: [
                    ReadOnlyCompartment.reconfigure(EditorState.readOnly.of(Boolean(readOnly))),
                ],
            });            
        }
    }, [readOnly, editor]);

    useEffect(() => {
        const changeArray = [...portalArrayChanges];
        if (changeArray.length === 0) {
            return;
        }
        setPortalArray(before => {
            const after = [...before];
            for (const [portal, active] of changeArray) {
                const index = after.indexOf(portal);
                if (active && index < 0) {
                    after.push(portal);
                } else if (!active && index >= 0) {
                    after.splice(index, 1);
                }
            }
            return after;
        });
        setPortalArrayChanges(before => before.slice(changeArray.length));
    }, [portalArrayChanges]);

    const rootProps = {
        className: clsx(
            className,
            classes.root,
            label && classes.hasLabel,
            error && classes.error,
            multiline && classes.multiline,
        ),
        onClick,        
    };    

    return (
        <>
            <fieldset {...rootProps}>
                {label && <legend className={classes.label}>{label}</legend>}
                <div ref={setEditorElem} className={classes.input} style={{maxHeight}}/>
            </fieldset>
            {portalArray}
        </>
    );
};

const ReadOnlyCompartment = new Compartment();

const useStyles = makeStyles((theme: Theme) => {
    const borderColor = theme.palette.type === "light" ? "rgba(0, 0, 0, 0.23)" : "rgba(255, 255, 255, 0.23)";    
    return {
        root: {
            display: "flex",
            flexDirection: "column",
            borderRadius: theme.shape.borderRadius,
            borderStyle: "solid",
            borderWidth: 1,            
            margin: 0,
            borderColor,
            padding: 1,
            cursor: "text",
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
                overflowY: "scroll",
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
