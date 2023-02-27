import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";
import { TypeInfo } from "../TypeInfo";
import { typeHoverTip  } from "./typehovertip";
import { paramInfoTip } from "./paraminfotip";
import { MountFunc } from "./infoview";
import { KeyBinding, keymap } from "@codemirror/view";
import { acceptCompletion } from "@codemirror/autocomplete";
import { Prec } from "@codemirror/state";

export const scriptLanguage = (
    globals: Iterable<[string, TypeInfo]>,
    mount: MountFunc,
): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    [
        javascriptLanguage.data.of({
            autocomplete: autocomplete(globals, mount)
        }),
        Prec.highest(keymap.of([completeWithTab])),
        typeHoverTip(globals, mount),
        paramInfoTip(globals, mount),
    ],
);

const completeWithTab: KeyBinding = {
    key: "Tab",
    run: acceptCompletion,
};
