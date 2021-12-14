import { Button, SnackbarContent, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";

export interface ConnectionBrokenProps {
    onReset?: () => void;
}

export const ConnectionBroken: FC<ConnectionBrokenProps> = props => {
    const { onReset } = props;
    const locale = useMaterialFlowLocale();
    const classes = useStyles();
    const action = (
        <Button
            size="small"
            startIcon={<Icon size={0.75} path={mdiSync}/>}
            className={classes.action}
            onClick={onReset}
            children={locale.button_reset}
        />
    );
    return (
        <SnackbarContent
            className={classes.root}
            action={action}
            message={locale.message_connection_broken}
        />
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.getContrastText(theme.palette.error.dark),
    },
    action: {
        color: "inherit",
    },
}));
