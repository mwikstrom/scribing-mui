import { LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { autocomplete } from "./autocomplete";

export const scriptLanguage = (): LanguageSupport => new LanguageSupport(
    javascriptLanguage,
    javascriptLanguage.data.of({ autocomplete: autocomplete() }),
);
