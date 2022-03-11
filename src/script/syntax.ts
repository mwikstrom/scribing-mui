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

export const getTypeInfoFromNode = (node: SyntaxNode): TypeInfo | null => {
    // TODO: IMPLEMENT ME!
    return null;
};

export type TypeSelection = (
    MemberSelection |
    ParamSelection |
    AwaitSelection |
    ReturnSelection
);

export interface TypeSelectionBase<T extends string = string> {
    select: T;
}

export interface MemberSelection extends TypeSelectionBase<"member">{
    member: string;
}

export interface ParamSelection extends TypeSelectionBase<"param"> {
    param: number;
}

export type AwaitSelection = TypeSelectionBase<"await">;

export type ReturnSelection = TypeSelectionBase<"return">;

export const getTypeSelectionPathFromNode = (
    node: SyntaxNode | null | undefined,
    slice: Slicer,
): readonly TypeSelection[] | null => {
    const path: TypeSelection[] = [];

    while (node) {
        const { name, from, to } = node;

        if (name === "this") {
            path.unshift(selectMember("this"));
            break;
        } else if (name === "VariableName") {
            path.unshift(selectMember(slice(from, to)));
            break;
        } else if (name === "PropertyName") {
            path.unshift(selectMember(slice(from, to)));
            node = node.prevSibling?.prevSibling;
        } else if (name === "." || name === "?.") {
            path.unshift(selectMember(""));
            node = node.prevSibling;
        } else if (name === "MemberExpression") {
            node = node.lastChild;
        } else if (name === "]") {
            node = node.prevSibling;
        } else if (name === "[") {
            path.unshift(selectMember(""));
            node = node.prevSibling;
        } else if (
            (name === "String" || name === "Number") && 
            node.prevSibling?.name === "[" &&
            node.nextSibling?.name === "]"
        ) {
            let literal = slice(from, to).trim();
            if (name === "String") {
                if (/^'.*'$/.test(literal)) {
                    literal = literal.substring(1, literal.length - 1);
                    literal = literal.replace(/\\"/g, "\"").replace(/"/g, "\\\"");
                    literal = `"${literal}"`;
                }
                literal = JSON.parse(literal);
            }
            path.unshift(selectMember(literal));
            node = node.prevSibling?.prevSibling;
        } else {            
            return null;
        }
    }

    return path;
};

export const selectMember = (member: string): MemberSelection => Object.freeze({ select: "member", member });
export const selectParam = (param: number): ParamSelection => Object.freeze({ select: "param", param });
export const selectAwait: AwaitSelection = Object.freeze({ select: "await"});
export const selectReturn: ReturnSelection = Object.freeze({ select: "return"});

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
