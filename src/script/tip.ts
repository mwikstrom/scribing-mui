import { Tooltip, TooltipView, showTooltip } from "@codemirror/tooltip";
import { EditorState, StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Theme } from "@material-ui/core";
import { TypeInfo } from "../TypeInfo";
import { Slicer } from "./syntax";
import { getTypeSelectionPathFromNode, selectType } from "./path";
import { getScopeFromNode } from "./scope";
import { deferRenderInfo, TypeInfoViewProps } from "./info";

export const syntaxTip = (
    globals: Iterable<[string, TypeInfo]>, 
    theme: Theme,
): StateField<readonly Tooltip[]> => StateField.define<readonly Tooltip[]>({
    create: state => getTooltipsForSelection(state, globals, theme),
    update: (array, txn) => {
        if (!txn.docChanged && !txn.selection) {
            return array;
        } else {
            return getTooltipsForSelection(txn.state, globals, theme);
        }
    },
    provide: f => showTooltip.computeN([f], state => state.field(f)),
});

function getTooltipsForSelection(
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>, 
    theme: Theme,
): readonly Tooltip[] {
    const result: Tooltip[] = [];
    for (const range of state.selection.ranges) {
        if (range.empty) {
            const tip = getTooltipForPosition(state, range.head, globals, theme);
            if (tip) {
                result.push(tip);
            }
        }
    }
    return result;
}

function getTooltipForPosition(
    state: EditorState,
    pos: number,
    globals: Iterable<[string, TypeInfo]>, 
    theme: Theme,
): Tooltip | null {
    const node: SyntaxNode = syntaxTree(state).resolveInner(pos, -1);
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

    const props: TypeInfoViewProps = {
        label: "TODO",
        info,
        theme,
    };

    const tooltip: Tooltip = {
        pos,
        above: true,
        strictSide: true,
        arrow: true,
        create: () => {
            const { dom, render: mount } = deferRenderInfo(props);
            const view: TooltipView = { dom, mount };
            return view;
        },
    };

    return tooltip;
}
