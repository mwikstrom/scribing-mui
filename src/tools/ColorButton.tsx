import { Menu, MenuItem, Theme, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import { mdiCheck, mdiColorHelper } from "@mdi/js";
import { Icon, Stack } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowColor, FLOW_COLORS } from "scribing";
import { FlowPalette, useFlowPalette } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface ColorButtonProps extends ToolButtonProps {
    current: FlowColor | undefined;
    iconPath: string;
    setCurrent: (color: FlowColor) => void;
}

export const ColorButton: FC<ColorButtonProps> = props => {
    const { current, setCurrent, iconPath, ...rest } = props;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const openMenu = useCallback(() => setMenuOpen(true), []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const applyColor = useCallback((color: FlowColor) => {
        closeMenu();
        setCurrent(color);
    }, [setCurrent, closeMenu]);
    const palette = useFlowPalette();
    const htmlColor = useMemo(() => getHtmlColor(current, palette), [palette, current]);
    const classes = useStyles();
    const muiTheme = useTheme<Theme>();
    const locale = useMaterialFlowLocale();
    return (
        <>
            <ToolButton
                {...rest} 
                ref={setButtonRef}
                onClick={openMenu}
                children={(
                    <Stack size={1}>
                        <Icon path={iconPath}/>
                        <Icon path={mdiColorHelper} color={htmlColor}/>
                    </Stack>
                )}
            />
            <Menu open={isMenuOpen} anchorEl={buttonRef} onClose={closeMenu}>
                {FLOW_COLORS.map(color => (
                    <MenuItem
                        key={color}
                        disableGutters
                        selected={current === color}
                        onClick={() => applyColor(color)}
                        children={(
                            <div className={classes.menuItem}>
                                <Icon
                                    className={classes.menuIcon}
                                    style={{
                                        backgroundColor: getHtmlColor(color, palette),
                                        color: muiTheme.palette.getContrastText(getHtmlColor(color, palette) || ""),
                                    }}
                                    size={0.75}
                                    path={current === color ? mdiCheck : ""}
                                />
                                <Typography variant="body2">{locale[`color_${color}`]}</Typography>
                            </div>
                        )}
                    />
                ))}
            </Menu>
        </>
    );
};

const getHtmlColor = (color: FlowColor | undefined, palette: FlowPalette): string | undefined => {
    if (color === "default") {
        return palette.text;
    } else if (color) {
        return palette[color];
    }
};

const useStyles = makeStyles((theme: Theme) => ({
    menuItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
    },
    menuIcon: {
        marginRight: theme.spacing(1),
        borderRadius: 2,
        padding: 1,
    },
}));
