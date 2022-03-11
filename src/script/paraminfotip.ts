import { Tooltip, TooltipView, showTooltip } from "@codemirror/tooltip";
import { EditorState, StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Theme } from "@material-ui/core";
import { TypeInfo } from "../TypeInfo";
import { Slicer } from "./syntax";
import { getTypeSelectionPathFromNode, selectType } from "./path";
import { getScopeFromNode } from "./scope";
import { deferRenderInfo, TypeInfoViewProps } from "./infoview";

export const paramInfoTip = (
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

    if (!path || path.length < 2) {
        return null;
    }

    const paramSelection = path[path.length - 1];
    if (paramSelection.select !== "param") {
        return null;
    }

    const functionPath = path.slice(0, -1);
    const rootProps = getScopeFromNode(node, state, globals);
    const rootType = TypeInfo.object(rootProps);
    const functionType = selectType(rootType, functionPath);

    if (functionType?.decl !== "function") {
        return null;
    }

    const props: TypeInfoViewProps = {
        label: "DUMMY!",
        info: TypeInfo.unknown,
        pad: true,
        theme,
    };

    const tooltip: Tooltip = {
        pos,
        above: true,
        arrow: true,
        create: () => {
            const { dom, render: mount } = deferRenderInfo(props);
            const view: TooltipView = { dom, mount };
            return view;
        },
    };

    return tooltip;
}
