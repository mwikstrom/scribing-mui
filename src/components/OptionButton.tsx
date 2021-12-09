import { makeStyles, useTheme } from "@material-ui/styles";
import React, { CSSProperties, FC, forwardRef, Ref, useCallback, useMemo, useState } from "react";
import { Menu, MenuItem, Theme, Typography, useForkRef } from "@material-ui/core";
import { ToolButton, ToolButtonProps } from "./ToolButton";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";

export interface OptionButtonProps<T> extends ToolButtonProps {
    options: readonly T[];
    selected: T | undefined;
    onOptionSelected: (value: T) => void;
    isSameOption?: (first: T, second: T) => boolean;
    getOptionKey?: (value: T) => string | number;
    getOptionLabel?: (value: T) => string;
    getOptionColor?: (value: T) => string | undefined;
}

const _OptionButton = <T,>(props: OptionButtonProps<T>, ref: Ref<HTMLButtonElement>) => {
    const { 
        options,
        selected,
        onClick,
        onOptionSelected,
        isSameOption = Object.is,
        getOptionKey = String,
        getOptionLabel = String,
        getOptionColor = Void,
        ...rest
    } = props;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const forkRef = useForkRef<HTMLButtonElement>(ref, setButtonRef);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const onClickOverride = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(e);
        }
        if (!e.defaultPrevented) {
            setMenuOpen(true);
        }
    }, [onClick]);
    const onOptionSelectedOverride = useCallback((value: T) => {
        closeMenu();
        onOptionSelected(value);
    }, [closeMenu, onOptionSelected]);
    return (
        <>
            <ToolButton
                {...rest}
                ref={forkRef}
                onClick={onClickOverride}
            />
            <Menu open={isMenuOpen} anchorEl={buttonRef} onClose={closeMenu}>
                {options.map(value => {
                    const isSelected = selected !== void(0) && isSameOption(selected, value); 
                    return (
                        <MenuItem
                            key={getOptionKey(value)}
                            disableGutters
                            selected={isSelected}
                            onClick={() => onOptionSelectedOverride(value)}
                            children={(
                                <Option
                                    selected={isSelected}
                                    label={getOptionLabel(value)}
                                    color={getOptionColor(value)}
                                />
                            )}
                        />
                    );
                })}
            </Menu>
        </>
    );
};

export const OptionButton = forwardRef(_OptionButton) as typeof _OptionButton;

const Void = () => void(0);

interface OptionProps {
    selected: boolean;
    label: string;
    color: string | undefined;
}

const Option: FC<OptionProps> = props => {
    const { selected, label, color } = props;
    const classes = useOptionStyles();
    const muiTheme = useTheme<Theme>();
    const style = useMemo<CSSProperties | undefined>(() => {
        if (color) {
            return {
                backgroundColor: color,
                color: muiTheme.palette.getContrastText(color),
            };
        }
    }, [color, muiTheme]);
    return (
        <div className={classes.root}>
            <Icon
                className={classes.icon}
                style={style}
                size={0.75}
                path={selected ? mdiCheck : ""}
            />
            <Typography variant="body2">{label}</Typography>
        </div>
    );
};

const useOptionStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(4),
    },
    icon: {
        marginRight: theme.spacing(1),
        borderRadius: 2,
        padding: 1,
    },
}));
