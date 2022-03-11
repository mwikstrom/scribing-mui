import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";
import { TypeInfo } from "../TypeInfo";
import { Theme } from "@material-ui/core";

export const scriptLanguage = (
    globals: Iterable<[string, TypeInfo]>,
    theme: Theme,
): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    javascriptLanguage.data.of({ autocomplete: autocomplete(globals, theme) }),
);
