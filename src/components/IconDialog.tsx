import { Button, Dialog, DialogActions, DialogProps, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { IconSelector } from "./IconSelector";

export interface IconDialogProps extends DialogProps {
    cancelLabel?: string;
    completeLabel?: string;
    initialValue?: string;
    onComplete?: (icon: string | null) => void;
}

export const IconDialog: FC<IconDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        onComplete,
        initialValue = "",
        cancelLabel = locale.button_cancel,
        completeLabel = locale.button_apply,
        ...rest
    } = props;
    const [icon, setIcon] = useState(initialValue);
    const classes = useStyles();
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(icon);
        }
    }, [onComplete, icon]);
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    useEffect(() => setIcon(initialValue), [rest.open]);
    return (
        <Dialog {...rest} scroll="paper" disableEscapeKeyDown={icon !== initialValue} maxWidth="md" fullWidth>
            <div className={classes.content}>
                <IconSelector
                    initial={initialValue}
                    onChange={setIcon}
                    onApply={value => {
                        setIcon(value);
                        if (onComplete) {
                            onComplete(value);
                        }
                    }}
                />
            </div>
            <DialogActions>
                <Button onClick={onClickCancel}>{cancelLabel}</Button>
                <Button onClick={onClickComplete} color="primary" disabled={!icon}>{completeLabel}</Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        flex: 1,
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        paddingTop: theme.spacing(2.5),
    },
}));
