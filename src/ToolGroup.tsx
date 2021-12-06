import { ButtonGroup } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import React, { FC, ReactNode } from "react";

export interface ToolGroupProps {
    children: ReactNode;
}

export const ToolGroup: FC<ToolGroupProps> = ({children}) => {
    const classes = useStyles();
    return (
        <ButtonGroup size="small" className={classes.root}>
            {children}
        </ButtonGroup>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(0.5),
    },
}));
