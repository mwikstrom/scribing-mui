import { Box, Button, DialogActions, DialogProps, IconButton, Theme, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiFullscreen, mdiFullscreenExit, mdiMessagePlusOutline, mdiMessageTextOutline } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Script } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog } from "./ResponsiveDialog";
import { ScriptEditor } from "./ScriptEditor";
import { ScriptMessageDialog } from "./ScriptMessageDialog";
import { ScriptMessageListDialog } from "./ScriptMessageListDialog";

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
        open,
        ...rest
    } = props;
    const [code, setCode] = useState(initialValue?.code || "");    
    const [messages, setMessages] = useState(() => initialValue?.messages || Object.freeze(new Map<string, string>()));
    const hasMessages = useMemo(() => messages.size > 0, [messages]);
    const classes = useStyles();
    const [isFullScreen, setIsFullScreen] = useState<boolean | undefined>();
    const [canToggleFullScreen, setCanTooggleFullScreen] = useState(false);
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(new Script({code, messages}));
        }
    }, [onComplete, code]);
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    const didChange = code !== (initialValue?.code || "");
    const onFullScreen = useCallback((value: boolean, implied: boolean) => {
        if (implied) {
            setIsFullScreen(undefined);
        } else {
            setIsFullScreen(value);
        }
        setCanTooggleFullScreen(!implied);
    }, []);
    const [editMessage, setEditMessage] = useState<string | boolean>(false);
    const saveMessage = useCallback((key: string, value: string) => {
        setMessages(before => {
            return Object.freeze(new Map(before).set(key, value));
        });
        setEditMessage(false);
    }, []);
    const deleteMessage = useCallback((key: string) => {
        let gotEmpty = false;
        setMessages(before => {
            const after = new Map(before);
            after.delete(key);
            gotEmpty = after.size === 0;
            return Object.freeze(after);
        });
        if (gotEmpty) {
            setEditMessage(false);
        }
    }, []);
    useEffect(() => {
        setCode(initialValue?.code || "");
        setMessages(initialValue?.messages || Object.freeze(new Map<string, string>()));
    }, [open]);

    return editMessage === false ? (
        <ResponsiveDialog 
            {...rest}
            scroll="paper"
            disableEscapeKeyDown={didChange}
            maxWidth="sm"
            fullWidth
            fullScreen={isFullScreen}
            onFullScreen={onFullScreen}
            open={open}
            children={(
                <>
                    <div className={classes.content}>
                        <ScriptEditor
                            className={classes.editor}
                            initialValue={initialValue?.code || ""}
                            onValueChange={setCode}
                            label={scriptLabel}
                            maxHeight={`calc(100vh - ${isFullScreen ? 120 : 184}px)`}
                            autoFocus
                        />
                    </div>
                    <DialogActions>
                        <Tooltip 
                            arrow
                            placement="top"
                            title={hasMessages ? locale.tip_messages : locale.tip_add_message}
                            children={
                                <IconButton color="primary" onClick={() => setEditMessage(true)}>
                                    <Icon
                                        path={hasMessages ? mdiMessageTextOutline : mdiMessagePlusOutline}
                                        size={1}
                                    />
                                </IconButton>
                            }
                        />
                        <Tooltip arrow placement="top" title={locale.tip_toggle_fullscreen}>
                            <IconButton 
                                onClick={() => setIsFullScreen(!isFullScreen)} 
                                disabled={!canToggleFullScreen}
                                children={<Icon path={isFullScreen ? mdiFullscreenExit : mdiFullscreen} size={1}/>}
                            />
                        </Tooltip>
                        <Box flex={1}/>
                        <Button onClick={onClickCancel}>{cancelLabel}</Button>
                        <Button onClick={onClickComplete} color="primary">{completeLabel}</Button>
                    </DialogActions>
                </>
            )}
        /> 
    ) : (typeof editMessage === "string" || !hasMessages) ? (
        <ScriptMessageDialog
            open={open}
            allMessages={messages}
            messageKey={typeof editMessage === "string" ? editMessage : undefined}
            onClose={() => setEditMessage(false)}
            onSave={saveMessage}
        />
    ) : (
        <ScriptMessageListDialog
            open={open}
            messages={messages}
            onClose={() => setEditMessage(false)}
            onMessageClick={setEditMessage}
            onMessageDelete={deleteMessage}
            onAddNew={() => setEditMessage("")}
        />
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        flex: 1,
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        paddingTop: theme.spacing(2.5),
        display: "flex",
        flexDirection: "column",
        position: "relative"
    },
    editor: {
        minWidth: theme.spacing(40),
        flex: 1,
    },
}));
