import { SyntaxNode } from "@lezer/common";
import { TypeInfo } from "../TypeInfo";
import { intrinsicGlobals } from "./intrinsic";
import { Slicer, tryGetConstant } from "./syntax";

export type TypeSelection = (
    MemberSelection |
    IndexSelection |
    ParamSelection |
    AwaitSelection |
    ReturnSelection |
    NewSelection |
    PrimitiveSelection
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

export interface PrimitiveSelection extends TypeSelectionBase<"primitive"> {
    primitive: TypeInfo;
}

export const getTypeSelectionPathFromNode = (
    node: SyntaxNode | null | undefined,
    slice: Slicer,
): readonly TypeSelection[] | null => {
    const path: TypeSelection[] = [];
    const guard = new Set<SyntaxNode>();

    while (node && !guard.has(node)) {
        const { name, from, to } = node;
        guard.add(node);

        if (name === "this") {
            path.unshift(selectMember("this"));
            break;
        } else if (name === "VariableName") {
            path.unshift(selectMember(slice(from, to)));
            break;
        } else if (name === "VariableDefinition") {
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
        } else if (node.prevSibling?.name === "[" && node.nextSibling?.name === "]") {
            const { value } = tryGetConstant(node, slice);
            if (typeof value === "string" || typeof value === "number") {
                path.unshift(selectMemberOrIndex(value));
                node = node.prevSibling?.prevSibling;
            } else {
                return null;
            }
        } else if (name === "String") {
            path.unshift(selectPrimitive(TypeInfo.string));
            break;
        } else if (name === "Number") {
            path.unshift(selectPrimitive(TypeInfo.number));
            break;
        } else if (name === "BooleanLiteral") {
            path.unshift(selectPrimitive(TypeInfo.boolean));
            break;
        } else if (name === "null") {
            path.unshift(selectPrimitive(TypeInfo.null));
            break;
        } else if (name === "CallExpression") {
            path.unshift(selectReturn);
            node = node.firstChild;
        } else if (name === "UnaryExpression" && node.firstChild?.name === "await") {
            path.unshift(selectAwait);
            node = node.firstChild.nextSibling;
        } else {
            return null;
        }
    }

    return path;
};

export const selectMember = (member: string): MemberSelection => Object.freeze({ select: "member", member });
export const selectIndex = (index: number): IndexSelection => Object.freeze({ select: "index", index });
export const selectMemberOrIndex = (memberOrIndex: string | number): MemberSelection | IndexSelection => (
    typeof memberOrIndex === "number" ? selectIndex(memberOrIndex) : selectMember(memberOrIndex)
);
export const selectParam = (param: number): ParamSelection => Object.freeze({ select: "param", param });
export const selectAwait: AwaitSelection = Object.freeze({ select: "await"});
export const selectReturn: ReturnSelection = Object.freeze({ select: "return"});
export const selectNew: NewSelection = Object.freeze({ select: "new"});
export const selectPrimitive = (primitive: TypeInfo): PrimitiveSelection => 
    Object.freeze({ select: "primitive", primitive });

export const selectScope = (
    root: Record<string, TypeInfo>,
    path: readonly TypeSelection[],
): Record<string, TypeInfo> => {
    const parent = TypeInfo.object(root);
    const leaf = selectType(parent, path);
    const builder = new Map<string, TypeInfo>();
    if (leaf) {
        buildScopeFromType(leaf, builder);
    }
    return Object.fromEntries(builder);
};

const buildScopeFromType = (type: TypeInfo, builder: Map<string, TypeInfo>): void => {
    if (type.decl === "union") {
        type.union.forEach(item => buildScopeFromType(item, builder));
    } else {
        const props = getPropsFromType(type);
        if (props) {
            for (const [key, value] of Object.entries(props)) {
                const before = builder.get(key);
                if (before) {
                    builder.set(key, TypeInfo.merge(before, value));
                } else {
                    builder.set(key, value);
                }
            }
        }
    }
};

const getPropsFromType = (type: TypeInfo | undefined): Record<string, TypeInfo> | undefined => {
    if (type?.decl === "array" || type?.decl === "tuple") {
        type = intrinsicGlobals.Array.ctor.returnType;
    } else if (type?.decl === "boolean") {
        type = intrinsicGlobals.Boolean.ctor.returnType;
    } else if (type?.decl === "function") {
        type = intrinsicGlobals.Function.ctor.returnType;
    } else if (type?.decl === "number") {
        type = intrinsicGlobals.Number.ctor.returnType;
    } else if (type?.decl === "promise") {
        type = intrinsicGlobals.Promise.ctor.returnType;
    } else if (type?.decl === "string") {
        type = intrinsicGlobals.String.ctor.returnType;
    }  
    
    if (type?.decl === "object" || type?.decl === "class") {
        return type.props;
    }
};

export const selectType = (type: TypeInfo | null, path: readonly TypeSelection[]): TypeInfo | null => {
    for (let i = 0; type && i < path.length; ++i) {
        type = selectChild(type, path[i]);
    }
    return type;
};

const selectChild = (parent: TypeInfo | undefined, selection: TypeSelection): TypeInfo | null => {
    const { select } = selection;
    
    if (!parent) {
        return null;
    }

    if (parent.decl === "union") {
        const children = parent.union
            .filter(item => select !== "member" || item.decl !== "undefined")
            .map(item => selectChild(item, selection))
            .filter(Boolean) as TypeInfo[];
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

    if (select === "await") {
        if (parent.decl === "promise") {
            return parent.resolveType ?? TypeInfo.unknown;
        }
    } else if (select === "member") {
        if (!selection.member) {
            return parent;
        }
        const props = getPropsFromType(parent);
        if (props) {
            return props[selection.member] ?? TypeInfo.undefined;
        } else if (parent.decl === "undefined") {
            return TypeInfo.undefined;
        } else {
            return TypeInfo.unknown;
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
    } else if (select === "primitive") {
        return selection.primitive;
    }

    return null;
};
