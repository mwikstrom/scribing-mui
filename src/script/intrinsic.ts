import { TypeInfo } from "../TypeInfo";

export const intrinsicGlobals: Record<string, TypeInfo> = Object.freeze({
    Infinity: TypeInfo.number,
    NaN: TypeInfo.number,
    undefined: TypeInfo.undefined,
    isFinite: TypeInfo.function(
        [ TypeInfo.param("number", TypeInfo.number) ], 
        TypeInfo.boolean,
    ),
    isNaN: TypeInfo.function(
        [ TypeInfo.param("number", TypeInfo.number) ], 
        TypeInfo.boolean,
    ),
    parseFloat: TypeInfo.function(
        [ TypeInfo.param("string", TypeInfo.string) ], 
        TypeInfo.number,
    ),
    parseInt: TypeInfo.function(
        [ 
            TypeInfo.param("string", TypeInfo.string),
            TypeInfo.param("radix", TypeInfo.number, { optional: true }),
        ], 
        TypeInfo.number,
    ),
    encodeURI: TypeInfo.function(
        [ TypeInfo.param("uri", TypeInfo.string) ],
        TypeInfo.string,
    ),
    encodeURIComponent: TypeInfo.function(
        [ TypeInfo.param("uriComponent", TypeInfo.string) ],
        TypeInfo.string,
    ),
    decodeURI: TypeInfo.function(
        [ TypeInfo.param("encodedURI", TypeInfo.string) ],
        TypeInfo.string,
    ),
    decodeURIComponent: TypeInfo.function(
        [ TypeInfo.param("encodedURIComponent", TypeInfo.string) ],
        TypeInfo.string,
    ),
    Object: TypeInfo.function(), // TODO: Declare Object
    Function: TypeInfo.function(), // TODO: Declare Function
    Boolean: TypeInfo.function(), // TODO: Declare Boolean
    Symbol: TypeInfo.function(), // TODO: Declare Symbol
    Error: TypeInfo.function(), // TODO: Declare Error
    EvalError: TypeInfo.function(), // TODO: Declare EvalError
    RangeError: TypeInfo.function(), // TODO: Declare RangeError
    ReferenceError: TypeInfo.function(), // TODO: Declare ReferenceError
    SyntaxError: TypeInfo.function(), // TODO: Declare SyntaxError
    TypeError: TypeInfo.function(), // TODO: Declare TypeError
    URIError: TypeInfo.function(), // TODO: Declare URIError
    Number: TypeInfo.function(), // TODO: Declare Number
    BigInt: TypeInfo.function(), // TODO: Declare BigInt
    Math: TypeInfo.object({
        ...TypeInfo.props(
            TypeInfo.number,
            "E", "LN10", "LN2", "LOG10E", "PI", "SQRT1_2", "SQRT2"
        ),
        ...TypeInfo.props(
            TypeInfo.function(
                [TypeInfo.param("x", TypeInfo.number)],
                TypeInfo.number
            ),
            "abs", "acos", "acosh", "asin", "asinh", "atan", "atanh", "cbrt", "ceil", "clz32", "cos", "cosh", "exp",
            "expm1", "floor", "fround", "log", "log10", "log1p", "log2", "round", "sign", "sin", "sinh", "sqrt", 
            "tan", "tanh", "trunc",
        ),
        ...TypeInfo.props(
            TypeInfo.function(
                [TypeInfo.param("x", TypeInfo.number), TypeInfo.param("y", TypeInfo.number)],
                TypeInfo.number
            ),
            "atan2", "imul",
        ),
        ...TypeInfo.props(
            TypeInfo.function(
                [TypeInfo.param("values", TypeInfo.number, { spread: true })],
                TypeInfo.number
            ),
            "hypot", "max", "min"
        ),
        pow: TypeInfo.function(
            [
                TypeInfo.param("base", TypeInfo.number),
                TypeInfo.param("exponent", TypeInfo.number),
            ],
            TypeInfo.number,
        ),
        random: TypeInfo.function([], TypeInfo.number),
    }),
    Date: TypeInfo.function(), // TODO: Declare Date
    String: TypeInfo.function(), // TODO: Declare String
    RegExp: TypeInfo.function(), // TODO: Declare RegExp
    Array: TypeInfo.function(), // TODO: Declare Array
    Int8Array: TypeInfo.function(), // TODO: Declare Int8Array
    Uint8Array: TypeInfo.function(), // TODO: Declare Uint8Array
    Uint8ClampedArray: TypeInfo.function(), // TODO: Declare Uint8ClampedArray
    Int16Array: TypeInfo.function(), // TODO: Declare Int16Array
    Uint16Array: TypeInfo.function(), // TODO: Declare Uint16Array
    Int32Array: TypeInfo.function(), // TODO: Declare Int32Array
    Uint32Array: TypeInfo.function(), // TODO: Declare Uint32Array
    Float32Array: TypeInfo.function(), // TODO: Declare Float32Array
    Float64Array: TypeInfo.function(), // TODO: Declare BigInt64Array
    BigInt64Array: TypeInfo.function(), // TODO: Declare BingInt64Array
    BigUint64Array: TypeInfo.function(), // TODO: Declare BigUint64Array
    Map: TypeInfo.function(), // TODO: Declare Map
    Set: TypeInfo.function(), // TODO: Declare Set
    WeakMap: TypeInfo.function(), // TODO: Declare WeakMap
    WeakSet: TypeInfo.function(), // TODO: Declare WeakSet
    ArrayBuffer: TypeInfo.function(), // TODO: Declare ArrayBuffer
    DataView: TypeInfo.function(), // TODO: Declare DataView
    JSON: TypeInfo.object({
        parse: TypeInfo.function(
            [
                TypeInfo.param("text", TypeInfo.string),
                TypeInfo.param("reviver", TypeInfo.function(), { optional: true }),
            ],
            TypeInfo.unknown,
        ),
        stringify: TypeInfo.function(
            [
                TypeInfo.param("value", TypeInfo.unknown),
                TypeInfo.param(
                    "replacer",
                    TypeInfo.union(
                        TypeInfo.function(),
                        TypeInfo.array(TypeInfo.union(TypeInfo.string, TypeInfo.number)),
                        TypeInfo.null,
                    ),
                    { optional: true },
                ),
                TypeInfo.param(
                    "space",
                    TypeInfo.union(
                        TypeInfo.string,
                        TypeInfo.number,
                        TypeInfo.null,
                    ),
                    { optional: true },
                ),
            ],
            TypeInfo.string,
        ),
    }),
    Promise: TypeInfo.function(), // TODO: Declare Promise
    delay: TypeInfo.desc(
        "Returns a promise that should be awaited to pause script execution for the specified number of milliseconds",
        TypeInfo.function(
            [ TypeInfo.param("duration", TypeInfo.number) ],
            TypeInfo.promise(TypeInfo.void),
        )
    ),
});
