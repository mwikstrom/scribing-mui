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
    initialValue?: string;
    autoFocus?: boolean;
    onValueChange?: (value: string) => void;
}

export const ScriptEditor: FC<ScriptEditorProps> = props => {
    const { className, initialValue, autoFocus, onValueChange } = props;
    const [value, setValue] = useState(initialValue || "");
    const [rootRef, setRootRef] = useState<HTMLElement | null>(null);
    const { palette } = useTheme<Theme>();

    useEffect(() => {
        if (onValueChange) {
            onValueChange(value);
        }
    }, [onValueChange, value]);

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
                t.labelName, 
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

    const editor = useMemo(() => {
        if (!rootRef) {
            return null;
        }
        const editor = new EditorView({
            state: EditorState.create({
                doc: initialValue,
                extensions: [
                    basicSetup,
                    keymap.of([indentWithTab]),
                    javascript(),
                    editorTheme,
                    highlightStyle,
                ],
            }),
            dispatch: transaction => {
                if (transaction.docChanged) {
                    setValue(transaction.newDoc.sliceString(0));
                }
                editor.update([transaction]);
            },
            parent: rootRef,
        });
        return editor;
    }, [rootRef, editorTheme, highlightStyle]);

    useEffect(() => {
        if (editor) {
            return editor.destroy.bind(editor);
        }
    }, [editor]);
    
    useEffect(() => {
        if (editor && autoFocus) {
            editor.focus();
        }
    }, [editor, autoFocus]);

    return (
        <div className={className} ref={setRootRef}/>
    );
};
