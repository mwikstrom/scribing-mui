import { mdiMenuDown, mdiTextBoxOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo } from "react";
import { BoxVariant, BOX_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "../components/OptionButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface BoxVariantSelectorProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const BoxVariantSelector: FC<BoxVariantSelectorProps> = props => {
    const { controller, frozen, ...rest } = props;
    const selected = useMemo(() => controller?.getBoxStyle()?.variant, [controller]);
    const disabled = useMemo(() => frozen || !controller || !controller.isBox(), [frozen, controller]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: BoxVariant) => locale[`box_${value}` as const], [locale]);
    const onOptionSelected = useCallback((variant: BoxVariant) => {
        controller?.formatBox("variant", variant);
    }, [controller]);
    return (
        <OptionButton
            {...rest} 
            startIcon={<Icon size={0.75} path={mdiTextBoxOutline}/>}
            endIcon={<Icon size={1} path={mdiMenuDown}/>}
            disabled={disabled}
            selected={selected}
            options={BOX_VARIANTS}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
        />
    );
};
