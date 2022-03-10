import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Completion, CompletionResult, CompletionSource, snippetCompletion as snip } from "@codemirror/autocomplete";
import { intrinsicGlobals } from "./intrinsic";
import { getSnippetsFromNode } from "./snippets";

export const autocomplete = (): CompletionSource => context => {
    const node: SyntaxNode = syntaxTree(context.state).resolveInner(context.pos, -1);

    if (dontCompleteIn.has(node.name)) {
        return null;
    }

    if (node.name === "VariableName") {
        return completeRoot(node.parent, node.from);
    }

    if (context.explicit) {
        return completeRoot(node, context.pos);
    }

    return null;
};

const completeRoot = (node: SyntaxNode | null, from: number): CompletionResult => {
    const scope = getScopeFromNode(node);
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

const getOptionsFromScope = (scope: unknown): readonly Completion[] => {
    if (typeof scope !== "object" || scope === null) {
        return [];
    } else {
        return Object.entries(scope).map(([label, value]) => ({
            label,
            type: typeof value === "function" ? "function" : "variable",
        }));
    }
};

// TODO: Extract local variables
const getScopeFromNode = (node: SyntaxNode | null): unknown => intrinsicGlobals;

const dontCompleteIn = new Set([
    "LineComment",
    "BlockComment",
    "String",
    "TemplateString",
    "Number",
    "VariableDefinition",
    "PropertyDefinition",
]);
