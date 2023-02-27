import { SyntaxNode } from "@lezer/common";
import { intrinsicGlobals } from "./intrinsic";
import {
    getOuterBlocks,
    getDeclarations,
    buildGlobalAssignments,
    Slicer,
    getRootNode,
    buildThisAssignments
} from "./syntax";
import { EditorState } from "@codemirror/state";
import { TypeInfo } from "../TypeInfo";

export const getScopeFromNode = (
    node: SyntaxNode | null,
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>,
): Record<string, TypeInfo> => {
    const result = new Map(globals);

    for (const [key, info] of Object.entries(intrinsicGlobals)) {
        result.set(key, TypeInfo.scope("intrinsic", info));
    }

    if (node) {
        const root = getRootNode(node);
        const slice: Slicer = (from, to) => state.sliceDoc(from, to);
        buildGlobalAssignments(root, slice, result);

        const thisInfo = result.get("this");
        const thisProps = (thisInfo?.decl === "object" && thisInfo.props) || {};
        const thisMap = new Map(Object.entries(thisProps));
        buildThisAssignments(root, slice, thisMap);
        result.set("this", TypeInfo.object(Object.fromEntries(thisMap)));

        for (const block of getOuterBlocks(node).reverse()) {
            const decl = getDeclarations(block, state, result);
            for (const [key, info] of Object.entries(decl)) {
                result.set(key, TypeInfo.scope("local", info));
            }
        }
    }

    return Object.fromEntries(result);
};
