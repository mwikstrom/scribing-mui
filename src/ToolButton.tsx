import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import React, { FC, ReactNode, useCallback } from "react";
import { alpha, Button, ButtonProps, Theme } from "@material-ui/core";

export interface ToolButtonProps extends ButtonProps {
    children?: ReactNode;
    className?: string;
    active?: boolean;
}

export const ToolButton: FC<ToolButtonProps> = props => {
    const { children, className: givenClass, active, ...rest } = props;
    const classes = useStyles();
    const onMouseDown = useCallback((e: React.MouseEvent) => e.preventDefault(), []);
    const className = clsx(
        classes.root,
        givenClass,
        active && classes.active,
    );
    return (
        <Button {...rest} className={className} onMouseDown={onMouseDown}>
            {children}
        </Button>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: alpha(theme.palette.action.active, 0.38),
        minWidth: theme.spacing(5),
        minHeight: theme.spacing(5),
    },
    active: {
        color: theme.palette.action.active,
        backgroundColor: alpha(theme.palette.action.active, 0.12),
        "&:hover": {
            backgroundColor: alpha(theme.palette.action.active, 0.15),
        },
    },
}));
