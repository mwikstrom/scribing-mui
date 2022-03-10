import { javascriptLanguage } from "@codemirror/lang-javascript";
import { EditorState } from "@codemirror/state";
import { SyntaxNode } from "@lezer/common";
import { ParamInfo, TypeInfo } from "../TypeInfo";

export const parseScript = (input: string): SyntaxNode => javascriptLanguage.parser.parse(input).topNode;

export const getGlobalAssignments = (node: SyntaxNode): Record<string, TypeInfo> => {
    const result: Record<string, TypeInfo> = {};
    return result;
};

export const getThisAssignments = (node: SyntaxNode): Record<string, TypeInfo> => {
    const result: Record<string, TypeInfo> = {};
    return result;
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
