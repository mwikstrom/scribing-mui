import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiFormatText, mdiMenuDown } from "@mdi/js";
import { Icon } from "@mdi/react";
import clsx from "clsx";
import React, { FC, useCallback, useMemo } from "react";
import { ParagraphVariant, PARAGRAPH_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "./OptionButton";
import { ToolButtonProps } from "./ToolButton";

export interface ParagraphVariantSelectorProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const ParagraphVariantSelector: FC<ParagraphVariantSelectorProps> = props => {
    const { controller, ...rest } = props;
    const selected = useMemo(() => controller?.getParagraphVariant(), [controller]);
    const classes = useStyles();
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: ParagraphVariant) => locale[`paragraph_${value}`], [locale]);
    const onOptionSelected = useCallback((value: ParagraphVariant) => {
        controller?.setParagraphVariant(value);
    }, [controller]);
    return (
        <OptionButton
            {...rest} 
            startIcon={<Icon size={0.75} path={mdiFormatText}/>}
            endIcon={<Icon size={1} path={mdiMenuDown}/>}
            disabled={!controller}
            selected={selected}
            options={PARAGRAPH_VARIANTS}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
            children={(
                <div className={classes.label}>
                    {PARAGRAPH_VARIANTS.map(variant => (
                        <Typography
                            key={variant}
                            variant="body2"
                            component="div"
                            className={clsx(classes.labelItem, selected !== variant && classes.inactiveLabelItem)}
                            children={getOptionLabel(variant)}
                        />
                    ))}            
                </div>
            )}
        />
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    label: {
        textAlign: "start",
        textTransform: "none",
    },
    labelItem: { 
        overflow: "hidden",
        lineHeight: "unset",
        color: theme.palette.text.primary,
    },
    inactiveLabelItem: {
        height: 0,
    },
}));
