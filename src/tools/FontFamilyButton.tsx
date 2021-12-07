import { Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiCheck, mdiFormatFont } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FontFamily, FONT_FAMILIES } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface FontFamilyButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const FontFamilyButton: FC<FontFamilyButtonProps> = props => {
    const { controller, ...rest } = props;
    const current = useMemo(() => controller?.getFontFamily(), [controller]);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const applyFont = useCallback((font: FontFamily) => {
        closeMenu();
        controller?.setFontFamily(font);
    }, [controller, closeMenu]);
    const classes = useStyles();
    return (
        <>
            <ToolButton
                {...rest} 
                ref={setButtonRef}
                onClick={openMenu}
                disabled={!controller}
                children={<Icon size={1} path={mdiFormatFont}/>}
            />
            <Menu open={isMenuOpen} anchorEl={buttonRef} onClose={closeMenu}>
                {FONT_FAMILIES.map(font => (
                    <MenuItem
                        key={font}
                        disableGutters
                        selected={current === font}
                        onClick={() => applyFont(font)}
                        children={(
                            <div className={classes.menuItem}>
                                <Icon
                                    className={classes.menuIcon}
                                    size={0.75}
                                    path={current === font ? mdiCheck : ""}
                                />
                                <Typography variant="caption">{DisplayLabels[font]}</Typography>
                            </div>
                        )}
                    />
                ))}
            </Menu>
        </>
    );
};

const DisplayLabels: Record<FontFamily, string> = {
    body: "Body",
    heading: "Heading",
    monospace: "Monospace",
};

const useStyles = makeStyles((theme: Theme) => ({
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
