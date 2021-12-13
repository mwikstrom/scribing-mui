import { mdiFormatColorFill } from "@mdi/js";
import React, { FC, useCallback, useMemo } from "react";
import { FlowColor } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ColorButton } from "../components/ColorButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface BoxColorButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const BoxColorButton: FC<BoxColorButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const selected = useMemo(() => controller?.getBoxColor(), [controller]);
    const disabled = useMemo(() => frozen || !controller || !controller.isBox(), [frozen, controller]);
    const onOptionSelected = useCallback((color: FlowColor) => controller?.setBoxColor(color), [controller]);
    return (
        <ColorButton
            {...rest}
            selected={selected}
            disabled={disabled}
            onOptionSelected={onOptionSelected}
            iconPath={mdiFormatColorFill}
        />
    );
};
