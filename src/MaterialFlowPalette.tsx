import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React, { FC, useMemo } from "react";
import { FlowPalette, FlowPaletteScope } from "scribing-react";

/** @public */
export const MaterialFlowPalette: FC = ({children}) => {
    const { palette: muiPalette } = useTheme<Theme>();
    const flowPalette = useMemo<Partial<FlowPalette>>(() => ({
        paper: muiPalette.background.paper,
        text: muiPalette.text.primary,
        subtle: muiPalette.text.secondary,
        primary: muiPalette.primary.main,
        secondary: muiPalette.secondary.main,
        error: muiPalette.error.main,
        warning: muiPalette.warning.main,
        success: muiPalette.success.main,
        information: muiPalette.info.main,
        tooltip: muiPalette.grey[700],
        tooltipText: muiPalette.common.white,
    }), [muiPalette]);
    return (
        <FlowPaletteScope children={children} palette={flowPalette}/>
    );
};
