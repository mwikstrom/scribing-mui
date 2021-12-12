import { ButtonGroup } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React, { FC, ReactNode } from "react";

export interface ToolGroupProps {
    children: ReactNode;
    collapse?: boolean;
}

export const ToolGroup: FC<ToolGroupProps> = ({children, collapse}) => {
    const classes = useStyles();
    return (
        <ButtonGroup size="small" className={clsx(classes.root, collapse && classes.collapse)}>
            {children}
        </ButtonGroup>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(0.5),
        overflow: "hidden",
        maxWidth: "100%",
    },
    collapse: {
        maxWidth: 0,
        margin: 0,
        opacity: 0,
    },
}));
