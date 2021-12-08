import { Button, Dialog, DialogActions, DialogContent, DialogProps, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ScriptEditor } from "./ScriptEditor";

export interface ScriptEditorDialogProps extends DialogProps {
    scriptLabel?: string;
    cancelLabel?: string;
    completeLabel?: string;
    initialValue?: string;
    onComplete?: (script: string | null) => void;
}

export const ScriptEditorDialog: FC<ScriptEditorDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        onComplete,
        initialValue = "",
        scriptLabel,
        cancelLabel = locale.button_cancel,
        completeLabel = locale.button_apply,
        ...rest
    } = props;
    const [script, setScript] = useState(initialValue);
    const classes = useStyles();
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(script);
        }
    }, [onComplete, script]);
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    useEffect(() => setScript(initialValue), [rest.open]);
    return (
        <Dialog {...rest}>
            <DialogContent>
                <ScriptEditor
                    className={classes.editor}
                    initialValue={initialValue}
                    onValueChange={setScript}
                    label={scriptLabel}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickCancel}>{cancelLabel}</Button>
                <Button onClick={onClickComplete} color="primary">{completeLabel}</Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    editor: {
        minWidth: theme.spacing(40),
        maxHeight: "60vh",
        overflow: "auto",
    },
}));
