import { Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiMenuDown, mdiTextBoxOutline } from "@mdi/js";
import { Icon } from "@mdi/react";
import clsx from "clsx";
import React, { FC, useCallback, useMemo } from "react";
import { BoxVariant, BOX_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { OptionButton } from "../components/OptionButton";
import { ToolButtonProps } from "../components/ToolButton";

export interface BoxVariantSelectorProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const BoxVariantSelector: FC<BoxVariantSelectorProps> = props => {
    const { controller, ...rest } = props;
    const selected = useMemo(() => controller?.getBoxStyle()?.variant, [controller]);
    const locale = useMaterialFlowLocale();
    const getOptionLabel = useCallback((value: BoxVariant) => locale[`box_${value}` as const], [locale]);
    const onOptionSelected = useCallback((variant: BoxVariant) => {
        controller?.formatBox("variant", variant);
    }, [controller]);
    const classes = useStyles();
    return (
        <OptionButton
            {...rest} 
            startIcon={<Icon size={0.75} path={mdiTextBoxOutline}/>}
            endIcon={<Icon size={1} path={mdiMenuDown}/>}
            disabled={!controller}
            selected={selected}
            options={BOX_VARIANTS}
            onOptionSelected={onOptionSelected}
            getOptionLabel={getOptionLabel}
            children={(
                <div className={classes.label}>
                    {BOX_VARIANTS.map(variant => (
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
