import { mdiFormatColorText } from "@mdi/js";
import React, { FC, useCallback, useMemo } from "react";
import { FlowColor } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ColorButton } from "../components/ColorButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface TextColorButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const TextColorButton: FC<TextColorButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const selected = useMemo(() => controller?.getTextColor(), [controller]);
    const onOptionSelected = useCallback((color: FlowColor) => controller?.setTextColor(color), [controller]);
    return (
        <ColorButton
            {...rest}
            selected={selected}
            disabled={frozen || !controller}
            onOptionSelected={onOptionSelected}
            iconPath={mdiFormatColorText}
        />
    );
};
