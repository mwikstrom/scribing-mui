import { makeStyles, useTheme } from "@material-ui/styles";
import React, { CSSProperties, FC, forwardRef, Ref, useMemo } from "react";
import { MenuItem, Theme, Typography } from "@material-ui/core";
import { ToolButtonProps } from "./ToolButton";
import Icon from "@mdi/react";
import { mdiCheck } from "@mdi/js";
import { MenuButton } from "./MenuButton";
import { OptionLabel, OptionLabelProps } from "./OptionLabel";

export interface OptionButtonProps<T> extends ToolButtonProps, OptionLabelProps<T> {
    onOptionSelected: (value: T) => void;
    getOptionColor?: (value: T) => string | undefined;
}

const _OptionButton = <T,>(props: OptionButtonProps<T>, ref: Ref<HTMLButtonElement>) => {
    const { 
        options,
        selected,
        onOptionSelected,
        isSameOption = Object.is,
        getOptionKey = String,
        getOptionLabel = String,
        getOptionColor = Void,
        children = (
            <OptionLabel
                options={options}
                selected={selected}
                getOptionKey={getOptionKey}
                getOptionLabel={getOptionLabel}
                isSameOption={isSameOption}
            />
        ),
        ...rest
    } = props;
    return (
        <MenuButton
            {...rest}
            ref={ref}
            children={children}
            menu={options.map(value => {
                const isSelected = selected !== void(0) && isSameOption(selected, value); 
                return (
                    <MenuItem
                        key={getOptionKey(value)}
                        disableGutters
                        selected={isSelected}
                        onClick={() => onOptionSelected(value)}
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
        />
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
            <div className={classes.icon} style={style}>
                <Icon
                    size={0.75}
                    path={selected ? mdiCheck : "Z"}
                />
            </div>
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
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginRight: theme.spacing(1),
        borderRadius: 2,
    },
}));
