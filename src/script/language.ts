import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";
import { TypeInfo } from "../TypeInfo";

export const scriptLanguage = (globals: Iterable<[string, TypeInfo]> = []): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    javascriptLanguage.data.of({ autocomplete: autocomplete(globals) }),
);
