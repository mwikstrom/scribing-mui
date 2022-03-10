import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Completion, CompletionResult, CompletionSource } from "@codemirror/autocomplete";
import { intrinsicGlobals } from "./intrinsic";
import { getSnippetsFromNode } from "./snippets";
import { getBlocks, getDeclarations } from "./syntax";
import { EditorState } from "@codemirror/state";
import { TypeInfo } from "./typeinfo";

export const autocomplete = (): CompletionSource => context => {
    const node: SyntaxNode = syntaxTree(context.state).resolveInner(context.pos, -1);

    if (dontCompleteIn.has(node.name)) {
        return null;
    }

    if (node.name === "VariableName") {
        return completeRoot(node.parent, node.from, context.state);
    }

    if (context.explicit) {
        return completeRoot(node, context.pos, context.state);
    }

    return null;
};

const completeRoot = (node: SyntaxNode | null, from: number, state: EditorState): CompletionResult => {
    const scope = getScopeFromNode(node, state);
    const result: CompletionResult = {
        from,
        options: [
            ...getOptionsFromScope(scope),
            ...getSnippetsFromNode(node),
        ],
        span: /^[\w$]*$/,
    };
    return result;
};

const getOptionsFromScope = (scope: Record<string, TypeInfo>): readonly Completion[] => {
    if (typeof scope !== "object" || scope === null) {
        return [];
    } else {
        return Object.entries(scope).map(([label, { decl }]) => ({
            label,
            type: decl === "function" ? decl : decl === "object" ? "namespace" : "variable",
        }));
    }
};

const getScopeFromNode = (node: SyntaxNode | null, state: EditorState): Record<string, TypeInfo> => {
    const result = new Map(Object.entries(intrinsicGlobals));
    for (const block of getBlocks(node).reverse()) {
        const decl = getDeclarations(block, state);
        for (const [key, info] of Object.entries(decl)) {
            result.set(key, info);
        }
    }
    return Object.fromEntries(result);
};

const dontCompleteIn = new Set([
    "LineComment",
    "BlockComment",
    "String",
    "TemplateString",
    "Number",
    "VariableDefinition",
    "PropertyDefinition",
]);
