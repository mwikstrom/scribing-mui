import { javascriptLanguage } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { SyntaxNode } from "@lezer/common";
import { ParamInfo, TypeInfo } from "../TypeInfo";
import { getTypeSelectionPathFromNode, selectType } from "./path";

export const parseScript = (input: string): SyntaxNode => javascriptLanguage.parser.parse(input).topNode;

export const getGlobalAssignments = (node: SyntaxNode, slice: Slicer): Record<string, TypeInfo> => {
    const map = new Map<string, TypeInfo>();
    buildGlobalAssignments(node, slice, map);
    return Object.fromEntries(map);
};

export const getThisAssignments = (node: SyntaxNode, slice: Slicer): Record<string, TypeInfo> => {
    const map = new Map<string, TypeInfo>();
    buildThisAssignments(node, slice, map);
    return Object.fromEntries(map);
};

export const getOuterBlocks = (node: SyntaxNode | null): SyntaxNode[] => {
    const blocks: SyntaxNode[] = [];
    while (node) {
        if (node.name === "Block") {
            blocks.push(node);
        }
        node = node.parent;
    }    
    return blocks;
};

export const getDeclarations = (
    block: SyntaxNode,
    state: EditorState,
    scope: ReadonlyMap<string, TypeInfo>
): Record<string, TypeInfo> => {
    const result: Record<string, TypeInfo> = {};
    for (let child = block.firstChild; child; child = child.nextSibling) {
        if (child.name === "FunctionDeclaration") {
            const key = getVariableName(child, state);
            if (key) {
                result[key] = TypeInfo.function(getFunctionParams(child, state));
            }
        } else if (child.name === "VariableDeclaration") {
            const key = getVariableName(child, state);
            if (key) {
                const currentScope = TypeInfo.object({ ...result, ...Object.fromEntries(scope.entries()) });
                result[key] = getVariableType(child, state, currentScope);
            }
        }
    }
    return result;
};

export type Slicer = (from: number, to: number) => string;

export const getRootNode = (node: SyntaxNode): SyntaxNode => node.parent ? getRootNode(node.parent) : node;

// TODO: Add syntax support for deconstructing assignments

export const buildGlobalAssignments = (node: SyntaxNode, slice: Slicer, map: Map<string, TypeInfo>): void => {
    if (node.name === "AssignmentExpression") {        
        const varName = node.getChild("VariableName");
        if (varName) {
            const { from, to } = varName;
            map.set(slice(from, to), TypeInfo.scope("global", TypeInfo.unknown));
        }
    } else {
        for (let child = node.firstChild; child; child = child.nextSibling) {
            buildGlobalAssignments(child, slice, map);
        }
    }
};

export const buildThisAssignments = (node: SyntaxNode, slice: Slicer, map: Map<string, TypeInfo>): void => {
    if (node.name === "AssignmentExpression") {
        const member = node.getChild("MemberExpression");
        if (member) {
            const obj = node.getChild("Expression");
            const first = obj?.firstChild;
            if (first?.name === "this") {
                const dot = first.nextSibling;
                if (dot?.name === ".") {
                    const next = dot.nextSibling;
                    const last = obj?.lastChild;
                    if (isSameRange(next, last) && last?.name === "PropertyName") {
                        map.set(slice(last.from, last.to), TypeInfo.unknown);
                    }
                }
            }
        }
    } else {
        for (let child = node.firstChild; child; child = child.nextSibling) {
            buildThisAssignments(child, slice, map);
        }
    }
};

export type Maybe<T> = (
    { success: true, value: T } |
    { success: false, value?: never }
);

export const tryGetConstant = (node: SyntaxNode | null, slice: Slicer): Maybe<unknown> => {
    if (!node) {
        return { success: false };
    }

    const parser = ConstantParserMap[node.name];

    if (parser) {
        try {
            return parser(node, slice);
        } catch (ignored) {
            // fall through
        }            
    }

    return { success: false };
};

export const tryGetVariableName = (node: SyntaxNode | null, slice: Slicer): string | null => {
    if (node) {
        const { name, from, to } = node;
        if (name === "VariableName") {
            return slice(from, to);
        }
    }
    return null;
};

export const isValidJavaScriptVariableName = (value: unknown): boolean => 
    typeof value === "string" &&
    JAVASCRIPT_IDENTIFIER_PATTERN.test(value) &&
    !JAVASCRIPT_KEYWORDS.has(value);

const isSameRange = (first: SyntaxNode | null | undefined, second: SyntaxNode | null | undefined): boolean => (
    first?.from === second?.from &&
    first?.to === second?.to
);

const getVariableName = (decl: SyntaxNode, state: EditorState): string | null => {
    const def = decl.getChild("VariableDefinition");
    if (def) {
        return state.sliceDoc(def.from, def.to);
    } else {
        return null;
    }
};

const getFunctionParams = (decl: SyntaxNode, state: EditorState): readonly ParamInfo[] | undefined => {
    const list = decl.getChild("ParamList");
    if (list) {
        const result: ParamInfo[] = [];        
        for (let item = list.firstChild; item; item = item.nextSibling) {
            const key = getVariableName(item, state);
            if (key) {
                result.push({ name: key });
            }
        }
        return result;
    }
};

const getVariableType = (decl: SyntaxNode, state: EditorState, scope: TypeInfo): TypeInfo => {
    const eq = decl.getChild("Equals");
    if (eq) {
        const val = decl.childAfter(eq.to);
        if (val?.name === "ArrowFunction") {
            return TypeInfo.function(getFunctionParams(val, state));
        } else if (val) {
            const path = getTypeSelectionPathFromNode(val, state.sliceDoc.bind(state));
            if (path) {
                const selected = selectType(scope, path);
                if (selected) {
                    return selected;
                }
            }
        }
    }
    return TypeInfo.unknown;
};

type ConstantParser = (node: SyntaxNode, slice: Slicer) => Maybe<unknown>;

const ConstantParserMap: Partial<Record<string, ConstantParser>> = {
    Number: ({from, to}, slice) => {
        const literal = slice(from, to);
        const value = Number(literal);
        if (Number.isNaN(value)) {
            return { success: false };
        } else {
            return { success: true, value };
        }
    },

    String: ({from, to}, slice) => {
        const literal = normalizeStringQuotes(slice(from, to).trim());
        const value = JSON.parse(literal);
        return { success: true, value };
    },

    RegExp: ({from, to}, slice) => {
        const literal = slice(from, to).trim();
        const match = /^\/([^/]+)\/([dgimsuy]*)?$/.exec(literal);
        if (match) {
            const [, pattern, flags] = match;
            const value = new RegExp(pattern, flags);
            return { success: true, value };
        } else {
            return { success: false };
        }
    },
};

const normalizeStringQuotes = (literal: string): string => {
    if (/^'.*'$/.test(literal)) {
        literal = literal.substring(1, literal.length - 1);
        literal = literal.replace(/\\"/g, "\"").replace(/"/g, "\\\"");
        literal = `"${literal}"`;
    }
    return literal;
};

// Note: This patterns doesn't cover everything - but it's good enough for now :-)
const JAVASCRIPT_IDENTIFIER_PATTERN = /^[$_\p{L}\p{Nl}][$_\p{L}\p{Nl}\p{Mn}\p{Mc}\p{Nd}\p{Pc}]*$/u;

const JAVASCRIPT_KEYWORDS = new Set([
    "do", "if", "in", "for", "let", "new", "try", "var", "case", "else", "enum", "eval", "false", "null", "this", 
    "true", "void", "with", "break", "catch", "class", "const", "super", "throw", "while", "yield", "delete", 
    "export", "import", "public", "return", "static", "switch", "typeof", "default", "extends", "finally", "package",
    "private", "continue", "debugger", "function", "arguments", "interface", "protected", "implements", "instanceof"
]);
