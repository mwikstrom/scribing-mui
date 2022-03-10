import { SyntaxNode } from "@lezer/common";
import { Completion, snippetCompletion as snip } from "@codemirror/autocomplete";

export const getSnippetsFromNode = (node: SyntaxNode | null): Completion[] => {
    if (!node) {
        return [];
    }

    const result = [...expressions];

    if (canInsertStatement(node)) { 
        result.push(...statements);
    }

    return result;
};

const canInsertStatement = (node: SyntaxNode): boolean => (
    /Statement$/.test(node.name) &&
    !/^(Return|Throw)/.test(node.name)
);

const expressions: readonly Completion[] = [
    snip("null", {
        label: "null",
        type: "keyword",
    }),
    snip("this", {
        label: "this",
        type: "keyword",
    }),
    snip("await ${promise}", {
        label: "await",
        type: "keyword",
        detail: "promise",
    }),
    snip("new ${}(${})", {
        label: "new",
        type: "keyword",
        detail: "constructor",
    }),
    snip("throw ${}", {
        label: "throw",
        type: "keyword",
        detail: "expression",
    }),
];

const statements: readonly Completion[] = [
    snip("const ${name} = ${value};", {
        label: "const",
        type: "keyword",
        detail: "definition",
    }),
    snip("let ${name} = ${value};", {
        label: "let",
        type: "keyword",
        detail: "definition",
    }),
    snip("return ${};", {
        label: "return",
        type: "keyword",
    }),
    snip("if (${test}) {\n\t${}\n}", {
        label: "if",
        detail: "block",
        type: "keyword",
    }),
    snip("function ${name}(${params}) {\n\t${}\n}", {
        label: "function",
        detail: "definition",
        type: "keyword"
    }),
    snip("for (let ${index} = 0; ${index} < ${bound}; ${index}++) {\n\t${}\n}", {
        label: "for",
        detail: "loop",
        type: "keyword"
    }),
    snip("for (let ${name} of ${collection}) {\n\t${}\n}", {
        label: "for",
        detail: "of loop",
        type: "keyword"
    }),
    snip("try {\n\t${}\n} catch (${error}) {\n\t${}\n}", {
        label: "try",
        detail: "catch",
        type: "keyword"
    }),
    snip("try {\n\t${}\n} finally {\n\t${}\n}", {
        label: "try",
        detail: "finally",
        type: "keyword"
    }),
    snip("try {\n\t${}\n} catch (${error}) {\n\t${}\n} finally {\n\t${}\n}", {
        label: "try",
        detail: "catch + finally",
        type: "keyword"
    }),
    snip("class ${name} {\n\tconstructor(${params}) {\n\t\t${}\n\t}\n}", {
        label: "class",
        detail: "definition",
        type: "keyword"
    }),
];
