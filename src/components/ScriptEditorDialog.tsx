import { Button, Dialog, DialogActions, DialogContent, DialogProps, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { FC, useCallback, useEffect, useState } from "react";
import { ScriptEditor } from "./ScriptEditor";

export interface ScriptEditorDialogProps extends DialogProps {
    initialValue?: string;
    onComplete?: (script: string | null) => void;
}

export const ScriptEditorDialog: FC<ScriptEditorDialogProps> = props => {
    const { onComplete, initialValue = "", ...rest } = props;
    const [script, setScript] = useState(initialValue);
    const classes = useStyles();
    const onClickOk = useCallback(() => {
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
                <Typography variant="caption">Dynamic expression script</Typography>
                <ScriptEditor
                    className={classes.editor}
                    initialValue={initialValue}
                    onValueChange={setScript}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickOk} color="primary">OK</Button>
                <Button onClick={onClickCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    editor: {
        minWidth: theme.spacing(40),
        maxHeight: "60vh",
        overflow: "auto",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.spacing(0.25),
    },
}));
