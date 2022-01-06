import { Button, Dialog, DialogActions, DialogContent, DialogProps, TextField } from "@material-ui/core";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";

export interface TextFieldDialogProps extends DialogProps {
    inputLabel?: string;
    cancelLabel?: string;
    completeLabel?: string;
    initialValue?: string;
    allowEmpty?: boolean;
    onComplete?: (value: string | null) => void;
}

export const TextFieldDialog: FC<TextFieldDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        onComplete,
        initialValue = "",
        allowEmpty = false,
        inputLabel,
        cancelLabel = locale.button_cancel,
        completeLabel = locale.button_apply,
        ...rest
    } = props;
    const [value, setValue] = useState(initialValue);
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(value);
        }
    }, [onComplete, value]);
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    const disabled = !allowEmpty && !value;
    const onSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (onComplete && !disabled) {
            onComplete(value);
        }
    }, [onComplete, value, disabled]);
    useEffect(() => setValue(initialValue), [rest.open]);
    return (
        <Dialog {...rest} scroll="paper" disableEscapeKeyDown={value !== initialValue}>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        label={inputLabel}
                        InputLabelProps={{shrink: true}}
                        autoFocus
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickCancel}>{cancelLabel}</Button>
                <Button
                    onClick={onClickComplete}
                    color="primary"
                    disabled={disabled}
                    children={completeLabel}
                />
            </DialogActions>
        </Dialog>
    );
};
