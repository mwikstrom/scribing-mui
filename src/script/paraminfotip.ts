import { Tooltip, TooltipView, showTooltip, repositionTooltips } from "@codemirror/tooltip";
import { EditorState, StateField } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { SyntaxNode } from "@lezer/common";
import { ParamInfo, ParamInfoTipRenderProps, TypeInfo } from "../TypeInfo";
import { Slicer, tryGetConstant } from "./syntax";
import { getTypeSelectionPathFromNode, selectType } from "./path";
import { getScopeFromNode } from "./scope";
import { deferRenderFunc, MountFunc } from "./infoview";
import { EditorView } from "@codemirror/view";

export const paramInfoTip = (
    globals: Iterable<[string, TypeInfo]>, 
    mount: MountFunc,
): StateField<readonly Tooltip[]> => StateField.define<readonly Tooltip[]>({
    create: state => getTooltipsForSelection(state, globals, mount),
    update: (array, txn) => {
        if (!txn.docChanged && !txn.selection) {
            return array;
        } else {
            return getTooltipsForSelection(txn.state, globals, mount);
        }
    },
    provide: f => showTooltip.computeN([f], state => state.field(f)),
});

function getTooltipsForSelection(
    state: EditorState,
    globals: Iterable<[string, TypeInfo]>, 
    mount: MountFunc,
): readonly Tooltip[] {
    const result: Tooltip[] = [];
    for (const range of state.selection.ranges) {
        if (range.empty) {
            const tip = getTooltipForPosition(state, range.head, globals, mount);
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
    mount: MountFunc,
): Tooltip | null {
    let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, -1);

    while (node?.parent && node.parent.name !== "ArgList") {
        node = node.parent;
    }

    if (node?.name === "(" && node.nextSibling?.name !== ")") {
        node = node.nextSibling;
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

    const to = node.to;
    const from = node.name == "(" ? to : node.from;
    let editor: EditorView | undefined;
    
    const onApplyConstantValue = (value: unknown): boolean => {
        let insert: string | undefined;

        if (typeof value === "string" || typeof value === "number") {
            insert = JSON.stringify(value);            
        }

        if (!editor || typeof insert !== "string") {
            return false;
        }

        const txn = editor.state.update({
            changes: [{ from, to, insert }],
            selection: { anchor: from + insert.length },
        });
        
        editor.dispatch(txn);
        editor.focus();
        return true;
    };

    const onUpdateLayout = () => void(editor && repositionTooltips(editor));
    const { success: hasConstantValue, value: constantValue } = tryGetConstant(node, slice);
    const renderProps: ParamInfoTipRenderProps = {
        funcType,
        paramInfo,
        paramIndex,
        hasConstantValue,
        constantValue,
        onApplyConstantValue,
        onUpdateLayout,
    };

    const renderFunc = () => renderInfoTip(renderProps);                    
    const tooltip: Tooltip = {
        pos: from,
        end: to,
        above: true,
        create: initial => {
            const { dom, render } = deferRenderFunc(renderFunc, mount);
            const view: TooltipView = { dom, mount: render };
            editor = initial;
            return view;
        },
    };

    return tooltip;
}
