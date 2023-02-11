import { Diff, diff_match_patch } from "diff-match-patch";

/** @internal */
export type LineDiff = KeepDiff | InsertDiff | RemoveDiff | ChangedLineDiff;

/** @internal */
export type KeepDiff = [0, string];

/** @internal */
export type InsertDiff = [1, string];

/** @internal */
export type RemoveDiff = [-1, string];

/** @internal */
export type ChangedLineDiff = InlineDiff[];

/** @internal */
export type InlineDiff = KeepDiff | InsertDiff | RemoveDiff | ChangeTextDiff;

/** @internal */
export type ChangeTextDiff = [2, string];

/** @internal */
export const getDiff = (oldText: string, newText: string): LineDiff[] => {
    const lineTokenMap = new Map<string, string>();    
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldLineTokens = buildLineTokens(oldLines, lineTokenMap);
    const newLineTokens = buildLineTokens(newLines, lineTokenMap);
    const diffArray = getEngine().diff_main(oldLineTokens, newLineTokens);
    getEngine().diff_cleanupSemanticLossless(diffArray);
    let oldPos = 0;
    let newPos = 0;
    const result: LineDiff[] = [];

    const emitSimple = (op: 0 | 1 | -1, tokens: string) => {
        for (let i = 0; i < tokens.length; ++i) {
            let line: string;
            if (op < 0) {
                line = oldLines[oldPos++];
            } else if (op > 0) {
                line = newLines[newPos++];
            } else {
                line = newLines[newPos++];
                ++oldPos;
            }
            result.push([op, line]);
        }
    };

    const emitRemoved = (tokens: string) => emitSimple(-1, tokens);
    const emitInserted = (tokens: string) => emitSimple(1, tokens);
    const emitUnchanged = (tokens: string) => emitSimple(0, tokens);
    const emitChanged = (tokens: string) => {
        for (let i = 0; i < tokens.length; ++i) {
            const inlineDiff = getInlineDiff(oldLines[oldPos++], newLines[newPos++]);
            result.push(inlineDiff);
        }
    };

    processDiff({
        input: diffArray,
        emitRemoved,
        emitInserted,
        emitUnchanged,
        emitChanged,
    });
    
    return result;
};

/** @internal */
export const isIgnorableWs = (array: readonly InlineDiff[], index: number): boolean =>
    isWsOnly(array, index) && (isAllWsBefore(array, index) || isAllWsAfter(array, index));

const isAllWsBefore = (array: readonly InlineDiff[], index: number): boolean => {
    for (let i = index - 1; i >= 0; --i) {
        if (!isWsOnly(array, i)) {
            return false;
        }
    }
    return true;
};

const isAllWsAfter = (array: readonly InlineDiff[], index: number): boolean => {
    for (let i = index + 1; i < array.length; ++i) {
        if (!isWsOnly(array, i)) {
            return false;
        }
    }
    return true;
};

const isWsOnly = (array: readonly InlineDiff[], index: number): boolean => /^\s*$/.test(array[index][1]);

const splitLines = (text: string): string[] => {
    const normalized = text.replace(/(\r\n|[\n\v\f\r\x85\u2028\u2029])/g, "\n");
    const lines = normalized.split("\n");
    const lastIndex = lines.length - 1;
    const mapped = lines.map((str, index) => {
        if (index === lastIndex) {
            return str;
        } else {
            return str + "\n";
        }
    });
    return mapped;
};

const buildLineTokens = (lines: readonly string[], map: Map<string, string>): string => 
    lines.map(str => str.trim()).map(str => {
        let token = map.get(str);
        if (!token) {
            token = String.fromCodePoint(map.size);
            map.set(str, token);
        }
        return token;
    }).join(""); 

const getInlineDiff = (oldText: string, newText: string): InlineDiff[] => {
    const result: InlineDiff[] = [];
    const diffArray = getEngine().diff_main(oldText, newText) || [];

    const emit = (op: -1 | 0 | 1 | 2, str: string) => result.push([op, str]);

    processDiff({
        input: diffArray,
        emitRemoved: str => emit(-1, str),
        emitInserted: str => emit(1, str),
        emitUnchanged: str => emit(0, str),
        emitChanged: str => emit(2, str),
    });
    
    return result;
};

interface ProcessDiffProps {
    input: readonly Diff[];
    emitRemoved(str: string): void;
    emitInserted(str: string): void;
    emitChanged(str: string): void;
    emitUnchanged(str: string): void;
}

const processDiff = (props: ProcessDiffProps) => {
    const { input, emitRemoved, emitInserted, emitChanged, emitUnchanged } = props;
    let pending = "";

    for (const [op, tokens] of input) {
        if (op === -1) {
            pending += tokens;
        } else if (op === 0) {
            if (pending) {
                emitRemoved(pending);
                pending = "";
            }
            emitUnchanged(tokens);
        } else if (op === 1) {
            const changed = tokens.substring(0, pending.length);
            if (changed) {
                emitChanged(changed);
            }
            if (tokens.length > changed.length) {
                emitInserted(tokens.substring(changed.length));
            } else if (pending.length > changed.length) {
                emitRemoved(pending.substring(changed.length));
            }
            pending = "";            
        }
    }

    if (pending) {
        emitRemoved(pending);
    } 
};

const getEngine = (): diff_match_patch => {
    if (!engine) {
        engine = new diff_match_patch();
    }
    return engine;
};

let engine: diff_match_patch | undefined;
