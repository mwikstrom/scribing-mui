import { Dialog, DialogProps, Theme, useMediaQuery } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { useTheme } from "@material-ui/styles";
import React, { FC, useEffect } from "react";

export interface ResponsiveDialogProps extends DialogProps {
    fullScreenWidth?: Breakpoint;
    onFullScreen?: (value: boolean, implied: boolean) => void;
}

export const ResponsiveDialog: FC<ResponsiveDialogProps> = props => {
    const {
        fullScreen: explicitFullscreen,
        fullScreenWidth = "xs",
        onFullScreen,
        ...otherProps
    } = props;
    const theme = useTheme<Theme>();
    const implicitFullscreen = useMediaQuery(theme.breakpoints.down(fullScreenWidth));
    const fullScreen = typeof explicitFullscreen === "boolean" ? explicitFullscreen : implicitFullscreen;
    useEffect(() => {
        if (onFullScreen) {
            onFullScreen(fullScreen, implicitFullscreen);
        }
    }, [onFullScreen, fullScreen, implicitFullscreen]);
    return <Dialog fullScreen={fullScreen} {...otherProps}/>;
};
