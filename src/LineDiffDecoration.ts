import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

/** @internal */
export interface LineDiffProps {
    pos: number;
    op: -1 | 1 | 2;
}

/** @internal */
export const addLineDiff = StateEffect.define<LineDiffProps>({
    map: ({pos, ...rest}, change) => ({ pos: change.mapPos(pos), ...rest }),
});

/** @internal */
export const clearLineDiff = StateEffect.define<void>();

/** @internal */
export const lineDiffField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update: (before, txn) => {
        let after = before.map(txn.changes);
        for (const e of txn.effects) {
            if (e.is(clearLineDiff)) {
                after = after.update({
                    filter: () => false,
                });
            } else if (e.is(addLineDiff)) {
                const { pos, op } = e.value;
                const mark = lineDiffMark(op);
                if (mark) {
                    after = after.update({
                        add: [mark.range(pos, pos)]
                    });
                }
            }
        }
        return after;
    },
    provide: f => EditorView.decorations.from(f),
});

const lineDiffMark = (op: LineDiffProps["op"]): Decoration | undefined => {
    if (op === -1) {
        return removeLineMark;
    } else if (op === 1) {
        return insertLineMark;
    } else if (op === 2) {
        return changeLineMark;
    }
};

const insertLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-insert" });
const removeLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-remove" });
const changeLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-change" });
