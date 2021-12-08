import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import React, { FC, forwardRef, useCallback } from "react";
import { alpha, Button, ButtonProps, Theme } from "@material-ui/core";

export interface ToolButtonProps extends ButtonProps {
    active?: boolean;
}

export const ToolButton: FC<ToolButtonProps> = forwardRef((props, ref) => {
    const { 
        className,
        active,
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
