import { Box, Button, DialogActions, DialogContent, DialogProps, TextField } from "@material-ui/core";
import React, { FC, useCallback, useState } from "react";
import { FlowImage, FlowVideo } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog } from "./ResponsiveDialog";

export interface MediaScaleDialogProps extends Omit<DialogProps, "onClose"> {
    node: FlowImage | FlowVideo;
    onClose(): void;
    onApply(value: number): void;
}

export const MediaScaleDialog: FC<MediaScaleDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const { node, onClose, onApply, maxWidth = "xs", ...rest } = props;
    const [scaleValue, setScaleValue] = useState(node.scale);
    const [scaleText, setScaleText] = useState((node.scale * 100).toFixed(1));
    const [widthText, setWidthText] = useState((node.source.width * node.scale).toFixed(0));
    const [heightText, setHeightText] = useState((node.source.height * node.scale).toFixed(0));
    const [isValidScaleText, setIsValidScaleText] = useState(true);
    const [isValidWidthText, setIsValidWidthText] = useState(true);
    const [isValidHeightText, setIsValidHeightText] = useState(true);
    const canApply = isValidScaleText && isValidWidthText && isValidHeightText;

    const onSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (canApply) {
            onApply(scaleValue);
        }
    }, [canApply, onApply, scaleValue]);

    const onScaleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const isValidText = /^\s*[0-9]+(\.[0-9]+)?\s*$/.test(newText);
        const parsedValue = isValidText && parseFloat(newText);
        setScaleText(newText);
        if (typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0) {
            const newScale = parsedValue / 100;
            setScaleValue(newScale);
            setWidthText((node.source.width * newScale).toFixed(0));
            setHeightText((node.source.height * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidScaleText(false);
        }
    }, [node]);

    const onWidthTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const isValidText = /^\s*[0-9]+\s*$/.test(newText);
        const parsedValue = isValidText && parseInt(newText, 10);
        setWidthText(newText);
        if (typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0) {
            const newScale = parsedValue / node.source.width;
            setScaleValue(newScale);
            setScaleText((newScale * 100).toFixed(1));
            setHeightText((node.source.height * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidWidthText(false);
        }
    }, [node]);

    const onHeightTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const isValidText = /^\s*[0-9]+\s*$/.test(newText);
        const parsedValue = isValidText && parseInt(newText, 10);
        setHeightText(newText);
        if (typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0) {
            const newScale = parsedValue / node.source.height;
            setScaleValue(newScale);
            setScaleText((newScale * 100).toFixed(1));
            setWidthText((node.source.width * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidHeightText(false);
        }
    }, [node]);

    return (
        <ResponsiveDialog {...rest} maxWidth={maxWidth} onClose={onClose}>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={scaleText}
                        onChange={onScaleTextChange}
                        label={locale.label_image_scale}
                        InputLabelProps={{shrink: true}}
                        error={!isValidScaleText}
                        autoFocus
                    />
                    <Box py={1.5} />
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={widthText}
                        onChange={onWidthTextChange}
                        label={locale.label_image_width}
                        InputLabelProps={{shrink: true}}
                        error={!isValidWidthText}
                    />
                    <Box py={1.5} />
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={heightText}
                        onChange={onHeightTextChange}
                        label={locale.label_image_height}
                        InputLabelProps={{shrink: true}}
                        error={!isValidHeightText}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>{locale.button_cancel}</Button>
                    <Button color="primary" type="submit" disabled={!canApply}>{locale.button_apply}</Button>
                </DialogActions>
            </form>
        </ResponsiveDialog>
    );
};
