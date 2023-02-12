import { Diff, diff_match_patch } from "diff-match-patch";

/** @internal */
export type LineDiff = KeepLineDiff | InsertDiff | RemoveDiff | ChangedLineDiff;

/** @internal */
export type KeepLineDiff = [0, string, string];

/** @internal */
export type InsertDiff = [1, string];

/** @internal */
export type RemoveDiff = [-1, string];

/** @internal */
export type ChangedLineDiff = InlineDiff[];

/** @internal */
export type InlineDiff = KeepTextDiff | InsertDiff | RemoveDiff | ChangeTextDiff;

/** @internal */
export type KeepTextDiff = [0, string];

/** @internal */
export type ChangeTextDiff = [2, string];

// TODO: getDiff should be improved to accept an inline tokenizer. This should be used to tokenizing JSON so that
// it doesn't report changes across or inside JSON tokens, but instead only diff on token level.

/** @internal */
export const getDiff = (oldText: string, newText: string): LineDiff[] => {
    const lineTokenMap = new Map<string, string>();    
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldLineTokens = buildLineTokens(oldLines, lineTokenMap);
    const newLineTokens = buildLineTokens(newLines, lineTokenMap);
    const engine = getEngine();
    const diffArray = engine.diff_main(oldLineTokens, newLineTokens);
    let oldPos = 0;
    let newPos = 0;
    const result: LineDiff[] = [];

    processDiff({
        input: diffArray,
        emitUnchanged: tokens => {
            for (let i = 0; i < tokens.length; ++i) {
                const oldLine = oldLines[oldPos++];
                const newLine = newLines[newPos++];
                result.push([0, oldLine, newLine]);
            }
        },
        emitChanged: (removedTokens, insertedTokens) => {
            const removedLines: string[] = [];
            const insertedLines: string[] = [];
            const affectedCount = Math.max(removedTokens.length, insertedTokens.length);
            for (let i = 0; i < affectedCount; ++i) {
                if (i < removedTokens.length) {
                    removedLines.push(oldLines[oldPos++]);
                }
                if (i < insertedTokens.length) {
                    insertedLines.push(newLines[newPos++]);
                }
            }
            while (insertedLines.length > 0) {
                const newText = insertedLines.shift() as string;
                let best: { diff: readonly Diff[]; score: number; index: number } | undefined;
                for (let index = 0; index < removedLines.length; ++index) {
                    const oldText = removedLines[index];
                    const diff = engine.diff_main(oldText, newText) || [];
                    const score = 1 - (engine.diff_levenshtein(diff) / Math.max(oldText.length, newText.length));
                    if (!best || score > best.score) {
                        best = { diff, score, index};
                    }
                }
                if (best && best.score > 0.5) {
                    removedLines.splice(0, best.index).forEach(line => result.push([-1, line]));
                    removedLines.shift();
                    result.push(getInlineDiff(best.diff));
                } else {
                    result.push([1, newText]);
                }
            }
            removedLines.forEach(line => result.push([-1, line]));
        },
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

const getInlineDiff = (diffArray: readonly Diff[]): InlineDiff[] => {
    const result: InlineDiff[] = [];
    const emit = (op: -1 | 0 | 1 | 2, str: string) => result.push([op, str]);

    processDiff({
        input: diffArray,
        emitUnchanged: chars => emit(0, chars),
        emitChanged: (removed, inserted) => {
            const changed = inserted.substring(0, removed.length);
            if (removed.length > changed.length) {
                emit(-1, removed.substring(0, removed.length - changed.length));
            }
            if (changed.length > 0) {
                emit(2, changed);
            }
            if (inserted.length > changed.length) {
                emit(1, inserted.substring(changed.length));
            }
        },
    });
    
    return result;
};

interface ProcessDiffProps {
    input: readonly Diff[];
    emitChanged(removed: string, inserted: string): void;
    emitUnchanged(text: string): void;
}

const processDiff = (props: ProcessDiffProps) => {
    const { input, emitChanged, emitUnchanged } = props;
    let pendingRemoval = "";
    let pendingInsertion = "";

    for (const [op, chars] of input) {
        if (op === -1) {
            pendingRemoval += chars;
        } else if (op === 0) {
            if (pendingRemoval || pendingInsertion) {
                emitChanged(pendingRemoval, pendingInsertion);
                pendingRemoval = "";
                pendingInsertion = "";
            }
            emitUnchanged(chars);
        } else if (op === 1) {
            pendingInsertion += chars;
        }
    }

    if (pendingRemoval || pendingInsertion) {
        emitChanged(pendingRemoval, pendingInsertion);
    }
};

const getEngine = (): diff_match_patch => {
    if (!engine) {
        engine = new diff_match_patch();
    }
    return engine;
};

let engine: diff_match_patch | undefined;
