import { Box, Button, DialogActions, DialogContent, DialogProps, TextField } from "@material-ui/core";
import React, { FC, useCallback, useState } from "react";
import { FlowImage } from "scribing";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ResponsiveDialog } from "./ResponsiveDialog";

export interface ImageScaleDialogProps extends Omit<DialogProps, "onClose"> {
    image: FlowImage;
    onClose(): void;
    onApply(value: number): void;
}

export const ImageScaleDialog: FC<ImageScaleDialogProps> = props => {
    const locale = useMaterialFlowLocale();
    const { image, onClose, onApply, maxWidth = "xs", ...rest } = props;
    const [scaleValue, setScaleValue] = useState(image.scale);
    const [scaleText, setScaleText] = useState((image.scale * 100).toFixed(1));
    const [widthText, setWidthText] = useState((image.source.width * image.scale).toFixed(0));
    const [heightText, setHeightText] = useState((image.source.height * image.scale).toFixed(0));
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
            setWidthText((image.source.width * newScale).toFixed(0));
            setHeightText((image.source.height * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidScaleText(false);
        }
    }, [image]);

    const onWidthTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const isValidText = /^\s*[0-9]+\s*$/.test(newText);
        const parsedValue = isValidText && parseInt(newText, 10);
        setWidthText(newText);
        if (typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0) {
            const newScale = parsedValue / image.source.width;
            setScaleValue(newScale);
            setScaleText((newScale * 100).toFixed(1));
            setHeightText((image.source.height * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidWidthText(false);
        }
    }, [image]);

    const onHeightTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        const isValidText = /^\s*[0-9]+\s*$/.test(newText);
        const parsedValue = isValidText && parseInt(newText, 10);
        setHeightText(newText);
        if (typeof parsedValue === "number" && Number.isFinite(parsedValue) && parsedValue > 0) {
            const newScale = parsedValue / image.source.height;
            setScaleValue(newScale);
            setScaleText((newScale * 100).toFixed(1));
            setWidthText((image.source.width * newScale).toFixed(0));
            setIsValidScaleText(true);
            setIsValidWidthText(true);
            setIsValidHeightText(true);
        } else {
            setIsValidHeightText(false);
        }
    }, [image]);

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
