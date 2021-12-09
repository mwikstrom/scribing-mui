import { mdiFormatColorFill } from "@mdi/js";
import React, { FC, useCallback, useMemo } from "react";
import { FlowColor } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ColorButton } from "../components/ColorButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface BoxColorButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const BoxColorButton: FC<BoxColorButtonProps> = props => {
    const { controller, ...rest } = props;
    const current = useMemo(() => controller?.getBoxColor(), [controller]);
    const setCurrent = useCallback((color: FlowColor) => controller?.setBoxColor(color), [controller]);
    return (
        <ColorButton
            {...rest}
            current={current}
            setCurrent={setCurrent}
            iconPath={mdiFormatColorFill}
        />
    );
};
