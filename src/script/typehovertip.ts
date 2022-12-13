import { Tooltip, TooltipView, hoverTooltip } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { TypeInfo } from "../TypeInfo";
import { Slicer } from "./syntax";
import { getTypeSelectionPathFromNode, selectType } from "./path";
import { getScopeFromNode } from "./scope";
import { deferRenderInfo, MountFunc, TypeInfoViewProps } from "./infoview";

export const typeHoverTip = (
    globals: Iterable<[string, TypeInfo]>, 
    mount: MountFunc,
): Extension => hoverTooltip((view, pos, side) => {
    const { state } = view;
    const node: SyntaxNode = syntaxTree(state).resolveInner(pos, side);
    const slice: Slicer = (from, to) => state.sliceDoc(from, to);
    const path = getTypeSelectionPathFromNode(node, slice);

    if (!path || path.length === 0) {
        return null;
    }

    const rootProps = getScopeFromNode(node, state, globals);
    const rootType = TypeInfo.object(rootProps);
    const info = selectType(rootType, path);

    if (!info) {
        return null;
    }

    const lastSelection = path.slice(-1)[0];
    const label = lastSelection.select === "member" ? lastSelection.member : "";
    const props: TypeInfoViewProps = {
        label,
        info,
        mount,
        pad: true,
    };

    const tooltip: Tooltip = {
        pos: node.from,
        end: node.to,
        create: () => {
            const { dom, render: mount } = deferRenderInfo(props);
            const view: TooltipView = { dom, mount };
            return view;
        },
    };

    return tooltip;
});
