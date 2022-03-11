import { Tooltip, TooltipView, showTooltip } from "@codemirror/tooltip";
import { EditorState, StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { Theme } from "@material-ui/core";
import { ParamInfo, ParamInfoTipRenderProps, TypeInfo } from "../TypeInfo";
import { Slicer, tryGetConstant } from "./syntax";
import { getTypeSelectionPathFromNode, selectType } from "./path";
import { getScopeFromNode } from "./scope";
import { deferRenderFunc } from "./infoview";

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
    let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, -1);

    while (node?.parent && node.parent.name !== "ArgList") {
        node = node.parent;
    }

    if (!node || node.name === ")") {
        return null;
    }

    const argList = node?.parent;
    if (argList?.name !== "ArgList") {
        return null;
    }

    const callExpr = argList.parent;
    if (callExpr?.name !== "CallExpression") {
        return null;
    }

    let paramIndex = 0;
    for (let prev = node.prevSibling; prev && prev.name !== "("; prev = prev.prevSibling) {
        ++paramIndex;
    }

    const funcExpr = callExpr.firstChild;
    if (!funcExpr) {
        return null;
    }

    const rootProps = getScopeFromNode(funcExpr, state, globals);
    const rootType = TypeInfo.object(rootProps);

    const slice: Slicer = (from, to) => state.sliceDoc(from, to);
    const funcPath = getTypeSelectionPathFromNode(funcExpr, slice);
    if (!funcPath) {
        return null;
    }

    const funcType = selectType(rootType, funcPath);
    if (funcType?.decl !== "function" || !funcType.params) {
        return null;
    }

    let paramInfo: ParamInfo;
    if (paramIndex < funcType.params.length) {
        paramInfo = funcType.params[paramIndex];
    } else {
        paramInfo = funcType.params[funcType.params.length - 1];
        if (!paramInfo.spread) {
            return null;
        }
    }

    const { renderInfoTip } = paramInfo;
    if (!renderInfoTip) {
        return null;
    }

    const onApplyConstantValue = (value: unknown): boolean => {
        // TODO: IMPLEMENT onApplyConstantValue
        console.error("TODO: IMPLEMENT onApplyConstantValue: " + value);
        return false;
    };

    const { success: hasConstantValue, value: constantValue } = tryGetConstant(node, slice);
    const renderProps: ParamInfoTipRenderProps = {
        funcType,
        paramInfo,
        paramIndex,
        hasConstantValue,
        constantValue,
        onApplyConstantValue,
    };

    const renderFunc = () => renderInfoTip(renderProps);
    const tooltip: Tooltip = {
        pos: node.from,
        end: node.to,
        above: true,
        arrow: true,
        create: () => {
            const { dom, render: mount } = deferRenderFunc(renderFunc, theme);
            const view: TooltipView = { dom, mount };
            return view;
        },
    };

    return tooltip;
}
