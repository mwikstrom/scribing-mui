import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, DecorationSet, EditorView } from "@codemirror/view";

/** @internal */
export interface LineDiffProps {
    pos: number;
    mode: -1 | 1 | 2;
}

/** @internal */
export const addLineDiff = StateEffect.define<LineDiffProps>({
    map: ({pos, ...rest}, change) => ({ pos: change.mapPos(pos), ...rest }),
});

/** @internal */
export const lineDiffField = StateField.define<DecorationSet>({
    create: () => Decoration.none,
    update: (before, txn) => {
        let after = before.map(txn.changes);
        for (const e of txn.effects) {
            if (e.is(addLineDiff)) {
                const { pos, mode } = e.value;
                const mark = lineDiffMark(mode);
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

const lineDiffMark = (mode: LineDiffProps["mode"]): Decoration | undefined => {
    if (mode === -1) {
        return removeLineMark;
    } else if (mode === 1) {
        return insertLineMark;
    } else if (mode === 2) {
        return changeLineMark;
    }
};

const insertLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-insert" });
const removeLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-remove" });
const changeLineMark = Decoration.line({ class: "cmd-linediff cmd-linediff-change" });
