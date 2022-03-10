export type TypeInfo = (
    UnknownType |
    VoidType |
    UndefinedType |
    NullType |
    BooleanType |
    NullType |
    StringType |
    NumberType |
    ObjectType |
    ArrayType |
    TupleType |
    FunctionType |
    PromiseType |
    UnionType
);

export interface TypeDecl<T> {
    decl: T;
}

export type UnknownType = TypeDecl<"unknown">;
export type VoidType = TypeDecl<"void">;
export type UndefinedType = TypeDecl<"undefined">;
export type NullType = TypeDecl<"null">;
export type BooleanType = TypeDecl<"boolean">;
export type StringType = TypeDecl<"string">;
export type NumberType = TypeDecl<"number">;

export interface UnionType extends TypeDecl<"union"> {
    union: readonly TypeInfo[];
}

export interface ArrayType extends TypeDecl<"array"> {
    itemType?: TypeInfo;
}

export interface TupleType extends TypeDecl<"tuple"> {
    itemTypes: readonly TypeInfo[];
}

export interface ObjectType extends TypeDecl<"object"> {
    props?: Record<string, TypeInfo>;
}

export interface FunctionType extends TypeDecl<"function"> {
    params?: readonly ParamInfo[];
    returnType?: TypeInfo;
}

export interface ParamInfo {
    name?: string;
    type?: TypeInfo;
    optional?: boolean;
    spread?: boolean;
}

export interface PromiseType extends TypeDecl<"promise"> {
    resolveType?: TypeInfo;
}

const basicType = <K>(decl: K): TypeDecl<K> => Object.freeze({ decl });

export const TypeInfo = Object.freeze({
    unknown: basicType("unknown" as const),
    void: basicType("void" as const),
    undefined: basicType("undefined" as const),
    null: basicType("null" as const),
    boolean: basicType("boolean" as const),
    string: basicType("string" as const),
    number: basicType("number" as const),
    union: (first: TypeInfo, ...rest: readonly TypeInfo[]): UnionType => Object.freeze({
        decl: "union",
        union: Object.freeze([first, ...rest]),
    }),
    array: (itemType?: TypeInfo): ArrayType => Object.freeze({
        decl: "array",
        itemType,
    }),
    tuple: (...itemTypes: readonly TypeInfo[]): TupleType => Object.freeze({
        decl: "tuple",
        itemTypes: Object.freeze([...itemTypes]),
    }),
    object: (props?: Record<string, TypeInfo>): ObjectType => Object.freeze({
        decl: "object",
        props: Object.freeze(props),
    }),
    function: (params?: readonly ParamInfo[], returnType?: TypeInfo): FunctionType => Object.freeze({
        decl: "function",
        params: Object.freeze(params),
        returnType,
    }),
    param: (
        name?: string,
        type?: TypeInfo,
        options: Pick<ParamInfo, "optional" | "spread"> = {}
    ): ParamInfo => Object.freeze({
        name,
        type,
        ...options,
    }),
    promise: (resolveType?: TypeInfo): PromiseType => Object.freeze({
        decl: "promise",
        resolveType,
    }),
});
