import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";
import { TypeInfo } from "../TypeInfo";
import { typeHoverTip  } from "./typehovertip";
import { paramInfoTip } from "./paraminfotip";
import { MountFunc } from "./infoview";

export const scriptLanguage = (
    globals: Iterable<[string, TypeInfo]>,
    mount: MountFunc,
): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    [
        javascriptLanguage.data.of({
            autocomplete: autocomplete(globals, mount)
        }),
        typeHoverTip(globals, mount),
        paramInfoTip(globals, mount),
    ],
);
