import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Completion, CompletionResult, CompletionSource } from "@codemirror/autocomplete";
import { intrinsicGlobals } from "./intrinsic";
import { getSnippetsFromNode } from "./snippets";
import {
    getOuterBlocks,
    getDeclarations,
    buildGlobalAssignments,
    Slicer,
    getRootNode,
    buildThisAssignments
} from "./syntax";
import { EditorState } from "@codemirror/state";
import { TypeInfo } from "../TypeInfo";
import { getTypeInfoClass, renderInfo } from "./info";
import { Theme } from "@material-ui/core";
import { getTypeSelectionPathFromNode, selectScope } from "./path";

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

// TODO: Support nested properties!
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

const getScopeFromNode = (
    node: SyntaxNode | null,
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>,
): Record<string, TypeInfo> => {
    const result = new Map(globals);

    for (const [key, info] of Object.entries(intrinsicGlobals)) {
        result.set(key, TypeInfo.scope("intrinsic", info));
    }

    if (node) {
        const root = getRootNode(node);
        const slice: Slicer = (from, to) => state.sliceDoc(from, to);
        buildGlobalAssignments(root, slice, result);

        const thisInfo = result.get("this");
        const thisProps = (thisInfo?.decl === "object" && thisInfo.props) || {};
        const thisMap = new Map(Object.entries(thisProps));
        buildThisAssignments(root, slice, thisMap);
        result.set("this", TypeInfo.object(Object.fromEntries(thisMap)));

        for (const block of getOuterBlocks(node).reverse()) {
            const decl = getDeclarations(block, state);
            for (const [key, info] of Object.entries(decl)) {
                result.set(key, TypeInfo.scope("local", info));
            }
        }
    }

    return Object.fromEntries(result);
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
