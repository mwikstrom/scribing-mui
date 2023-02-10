import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

/** @internal */
export interface InlineDiffProps {
    from: number;
    to: number;
    mode: -1 | 1 | 2;
}

/** @internal */
export const addInlineDiff = StateEffect.define<InlineDiffProps>({
    map: ({from, to, ...rest}, change) => ({ from: change.mapPos(from), to: change.mapPos(to), ...rest }),
});

/** @internal */
export const inlineDiffField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update: (before, txn) => {
        let after = before.map(txn.changes);
        for (const e of txn.effects) {
            if (e.is(addInlineDiff)) {
                const { from, to, mode } = e.value;
                const mark = inlineDiffMark(mode);
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

const inlineDiffMark = (mode: InlineDiffProps["mode"]): Decoration | undefined => {
    if (mode === -1) {
        return removeTextMark;
    } else if (mode === 1) {
        return insertTextMark;
    } else if (mode === 2) {
        return changeTextMark;
    }
};

const insertTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-insert" });
const removeTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-remove" });
const changeTextMark = Decoration.mark({ class: "cmd-textdiff cmd-textdiff-change" });
