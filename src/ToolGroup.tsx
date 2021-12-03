import { Theme } from "@material-ui/core/styles";
import { ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/styles";
import React, { FC, ReactNode } from "react";

export interface ToolGroupProps {
    children: ReactNode;
}

export const ToolGroup: FC<ToolGroupProps> = ({children}) => {
    const classes = useStyles();
    return (
        <ToggleButtonGroup size="small" className={classes.root}>
            {children}
        </ToggleButtonGroup>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(0.5),
    },
}));
