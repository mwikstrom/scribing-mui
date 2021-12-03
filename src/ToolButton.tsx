import clsx from "clsx";
import { ToggleButton, ToggleButtonProps } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import React, { FC, ReactNode } from "react";

export interface ToolButtonProps extends ToggleButtonProps {
    children: ReactNode;
    className?: string;
}

export const ToolButton: FC<ToolButtonProps> = ({children, className, ...rest}) => {
    const classes = useStyles();
    return (
        <ToggleButton {...rest} className={clsx(classes.root, className)}>
            {children}
        </ToggleButton>
    );
};

const useStyles = makeStyles({
    root: {},
});
