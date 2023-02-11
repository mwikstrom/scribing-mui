import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { EditorView, basicSetup } from "codemirror";
import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { ChangeSpec, Compartment, EditorState, Extension, StateEffect } from "@codemirror/state";
import { syntaxHighlighting, HighlightStyle } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { LanguageSupport } from "@codemirror/language";
import clsx from "clsx";
import { Diagnostic, linter, LintSource } from "@codemirror/lint";
import { getDiff } from "./tools/DiffHelper";
import { addLineDiff, clearLineDiff, lineDiffField } from "./LineDiffDecoration";
import { addInlineDiff, clearInlineDiff, inlineDiffField } from "./InlineDiffDecoration";
import { createCodeEditorViewTheme } from "./CodeEditorViewTheme";
import { useCodeEditorStyles } from "./CodeEditorStyles";

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
    diffDelay?: number;
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
        diffDelay = parseDelay,
        language,
    } = props;
    const [value, setValue] = useState(initialValue || "");
    const [editorElem, setEditorElem] = useState<HTMLElement | null>(null);
    const [theirElem, setTheirElem] = useState<HTMLElement | null>(null);
    const { palette } = useTheme<Theme>();
    const classes = useCodeEditorStyles();
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

    const multiline = useMemo(() => value.indexOf("\n") >= 0, [value]);
    const editorTheme = useMemo(() => createCodeEditorViewTheme(palette), [palette]);

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
            lineDiffField,
            inlineDiffField,
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

    const theirView = useMemo(() => {
        if (!theirElem) {
            return null;
        }
        const extensions: Extension[] = [
            basicSetup,
            editorTheme,
            syntaxHighlighting(highlightStyle),
            ReadOnlyCompartment.of(EditorState.readOnly.of(true)),
            lineDiffField,
            inlineDiffField,
        ];

        if (language) {
            extensions.push(language);
        }

        const view = new EditorView({
            state: EditorState.create({
                doc: theirValue,
                extensions,
            }),
            parent: theirElem,
        });
        return view;
    }, [theirElem, editorTheme, highlightStyle, language]);

    const onClickEditor = useCallback(() => {
        editorView?.focus();
    }, [editorView]);

    const onClickTheir = useCallback(() => {
        theirView?.focus();
    }, [theirView]);

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
        if (theirView) {
            return theirView.destroy.bind(theirView);
        }
    }, [theirView]);
    
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

    useEffect(() => {
        if (theirValue !== undefined && theirView) {
            const timerId = setTimeout(() => {
                const diffArray = getDiff(value, theirValue);
                const theirEffects: StateEffect<unknown>[] = [];
                const editorEffects: StateEffect<unknown>[] = [clearLineDiff.of(), clearInlineDiff.of()];
                const theirChanges: ChangeSpec[] = [{ from: 0, to: theirView.state.sliceDoc(0).length }];
                let editorPos = 0;
                let theirPos = 0;
                for (const diff of diffArray) {
                    if (typeof diff[0] === "number") {
                        const [op, text] = diff;
                        if (op === -1) {
                            editorEffects.push(addLineDiff.of({ pos: editorPos, op }));
                            editorPos += text.length;
                        } else if (op === 0) {
                            theirChanges.push({
                                from: 0,
                                insert: text,
                            });
                            theirPos += text.length;
                            editorPos += text.length;
                        } else if (op === 1) {
                            theirEffects.push(addLineDiff.of({ pos: theirPos, op }));
                            theirChanges.push({
                                from: 0,
                                insert: text,
                            });
                            theirPos += text.length;
                        }
                    } else {
                        editorEffects.push(addLineDiff.of({ pos: editorPos, op: 2 }));
                        theirEffects.push(addLineDiff.of({ pos: theirPos, op: 2 }));
                        for (const [op, text] of diff) {
                            if (op === -1) {
                                if (!/^\s+$/.test(text)) {
                                    editorEffects.push(addInlineDiff.of({
                                        from: editorPos,
                                        to: editorPos + text.length,
                                        op,
                                    }));
                                }
                                editorPos += text.length;
                            } else if (op === 0) {
                                theirChanges.push({
                                    from: 0,
                                    insert: text,
                                });
                                theirPos += text.length;
                                editorPos += text.length;
                            } else if (op === 1) {
                                theirChanges.push({
                                    from: 0,
                                    insert: text,
                                });
                                if (!/^\s+$/.test(text)) {
                                    theirEffects.push(addInlineDiff.of({
                                        from: theirPos,
                                        to: theirPos + text.length,
                                        op: op
                                    }));
                                }
                                theirPos += text.length;
                            } else if (op === 2) {
                                editorEffects.push(addInlineDiff.of({
                                    from: editorPos,
                                    to: editorPos + text.length,
                                    op,
                                }));
                                theirEffects.push(addInlineDiff.of({
                                    from: theirPos,
                                    to: theirPos + text.length,
                                    op: op
                                }));
                                theirChanges.push({
                                    from: 0,
                                    insert: text,
                                });
                                theirPos += text.length;
                                editorPos += text.length;
                            }
                        }
                    }
                }
                theirView.dispatch({ changes: theirChanges, effects: theirEffects });
                if (editorView?.state.sliceDoc(0) === value) {
                    editorView.dispatch({ effects: editorEffects });
                }
            }, diffDelay);
            return () => clearTimeout(timerId);
        }
    }, [value, theirValue, theirView, editorView, diffDelay]);

    const hasDiff = theirValue !== undefined;

    const rootClass = clsx(
        className,
        classes.root,
        parseFailed && classes.error,
    );
        
    const editorClass = clsx(
        classes.view,
        hasDiff && classes.diffEditor,
        label && classes.hasLabel,
        multiline && classes.multiline,
    );

    const theirClass = clsx(
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
                <fieldset className={theirClass} onClick={onClickTheir}>
                    {theirLabel && <legend className={classes.label}>{theirLabel}</legend>}
                    <div ref={setTheirElem} className={classes.input} style={{minHeight, maxHeight}} />
                </fieldset>
            )}
        </div>
    );
};

const ReadOnlyCompartment = new Compartment();
