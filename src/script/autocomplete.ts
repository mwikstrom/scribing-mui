import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Completion, CompletionResult, CompletionSource } from "@codemirror/autocomplete";
import { intrinsicGlobals } from "./intrinsic";
import { getSnippetsFromNode } from "./snippets";
import { getOuterBlocks, getDeclarations } from "./syntax";
import { EditorState } from "@codemirror/state";
import { ParamInfo, TypeInfo } from "../TypeInfo";

export const autocomplete = (): CompletionSource => context => {
    const node: SyntaxNode = syntaxTree(context.state).resolveInner(context.pos, -1);

    if (dontCompleteIn.has(node.name)) {
        return null;
    }

    if (completePropIn.has(node.name) && node.parent?.name === "MemberExpression") {
        return completeProp(node, context.state);
    }

    if (node.name === "VariableName") {
        return completeRoot(node.parent, node.from, context.state);
    }

    if (context.explicit) {
        return completeRoot(node, context.pos, context.state);
    }

    return null;
};

// TODO: Support nested properties!
const completeProp = (node: SyntaxNode, state: EditorState): CompletionResult | null => {
    const path: string[] = [];
    const obj = node.parent?.getChild("Expression");
    if (obj?.name === "VariableName" || obj?.name === "this") {
        path.unshift(state.sliceDoc(obj.from, obj.to));
    }
    if (path.length === 0) {
        return null;
    }
    let scope = getScopeFromNode(node, state);
    for (const key of path) {
        const type = scope[key];
        if (type?.decl !== "object" || !type.props) {
            return null;
        }
        scope = type.props;
    }
    const from = /^\./.test(node.name) ? node.to : node.from;
    const result: CompletionResult = {
        from,
        options: getOptionsFromScope(scope),
        span: /^[\w$]*$/,
    };
    return result;    
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
        return Object.entries(scope).map(getOptionFromEntry);
    }
};

const getOptionFromEntry = ([label, info]: [string, TypeInfo]): Completion => {
    let type = "variable";
    let detail: string | undefined;
    if (info.decl === "object") {
        type = "namespace";
    } else if (info.decl === "function") {
        type = "function";
        if (info.params) {
            detail = `(${info.params.map(formatParam).join(", ")})`;
        }
        if (info.returnType && info.returnType.decl !== "unknown") {
            detail += ": " + formatType(info.returnType);
        }
    } else if (info.decl !== "unknown") {
        detail = formatType(info);
    }
    return { label, type, detail };
};

const formatParam = (info: ParamInfo, index: number): string => {
    const { name = `arg${index}`, type, spread, optional } = info;
    const parts = [name];
    if (spread) {
        parts.unshift("...");
    }
    if (optional) {
        parts.push("?");
    }
    if (type && type.decl !== "unknown") {
        parts.push(": ");
        parts.push(formatType(type));
    }
    return parts.join("");
};

const formatType = (info: TypeInfo): string => {
    if (info.decl === "promise") {
        if (info.resolveType && info.resolveType.decl !== "unknown") {
            return `Promise<${formatType(info.resolveType)}>`;
        } else {
            return "Promise";
        }
    } else if (info.decl === "array") {
        const { itemType = TypeInfo.unknown } = info;
        return `Array<${formatType(itemType)}>`;
    } else if (info.decl === "tuple") {
        return `[${info.itemTypes.map(formatType).join(", ")}]`;
    } else if (info.decl === "union") {
        return info.union.map(formatType).join("|");
    }
    return info.decl;
};

const getScopeFromNode = (node: SyntaxNode | null, state: EditorState): Record<string, TypeInfo> => {
    const result = new Map(Object.entries(intrinsicGlobals));
    for (const block of getOuterBlocks(node).reverse()) {
        const decl = getDeclarations(block, state);
        for (const [key, info] of Object.entries(decl)) {
            result.set(key, info);
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
