import { mdiFormatText, mdiMenuDown } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo } from "react";
import { ParagraphVariant, PARAGRAPH_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "../components/OptionButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface ParagraphVariantSelectorProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const ParagraphVariantSelector: FC<ParagraphVariantSelectorProps> = props => {
    const { controller, ...rest } = props;
    const selected = useMemo(() => controller?.getParagraphVariant(), [controller]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: ParagraphVariant) => locale[`paragraph_${value}` as const], [locale]);
    const onOptionSelected = useCallback((value: ParagraphVariant) => {
        controller?.setParagraphVariant(value);
    }, [controller]);
    return (
        <OptionButton
            {...rest} 
            startIcon={<Icon size={0.75} path={mdiFormatText}/>}
            endIcon={<Icon size={1} path={mdiMenuDown}/>}
            disabled={!controller}
            selected={selected}
            options={PARAGRAPH_VARIANTS}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
        />
    );
};
