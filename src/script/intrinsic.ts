import { TypeInfo } from "./typeinfo";

export const intrinsicGlobals: Record<string, TypeInfo> = Object.freeze({
    Infinity: { decl: "number" },
    NaN: { decl: "number" },
    undefined: { decl: "undefined" },
    isFinite: {
        decl: "function",
        params: [
            { name: "number", type: { decl: "number" } },
        ],
        returnType: { decl: "boolean"},
    },
    isNaN: {
        decl: "function",
        params: [
            { name: "number", type: { decl: "number" } },
        ] ,
        returnType: { decl: "boolean"},
    },
    parseFloat: {
        decl: "function",
        params: [
            { name: "string", type: { decl: "string" } },
        ],
        returnType: { decl: "number"},
    },
    parseInt: {
        decl: "function",
        params: [
            { name: "string", type: { decl: "string" } },
            { name: "radix", type: { decl: "number", optional: true } },
        ],
        returnType: { decl: "number"},
    },
    encodeURI: {
        decl: "function",
        params: [
            { name: "uri", type: { decl: "string" } }
        ],
        returnType: { decl: "string"},
    },
    encodeURIComponent: {
        decl: "function",
        params: [
            { name: "uriComponent", type: { decl: "string" } }
        ],
        returnType: { decl: "string"},
    },
    decodeURI: {
        decl: "function",
        params: [
            { name: "encodedURI", type: { decl: "string" } }
        ],
        returnType: { decl: "string"},
    },
    decodeURIComponent: {
        decl: "function",
        params: [
            { name: "encodedURIComponent", type: { decl: "string" } }
        ],
        returnType: { decl: "string"},
    },
    Object: { decl: "function" }, // TODO: Declare Object
    Function: { decl: "function" }, // TODO: Declare Function
    Boolean: { decl: "function" }, // TODO: Declare Boolean
    Symbol: { decl: "function" }, // TODO: Declare Symbol
    Error: { decl: "function" }, // TODO: Declare Error
    EvalError: { decl: "function" }, // TODO: Declare EvalError
    RangeError: { decl: "function" }, // TODO: Declare RangeError
    ReferenceError: { decl: "function" }, // TODO: Declare ReferenceError
    SyntaxError: { decl: "function" }, // TODO: Declare SyntaxError
    TypeError: { decl: "function" }, // TODO: Declare TypeError
    URIError: { decl: "function" }, // TODO: Declare URIError
    Number: { decl: "function" }, // TODO: Declare Number
    BigInt: { decl: "function" }, // TODO: Declare BigInt
    Math: { decl: "object" }, // TODO: Declare Math
    Date: { decl: "function" }, // TODO: Declare Date
    String: { decl: "function" }, // TODO: Declare String
    RegExp: { decl: "function" }, // TODO: Declare RegExp
    Array: { decl: "function" }, // TODO: Declare Array
    Int8Array: { decl: "function" }, // TODO: Declare Int8Array
    Uint8Array: { decl: "function" }, // TODO: Declare Uint8Array
    Uint8ClampedArray: { decl: "function" }, // TODO: Declare Uint8ClampedArray
    Int16Array: { decl: "function" }, // TODO: Declare Int16Array
    Uint16Array: { decl: "function" }, // TODO: Declare Uint16Array
    Int32Array: { decl: "function" }, // TODO: Declare Int32Array
    Uint32Array: { decl: "function" }, // TODO: Declare Uint32Array
    Float32Array: { decl: "function" }, // TODO: Declare Float32Array
    Float64Array: { decl: "function" }, // TODO: Declare BigInt64Array
    BigInt64Array: { decl: "function" }, // TODO: Declare BingInt64Array
    BigUint64Array: { decl: "function" }, // TODO: Declare BigUint64Array
    Map: { decl: "function" }, // TODO: Declare Map
    Set: { decl: "function" }, // TODO: Declare Set
    WeakMap: { decl: "function" }, // TODO: Declare WeakMap
    WeakSet: { decl: "function" }, // TODO: Declare WeakSet
    ArrayBuffer: { decl: "function" }, // TODO: Declare ArrayBuffer
    DataView: { decl: "function" }, // TODO: Declare DataView
    JSON: { decl: "object" }, // TODO: Declare JSON
    Promise: { decl: "function" }, // TODO: Declare Promise
    delay: {
        decl: "function",
        params: [
            { name: "duration", type: { decl: "number" } },
        ],
        returnType: { decl: "promise", resolveType: { decl: "void" } },
    },
});
