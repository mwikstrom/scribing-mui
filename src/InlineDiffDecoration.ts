import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

/** @internal */
export interface InlineDiffProps {
    from: number;
    to: number;
    op: -1 | 1 | 2;
}

/** @internal */
export const addInlineDiff = StateEffect.define<InlineDiffProps>({
    map: ({from, to, ...rest}, change) => ({ from: change.mapPos(from), to: change.mapPos(to), ...rest }),
});

/** @internal */
export const clearInlineDiff = StateEffect.define<void>();

/** @internal */
export const inlineDiffField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update: (before, txn) => {
        let after = before.map(txn.changes);
        for (const e of txn.effects) {
            if (e.is(clearInlineDiff)) {
                after = after.update({
                    filter: () => false,
                });
            } else if (e.is(addInlineDiff)) {
                const { from, to, op } = e.value;
                const mark = inlineDiffMark(op);
                if (mark) {
                    after = after.update({
                        add: [mark.range(from, to)]
                    });
                }
            }
        }
        return after;
    },
    provide: f => EditorView.decorations.from(f),
});

const inlineDiffMark = (op: InlineDiffProps["op"]): Decoration | undefined => {
    if (op === -1) {
        return removeTextMark;
    } else if (op === 1) {
        return insertTextMark;
    } else if (op === 2) {
        return changeTextMark;
    }
};

const insertTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-insert" });
const removeTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-remove" });
const changeTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-change" });
