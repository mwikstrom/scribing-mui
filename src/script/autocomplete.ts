import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Completion, CompletionResult, CompletionSource } from "@codemirror/autocomplete";
import { getSnippetsFromNode } from "./snippets";
import type { Slicer} from "./syntax";
import { EditorState } from "@codemirror/state";
import { TypeInfo } from "../TypeInfo";
import { getTypeInfoClass, renderInfo } from "./info";
import { Theme } from "@material-ui/core";
import { getTypeSelectionPathFromNode, selectScope } from "./path";
import { getScopeFromNode } from "./scope";

export const autocomplete = (globals: Iterable<[string, TypeInfo]>, theme: Theme): CompletionSource => context => {
    const node: SyntaxNode = syntaxTree(context.state).resolveInner(context.pos, -1);

    if (dontCompleteIn.has(node.name)) {
        return null;
    }

    if (completePropIn.has(node.name) && node.parent?.name === "MemberExpression") {
        return completeProp(node, context.state, globals, theme);
    }

    if (node.name === "VariableName") {
        return completeRoot(node.parent, node.from, context.state, globals, theme);
    }

    if (context.explicit) {
        return completeRoot(node, context.pos, context.state, globals, theme);
    }

    return null;
};

const completeProp = (
    node: SyntaxNode,
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>,
    theme: Theme,
): CompletionResult | null => {
    const slice: Slicer = (from, to) => state.sliceDoc(from, to);
    const path = getTypeSelectionPathFromNode(node, slice);

    if (!path || path.length === 0) {
        return null;
    }

    const root = getScopeFromNode(node, state, globals);
    const scope = selectScope(root, path);

    if (!scope) {
        return null;
    }

    const from = /\.$/.test(node.name) ? node.to : node.from;
    const result: CompletionResult = {
        from,
        options: getOptionsFromScope(scope, theme),
        span: /^[\w$]*$/,
    };
    return result;    
};

const completeRoot = (
    node: SyntaxNode | null,
    from: number,
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>,
    theme: Theme,
): CompletionResult => {
    const scope = getScopeFromNode(node, state, globals);
    const result: CompletionResult = {
        from,
        options: [
            ...getOptionsFromScope(scope, theme).filter(entry => entry.label !== "this"),
            ...getSnippetsFromNode(node),
        ],
        span: /^[\w$]*$/,
    };
    return result;
};

const getOptionsFromScope = (scope: Record<string, TypeInfo>, theme: Theme): readonly Completion[] => {
    if (typeof scope !== "object" || scope === null) {
        return [];
    } else {
        return Object.entries(scope).map(([label, info]) => getOptionFromEntry(label, info, theme));
    }
};

const getOptionFromEntry = (label: string, info: TypeInfo, theme: Theme): Completion => {
    const type = getTypeInfoClass(info);
    return { label, type, info: renderInfo({label, info, theme}) };
};

const completePropIn = new Set([
    "PropertyName",
    ".",
    "?."
]);

const dontCompleteIn = new Set([
    "LineComment",
    "BlockComment",
    "String",
    "TemplateString",
    "Number",
    "VariableDefinition",
    "PropertyDefinition",
]);
