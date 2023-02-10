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
    const tokenLineMap = new Map(Array.from(lineTokenMap).map(([str, token]) => [token, str]));
    const diffArray = getEngine().diff_main(oldLineTokens, newLineTokens);
    const result: LineDiff[] = [];

    const emitSimple = (op: 0 | 1 | -1, tokens: string) => {
        for (let i = 0; i < tokens.length; ++i) {
            const line = tokenLineMap.get(tokens[i]) || "";
            result.push([op, line]);
        }
    };

    const emitRemoved = (tokens: string) => emitSimple(-1, tokens);
    const emitInserted = (tokens: string) => emitSimple(1, tokens);
    const emitUnchanged = (tokens: string) => emitSimple(0, tokens);
    const emitChanged = (oldToken: string, newToken: string) => {
        const oldLine = tokenLineMap.get(oldToken) || "";
        const newLine = tokenLineMap.get(newToken) || "";
        const inlineDiff = getInlineDiff(oldLine, newLine);
        result.push(inlineDiff);
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
    lines.map(str => {
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
        emitChanged: (_, newStr) => emit(2, newStr),
    });
    
    return result;
};

interface ProcessDiffProps {
    input: readonly Diff[];
    emitRemoved(str: string): void;
    emitInserted(str: string): void;
    emitChanged(oldStr: string, newStr: string): void;
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
            for (let i = 0; i < changed.length; ++i) {
                emitChanged(pending[i], changed[i]);
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
