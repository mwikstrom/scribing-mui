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
