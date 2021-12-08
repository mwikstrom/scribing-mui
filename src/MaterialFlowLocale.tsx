import React, { createContext, FC, ReactNode, useContext, useMemo } from "react";
import { DefaultFlowLocale, FlowLocale, FlowLocaleScope } from "scribing-react";

export interface MaterialFlowLocaleProps {
    children: ReactNode;
    locale: Partial<MaterialFlowLocale>;
}

/** @public */
export interface MaterialFlowLocale extends FlowLocale {
    button_insert: string;
    button_apply: string;
    button_cancel: string;
    label_dynamic_text_script: string;    
}

/** @public */
export const DefaultMaterialFlowLocale: Readonly<MaterialFlowLocale> = Object.freeze({
    ...DefaultFlowLocale,
    button_insert: "Insert",
    button_apply: "Apply",
    button_cancel: "Cancel",
    label_dynamic_text_script: "Dynamic text script",
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
