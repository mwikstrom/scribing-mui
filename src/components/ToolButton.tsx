import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import React, { FC, forwardRef, useCallback } from "react";
import { alpha, Button, ButtonProps, Theme } from "@material-ui/core";

export interface ToolButtonProps extends ButtonProps {
    active?: boolean;
    primary?: boolean;
}

export const ToolButton: FC<ToolButtonProps> = forwardRef((props, ref) => {
    const { 
        className,
        active,
        primary,
        onMouseDown,
        ...rest
    } = props;
    const classes = useStyles();
    const onMouseDownOverride = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (onMouseDown) {
            onMouseDown(e);
        }
    }, [onMouseDown]);
    const classNameOverride = clsx(
        classes.root,
        className,
        active && classes.active,
        primary && classes.primary,
    );    
    return (
        <Button
            {...rest}
            ref={ref}
            className={classNameOverride}
            onMouseDown={onMouseDownOverride}
        />
    );
});

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minWidth: theme.spacing(5),
        minHeight: theme.spacing(5),
        color: alpha(theme.palette.action.active, 0.45),
        "&$active": {
            color: theme.palette.action.active,
            backgroundColor: alpha(theme.palette.action.active, 0.12),
            "&:hover": {
                backgroundColor: alpha(theme.palette.action.active, 0.15),
            },    
        },
        "&$primary": {
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
            "&$active": {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
            "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.15),
            },    
        },
    },
    active: {},
    primary: {},
}));
