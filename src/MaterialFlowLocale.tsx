import React, { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { BoxVariant, FlowColor, FontFamily, ParagraphVariant } from "scribing";
import { DefaultFlowLocale, FlowLocale, FlowLocaleScope } from "scribing-react";

/** @public */
export interface MaterialFlowLocaleProps {
    children: ReactNode;
    locale: Partial<MaterialFlowLocale>;
}

/** @public */
export type LocaleItemKey = (
    ParagraphVariantLocaleKey |
    FlowColorLocaleKey |
    FontFamilyLocaleKey |
    BoxVariantLocaleKey
);

/** @public */
export type ParagraphVariantLocaleKey = `paragraph_${ParagraphVariant}`;

/** @public */
export type FlowColorLocaleKey = `color_${FlowColor}`;

/** @public */
export type FontFamilyLocaleKey = `font_family_${FontFamily}`;

/** @public */
export type BoxVariantLocaleKey = `box_${BoxVariant}`;

/** @public */
export interface MaterialFlowLocale extends Record<LocaleItemKey, string>, FlowLocale {
    button_insert: string;
    button_apply: string;
    button_cancel: string;
    label_dynamic_text_script: string;
    tab_predefined_icons: string;
    tab_material_design_icons: string;
}

/** @public */
export const DefaultMaterialFlowLocale: Readonly<MaterialFlowLocale> = Object.freeze({
    ...DefaultFlowLocale,
    button_insert: "Insert",
    button_apply: "Apply",
    button_cancel: "Cancel",
    tab_predefined_icons: "Predefined icons",
    tab_material_design_icons: "Material design icons",
    label_dynamic_text_script: "Dynamic text script",
    paragraph_normal: "Normal",
    paragraph_title: "Title",
    paragraph_subtitle: "Subtitle",
    paragraph_preamble: "Preamble",
    paragraph_code: "Code",
    paragraph_h1: "Heading 1",
    paragraph_h2: "Heading 2",
    paragraph_h3: "Heading 3",
    paragraph_h4: "Heading 4",
    paragraph_h5: "Heading 5",
    paragraph_h6: "Heading 6",
    color_default: "Default",
    color_primary: "Primary accent",
    color_secondary: "Secondary accent",
    color_subtle: "Subtle",
    color_information: "Information",
    color_success: "Success",
    color_warning: "Warning",
    color_error: "Error",
    font_family_body: "Body",
    font_family_heading: "Heading",
    font_family_monospace: "Monospace",
    box_basic: "Basic",
    box_outlined: "Outlined",
    box_contained: "Contained",
    box_quote: "Quote",
    box_alert: "Alert",
});

/** @public */
export const MaterialFlowLocale: FC<MaterialFlowLocaleProps> = props => {
    const { children, locale: partial } = props;
    const locale = useMemo<Readonly<MaterialFlowLocale>>(() => !partial ? DefaultMaterialFlowLocale : Object.freeze({
        ...DefaultMaterialFlowLocale,
        ...partial,
    }), [partial]);
    return (
        <MaterialFlowLocaleContext.Provider value={locale}>
            <FlowLocaleScope children={children} locale={locale}/>
        </MaterialFlowLocaleContext.Provider>
    );
};

/**
 * @public
 */
export function useMaterialFlowLocale(): Readonly<MaterialFlowLocale> {
    return useContext(MaterialFlowLocaleContext);
}

const MaterialFlowLocaleContext = createContext<Readonly<MaterialFlowLocale>>(DefaultMaterialFlowLocale);
