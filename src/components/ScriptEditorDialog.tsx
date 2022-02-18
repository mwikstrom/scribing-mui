import { Button, DialogActions, DialogProps, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { FC, useCallback, useEffect, useState } from "react";
import { Script } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { ScriptEditor } from "./ScriptEditor";

export interface ScriptEditorDialogProps extends DialogProps {
    scriptLabel?: string;
    cancelLabel?: string;
    completeLabel?: string;
    initialValue?: Script | null;
    onComplete?: (script: Script | null) => void;
}

export const ScriptEditorDialog: FC<ScriptEditorDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        onComplete,
        initialValue = null,
        scriptLabel,
        cancelLabel = locale.button_cancel,
        completeLabel = locale.button_apply,
        ...rest
    } = props;
    const [code, setCode] = useState(initialValue?.code || "");
    const classes = useStyles();
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(Script.fromData(code));
        }
    }, [onComplete, code]);
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    const didChange = code !== (initialValue?.code || "");
    useEffect(() => setCode(initialValue?.code || ""), [rest.open]);
    return (
        <ResponsiveDialog {...rest} scroll="paper" disableEscapeKeyDown={didChange}>
            <div className={classes.content}>
                <ScriptEditor
                    className={classes.editor}
                    initialValue={initialValue?.code || ""}
                    onValueChange={setCode}
                    label={scriptLabel}
                    maxHeight="calc(max(40px, min(67vh - 80px, 800px)))"
                    autoFocus
                />
            </div>
            <DialogActions>
                <Button onClick={onClickCancel}>{cancelLabel}</Button>
                <Button onClick={onClickComplete} color="primary">{completeLabel}</Button>
            </DialogActions>
        </ResponsiveDialog>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        flex: 1,
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        paddingTop: theme.spacing(2.5),
    },
    editor: {
        minWidth: theme.spacing(40)    
    },
}));
