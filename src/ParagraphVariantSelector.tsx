import { ListItemText, Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiCheck, mdiFormatText, mdiMenuDown } from "@mdi/js";
import { Icon } from "@mdi/react";
import clsx from "clsx";
import React, { FC, useCallback, useMemo, useState } from "react";
import { ParagraphVariant, PARAGRAPH_VARIANTS } from "scribing";
import { FlowEditorController } from "scribing-react";
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
                                className={clsx(classes.labelItem, current !== variant && classes.inactiveLabelItem)}
                                children={DisplayLabels[variant]}
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
                                <ListItemText secondary={DisplayLabels[variant]}/>
                            </div>
                        )}
                    />
                ))}
            </Menu>
        </>
    );
};

const DisplayLabels: Record<ParagraphVariant, string> = {
    normal: "Normal",
    title: "Title",
    subtitle: "Subtitle",
    preamble: "Preamble",
    code: "Code",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
};

const useStyles = makeStyles((theme: Theme) => ({
    label: {
        textAlign: "start",
        textTransform: "none",
    },
    labelItem: { 
        overflow: "hidden",
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
        color: theme.palette.text.secondary,
    },
    menuIcon: {
        marginRight: theme.spacing(1),
    },
}));
