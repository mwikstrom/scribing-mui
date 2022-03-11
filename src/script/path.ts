import { tsParameterProperty } from "@babel/types";
import { SyntaxNode } from "@lezer/common";
import { TypeInfo } from "../TypeInfo";
import { intrinsicGlobals } from "./intrinsic";
import type { Slicer } from "./syntax";

export type TypeSelection = (
    MemberSelection |
    IndexSelection |
    ParamSelection |
    AwaitSelection |
    ReturnSelection |
    NewSelection
);

export interface TypeSelectionBase<T extends string = string> {
    select: T;
}

export interface MemberSelection extends TypeSelectionBase<"member">{
    member: string;
}

export interface IndexSelection extends TypeSelectionBase<"index">{
    index: number;
}

export interface ParamSelection extends TypeSelectionBase<"param"> {
    param: number;
}

export type AwaitSelection = TypeSelectionBase<"await">;

export type ReturnSelection = TypeSelectionBase<"return">;

export type NewSelection = TypeSelectionBase<"new">;

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
            }
            const parsed = JSON.parse(literal);
            if (typeof parsed === "number") {
                path.unshift(selectIndex(parsed));
            } else if (typeof parsed === "string") {
                path.unshift(selectMember(parsed));
            } else {
                return null;
            }
            node = node.prevSibling?.prevSibling;
        } else {            
            return null;
        }
    }

    return path;
};

export const selectMember = (member: string): MemberSelection => Object.freeze({ select: "member", member });
export const selectIndex = (index: number): IndexSelection => Object.freeze({ select: "index", index });
export const selectParam = (param: number): ParamSelection => Object.freeze({ select: "param", param });
export const selectAwait: AwaitSelection = Object.freeze({ select: "await"});
export const selectReturn: ReturnSelection = Object.freeze({ select: "return"});
export const selectNew: NewSelection = Object.freeze({ select: "new"});

export const selectScope = (
    root: Record<string, TypeInfo>,
    path: readonly TypeSelection[],
): Record<string, TypeInfo> => {
    const parent = TypeInfo.object(root);
    const leaf = selectType(parent, path);
    if (leaf?.decl === "object" || leaf?.decl === "class") {
        return leaf.props ?? {};
    } else {
        return {};
    }
};

export const selectType = (type: TypeInfo | null, path: readonly TypeSelection[]): TypeInfo | null => {
    for (let i = 0; type && i < path.length; ++i) {
        type = selectChild(type, path[i]);
    }
    return type;
};

const selectChild = (parent: TypeInfo | undefined, selection: TypeSelection): TypeInfo | null => {
    if (!parent) {
        return null;
    }

    if (parent.decl === "union") {
        const children = parent.union.map(item => selectChild(item, selection)).filter(Boolean) as TypeInfo[];
        if (children.length === 0) {
            return null;
        }
        const [first, ...rest] = children;
        if (rest.length === 0) {
            return first;
        }
        return TypeInfo.union(first, ...rest);
    } else if (parent.decl === "unknown") {
        return TypeInfo.unknown;
    } else if (parent.decl === "void") {
        return null;
    }

    const { select } = selection;

    if (select === "await") {
        if (parent.decl === "promise") {
            return parent.resolveType ?? TypeInfo.unknown;
        }
    } else if (select === "member") {
        if (parent.decl === "array" || parent.decl === "tuple") {
            parent = intrinsicGlobals.Array.ctor.returnType;
        } else if (parent.decl === "boolean") {
            parent = intrinsicGlobals.Boolean.ctor.returnType;
        } else if (parent.decl === "function") {
            parent = intrinsicGlobals.Function.ctor.returnType;
        } else if (parent.decl === "number") {
            parent = intrinsicGlobals.Number.ctor.returnType;
        } else if (parent.decl === "promise") {
            parent = intrinsicGlobals.Promise.ctor.returnType;
        } else if (parent.decl === "string") {
            parent = intrinsicGlobals.String.ctor.returnType;
        }

        if (parent?.decl === "object" || parent?.decl === "class") {
            if (!parent.props) {
                return TypeInfo.unknown;
            } else {
                return parent.props[selection.member] ?? null;
            }    
        }
    } else if (select === "index") {
        if (parent.decl === "array") {
            return parent.itemType ?? TypeInfo.unknown;
        } else if (parent.decl === "tuple") {
            return parent.itemTypes[selection.index] ?? null;
        }
    } else if (select === "new") {
        if (parent.decl === "class") {
            parent = parent.ctor;
        }

        if (parent?.decl === "function") {
            return parent.returnType ?? TypeInfo.unknown;
        }
    } else if (select === "return") {
        if (parent.decl === "function") {
            return parent.returnType ?? TypeInfo.unknown;
        }
    } else if (select === "param") {
        if (parent.decl === "function") {
            if (!parent.params) {
                return TypeInfo.unknown;
            } else {
                const param = parent.params[selection.param];
                if (!param) {
                    const lastParam = parent.params[parent.params.length - 1];
                    if (lastParam?.spread) {
                        return lastParam.type ?? TypeInfo.unknown;
                    } else {
                        return null;
                    }
                } else {
                    return param.type ?? TypeInfo.unknown;
                }
            }
        }
    }

    return null;
};
