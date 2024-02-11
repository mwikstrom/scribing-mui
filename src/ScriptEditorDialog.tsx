import { Box, Button, DialogActions, DialogProps, IconButton, Theme, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiFullscreen, mdiFullscreenExit } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Script } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useOtherScripts } from "./hooks/use-other-scripts";
import { useScriptHostFuncs } from "./hooks/use-scripthost-funcs";
import { useMaterialFlowLocale } from "./MaterialFlowLocale";
import { buildGlobalAssignments, parseScript } from "./script/syntax";
import { TypeInfo } from "./TypeInfo";
import { ResponsiveDialog } from "./components/ResponsiveDialog";
import { ScriptEditor } from "./ScriptEditor";
import { ScriptMessagesButton } from "./ScriptMessagesButton";

/** @public */
export interface ScriptEditorDialogProps extends DialogProps {
    scriptLabel?: string;
    cancelLabel?: string;
    completeLabel?: string;
    initialValue?: Script | null;
    lang?: string;
    idempotent?: boolean;
    controller?: FlowEditorController | null;
    onComplete?: (script: Script | null) => void;
    onSave?: (script: Script) => void;
    additionalGlobals?: Iterable<[string, TypeInfo]>;
}

/** @public */
export const ScriptEditorDialog: FC<ScriptEditorDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const {
        onComplete,
        onSave,
        initialValue = null,
        scriptLabel,
        cancelLabel = locale.button_cancel,
        completeLabel = locale.button_apply,
        lang,
        idempotent,
        controller,
        open,
        additionalGlobals,
        maxWidth = "md",
        onClose: onCloseOuter,
        ...rest
    } = props;

    const hostFuncs = useScriptHostFuncs();
    const otherScripts = useOtherScripts(controller);
    const [code, setCode] = useState(initialValue?.code || "");    
    const [messages, setMessages] = useState(() => initialValue?.messages || Object.freeze(new Map<string, string>()));
    const classes = useStyles();
    const [isFullScreen, setIsFullScreen] = useState<boolean | undefined>();
    const [canToggleFullScreen, setCanTooggleFullScreen] = useState(false);
    const [editingMessages, setEditingMessages] = useState(false);
    const [disableBackdropTransition, setDisableBackdropTransition] = useState(false);

    const globals = useMemo<Map<string, TypeInfo>>(() => {
        const result = new Map<string, TypeInfo>();

        if (hostFuncs) {
            for (const [key, func] of hostFuncs) {
                result.set(key, TypeInfo.from(func));
            }
        }

        if (otherScripts) {
            for (const { code } of otherScripts) {
                const root = parseScript(code);
                buildGlobalAssignments(root, (from, to) => code.substring(from, to), result);
            }
        }

        for (const [key, value] of messages) {
            result.set(key, TypeInfo.scope("message", TypeInfo.stringValue(value)));
        }
        
        const thisProps: Record<string, TypeInfo> = {
            idempotent: typeof idempotent === "boolean" ? TypeInfo.booleanValue(idempotent) : TypeInfo.boolean,
        };

        if (idempotent) {
            thisProps.refresh = TypeInfo.number;
        }

        result.set("this", TypeInfo.object(thisProps));

        if (additionalGlobals) {
            for (const [key, info] of additionalGlobals) {
                result.set(key, info);
            }
        }

        return result;
    }, [messages, hostFuncs, otherScripts, idempotent, additionalGlobals]);
    
    const onClickComplete = useCallback(() => {
        if (onComplete) {
            onComplete(new Script({code, messages}));
        }
    }, [onComplete, code, messages]);
    
    const onClickCancel = useCallback(() => {
        if (onComplete) {
            onComplete(null);
        }
    }, [onComplete]);
    
    const didChange = useMemo(() => {
        if (!initialValue) {
            return !!code || messages.size > 0;
        } else if (code !== initialValue.code) {
            return true;
        } else if (messages === initialValue.messages) {
            return false;
        } else if (messages.size !== initialValue.messages.size) {
            return true;
        } else {
            for (const [key, value] of messages) {
                const before = initialValue.messages.get(key);
                if (value !== before) {
                    return true;
                }
            }
            return false;
        }
    }, [code, messages, initialValue]);

    const onClose = useCallback<Required<DialogProps>["onClose"]>((...args) => {
        if (onCloseOuter && !didChange) {
            onCloseOuter(...args);
        }
    }, [onCloseOuter, didChange]);
    
    const onFullScreen = useCallback((value: boolean, implied: boolean) => {
        if (implied) {
            setIsFullScreen(undefined);
        } else {
            setIsFullScreen(value);
        }
        setCanTooggleFullScreen(!implied);
    }, []);
    
    const [innerRef, setInnerRef] = useState<HTMLElement | null>(null);
    const keyHandler = useCallback((e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "s" && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            if (didChange && onSave) {
                onSave(new Script({code, messages}));
            }
        }
    }, [didChange, onSave, code, messages]);

    useEffect(() => {
        if (innerRef) {
            innerRef.addEventListener("keydown", keyHandler);
            return () => innerRef.removeEventListener("keydown", keyHandler);
        }
    }, [innerRef, keyHandler]);

    useEffect(() => {
        if (!open) {
            setCode(initialValue?.code || "");
            setMessages(initialValue?.messages || Object.freeze(new Map<string, string>()));
        }
    }, [open, initialValue]);

    useEffect(() => {
        if (editingMessages) {
            setDisableBackdropTransition(true);
        } else {
            const timerId = setTimeout(() => setDisableBackdropTransition(false), 300);
            return () => clearTimeout(timerId);
        }
    }, [editingMessages]);

    return (
        <>
            <ResponsiveDialog 
                {...rest}
                scroll="paper"
                onClose={onClose}
                disableEscapeKeyDown={didChange}
                hideBackdrop={editingMessages}
                innerRef={setInnerRef}
                BackdropProps={{
                    transitionDuration: disableBackdropTransition ? 0 : undefined,
                }}
                maxWidth={maxWidth}
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
                                label={didChange ? `${scriptLabel} ●` : scriptLabel}
                                maxHeight={`calc(100vh - ${isFullScreen === false ? 184 : 120}px)`}
                                autoFocus
                                globals={globals}
                            />
                        </div>
                        <DialogActions>
                            <ScriptMessagesButton
                                lang={lang}
                                color="primary"
                                messages={messages}
                                onMessagesChange={setMessages}
                                onEditChange={setEditingMessages}
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
        </>
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
