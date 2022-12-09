import React, { FC, ReactPortal, useCallback, useEffect, useMemo, useState } from "react";
import { scriptLanguage } from "./script/language";
import { TypeInfo } from "./TypeInfo";
import { CodeEditor, CodeEditorProps } from "./CodeEditor";

/** @public */
export interface ScriptEditorProps extends Omit<CodeEditorProps, "parse" | "language"> {
    globals?: Iterable<[string, TypeInfo]>;
}

const EMPTY_GLOBALS: Iterable<[string, TypeInfo]> = Object.freeze([]);

/** @public */
export const ScriptEditor: FC<ScriptEditorProps> = props => {
    const { globals = EMPTY_GLOBALS, ...otherProps } = props;
    const parse = useCallback((value: string) => void new Function(`"use strict"; async () => ${value};`), []);
    const [portalArray, setPortalArray] = useState<ReactPortal[]>([]);
    const [portalArrayChanges, setPortalArrayChanges] = useState<[ReactPortal, boolean][]>([]);
    const mountPortal = useCallback((portal: ReactPortal) => {
        setPortalArrayChanges(before => [...before, [portal, true]]);
        return () => setPortalArrayChanges(before => [...before, [portal, false]]);
    }, []);
    const language = useMemo(() => scriptLanguage(globals, mountPortal), [globals]);

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

    return (
        <>
            <CodeEditor parse={parse} language={language} {...otherProps} />
            {portalArray}
        </>
    );
};
