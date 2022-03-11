import { ScriptFunction } from "scripthost";

/** @public */
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
    ClassType |
    PromiseType |
    UnionType
);

/** @public */
export interface TypeDecl<T> {
    decl: T;
    scope?: string;
    desc?: string;
}

/** @public */
export type UnknownType = TypeDecl<"unknown">;

/** @public */
export type VoidType = TypeDecl<"void">;

/** @public */
export type UndefinedType = TypeDecl<"undefined">;

/** @public */
export type NullType = TypeDecl<"null">;

/** @public */
export interface BooleanType extends TypeDecl<"boolean"> {
    value?: boolean;
}

/** @public */
export interface StringType extends TypeDecl<"string"> {
    value?: string;
}

/** @public */
export interface NumberType extends TypeDecl<"number"> {
    value?: number;
}

/** @public */
export interface UnionType extends TypeDecl<"union"> {
    union: readonly TypeInfo[];
}

/** @public */
export interface ArrayType extends TypeDecl<"array"> {
    itemType?: TypeInfo;
}

/** @public */
export interface TupleType extends TypeDecl<"tuple"> {
    itemTypes: readonly TypeInfo[];
}

/** @public */
export interface ObjectType extends TypeDecl<"object"> {
    props?: Record<string, TypeInfo>;
}

/** @public */
export interface FunctionType extends TypeDecl<"function"> {
    params?: readonly ParamInfo[];
    returnType?: TypeInfo;
}

/** @public */
export interface ClassType extends TypeDecl<"class"> {
    ctor: FunctionType;
    props?: Record<string, TypeInfo>;
}

/** @public */
export interface ParamInfo {
    name?: string;
    type?: TypeInfo;
    optional?: boolean;
    spread?: boolean;
}

/** @public */
export interface PromiseType extends TypeDecl<"promise"> {
    resolveType?: TypeInfo;
}

const basicType = <K>(decl: K): TypeDecl<K> => Object.freeze({ decl });

/** @public */
export const TypeInfo = Object.freeze({
    unknown: basicType("unknown" as const),
    void: basicType("void" as const),
    undefined: basicType("undefined" as const),
    null: basicType("null" as const),
    boolean: basicType("boolean" as const),
    string: basicType("string" as const),
    number: basicType("number" as const),
    scope: <T extends TypeInfo>(scope: string, type: T): T => Object.freeze({
        ...type,
        scope,
    }),
    desc: <T extends TypeInfo>(desc: string, type: T): T => Object.freeze({
        ...type,
        desc,
    }), 
    booleanValue: (value: boolean): BooleanType => Object.freeze({
        decl: "boolean",
        value,
    }),
    stringValue: (value: string): StringType => Object.freeze({
        decl: "string",
        value,
    }),
    numberValue: (value: number): NumberType => Object.freeze({
        decl: "number",
        value,
    }),
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
    class: (ctor: FunctionType, props?: Record<string, TypeInfo>): ClassType => Object.freeze({
        decl: "class",
        ctor,
        props,
    }),
    props: <K extends string>(type: TypeInfo, ...keys: K[]): Record<K, TypeInfo> => Object.freeze(Object.fromEntries(
        keys.map(key => [key, type])
    )) as Record<K, TypeInfo>,
    from: (func: ScriptFunction): FunctionType => ANNOTATED.get(func) ?? TypeInfo.function(),
    annotate: <T extends ScriptFunction>(func: T, info: FunctionType): T => {
        ANNOTATED.set(func, info);
        return func;
    },
});

const ANNOTATED = new WeakMap<ScriptFunction, FunctionType>();
