import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";
import { TypeInfo } from "../TypeInfo";
import { Theme } from "@material-ui/core";
import { syntaxTip } from "./tip";

export const scriptLanguage = (
    globals: Iterable<[string, TypeInfo]>,
    theme: Theme,
): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    [
        javascriptLanguage.data.of({
            autocomplete: autocomplete(globals, theme)
        }),
        syntaxTip(globals, theme),
    ]
);
