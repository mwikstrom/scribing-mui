import { ReactNode } from "react";
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
export interface ParamInfoTipRenderProps {
    funcType: FunctionType;
    paramInfo: ParamInfo;
    paramIndex: number;
    hasConstantValue: boolean;
    constantValue: unknown;
    onApplyConstantValue: (value: unknown) => boolean;
    onUpdateLayout: () => void;
}

/** @public */
export interface ParamInfo {
    name?: string;
    type?: TypeInfo;
    optional?: boolean;
    spread?: boolean;
    renderInfoTip?: (props: ParamInfoTipRenderProps) => ReactNode;
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
        options: Omit<ParamInfo, "name" | "type"> = {}
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
    merge: (...types: TypeInfo[]): TypeInfo => {
        const union = reduceUnion(types);
        if (union.length > 1) {
            return Object.freeze({
                decl: "union",
                union: Object.freeze(union),
            });
        } else if (union.length === 1) {
            return union[0];
        } else {
            return TypeInfo.void;
        }
    },
});

const ANNOTATED = new WeakMap<ScriptFunction, FunctionType>();

const reduceUnion = (items: TypeInfo[]): TypeInfo[] => {
    const result: TypeInfo[] = [];
    items.map(type => type.decl === "union" ? type.union : [type]).flat(100).forEach(type => {
        for (let i = 0; i < result.length; ++i) {
            const existing = result[i];
            const merged = tryMerge(existing, type);
            if (merged === existing) {
                continue;
            } else if (merged) {
                result[i] = merged;
            } else {
                result.push(type);
            }
        }
    });
    return result;
};

const tryMerge = (target: TypeInfo = TypeInfo.unknown, source: TypeInfo = TypeInfo.unknown): TypeInfo | null => {
    if (target === source) {
        return target;
    } else if (target.decl === "array") {
        return tryMergeArray(target, source);
    } else if (target.decl === "class") {
        return null;
    } else if (target.decl === "function") {
        return tryMergeFunction(target, source);
    } else if (target.decl === "object") {
        return tryMergeObject(target, source);
    } else if (target.decl === "promise") {
        return tryMergePromise(target, source);
    } else if (target.decl === "tuple") {
        return tryMergeTuple(target, source);
    } else if (target.decl === "unknown") {
        return target;
    } else if (target.decl === "union") {
        return null; // this case should be handled elsewhere...
    } else if (target.decl === source.decl) {
        return target;
    } else {
        return null;
    }
};

const tryMergeArray = (target: ArrayType, source: TypeInfo): TypeInfo | null => {
    if (source.decl === "tuple") {
        source = TypeInfo.array(TypeInfo.merge(...source.itemTypes));
    }

    if (source.decl !== "array") {
        return null;
    }

    const targetItemType = target.itemType ?? TypeInfo.unknown;
    const sourceItemType = source.itemType ?? TypeInfo.unknown;
    const mergedItemType = tryMerge(targetItemType, sourceItemType);
    if (!mergedItemType) {
        return TypeInfo.array(TypeInfo.union(targetItemType, sourceItemType));
    } else if (mergedItemType === target.itemType) {
        return target;
    } else {
        return TypeInfo.array(mergedItemType);
    }
};

const tryMergeTuple = (target: TupleType, source: TypeInfo): TypeInfo | null => {
    if (source.decl === "array") {
        source = TypeInfo.tuple(...new Array(target.itemTypes.length).fill(source.itemType ?? TypeInfo.unknown));
    }

    if (source.decl !== "tuple") {
        return null;
    }

    const targetArray = target.itemTypes;
    const sourceArray = source.itemTypes;
    const longestLength = Math.max(targetArray.length, sourceArray.length);
    const shortestLength = Math.min(targetArray.length, sourceArray.length);
    const mergedItemTypes: TypeInfo[] = new Array(longestLength).fill(TypeInfo.undefined);
    let keepTarget = longestLength === shortestLength;

    for (let i = 0; i < shortestLength; ++i) {
        const targetItem = targetArray[i];
        const sourceItem = sourceArray[i];
        const mergedItem = tryMerge(targetItem, sourceItem);
        if (mergedItem !== targetItem) {
            keepTarget = false;
        }
        mergedItemTypes[i] = mergedItem ?? TypeInfo.union(targetItem, sourceItem);
    }

    if (keepTarget) {
        return target;
    } else {
        return TypeInfo.tuple(...mergedItemTypes);
    }
};

const tryMergeFunction = (target: FunctionType, source: TypeInfo): TypeInfo | null => {
    if (source.decl !== "function") {
        return null;
    }

    const targetParamList = target.params;
    const mergedParamList = mergeParamList(targetParamList, source.params);

    const targetReturnType = target.returnType;
    const mergedReturnType = mergeOptionalTypes(targetReturnType, source.returnType);

    if (mergedParamList === targetParamList && mergedReturnType === targetReturnType) {
        return target;
    } else {
        return TypeInfo.function(mergedParamList, mergedReturnType);
    }
};

const tryMergeObject = (target: ObjectType, source: TypeInfo): TypeInfo | null => {
    if (source.decl !== "object") {
        return null;
    }

    if (!target.props) {
        return target;
    }

    if (!source.props) {
        return TypeInfo.object();
    }

    const targetProps = new Map(Object.entries(target.props));
    const sourceProps = new Map(Object.entries(source.props));
    const mergedProps = new Map<string, TypeInfo>();
    let keepTarget = targetProps.size === sourceProps.size;

    for (const [key, targetValue] of targetProps) {
        const sourceValue = sourceProps.get(key) ?? TypeInfo.undefined;
        const mergedValue = tryMerge(targetValue, sourceValue);
        if (mergedValue !== targetValue) {
            keepTarget = false;
        }
        mergedProps.set(key, mergedValue ?? TypeInfo.union(targetValue, sourceValue));
    }

    for (const [key, sourceValue] of sourceProps) {
        if (targetProps.has(key)) {
            continue;
        } else {
            keepTarget = false;
            mergedProps.set(key, TypeInfo.merge(sourceValue, TypeInfo.undefined));
        }
    }

    if (keepTarget) {
        return target;
    } else {
        return TypeInfo.object(Object.fromEntries(mergedProps));
    }
};

const tryMergePromise = (target: PromiseType, source: TypeInfo): TypeInfo | null => {
    if (source.decl !== "promise") {
        return null;
    }

    const mergedResolveType = mergeOptionalTypes(target.resolveType, source.resolveType);
    if (mergedResolveType === target.resolveType) {
        return target;
    } else {
        return TypeInfo.promise(mergedResolveType);
    }
};

const mergeOptionalTypes = (
    target: TypeInfo | undefined,
    source: TypeInfo | undefined,
): TypeInfo | undefined => {
    if (target && source) {
        return TypeInfo.merge(target, source);
    }
};

const mergeParamList = (
    targetArray: readonly ParamInfo[] | undefined,
    sourceArray: readonly ParamInfo[] | undefined,
): readonly ParamInfo[] | undefined => {
    if (targetArray && sourceArray) {
        const longestLength = Math.max(targetArray.length, sourceArray.length);
        const shortestLength = Math.min(targetArray.length, sourceArray.length);
        const targetSpread = getSpreadParam(targetArray);
        const sourceSpread = getSpreadParam(sourceArray);

        if (targetSpread || sourceSpread) {
            // TODO: Support for merging param lists with spread param(s)
            return undefined;
        }

        let keepTarget = longestLength === shortestLength;
        const fillParam = TypeInfo.param(undefined, TypeInfo.undefined, { optional: true });
        const mergedArray: ParamInfo[] = new Array(longestLength).fill(fillParam);

        for (let i = 0; i < shortestLength; ++i) {
            const targetParam = targetArray[i];
            const sourceParam = sourceArray[i];
            const mergedParam = mergeParamsIgnoreSpread(targetParam, sourceParam);
            if (mergedParam !== targetParam) {
                keepTarget = false;
            }
            mergedArray[i] = mergedParam;
        }
    
        if (keepTarget) {
            return targetArray;
        } else {
            return mergedArray;
        }
    }
};

const getSpreadParam = (paramList: readonly ParamInfo[]): ParamInfo | undefined => {
    if (paramList.length > 0) {
        const lastParam = paramList[paramList.length - 1];
        if (lastParam.spread) {
            return lastParam;
        }
    }
};

const mergeParamsIgnoreSpread = (target: ParamInfo, source: ParamInfo): ParamInfo => {
    const mergedName = target.name === source.name ? target.name : undefined;
    const mergedType = mergeOptionalTypes(target.type, source.type);
    const mergedOptional = target.optional === source.optional ? target.optional : target.optional || source.optional;
    if (
        mergedName === target.name &&
        mergedType === target.type &&
        mergedOptional === target.optional &&
        !target.spread
    ) {
        return target;
    } else {
        return TypeInfo.param(mergedName, mergedType, { optional: mergedOptional });
    }
};