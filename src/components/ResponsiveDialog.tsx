import { Dialog, DialogProps, Theme, useMediaQuery } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { useTheme } from "@material-ui/styles";
import React, { FC } from "react";

export interface ResponsiveDialogProps extends DialogProps {
    fullscreenWidth?: Breakpoint;
}

export const ResponsiveDialog: FC<ResponsiveDialogProps> = props => {
    const {
        fullScreen: explicitFullscreen,
        fullscreenWidth = "xs",
        ...otherProps
    } = props;
    const theme = useTheme<Theme>();
    const implicitFullscreen = useMediaQuery(theme.breakpoints.down(fullscreenWidth));
    const fullScreen = typeof explicitFullscreen === "boolean" ? explicitFullscreen : implicitFullscreen;
    return <Dialog fullScreen={fullScreen} {...otherProps}/>;
};
