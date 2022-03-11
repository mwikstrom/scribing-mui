import { SyntaxNode } from "@lezer/common";
import type { Slicer } from "./syntax";

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
