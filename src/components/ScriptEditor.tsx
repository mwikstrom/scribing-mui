import React, { FC, useEffect, useMemo, useState } from "react";
import { EditorState, EditorView, basicSetup } from "@codemirror/basic-setup";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { HighlightStyle, tags as t } from "@codemirror/highlight";
import { useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { DefaultFlowPalette } from "scribing-react";

export interface ScriptEditorProps {
    className?: string;
}

export const ScriptEditor: FC<ScriptEditorProps> = props => {
    const { className } = props;
    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const { palette } = useTheme<Theme>();

    const editorTheme = useMemo(() => EditorView.theme({
        "&": {
            color: palette.text.primary,
            backgroundColor: palette.background.paper,
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
            backgroundColor: palette.action.hover,
        },
        ".cm-gutters": {
            backgroundColor: palette.background.paper,
            color: palette.text.secondary,
            border: "none"
        },
        ".cm-activeLineGutter": {
            backgroundColor: palette.action.hover,
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
            color: palette.warning.main,
        },
        {
            tag: [
                t.bool, 
                t.null, 
                t.number, 
            ],
            color: palette.success.main,
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
                //t.variableName, 
                t.labelName, 
                //t.propertyName, 
                //t.special(t.propertyName), 
                t.function(t.propertyName), 
                t.function(t.definition(t.variableName)),
                t.definition(t.className),
                t.definition(t.propertyName),
                t.definition(t.special(t.propertyName)),
            ],
            color: palette.info.light,
        },
        {
            tag: [
                t.lineComment, 
                t.blockComment
            ],
            color: palette.success.dark,
        },
    ]), [palette]);

    useEffect(() => {
        if (!rootRef) {
            return;
        }
        const editor = new EditorView({
            state: EditorState.create({
                extensions: [
                    basicSetup,
                    keymap.of([indentWithTab]),
                    javascript(),
                    editorTheme,
                    highlightStyle,
                ],
            }),
            parent: rootRef,
        });
        return () => { editor.destroy(); };
    }, [rootRef, editorTheme, highlightStyle]);

    return (
        <div className={className} ref={setRootRef}/>
    );
};
