import { Box, Button, DialogActions, DialogProps, IconButton, Theme, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiFullscreen, mdiFullscreenExit } from "@mdi/js";
import Icon from "@mdi/react";
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
    const [isFullScreen, setIsFullScreen] = useState<boolean | undefined>();
    const [canToggleFullScreen, setCanTooggleFullScreen] = useState(false);
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
    const onFullScreen = useCallback((value: boolean, implied: boolean) => {
        if (implied) {
            setIsFullScreen(undefined);
        } else {
            setIsFullScreen(value);
        }
        setCanTooggleFullScreen(!implied);
    }, []);
    useEffect(() => setCode(initialValue?.code || ""), [rest.open]);
    return (
        <ResponsiveDialog 
            {...rest}
            scroll="paper"
            disableEscapeKeyDown={didChange}
            maxWidth="sm"
            fullWidth
            fullScreen={isFullScreen}
            onFullScreen={onFullScreen}
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
                        <Tooltip arrow placement="top" title={locale.tip_toggle_fullscreen}>
                            <IconButton onClick={() => setIsFullScreen(!isFullScreen)} disabled={!canToggleFullScreen}>
                                <Icon path={isFullScreen ? mdiFullscreenExit : mdiFullscreen} size={1}/>
                            </IconButton>
                        </Tooltip>
                        <Box flex={1}/>
                        <Button onClick={onClickCancel}>{cancelLabel}</Button>
                        <Button onClick={onClickComplete} color="primary">{completeLabel}</Button>
                    </DialogActions>
                </>
            )}
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
