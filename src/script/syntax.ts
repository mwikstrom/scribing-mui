import { javascriptLanguage } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { SyntaxNode } from "@lezer/common";
import { ParamInfo, TypeInfo } from "../TypeInfo";

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

export const getDeclarations = (block: SyntaxNode, state: EditorState): Record<string, TypeInfo> => {
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
                result[key] = getVariableType(child, state);
            }
        }
    }
    return result;
};

export type Slicer = (from: number, to: number) => string;

export const getRootNode = (node: SyntaxNode): SyntaxNode => node.parent ? getRootNode(node.parent) : node;

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

const getVariableType = (decl: SyntaxNode, state: EditorState): TypeInfo => {
    const eq = decl.getChild("Equals");
    if (eq) {
        const val = decl.childAfter(eq.to);
        if (val?.name === "ArrowFunction") {
            return TypeInfo.function(getFunctionParams(val, state));
        }
    }
    return TypeInfo.unknown;
};
