import { mdiColorHelper } from "@mdi/js";
import { Icon, Stack } from "@mdi/react";
import React, { FC, useCallback, useMemo } from "react";
import { FlowColor, FLOW_COLORS } from "scribing";
import { FlowPalette, useFlowPalette } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "./OptionButton";
import { ToolButtonProps } from "./ToolButton";

export interface ColorButtonProps extends ToolButtonProps {
    selected: FlowColor | undefined;
    iconPath: string;
    onOptionSelected: (color: FlowColor) => void;
}

export const ColorButton: FC<ColorButtonProps> = props => {
    const { selected, onOptionSelected, iconPath, ...rest } = props;
    const palette = useFlowPalette();
    const htmlColor = useMemo(() => getHtmlColor(selected, palette), [palette, selected]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: FlowColor) => locale[`color_${value}` as const], [locale]);
    const getOptionColor = useCallback((value: FlowColor) => getHtmlColor(value, palette), [palette]);
    return (
        <OptionButton
            {...rest} 
            options={FLOW_COLORS}
            selected={selected}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
            getOptionColor={getOptionColor}
            children={(
                <Stack size={1}>
                    <Icon path={iconPath}/>
                    <Icon path={mdiColorHelper} color={htmlColor}/>
                </Stack>
            )}
        />
    );
};

const getHtmlColor = (color: FlowColor | undefined, palette: FlowPalette): string | undefined => {
    if (color === "default") {
        return palette.text;
    } else if (color) {
        return palette[color];
    }
};
