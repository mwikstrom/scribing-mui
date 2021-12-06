import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import React, { FC, ReactNode } from "react";
import { Button, ButtonProps, Theme } from "@material-ui/core";

export interface ToolButtonProps extends ButtonProps {
    children: ReactNode;
    className?: string;
}

export const ToolButton: FC<ToolButtonProps> = ({children, className, ...rest}) => {
    const classes = useStyles();
    return (
        <Button {...rest} className={clsx(classes.root, className)}>
            {children}
        </Button>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        color: theme.palette.text.secondary,
        minWidth: theme.spacing(5),
        minHeight: theme.spacing(5),
    },
}));
