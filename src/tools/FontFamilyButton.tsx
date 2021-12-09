import { mdiFormatFont } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo } from "react";
import { FontFamily, FONT_FAMILIES } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButtonProps } from "../components/ToolButton";
import { OptionButton } from "../components/OptionButton";

export interface FontFamilyButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const FontFamilyButton: FC<FontFamilyButtonProps> = props => {
    const { controller, ...rest } = props;
    const selected = useMemo(() => controller?.getFontFamily(), [controller]);
    const onOptionSelected = useCallback((font: FontFamily) => controller?.setFontFamily(font), [controller]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: FontFamily) => locale[`font_family_${value}` as const], [locale]);
    return (
        <OptionButton
            {...rest} 
            disabled={!controller}
            options={FONT_FAMILIES}
            selected={selected}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
            children={<Icon size={1} path={mdiFormatFont}/>}
        />
    );
};
