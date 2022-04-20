import {
    Box,
    Button,
    Checkbox,
    DialogActions,
    DialogContent,
    DialogProps,
    FormControlLabel,
    TextField,
} from "@material-ui/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Script } from "scribing";
import { FlowEditorController } from "scribing-react";
import { MarkupInfo, MarkupUpdateInfo, UnsetAttribute } from "../MarkupInfo";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { KeyValueGrid } from "./KeyValueGrid";
import { ResponsiveDialog } from "./ResponsiveDialog";

export interface MarkupDialogProps extends Omit<DialogProps, "onClose"> {
    current: MarkupInfo | null;
    canInsertEmpty?: boolean;
    controller?: FlowEditorController | null;
    onComplete?: (update: MarkupUpdateInfo) => void;
    onClose?: () => void;
}

export const MarkupDialog: FC<MarkupDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        current: initial,
        controller,
        canInsertEmpty = !initial && controller?.isCaret(),
        onComplete,
        ...dialogProps
    } = props;
    const { open, onClose } = dialogProps;
    const [tag, setTag] = useState(() => initial?.tag || "");
    const [attr, setAttr] = useState(() => initial?.attr || new Map());
    const [insertEmpty, setInsertEmpty] = useState(false);
    const changedAttr = useMemo(() => {
        const result = new Map<string, string | Script | UnsetAttribute>();
        for (const [key, value] of attr) {
            if (typeof value === "string" || value instanceof Script) {
                result.set(key, value);
            }
        }
        if (initial?.attr) {
            for (const [key, value] of initial.attr) {
                const assigned = attr.get(key);
                if (assigned === undefined) {
                    result.set(key, UnsetAttribute);
                } else if (assigned === value) {
                    result.delete(key);
                }
            }
        }     
        return result;
    }, [initial, attr]);
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            const update: MarkupUpdateInfo = { tag, attr: changedAttr, empty: insertEmpty };
            onComplete(update);
        }
    }, [onComplete, tag, changedAttr, insertEmpty]);
    const onClickCancel = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);
    const isNew = !initial;
    const canSubmit = !isNew || !!tag;
    const isChanged = (tag && tag !== initial?.tag) || changedAttr.size > 0;
    const onSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (canSubmit) {
            onClickComplete();
        }
    }, [onClickComplete, canSubmit]);
    const onSetAttr = useCallback((key: string, value: string | Script) => {
        setAttr(before => new Map([...before, [key, value]]));
    }, []);
    const onUnsetAttr = useCallback((unset: string) => {
        setAttr(before => new Map(Array.from(before).filter(([key]) => key !== unset)));
    }, []);
    useEffect(() => {
        if (!open) {
            setTag(initial?.tag || "");
            setAttr(initial?.attr || new Map());
            setInsertEmpty(false);
        }
    }, [open]);
    return (
        <ResponsiveDialog maxWidth="sm" scroll="paper" fullWidth {...dialogProps} disableEscapeKeyDown={isChanged}>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={tag}
                        placeholder={(initial?.tag === null && !isNew) ? locale.label_multiple_values : undefined}
                        onChange={e => setTag(e.target.value)}
                        label={locale.label_markup_tag}
                        InputLabelProps={{shrink: true}}
                        autoFocus
                    />
                    {(isNew || initial?.attr) && (
                        <Box pt={2}>
                            <KeyValueGrid
                                data={attr}
                                controller={controller}
                                keyLabel={locale.label_attribute}
                                newKeyLabel={locale.label_new_attribute}
                                onSetValue={onSetAttr}
                                onUnsetValue={onUnsetAttr}
                            />
                        </Box>
                    )}
                    {canInsertEmpty && (
                        <Box pt={1}>
                            <FormControlLabel
                                label={locale.label_insert_empty_element}
                                control={
                                    <Checkbox 
                                        checked={insertEmpty}
                                        onChange={e => setInsertEmpty(e.target.checked)}
                                    />
                                }
                            />
                        </Box>
                    )}
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClickCancel}>{locale.button_cancel}</Button>
                <Button
                    onClick={onClickComplete}
                    color="primary"
                    disabled={!canSubmit}
                    children={isNew ? locale.button_insert : locale.button_apply}
                />
            </DialogActions>
        </ResponsiveDialog>
    );
};
