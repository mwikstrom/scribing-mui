import { makeStyles } from "@material-ui/styles";
import React, { ReactElement } from "react";
import { Typography } from "@material-ui/core";
import clsx from "clsx";

export interface OptionLabelProps<T> {
    options: readonly T[];
    selected: T | undefined;
    isSameOption?: (first: T, second: T) => boolean;
    getOptionKey?: (value: T) => string | number;
    getOptionLabel?: (value: T) => string;
}

export const OptionLabel = <T,>(props: OptionLabelProps<T>): ReactElement => {
    const { 
        options,
        selected,
        isSameOption = Object.is,
        getOptionKey = String,
        getOptionLabel = String,
    } = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {options.map(value => (
                <Typography
                    key={getOptionKey(value)}
                    variant="body2"
                    component="div"
                    children={getOptionLabel(value)}
                    className={clsx(
                        classes.item, 
                        (!selected || !isSameOption(selected, value)) && classes.inactive
                    )}
                />
            ))}            
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        textAlign: "start",
        textTransform: "none",
    },
    item: { 
        overflow: "hidden",
        lineHeight: "unset",
    },
    inactive: {
        height: 0,
    },
});
