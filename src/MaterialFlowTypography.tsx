import { Theme } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import React, { FC, useMemo } from "react";
import { FlowTypography, FlowTypographyScope } from "scribing-react";

/** @public */
export const MaterialFlowTypography: FC = ({children}) => {
    const { typography: muiTypography } = useTheme<Theme>();
    const flowTypography = useMemo<Partial<FlowTypography>>(() => ({
        body: muiTypography.body1.fontFamily ?? muiTypography.fontFamily,
        heading: muiTypography.h3.fontFamily ?? muiTypography.fontFamily,
        monospace: "monospace",
        cursive: muiTypography.fontFamily,
        decorative: muiTypography.fontFamily,
        ui: muiTypography.fontFamily,
    }), [muiTypography]);
    return (
        <FlowTypographyScope children={children} typography={flowTypography}/>
    );
};
