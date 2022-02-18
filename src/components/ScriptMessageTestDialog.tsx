import { Box, Button, DialogActions, DialogContent, TextField } from "@material-ui/core";
import React, { FC, useCallback, useMemo, useState } from "react";
import { MessageFormatArgumentInfo, Script } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog, ResponsiveDialogProps } from "./ResponsiveDialog";
import { IntlMessageFormat } from "intl-messageformat";

export interface ScriptMessageTestDialogProps extends Omit<ResponsiveDialogProps, "onClose"> {
    messageFormat: string;
    onClose?: () => void;
}

export const ScriptMessageTestDialog: FC<ScriptMessageTestDialogProps> = props => {
    const {
        messageFormat,
        onClose,
        ...otherProps
    } = props;
    const locale = useMaterialFlowLocale();
    const argInfo = useMemo(() => Script.getMessageArguments(messageFormat), [messageFormat]);
    const [args, setArgs] = useState(() => createDefaultArgs(argInfo));
    const formatter = useMemo(() => {
        try {
            return new IntlMessageFormat(messageFormat);
        } catch {
            return null;
        }
    }, [messageFormat]);
    const output = useMemo(() => {
        try {            
            return formatter?.format(args) || "";
        } catch {
            return "";
        }
    }, [formatter, args]);
    return (
        <ResponsiveDialog {...otherProps} maxWidth="sm" fullWidth onClose={onClose}>
            <DialogContent>
                {argInfo.map(info => (
                    <Box key={info.key} pb={1.5}>
                        <ArgumentEditor info={info} args={args} onArgsChange={setArgs}/>
                    </Box>
                ))}
                <TextField
                    variant="outlined"
                    fullWidth
                    value={output}
                    label={locale.label_output}
                    InputLabelProps={{shrink: true}}
                    InputProps={{readOnly: true}}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={onClose}>
                    {locale.button_close}
                </Button>
            </DialogActions>
        </ResponsiveDialog>
    );
};

interface ArgumentEditorProps {
    info: MessageFormatArgumentInfo;
    args: Record<string, string>;
    onArgsChange(args: Record<string, string>): void;
}

const ArgumentEditor: FC<ArgumentEditorProps> = props => {
    const { info, args, onArgsChange } = props;
    const value = useMemo(() => args[info.key] || "", [args, info]);
    const locale = useMaterialFlowLocale();
    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const map = new Map(Object.entries(args));
        map.set(info.key, e.target.value);
        onArgsChange(Object.fromEntries(map));
    }, [info, args]);    
    return (
        <TextField
            variant="outlined"
            fullWidth
            value={value}
            onChange={onChange}
            label={`${locale.label_input}: ${info.key}`}
            InputLabelProps={{shrink: true}}
        />
    );
};

const createDefaultArgs = (array: MessageFormatArgumentInfo[]): Record<string, string> => {
    const map = new Map<string, string>();
    array.forEach(info => {
        let value = "";
        if (!info.free) {
            if (info.numeric) {
                value = "0";
            } else if (info.choice && info.options.length > 0) {
                value = info.options[0];
            }
        }
        map.set(info.key, value);
    });
    return Object.fromEntries(map);
};
