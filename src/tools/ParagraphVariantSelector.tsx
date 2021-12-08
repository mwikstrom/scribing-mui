import { Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiCheck, mdiFormatText, mdiMenuDown } from "@mdi/js";
import { Icon } from "@mdi/react";
import clsx from "clsx";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ParagraphVariant, PARAGRAPH_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface ParagraphVariantSelectorProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const ParagraphVariantSelector: FC<ParagraphVariantSelectorProps> = props => {
    const { controller, ...rest } = props;
    const current = useMemo(() => controller?.getParagraphVariant(), [controller]);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const applyVariant = useCallback((variant: ParagraphVariant) => {
        closeMenu();
        controller?.setParagraphVariant(variant);
    }, [controller, closeMenu]);
    const classes = useStyles();
    const locale = useMaterialFlowLocale();
    return (
        <>
            <ToolButton
                {...rest} 
                ref={setButtonRef}
                startIcon={<Icon size={0.75} path={mdiFormatText}/>}
                endIcon={<Icon size={1} path={mdiMenuDown}/>}
                onClick={openMenu}
                disabled={!controller}
                children={(
                    <div className={classes.label}>
                        {PARAGRAPH_VARIANTS.map(variant => (
                            <Typography
                                key={variant}
                                variant="body2"
                                component="div"
                                className={clsx(classes.labelItem, current !== variant && classes.inactiveLabelItem)}
                                children={locale[`paragraph_${variant}`]}
                            />
                        ))}            
                    </div>
                )}
            />
            <Menu open={isMenuOpen} anchorEl={buttonRef} onClose={closeMenu}>
                {PARAGRAPH_VARIANTS.map(variant => (
                    <MenuItem
                        key={variant}
                        disableGutters
                        selected={current === variant}
                        onClick={() => applyVariant(variant)}
                        children={(
                            <div className={classes.menuItem}>
                                <Icon
                                    className={classes.menuIcon}
                                    size={0.75}
                                    path={current === variant ? mdiCheck : ""}
                                />
                                <Typography variant="body2">{locale[`paragraph_${variant}`]}</Typography>
                            </div>
                        )}
                    />
                ))}
            </Menu>
        </>
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
    menuItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
    },
    menuIcon: {
        marginRight: theme.spacing(1),
    },
}));
