import { Box, Button, DialogActions, DialogContent, TextField } from "@material-ui/core";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Script } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog, ResponsiveDialogProps } from "./ResponsiveDialog";
import { ScriptMessageTestDialog } from "./ScriptMessageTestDialog";

export interface ScriptMessageDialogProps extends Omit<ResponsiveDialogProps, "onClose"> {
    allMessages?: ReadonlyMap<string, string>;
    messageKey?: string;
    messageKeyPrefix?: string;
    lang?: string;
    onClose?: () => void;
    onSave?: (messageKey: string, messageFormat: string) => void;
}

export const ScriptMessageDialog: FC<ScriptMessageDialogProps> = props => {
    const {
        allMessages,
        messageKey: givenMessageKey,
        messageKeyPrefix = "TXT",
        lang,
        onSave: onSaveProp,
        onClose,
        open,
        ...otherProps
    } = props;
    const locale = useMaterialFlowLocale();
    const [messageKey, setMessageKey] = useState(() => {
        if (givenMessageKey) {
            return givenMessageKey;
        } else {
            return allocateMessageKey(allMessages, messageKeyPrefix);
        }        
    });
    const [messageFormat, setMessageFormat] = useState(() => {        
        if (givenMessageKey && allMessages) {
            return allMessages.get(givenMessageKey) || "";
        } else {
            return "";
        }
    });
    const [isTesting, setIsTesting] = useState(false);
    const onSave = useCallback(() => {
        if (onSaveProp) {
            onSaveProp(messageKey, messageFormat);
        }
    }, [onSaveProp, messageKey, messageFormat]);
    const isBadMessageKey = useMemo(() => {
        if (!allMessages || givenMessageKey === messageKey) {
            return false;
        } else {
            return allMessages.has(messageKey);
        }
    }, [messageKey, allMessages, givenMessageKey]);
    const isBadMessageFormat = useMemo(() => {
        return !Script.isSupportedMessageFormat(messageFormat);
    }, [messageFormat]);
    const canSave = useMemo(() => !!messageKey && !isBadMessageKey, [messageKey, isBadMessageKey]);
    const canTest = useMemo(() => {
        return !isBadMessageFormat && Script.getMessageArguments(messageFormat).length > 0;
    }, [messageFormat, isBadMessageFormat]);
    const [disableBackdropTransition, setDiableBackdropTransition] = useState(false);

    useEffect(() => {
        if (isTesting) {
            setDiableBackdropTransition(true);
        } else {
            const timerId = setTimeout(() => setDiableBackdropTransition(false), 300);
            return () => clearTimeout(timerId);
        }
    }, [isTesting]);

    return (
        <>
            <ResponsiveDialog 
                maxWidth="sm"
                fullWidth
                onClose={onClose}
                open={open}
                hideBackdrop={isTesting}
                BackdropProps={{
                    transitionDuration: disableBackdropTransition ? 0 : undefined
                }}
                {...otherProps}
                children={(
                    <>
                        <DialogContent>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={messageKey}
                                onChange={e => setMessageKey(e.target.value)}
                                label={locale.label_message_id}
                                InputLabelProps={{shrink: true}}
                                error={isBadMessageKey}
                            />
                            <Box py={1.5}/>
                            <TextField
                                variant="outlined"
                                fullWidth
                                value={messageFormat}
                                onChange={e => setMessageFormat(e.target.value)}
                                label={locale.label_message_format}
                                InputLabelProps={{shrink: true}}
                                autoFocus
                                multiline
                                error={isBadMessageFormat}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" onClick={() => setIsTesting(true)} disabled={!canTest}>
                                {locale.button_test}
                            </Button>
                            <Box flex={1}/>
                            <Button onClick={onClose}>
                                {locale.button_cancel}
                            </Button>
                            <Button color="primary" onClick={onSave} disabled={!canSave}>
                                {locale.button_apply}
                            </Button>
                        </DialogActions>
                    </>
                )}
            />
            {isTesting && (
                <ScriptMessageTestDialog
                    open={open}
                    BackdropProps={{transitionDuration:0}}
                    messageFormat={messageFormat}
                    lang={lang}
                    onClose={() => setIsTesting(false)}
                />
            )}
        </>
    );
};

const allocateMessageKey = (map: ReadonlyMap<string, string> | undefined, prefix: string): string => {
    let index = 1;
    let allocated = formatMessageKey(prefix, index);
    while (map && map.has(allocated)) {
        allocated = formatMessageKey(prefix, ++index);
    }
    return allocated;
};

const formatMessageKey = (prefix: string, index: number) => `${prefix}${index}`;
