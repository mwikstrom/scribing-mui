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
    button_exit_preview: string;
    button_check_in: string;
    button_check_out: string;
    button_reset: string;
    button_add_new: string;
    button_close: string;
    button_test: string;
    label_please_wait: string;
    label_dynamic_text_script: string;
    label_all_categories: string;
    tab_predefined_icons: string;
    tab_material_design_icons: string;
    interaction_none: string;
    interaction_open_url: string;
    interaction_run_script: string;
    markup_advanced: string;
    label_markup_tag: string;
    message_connection_broken: string;
    label_multiple_values: string;
    label_insert_empty_element: string;
    label_attribute: string;
    label_new_attribute: string;
    label_value: string;
    label_data_source: string;
    label_message_id: string;
    label_message_format: string;
    label_input: string;
    label_output: string;
    label_language: string;
    tip_data_source: string;
    tip_more_tools: string;
    tip_check_in: string;
    tip_preview: string;
    tip_formatting_marks: string;
    tip_reading_ltr: string;
    tip_reading_rtl: string;
    tip_paste: string;
    tip_copy: string;
    tip_cut: string;
    tip_redo: string;
    tip_undo: string;
    tip_table_split_cell: string;
    tip_table_merge_cells: string;
    tip_table_column_remove: string;
    tip_table_row_remove: string;
    tip_table_row_insert_before: string;
    tip_table_row_insert_after: string;
    tip_table_column_insert_before: string;
    tip_table_column_insert_after: string;
    tip_markup: string;
    tip_insert_table: string;
    tip_image: string;
    tip_icon: string;
    tip_insert_box: string;
    tip_dynamic_text: string;
    tip_indent_increment: string;
    tip_indent_decrement: string;
    tip_list_ordered: string;
    tip_list_unordered: string;
    tip_align_left: string;
    tip_align_center: string;
    tip_align_right: string;
    tip_align_justify: string;
    tip_box_full_width: string;
    tip_box_interaction: string;
    tip_box_color: string;
    tip_superscript: string;
    tip_subscript: string;
    tip_link_interaction: string;
    tip_strikethrough: string;
    tip_bold: string;
    tip_italic: string;
    tip_underline: string;
    tip_font_family: string;
    tip_text_color: string;
    tip_toggle_fullscreen: string;
    tip_messages: string;
    tip_add_message: string;
}

/** @public */
export const DefaultMaterialFlowLocale: Readonly<MaterialFlowLocale> = Object.freeze({
    ...DefaultFlowLocale,
    button_insert: "Insert",
    button_apply: "Apply",
    button_cancel: "Cancel",
    button_exit_preview: "Exit preview",
    button_check_out: "Check out",
    button_check_in: "Check in",
    button_reset: "Reset",
    button_add_new: "Add new…",
    button_close: "Close",
    button_test: "Test",
    label_please_wait: "Please wait",
    tab_predefined_icons: "Predefined icons",
    tab_material_design_icons: "Material design icons",
    label_dynamic_text_script: "Dynamic text script",
    label_all_categories: "All categories",
    interaction_none: "Not interactive",
    interaction_open_url: "Open URL",
    interaction_run_script: "Run script",
    markup_advanced: "Advanced",
    label_markup_tag: "Markup tag",
    message_connection_broken: "Ouch! A synchronization problem occurred. It's a bug and we'll do our best to fix it!",
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
    font_family_cursive: "Cursive",
    font_family_decorative: "Decorative",
    box_basic: "Basic",
    box_outlined: "Outlined",
    box_contained: "Contained",
    box_quote: "Quote",
    box_alert: "Alert",
    label_multiple_values: "Multiple values",
    label_insert_empty_element: "Insert empty element",
    label_attribute: "Attribute",
    label_new_attribute: "Type a new attribute here",
    label_value: "Value",
    label_data_source: "Data source",
    label_message_id: "Message ID",
    label_message_format: "Message format",
    label_input: "Input",
    label_output: "Output",
    label_language: "Language",
    tip_data_source: "Data source",
    tip_more_tools: "Hide or show additional tools",
    tip_check_in: "Check in",
    tip_preview: "Show preview",
    tip_formatting_marks: "Hide or show formatting marks",
    tip_reading_ltr: "Left-to-right reading direction",
    tip_reading_rtl: "Right-to-left reading direction",
    tip_paste: "Paste from clipboard",
    tip_copy: "Copy to clipboard",
    tip_cut: "Cut to clipboard",
    tip_redo: "Redo",
    tip_undo: "Undo",
    tip_table_split_cell: "Split merged table cell",
    tip_table_merge_cells: "Merge table cells",
    tip_table_column_remove: "Remove table column",
    tip_table_row_remove: "Remove table row",
    tip_table_row_insert_before: "Insert table row before",
    tip_table_row_insert_after: "Insert table row after",
    tip_table_column_insert_before: "Insert table column before",
    tip_table_column_insert_after: "Insert table column after",
    tip_markup: "Insert or edit markup",
    tip_insert_table: "Insert table",
    tip_image: "Insert or change image",
    tip_icon: "Insert or change icon",
    tip_insert_box: "Insert box",
    tip_dynamic_text: "Insert or edit dynamic text",
    tip_indent_increment: "Increase indent",
    tip_indent_decrement: "Decrease indent",
    tip_list_ordered: "Toggle ordered list",
    tip_list_unordered: "Toggle unordered list",
    tip_align_left: "Align content to the left",
    tip_align_center: "Align content to the right",
    tip_align_right: "Center content",
    tip_align_justify: "Justify content",
    tip_box_full_width: "Toggle full-width box",
    tip_box_interaction: "Box interaction",
    tip_box_color: "Box color",
    tip_superscript: "Superscript",
    tip_subscript: "Subscript",
    tip_link_interaction: "Link interaction",
    tip_strikethrough: "Strikethrough",
    tip_bold: "Bold",
    tip_italic: "Italic",
    tip_underline: "Underline",
    tip_font_family: "Font family",
    tip_text_color: "Text color",
    tip_toggle_fullscreen: "Toogle fullscreen",
    tip_messages: "Messages",
    tip_add_message: "Add message",
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
